import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWishesDialogComponent } from './employee-wishes-dialog.component';

describe('EmployeeWishesDialogComponent', () => {
  let component: EmployeeWishesDialogComponent;
  let fixture: ComponentFixture<EmployeeWishesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeWishesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeWishesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
