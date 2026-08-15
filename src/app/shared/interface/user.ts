export interface UserDetails {
  _id: string;
  empNo: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  email: string;
  mobile: string;
  address: string;
  country: string;
  role: string;
  roleId: number;
  type: string;
  status: string;
  reportedBy: string;
  designation: string;
  department: string;
  joiningDate: string;
  salary: number;
  workType: string;
  bankName: string;
  bankAccNo: string;
  pfNo: string;
  uan: string;
  pan: string;
  profileImage: string;
  loginUserSecretkey: string;
}

export interface TodayPerson {
  empNo: string;
  name: string;
  image: string | null;
  designation: string;
  department: string;
  yearsCompleted?: number;
}

export interface EmployeeWish {
  _id: string;
  senderEmpNo: string;
  senderName: string;
  senderDesignation: string;
  senderDepartment: string;
  senderProfileImage: string | null;
  message: string;
  occasionType: 'birthday' | 'anniversary' | 'newJoinee';
  createdAt: string;
}
