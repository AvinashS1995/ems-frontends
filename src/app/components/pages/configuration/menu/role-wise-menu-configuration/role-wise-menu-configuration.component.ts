import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_MATERIAL_MODULES } from '../../../../../shared/common/shared-material';
import { CommonService } from '../../../../../shared/service/common/common.service';
import { ApiService } from '../../../../../shared/service/api/api.service';
import { API_ENDPOINTS } from '../../../../../shared/common/api-contant';

@Component({
  selector: 'app-role-wise-menu-configuration',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './role-wise-menu-configuration.component.html',
  styleUrl: './role-wise-menu-configuration.component.scss',
})
export class RoleWiseMenuConfigurationComponent {
  roleWiseMenuFilterForm!: FormGroup;
  createRoleWiseMenuForm!: FormGroup;

  employeeRoleList: Array<any> = [];

  selectedRole: string | null = null;

  menuList: Array<any> = [];

  menuFormArray!: FormArray;

  displayedColumns: string[] = ['title', 'noAccess', 'fullAccess'];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.prepareRoleWiseMenuFilterForm();
    this.getparams();
    this.setSubscription();
  }

  prepareRoleWiseMenuFilterForm() {
    this.roleWiseMenuFilterForm = this.fb.group({
      role: [''],
    });

    this.createRoleWiseMenuForm = this.fb.group({
      menus: this.fb.array([]),
    });
  }

  getparams() {
    this.activateRoute.data.subscribe((params) => {
      console.log(params);
      if (params['data']) {
        this.employeeRoleList = params['data'].roles.data.types || [];

        console.log(this.employeeRoleList);

        this.employeeRoleList = this.employeeRoleList.map((item) => {
          return {
            value: item.typeValue,
            label: item.typeLabel,
          };
        });

        console.log(this.employeeRoleList);
      }
    });
  }

  setSubscription() {
    this.roleWiseMenuFilterForm.controls['role'].valueChanges.subscribe(
      (selectedRoleValue) => {
        console.log(selectedRoleValue);

        if (selectedRoleValue) {
          this.getMenuList();
        }
      }
    );
  }

  getMenuList() {
    const { role } = this.roleWiseMenuFilterForm.getRawValue();
    const payload = {
      role: role || '',
    };
    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GETMENUS, payload)
      .subscribe({
        next: (res: any) => {
          console.log(`${API_ENDPOINTS.SERVICE_GETMENUS} Response : `, res);

          // this.menuList = res?.data || [];
          const rawMenus = res?.data || [];
          this.menuList = this.flattenMenus(rawMenus);
          debugger;
          this.menuFormArray = this.fb.array(
            this.menuList.map((menu) =>
              this.fb.group({
                menuId: [menu._id],
                access: [menu.access || 'noAccess'],
              })
            )
          );
          this.createRoleWiseMenuForm.setControl('menus', this.menuFormArray);
          console.log(this.menuList);

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  flattenMenus(
    menus: any[],
    level: number = 0,
    parentId: string | null = null
  ): any[] {
    return menus.reduce((acc: any[], menu) => {
      const { childMenu, ...rest } = menu;
      const current = { ...rest, level, parentId, access: menu?.access };

      acc.push(current);

      if (childMenu && childMenu.length) {
        acc.push(...this.flattenMenus(childMenu, level + 1, menu._id));
      }

      return acc;
    }, []);
  }

  onRoleChange() {
    console.log('Selected Role:', this.selectedRole);
  }

  getAccessValue(i: number): string {
    return (this.createRoleWiseMenuForm.get('menus') as FormArray)
      .at(i)
      .get('access')?.value;
  }

  setAccessValue(i: number, value: string): void {
    (this.createRoleWiseMenuForm.get('menus') as FormArray)
      .at(i)
      .get('access')
      ?.setValue(value);
  }

  submitRoleWiseMenuForm() {
    console.log(this.menuFormArray.value);

    const { role } = this.roleWiseMenuFilterForm.getRawValue();

    const payload = {
      role: role || '',
      menus: this.menuFormArray.value || [],
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_SAVE_ROLE_WISE_MENUS, payload)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_SAVE_ROLE_WISE_MENUS} Response : `,
            res
          );

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  onCancel() {
    this.router.navigateByUrl('/dashboard');
  }
}
