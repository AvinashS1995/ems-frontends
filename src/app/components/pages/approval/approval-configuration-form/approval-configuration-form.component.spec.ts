import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalConfigurationFormComponent } from './approval-configuration-form.component';

describe('ApprovalConfigurationFormComponent', () => {
  let component: ApprovalConfigurationFormComponent;
  let fixture: ComponentFixture<ApprovalConfigurationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalConfigurationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalConfigurationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
