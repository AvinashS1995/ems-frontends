import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBotDialogComponent } from './chat-bot-dialog.component';

describe('ChatBotDialogComponent', () => {
  let component: ChatBotDialogComponent;
  let fixture: ComponentFixture<ChatBotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBotDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
