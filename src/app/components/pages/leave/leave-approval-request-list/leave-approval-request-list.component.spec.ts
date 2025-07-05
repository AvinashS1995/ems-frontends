import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApprovalRequestListComponent } from './leave-approval-request-list.component';

describe('LeaveApprovalRequestListComponent', () => {
  let component: LeaveApprovalRequestListComponent;
  let fixture: ComponentFixture<LeaveApprovalRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveApprovalRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveApprovalRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
