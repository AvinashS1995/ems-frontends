import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_MATERIAL_MODULES } from '../../../../../shared/common/shared-material';
import { CommonService } from '../../../../../shared/service/common/common.service';
import { ApiService } from '../../../../../shared/service/api/api.service';
import { API_ENDPOINTS } from '../../../../../shared/common/api-contant';

@Component({
  selector: 'app-create-menu-configuration',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './create-menu-configuration.component.html',
  styleUrl: './create-menu-configuration.component.scss',
})
export class CreateMenuConfigurationComponent {
  createMenuForm!: FormGroup;

  menuList: Array<any> = [];
  isEditMode: Boolean = false;
  descriptionLength = 0;

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.prepareCreateMenuForm();
    this.getparams();
  }

  prepareCreateMenuForm() {
    this.createMenuForm = this.fb.group({
      menuTitle: [''],
      menuRoute: [''],
      menuComponentName: [''],
      menuIcon: [''],
      parentMenu: [''],
      menuDescription: [''],
    });

    this.createMenuForm.controls['menuDescription'].valueChanges.subscribe(
      (menuDescriptionValue) => {
        this.descriptionLength = menuDescriptionValue?.length || 0;
      }
    );
  }

  getparams() {
    this.activateRoute.data.subscribe((params) => {
      console.log('Menu Params--->', params);

      if (params['data']) {
        const menuData = params['data']?.menus?.data || [];

        this.menuList = this.buildMenuList(menuData);

        console.log(this.menuList);

        const {
          title,
          componentName,
          path,
          icon,
          description,
          parentId,
          mode,
        } = params['data'].menuDetails || {};

        const parentMenu = this.menuList.find(
          (item) => item.value === parentId
        );
        console.log(parentMenu);

        if (mode === 'edit') {
          this.isEditMode = true;
          this.createMenuForm.patchValue({
            menuTitle: title || '',
            menuRoute: path || '',
            menuComponentName: componentName || '',
            menuIcon: icon || '',
            parentMenu: parentMenu?.label || '',
            menuDescription: description || '',
          });
        }
      }
    });
  }

  buildMenuList(menus: any[], parentPath: string = ''): Array<any> {
    let result: Array<any> = [];

    for (const menu of menus) {
      const label = parentPath ? `${menu.title}` : menu.title;

      result.push({
        label: label,
        value: menu._id,
      });

      if (menu.childMenu && menu.childMenu.length > 0) {
        result = result.concat(this.buildMenuList(menu.childMenu, label));
      }
    }

    return result;
  }

  updateDescriptionLength() {
    const value = this.createMenuForm.get('menuDescription')?.value;
    this.descriptionLength = value?.length || 0;
  }

  onSubmitMenuForm() {
    const {
      menuTitle,
      menuRoute,
      menuComponentName,
      menuIcon,
      parentMenu,
      menuDescription,
    } = this.createMenuForm.getRawValue();

    const parentId = this.menuList.find((item) => item.label === parentMenu);

    console.log(parentId);

    const payload = {
      title: menuTitle || '',
      path: menuRoute || '',
      componentName: menuComponentName || '',
      description: menuDescription || '',
      icon: menuIcon || '',
      parentId: parentId?.value || '',
    };

    console.log(payload);

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_SAVE_MENU, payload)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_SAVE_ROLE_WISE_MENUS} Response : `,
            res
          );

          this.commonService.openSnackbar(res.message, 'success');
          this.router.navigateByUrl('/menu-configuration');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  cancelForm() {
    this.router.navigateByUrl('/menu-configuration');
  }
}
