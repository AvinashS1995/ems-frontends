import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewRoleTypeComponent } from './add-new-role-type.component';

describe('AddNewRoleTypeComponent', () => {
  let component: AddNewRoleTypeComponent;
  let fixture: ComponentFixture<AddNewRoleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewRoleTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewRoleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
