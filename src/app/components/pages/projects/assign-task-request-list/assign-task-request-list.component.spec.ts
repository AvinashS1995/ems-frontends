import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTaskRequestListComponent } from './assign-task-request-list.component';

describe('AssignTaskRequestListComponent', () => {
  let component: AssignTaskRequestListComponent;
  let fixture: ComponentFixture<AssignTaskRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignTaskRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignTaskRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
