import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { AddNewRoleTypeComponent } from '../add-new-role-type/add-new-role-type.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { ApiService } from '../../../../shared/service/api/api.service';
import { CommonService } from '../../../../shared/service/common/common.service';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
})
export class ConfigurationComponent {
  displayedColumns: string[] = [
    'srno',
    'role',
    'roleType',
    'description',
    'action',
  ];

  roles: Array<any> = [];
  roleTypes: Array<any> = [];
  fiterRoleTypes: Array<any> = [];
  filterRoles: Array<any> = [];

  roleTypeFilterForm!: FormGroup;

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filterRole: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.prepareFilterForm();
    this.getparam();
    this.getRoleType();
  }

  getparam() {
    this.activateRoute.data.subscribe((params) => {
      console.log('Title ---->', params);

      if (params['data']) {

        this.roles = params['data'].roles?.data?.types || [];
        this.roles = this.roles.map((item) => {
          return {
            value: item.typeValue,
            label: item.typeLabel,
          };
        });
  
        console.log('Roles--->', this.roles);
  
        this.roleTypes = params['data'].status?.data?.types || [];
        this.roleTypes = this.roleTypes.map((status) => {
          return {
            value: status.name,
            label: status.name,
          };
        });
  
        console.log('Status ---->', this.roleTypes);
  
        this.filterRole = params['data'].filterRoles?.data?.types || [];
  
        this.filterRole = [
          ...new Map(
            this.filterRole.map((item: { entityValue: any }) => [
              item.entityValue,
              item,
            ])
          ).values(),
        ];
  
        this.filterRole = this.filterRole.map((item: { entityValue: any }) => {
          return {
            value: item.entityValue,
            label: item.entityValue,
          };
        });
  
        console.log('this.filterRoles', this.filterRoles);
        console.log('this.filterRoles', this.filterRole);
      }
     
    });
  }

  prepareFilterForm() {
    this.roleTypeFilterForm = this.fb.group({
      role: [''],
      roleType: [''],
    });
  }

  addRoleType(roleTypeData?: any) {
    
    const dialogRef = this.dialog.open(AddNewRoleTypeComponent, {
      width: '600px',
      disableClose: true,
      data: {
        Roles: this.roles,
        editData: roleTypeData || null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'saved' || result === 'updated') {
        this.getRoleType();
      }
    });
  }

  getRoleType() {
    const paylaod = {
      entityValue: '',
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, paylaod)
      .subscribe((res) => {
        console.log(res);
        this.dataSource.data = res?.data?.types || [];
        this.fiterRoleTypes = this.dataSource.data.map((item) => {
          return {
            value: item.typeValue,
            label: item.typeLabel,
          };
        });
        console.log(this.fiterRoleTypes);
      });
  }

  applyFilter() {

    const { role, roleType } = this.roleTypeFilterForm.getRawValue();

    const paylaod = {
      entityValue: role ? role : '',
      typeLabel: roleType ? roleType : '',
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, paylaod)
      .subscribe((res) => {
        console.log(res);
        this.dataSource.data = res?.data?.types || [];

        console.log(this.fiterRoleTypes);
      });
  }

  clearFilter() {
    this.roleTypeFilterForm.reset();
  }

  editRoleType(row: any) {
    this.addRoleType(row);
  }

  deleteRoleType(row: any) {
    const paylaod = {
      id: row ? row._id : 0,
    };

    console.log(paylaod);

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_DELETEROLETYPE, paylaod)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_DELETEROLETYPE} Response : `,
            res
          );
          this.getRoleType();

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
    console.log('Delete clicked:', row);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
