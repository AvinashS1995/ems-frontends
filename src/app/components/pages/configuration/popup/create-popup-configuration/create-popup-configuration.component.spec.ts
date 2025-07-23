import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePopupConfigurationComponent } from './create-popup-configuration.component';

describe('CreatePopupConfigurationComponent', () => {
  let component: CreatePopupConfigurationComponent;
  let fixture: ComponentFixture<CreatePopupConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePopupConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePopupConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
