
import { AppStep, StepConfig } from './types';

export const APP_NAME = "Salary Increment FMS";

export const STEPS_CONFIG: StepConfig[] = [
  {
    id: AppStep.HOD_COMMENTS,
    label: 'Hod Approval',
    actualColumn: 'Actual',
    plannedColumn: 'Planned',
    fields: ['Hod Amount', 'Hod Feedback'],
    tableColumns: [
      "Timestamp",
      "Unique No.",
      "Employee Code",
      "Employee Name",
      "Designation",
      "Date of Joining",
      "Joining Company Name",
      "Joining Salary",
      "Current Salary",
      "Department",
      "Last Increment Amount",
      "Last Increment Date",
      "HOD",
      "Planned"
    ]
  },
  {
    id: AppStep.MGMT_COMMENTS,
    label: 'Mgmt Comments',
    actualColumn: 'Actual2',
    plannedColumn: 'Planned2',
    fields: ['Mgmt Amount', 'Mgmt Feedback'],
    tableColumns: [
      "Timestamp",
      "Unique No.",
      "Employee Code",
      "Employee Name",
      "Designation",
      "Date of Joining",
      "Joining Company Name",
      "Joining Salary",
      "Current Salary",
      "Department",
      "Last Increment Amount",
      "Last Increment Date",
      "HOD",
      "Hod Amount",
      "Hod Feedback",
      "Planned2"
    ]
  },
  {
    id: AppStep.SALARY_INCREMENT,
    label: 'Salary Finalize',
    actualColumn: 'Actual3',
    plannedColumn: 'Planned3',
    fields: ['Action', 'Employee ID', 'Date Of Increment', 'Current Salary', 'Increment Amount', 'Next Increment (No. Of Month)', 'Note', 'Mark Done'], 
    tableColumns: [
      "Timestamp",
      "Unique No.",
      "Employee Code",
      "Employee Name",
      "Designation",
      "Date of Joining",
      "Joining Company Name",
      "Joining Salary",
      "Current Salary",
      "Department",
      "Last Increment Amount",
      "Last Increment Date",
      "HOD",
      "Hod Amount",
      "Hod Feedback",
      "Mgmt Amount",
      "Mgmt Feedback",
      "Planned3"
    ]
  }
];

export const PRESENT_EMPLOYEES_COLUMNS = [
  "Pmmpl-Ac",
  "Name As Per Aadhar",
  "Joining Company Name",
  "Date Of Joining",
  "Joining Place",
  "Designation",
  "Joining Salary",
  "Payment Mode",
  "Current Bank A.C No.",
  "Ifsc Code",
  "Branch Name",
  "Actual Salary",
  "Pf Number",
  "Esic Number",
  "Salary Bank Name",
  "Account Number",
  "Ifsc Code 2",
  "Photo",
  "Attendance Mode",
  "Working Days",
  "Incentive Category",
  "Current Salary"
];

export const MASTER_COLUMNS = [
  "Timestamp",
  "Unique No.",
  "Employee Code",
  "Employee Name",
  "Designation",
  "Date of Joining",
  "Joining Company Name",
  "Joining Salary",
  "Current Salary",
  "Department",
  "Last Increment Amount",
  "Last Increment Date",
  "HOD",
  "Hod Amount",
  "Hod Feedback",
  "Mgmt Amount",
  "Mgmt Feedback"
];

export const DISPLAY_COLUMNS = [
  "Unique No.",
  "Employee Code",
  "Employee Name",
  "Designation",
  "Department",
  "Current Salary"
];

export const API_URL = 'https://script.google.com/macros/s/AKfycbz3pKDRMdJgp2LG1yaN6RSxPy8YoU6ax8l6VTz7-BwtVim3AjVdr-xgMgCPcMRypckWWw/exec';
