export interface AlertDialogData {
  title: string;
  message: string;
  okText?: string;
}

export interface ConfirmationDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  }