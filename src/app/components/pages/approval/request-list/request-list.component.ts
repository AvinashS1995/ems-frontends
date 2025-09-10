import { Component } from '@angular/core';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { APPROVAL_ROUTE_MAP } from '../../../../shared/common/constant';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss',
})
export class RequestListComponent {
  private destroy$ = new Subject<void>();
  requestList: Array<any> = [];

  displayedColumns: string[] = ['srno', 'requestType', 'noOfRequest', 'view'];

  constructor(private activateRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getparams();
  }

  getparams() {
    this.activateRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        console.log('PARAMS--->', params);

        if (params['data']) {
          this.requestList =
            params['data']?.employeeApprovalList?.data.approvalList || [];

          console.log(this.requestList);
        }
      });
  }

  navigateToRequest(element: any) {
    const route = APPROVAL_ROUTE_MAP[element.applicationType];
    if (route) {
      this.router.navigate([route]);
    } else {
      console.warn(`No route mapped for: ${element.applicationType}`);
    }
  }
}
