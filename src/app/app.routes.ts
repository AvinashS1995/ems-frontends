import { Routes } from '@angular/router';
import { DashboardResolverService } from './components/pages/dashboard/dashboard-resolver.service';
import { LayoutComponent } from './components/layout/layout.component';
import { EmployeeProfileResolverService } from './components/pages/employee/employee-profile/employee-profile-resolver.service';
import { EmployeeManagementResolverService } from './components/pages/employee/employee-management/employee-management-resolver.service';
import { AttendenceManagementResolverService } from './components/pages/attendence/attendence-management/attendence-management-resolver.service';
import { LeaveManagementResolverService } from './components/pages/leave/leave-management/leave-management-resolver.service';
import { LeaveApprovalRequestListResolverService } from './components/pages/leave/leave-approval-request-list/leave-approval-request-list-resolver.service';
import { ConfigurationResolverService } from './components/pages/configuration/configuration/configuration-resolver.service';
import { CreateMenuConfigurationResolverService } from './components/pages/configuration/menu/create-menu-configuration/create-menu-configuration-resolver.service';
import { RoleWiseMenuConfigurationResolverService } from './components/pages/configuration/menu/role-wise-menu-configuration/role-wise-menu-configuration-resolver.service';
import { ApprovalConfigurationResolverService } from './components/pages/approval/approaval-configuration/approval-configuration-resolver.service';
import { RequestListResolverService } from './components/pages/approval/request-list/request-list-resolver.service';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/components/user/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        '../app/components/user/forgot-password/forgot-password.component'
      ).then((c) => c.ForgotPasswordComponent),
  },

  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../app/components/pages/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
        data: {
          title: 'Dashboard',
        },
        resolve: { data: DashboardResolverService },
      },
      {
        path: 'employee-profile',
        loadComponent: () =>
          import(
            '../app/components/pages/employee/employee-profile/employee-profile.component'
          ).then((c) => c.EmployeeProfileComponent),
        data: {
          title: 'Employee Profile',
        },
        resolve: { data: EmployeeProfileResolverService },
      },
      {
        path: 'employee-management',
        loadComponent: () =>
          import(
            '../app/components/pages/employee/employee-management/employee-management.component'
          ).then((c) => c.EmployeeManagementComponent),
        data: {
          title: 'Employee Management',
        },
        resolve: { data: EmployeeManagementResolverService },
      },
      {
        path: 'add-employee',
        loadComponent: () =>
          import(
            '../app/components/pages/employee/add-employee/add-employee.component'
          ).then((c) => c.AddEmployeeComponent),
      },
      {
        path: 'attendence-management',
        loadComponent: () =>
          import(
            '../app/components/pages/attendence/attendence-management/attendence-management.component'
          ).then((c) => c.AttendenceManagementComponent),
        data: {
          title: 'Attendence Management',
        },
        resolve: { data: AttendenceManagementResolverService },
      },
      {
        path: 'leave-management',
        loadComponent: () =>
          import(
            './components/pages/leave/leave-management/leave-management.component'
          ).then((c) => c.LeaveManagementComponent),
        data: {
          title: 'Leave Management',
        },
        resolve: { data: LeaveManagementResolverService },
      },
      {
        path: 'employee-leave-approval-request-list',
        loadComponent: () =>
          import(
            './components/pages/leave/leave-approval-request-list/leave-approval-request-list.component'
          ).then((c) => c.LeaveApprovalRequestListComponent),
        data: {
          title: 'Employee Leave Approval Request List',
        },
        resolve: { data: LeaveApprovalRequestListResolverService },
      },
      {
        path: 'option-type-configuration',
        loadComponent: () =>
          import(
            './components/pages/configuration/configuration/configuration.component'
          ).then((c) => c.ConfigurationComponent),
        data: {
          title: 'Configuration',
        },
        resolve: { data: ConfigurationResolverService },
      },
      {
        path: 'add-new-role-type',
        loadComponent: () =>
          import(
            './components/pages/configuration/add-new-role-type/add-new-role-type.component'
          ).then((c) => c.AddNewRoleTypeComponent),
      },
      {
        path: 'menu-configuration',
        loadComponent: () =>
          import(
            './components/pages/configuration/menu/menu-configuration/menu-configuration.component'
          ).then((c) => c.MenuConfigurationComponent),
        data: {
          title: 'Menu Configuration List',
        },
        resolve: { data: CreateMenuConfigurationResolverService },
      },
      {
        path: 'create-menu',
        loadComponent: () =>
          import(
            './components/pages/configuration/menu/create-menu-configuration/create-menu-configuration.component'
          ).then((c) => c.CreateMenuConfigurationComponent),
        data: {
          title: 'Create Menu Configuration',
        },
        resolve: { data: CreateMenuConfigurationResolverService },
      },
      {
        path: 'role-wise-menu-configuration',
        loadComponent: () =>
          import(
            './components/pages/configuration/menu/role-wise-menu-configuration/role-wise-menu-configuration.component'
          ).then((c) => c.RoleWiseMenuConfigurationComponent),
        data: {
          title: 'Role Wise Menu Configuration',
        },
        resolve: { data: RoleWiseMenuConfigurationResolverService },
      },
      {
        path: 'approval-configuration-list',
        loadComponent: () =>
          import(
            './components/pages/approval/approaval-configuration/approaval-configuration.component'
          ).then((c) => c.ApproavalConfigurationComponent),
        data: {
          title: 'Approval Configuration List',
        },
        resolve: { data: ApprovalConfigurationResolverService },
      },
      {
        path: 'create-approval-configuration',
        loadComponent: () =>
          import(
            './components/pages/approval/approval-configuration-form/approval-configuration-form.component'
          ).then((c) => c.ApprovalConfigurationFormComponent),
        data: {
          title: 'Create Approval Configuration',
        },
        resolve: { data: ApprovalConfigurationResolverService },
      },
      {
        path: 'request-list',
        loadComponent: () =>
          import(
            './components/pages/approval/request-list/request-list.component'
          ).then((c) => c.RequestListComponent),
        data: {
          title: 'Request List',
        },
        resolve: { data: RequestListResolverService },
      },
      {
        path: 'popup-configuration',
        loadComponent: () =>
          import(
            './components/pages/configuration/popup/popup-configuration/popup-configuration.component'
          ).then((c) => c.PopupConfigurationComponent),
        data: {
          title: 'Popup Configuration',
        },
      },
      {
        path: 'create-popup-configuration',
        loadComponent: () =>
          import(
            './components/pages/configuration/popup/create-popup-configuration/create-popup-configuration.component'
          ).then((c) => c.CreatePopupConfigurationComponent),
        data: {
          title: 'Create Popup Configuration',
        },
      },
    ],
  },
];
