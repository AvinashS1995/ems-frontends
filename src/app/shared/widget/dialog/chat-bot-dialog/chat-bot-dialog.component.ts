import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SHARED_MATERIAL_MODULES } from '../../../common/shared-material';

@Component({
  selector: 'app-chat-bot-dialog',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './chat-bot-dialog.component.html',
  styleUrl: './chat-bot-dialog.component.scss',
})
export class ChatBotDialogComponent {
  userMessage: string = '';
  messages: { text: string; sender: 'user' | 'bot' }[] = [
    {
      text: "Hello! I'm EMS bot AI. 👋 Wondering what’s here? I’ll help you explore.",
      sender: 'bot',
    },
  ];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(private dialogRef: MatDialogRef<ChatBotDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    const message = this.userMessage.trim();
    this.messages.push({ text: message, sender: 'user' });

    setTimeout(() => {
      const botReply = this.getBotReply(message);
      this.messages.push({ text: botReply, sender: 'bot' });
      this.scrollToBottom();
    }, 600);

    this.userMessage = '';
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }, 0);
  }

  getBotReply(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes('hi') || lower.includes('hello')) {
      return 'Hi there! How can I assist you today?';
    } else if (lower.includes('leave')) {
      return 'You can check your leave balance on the dashboard.';
    } else {
      return 'Hi again! What can I help you with today?';
    }
  }
}
