import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CommonService } from '../../../../../shared/service/common/common.service';
import { CryptoService } from '../../../../../shared/service/common/crypto.service';
import { ApiService } from '../../../../../shared/service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SHARED_MATERIAL_MODULES } from '../../../../../shared/common/shared-material';

@Component({
  selector: 'app-popup-configuration',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './popup-configuration.component.html',
  styleUrl: './popup-configuration.component.scss'
})
export class PopupConfigurationComponent {

  popupConfigFilterForm!: FormGroup;
  
    menuStatusList: Array<any> = [];
  
    menuList: Array<any> = [];
  
    totalRecords = 0;
    pageSize = 5;
    currentPage: number = 1;
  
    displayedColumns: string[] = [
      'srNo',
      'title',
      'path',
      'componentName',
    ];
  
    constructor(
      private commonService: CommonService,
      private cryptoService: CryptoService,
      private apiService: ApiService,
      private activateRoute: ActivatedRoute,
      private fb: FormBuilder,
      private router: Router
    ) {}
  
    ngOnInit() {
      this.prepareMenuFilterForm();
    }
  
    prepareMenuFilterForm() {
      this.popupConfigFilterForm = this.fb.group({
        menuName: [''],
        menuStatus: [''],
      });
    }
  
    
  
    createMenu() {
      this.router.navigateByUrl('/create-popup-configuration');
    }
  
  
    applyFilters() {}
  
    clearFilters() {
      this.popupConfigFilterForm.reset();
    }
  
    onPageChange(event: PageEvent): void {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      // this.getEmployeesLeave();
    }
}
