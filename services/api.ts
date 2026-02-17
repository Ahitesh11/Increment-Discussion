
import { EmployeeData, User, UpcomingData, PresentEmployeeData } from '../types';

export interface SheetResponse {
  fmsData: EmployeeData[];
  masterData: any[];
  loginData: User[];
  upcomingData: UpcomingData[];
  presentData: PresentEmployeeData[];
}

export const fetchSheetData = async (apiUrl: string): Promise<SheetResponse> => {
  if (!apiUrl) return { fmsData: [], masterData: [], loginData: [], upcomingData: [], presentData: [] };
  try {
    const response = await fetch(apiUrl);
    const result = await response.json();
    return {
      fmsData: result.fmsData || [],
      masterData: result.masterData || [],
      loginData: result.loginData || [],
      upcomingData: result.upcomingData || [],
      presentData: result.presentData || []
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { fmsData: [], masterData: [], loginData: [], upcomingData: [], presentData: [] };
  }
};

export const updateSheetRow = async (
  apiUrl: string, 
  rowIndex: number, 
  updates: any, 
  actualColumnName?: string,
  isSalaryFinalize: boolean = false
): Promise<boolean> => {
  if (!apiUrl) return true;
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        rowIndex,
        updates,
        actualColumnName,
        isSalaryFinalize
      })
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error updating data:", error);
    return false;
  }
};

export const createSheetRow = async (apiUrl: string, updates: any): Promise<boolean> => {
  if (!apiUrl) return true;
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        updates
      })
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error creating data:", error);
    return false;
  }
};
