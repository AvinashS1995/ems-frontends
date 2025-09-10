import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignProjectRequestListComponent } from './assign-project-request-list.component';

describe('AssignProjectRequestListComponent', () => {
  let component: AssignProjectRequestListComponent;
  let fixture: ComponentFixture<AssignProjectRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignProjectRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignProjectRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
