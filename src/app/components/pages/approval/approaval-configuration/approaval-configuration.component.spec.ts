import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproavalConfigurationComponent } from './approaval-configuration.component';

describe('ApproavalConfigurationComponent', () => {
  let component: ApproavalConfigurationComponent;
  let fixture: ComponentFixture<ApproavalConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproavalConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproavalConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
