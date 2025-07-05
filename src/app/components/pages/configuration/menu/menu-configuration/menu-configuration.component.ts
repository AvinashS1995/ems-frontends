import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { SHARED_MATERIAL_MODULES } from '../../../../../shared/common/shared-material';
import { CommonService } from '../../../../../shared/service/common/common.service';
import { ApiService } from '../../../../../shared/service/api/api.service';
import { CryptoService } from '../../../../../shared/service/common/crypto.service';

@Component({
  selector: 'app-menu-configuration',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './menu-configuration.component.html',
  styleUrl: './menu-configuration.component.scss'
})
export class MenuConfigurationComponent {

  menuFilterForm!: FormGroup;

  menuStatusList: Array<any> = [];

  menuList: Array<any> = [];

  totalRecords = 0;
  pageSize = 5;
  currentPage: number = 1;

 displayedColumns: string[] = ['srNo', 'title', 'path', 'componentName', 'action'];



  constructor(
      private commonService: CommonService,
      private cryptoService: CryptoService,
      private apiService: ApiService,
      private activateRoute: ActivatedRoute,
      private fb: FormBuilder,
      private router: Router
    ) {
      
    }

    ngOnInit() {
      this.prepareMenuFilterForm();
      this.getparam();
    }

  prepareMenuFilterForm() {
    this.menuFilterForm = this.fb.group({
          menuName: ['',],
          menuStatus: [''],
    })
  }

  getparam() {
    this.activateRoute.data.subscribe(params => {

      if (params['data']) {
        const rawMenus = params['data'].menus.data || []

        this.menuList = this.flattenMenus(rawMenus);

        console.log(this.menuList)

        this.menuStatusList = params['data'].menuStatus.data.types || [];

        this.menuStatusList = this.menuStatusList.map(item => {
          return {
            value: item.typeValue,
            label: item.typeLabel,
          };
        })
      }
    })
  }

  toggle(menu: any) {
    
    menu.expanded = !menu.expanded;
  }

  createMenu() {
    this.router.navigateByUrl('/create-menu')
  }

  flattenMenus(menus: any[], level: number = 0, parentId: string | null = null): any[] {
  return menus.reduce((acc: any[], menu) => {
    const { childMenu, path, componentName, ...rest } = menu;
    const current = {
      ...rest,
      level,
      parentId,
      path: path || '',
      componentName: componentName || '',
      visibility: true
    };
    acc.push(current);

    if (childMenu && childMenu.length) {
      acc.push(...this.flattenMenus(childMenu, level + 1, menu._id));
    }

    return acc;
  }, []);
}

toggleVisibility(menu: any) {
  menu.visibility = !menu.visibility;
}


onEditMedu(element: any) {
  const payload = {
    id: element._id,
    title: element.title,
    componentName: element.componentName,
    description: element.description,
    icon: element.icon,
    parentId: element.parentId,
    parentMenu: element.parentMenu,
    path: element.path,
    sequence: element.sequence,
    mode: 'edit'
  }
  this.router.navigate(['/create-menu'], {
    queryParams: {
      // data: this.commonService.encryptByAEStoString(payload)
      data: this.cryptoService.encrypt(payload)
    }
  })
}

  applyFilters() {

  }

  clearFilters() {

  }

   onPageChange(event: PageEvent): void {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      // this.getEmployeesLeave();
    }
}
