import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMenuConfigurationComponent } from './create-menu-configuration.component';

describe('CreateMenuConfigurationComponent', () => {
  let component: CreateMenuConfigurationComponent;
  let fixture: ComponentFixture<CreateMenuConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMenuConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMenuConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
