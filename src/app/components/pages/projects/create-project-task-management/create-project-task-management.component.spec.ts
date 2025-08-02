import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectTaskManagementComponent } from './create-project-task-management.component';

describe('CreateProjectTaskManagementComponent', () => {
  let component: CreateProjectTaskManagementComponent;
  let fixture: ComponentFixture<CreateProjectTaskManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProjectTaskManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProjectTaskManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
