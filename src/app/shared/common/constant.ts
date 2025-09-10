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

export const APPROVAL_ROUTE_MAP: { [key: string]: string } = {
  '1': '/employee-leave-approval-request-list',
  '3': '/employee-leave-approval-request-list',
  '4': '/assign-project-request-list',
};

// Month List
export const MONTH_LIST = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

// Year List → 2025 down to 2020
export const YEAR_LIST = Array.from({ length: 6 }, (_, i) => {
  const year = 2025 - i;
  return { value: year, label: `${year}` };
});

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export enum RoleCategory {
  MANAGER = 1,
  TEAMLEADER = 2,
  EMPLOYEE = 3,
  HR = 4,
}
