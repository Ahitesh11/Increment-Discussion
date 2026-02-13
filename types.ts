
export interface EmployeeData {
  rowIndex: number;
  Timestamp: string | Date;
  "Unique No.": string;
  "Employee Code": string;
  "Employee Name": string;
  "Designation": string;
  "Date of Joining": string | Date;
  "Joining Company Name": string;
  "Joining Salary": number;
  "Current Salary": number;
  "Department": string;
  "Last Increment Amount": number;
  "Last Increment Date": string | Date;
  "HOD": string;
  "Hod Amount": number;
  "Hod Feedback": string;
  "Mgmt Amount": number;
  "Mgmt Feedback": string;
  "Increment Form": string;
  "Remark": string;
  "Mark Done": string;
  "Planned": string | Date;
  "Actual": string | Date;
  "Planned2": string | Date;
  "Actual2": string | Date;
  "Planned3": string | Date;
  "Actual3": string | Date;
}

export interface UpcomingData {
  "Last Increment Date": string | Date;
  "Employee ID": string;
  "Next Increment Date": string | Date;
  "Date Of Joining": string | Date;
  "Name As Per Aadhar": string;
  "Joining Place": string;
  "Company Name": string;
  "Designation": string;
  "Joining Salary": number;
  "Total Year Working For Our Company": number;
  "Attendance Mode": string;
}

export interface User {
  Username: string;
  Name: string;
  Dashboard: string;
  "Add New Entry": string;
  "HOD Approval": string;
  "Management": string;
  "Salary Finalize": string;
  "Master Records": string;
}

export enum AppStep {
  DASHBOARD = 'DASHBOARD',
  HOD_COMMENTS = 'HOD_COMMENTS',
  MGMT_COMMENTS = 'MGMT_COMMENTS',
  SALARY_INCREMENT = 'SALARY_INCREMENT',
  RECORDS = 'RECORDS',
  ADD_NEW = 'ADD_NEW'
}

export interface StepConfig {
  id: AppStep;
  label: string;
  actualColumn: string;
  plannedColumn: string;
  fields: string[];
  tableColumns: string[];
}
