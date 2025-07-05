import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleWiseMenuConfigurationComponent } from './role-wise-menu-configuration.component';

describe('RoleWiseMenuConfigurationComponent', () => {
  let component: RoleWiseMenuConfigurationComponent;
  let fixture: ComponentFixture<RoleWiseMenuConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleWiseMenuConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleWiseMenuConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
