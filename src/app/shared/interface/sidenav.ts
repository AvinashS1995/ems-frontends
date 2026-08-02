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
