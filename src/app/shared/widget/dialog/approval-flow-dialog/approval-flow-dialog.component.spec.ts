import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalFlowDialogComponent } from './approval-flow-dialog.component';

describe('ApprovalFlowDialogComponent', () => {
  let component: ApprovalFlowDialogComponent;
  let fixture: ComponentFixture<ApprovalFlowDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalFlowDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalFlowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
