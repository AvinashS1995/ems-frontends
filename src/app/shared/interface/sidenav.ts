export interface Sidenav {
  id: string;
  title: string;
  icon: string;
  route: string;
  sequence: number;
  children: Sidenav[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
  color: string;
  isRead: boolean;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  module: string;
  event: string;

  recipientEmployee: string;
  recipientEmail?: string;

  createdByEmployee?: string;
  createdByName?: string;

  icon: string;
  color: string;

  isRead: boolean;
  readAt?: string | null;

  route?: string | null;

  referenceId?: string | null;
  referenceType?: string | null;

  metadata?: any;

  expiresAt?: string | null;

  createdAt: string;
  updatedAt: string;
}
