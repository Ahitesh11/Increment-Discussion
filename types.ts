
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

export interface PresentEmployeeData {
  "Pmmpl-Ac": string;
  "Name As Per Aadhar": string;
  "Joining Company Name": string;
  "Date Of Joining": string | Date;
  "Joining Place": string;
  "Designation": string;
  "Joining Salary": number;
  "Payment Mode": string;
  "Current Bank A.C No.": string;
  "Ifsc Code": string;
  "Branch Name": string;
  "Actual Salary": number;
  "Pf Number": string;
  "Esic Number": string;
  "Salary Bank Name": string;
  "Account Number": string;
  "Ifsc Code 2": string; // Handle duplicate IFSC
  "Photo": string;
  "Attendance Mode": string;
  "Working Days": number;
  "Incentive Category": string;
  "Current Salary": number;
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
  "Present Employees": string;
}

export enum AppStep {
  DASHBOARD = 'DASHBOARD',
  HOD_COMMENTS = 'HOD_COMMENTS',
  MGMT_COMMENTS = 'MGMT_COMMENTS',
  SALARY_INCREMENT = 'SALARY_INCREMENT',
  RECORDS = 'RECORDS',
  ADD_NEW = 'ADD_NEW',
  PRESENT_EMPLOYEES = 'PRESENT_EMPLOYEES'
}

export interface StepConfig {
  id: AppStep;
  label: string;
  actualColumn: string;
  plannedColumn: string;
  fields: string[];
  tableColumns: string[];
}
