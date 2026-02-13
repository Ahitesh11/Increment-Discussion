
import { EmployeeData, User, UpcomingData } from '../types';

export interface SheetResponse {
  fmsData: EmployeeData[];
  masterData: any[];
  loginData: User[];
  upcomingData: UpcomingData[];
}

export const fetchSheetData = async (apiUrl: string): Promise<SheetResponse> => {
  if (!apiUrl) return { fmsData: [], masterData: [], loginData: [], upcomingData: [] };
  try {
    const response = await fetch(apiUrl);
    const result = await response.json();
    return {
      fmsData: result.fmsData || [],
      masterData: result.masterData || [],
      loginData: result.loginData || [],
      upcomingData: result.upcomingData || []
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { fmsData: [], masterData: [], loginData: [], upcomingData: [] };
  }
};

export const updateSheetRow = async (apiUrl: string, rowIndex: number, updates: any, actualColumnName?: string): Promise<boolean> => {
  if (!apiUrl) return true;
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        rowIndex,
        updates,
        actualColumnName
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
