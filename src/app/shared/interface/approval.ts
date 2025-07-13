export interface RequestType {
  label: string;
  value: number | string;
}

export interface Role {
  _id: string;
  typeLabel: string;
  typeValue: number;
  description: string;
  departmentType?: string;
}

export interface Category {
  name: string;
  expanded: boolean;
  roles: Role[];
}

export interface ApprovalStep {
  label: string;
  createdBy: string | null;
  updatedBy: string | null;
  status: string;
  comment: string | null;
  date: Date | null;
}

export interface StepperApiData {
  role: string;
  empNo: string;
  name: string;
  approveBy: string;
  comments: string | null;
  actionDate: string | null;
  status: string;
}
