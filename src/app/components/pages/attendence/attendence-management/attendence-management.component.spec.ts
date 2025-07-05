import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendenceManagementComponent } from './attendence-management.component';

describe('AttendenceManagementComponent', () => {
  let component: AttendenceManagementComponent;
  let fixture: ComponentFixture<AttendenceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendenceManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendenceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
