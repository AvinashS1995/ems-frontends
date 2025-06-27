export const REGEX = {
  MOBILE_NUMBER_REGEX: /^\d{10}$/,
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

export enum ForgotPasswordStep {
  VERIFY_EMAIL,
  SEND_OTP,
  VERIFY_OTP,
  RESET_PASSWORD,
}

export enum CheckInsStep {
  INITIAL,
  SEND_OTP,
}
