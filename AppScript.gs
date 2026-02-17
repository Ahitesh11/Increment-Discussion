
/**
 * GOOGLE APPS SCRIPT CODE
 */

const FMS_SHEET_NAME = 'Fms 1';
const MASTER_SHEET_NAME = 'Master';
const LOGIN_SHEET_NAME = 'Login Page';
const UPCOMING_SHEET_NAME = 'Upcoming';
const PRESENT_EMPLOYEES_SHEET_NAME = 'Present Employees';
const INCREMENT_FORM_SHEET_NAME = 'Increment Form';
const HEADER_ROW = 6;

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Fetch FMS Data
  const fmsSheet = ss.getSheetByName(FMS_SHEET_NAME);
  let fmsData = [];
  if (fmsSheet) {
    const lastRow = fmsSheet.getLastRow();
    const lastCol = fmsSheet.getLastColumn();
    if (lastRow > HEADER_ROW) {
      const range = fmsSheet.getRange(HEADER_ROW, 1, lastRow - HEADER_ROW + 1, lastCol);
      const values = range.getValues();
      const headers = values[0];
      for (let i = 1; i < values.length; i++) {
        const row = values[i];
        const obj = { rowIndex: i + HEADER_ROW };
        headers.forEach((header, index) => {
          if (header) {
            obj[header.toString().trim()] = row[index];
          }
        });
        fmsData.push(obj);
      }
    }
  }

  // Fetch Master Data
  const masterSheet = ss.getSheetByName(MASTER_SHEET_NAME);
  let masterData = [];
  if (masterSheet) {
    const values = masterSheet.getDataRange().getValues();
    const headers = values[0];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const obj = {};
      headers.forEach((header, index) => {
        if (header) {
          obj[header.toString().trim()] = row[index];
        }
      });
      masterData.push(obj);
    }
  }

  // Fetch Login Data
  const loginSheet = ss.getSheetByName(LOGIN_SHEET_NAME);
  let loginData = [];
  if (loginSheet) {
    const values = loginSheet.getDataRange().getValues();
    const headers = values[0];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const obj = {};
      headers.forEach((header, index) => {
        if (header) {
          obj[header.toString().trim()] = row[index];
        }
      });
      loginData.push(obj);
    }
  }

  // Fetch Upcoming Data
  const upcomingSheet = ss.getSheetByName(UPCOMING_SHEET_NAME);
  let upcomingData = [];
  if (upcomingSheet) {
    const values = upcomingSheet.getDataRange().getValues();
    const headers = values[0];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const obj = {};
      headers.forEach((header, index) => {
        if (header) {
          obj[header.toString().trim()] = row[index];
        }
      });
      upcomingData.push(obj);
    }
  }

  // Fetch Present Employees Data
  const presentSheet = ss.getSheetByName(PRESENT_EMPLOYEES_SHEET_NAME);
  let presentData = [];
  if (presentSheet) {
    const values = presentSheet.getDataRange().getValues();
    const headers = values[0];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const obj = {};
      headers.forEach((header, index) => {
        if (header) {
          obj[header.toString().trim()] = row[index];
        }
      });
      presentData.push(obj);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ 
    fmsData: fmsData,
    masterData: masterData,
    loginData: loginData,
    upcomingData: upcomingData,
    presentData: presentData
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(FMS_SHEET_NAME);
    
    let rowIndex = params.rowIndex;
    const updates = params.updates;
    const headers = sheet.getRange(HEADER_ROW, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Specialized logic for "Salary Finalize" -> "Increment Form" sheet
    if (params.isSalaryFinalize) {
      const incFormSheet = ss.getSheetByName(INCREMENT_FORM_SHEET_NAME);
      if (incFormSheet) {
        // Headers are row 1, data starts row 2
        const incHeaders = incFormSheet.getRange(1, 1, 1, incFormSheet.getLastColumn()).getValues()[0];
        const newRow = new Array(incHeaders.length).fill("");
        
        incHeaders.forEach((h, idx) => {
          const header = h.toString().trim();
          if (updates[header] !== undefined) {
            newRow[idx] = updates[header];
          } else if (header.toLowerCase() === 'timestamp') {
            newRow[idx] = new Date();
          }
        });
        incFormSheet.appendRow(newRow);
      }
    }

    // Regular workflow update in Fms 1
    if (rowIndex) {
      for (let header in updates) {
        const colIndex = headers.indexOf(header.trim()) + 1;
        if (colIndex > 0) {
          sheet.getRange(rowIndex, colIndex).setValue(updates[header]);
        }
      }

      // Update the "Actual" timestamp for workflow steps if applicable
      if (params.actualColumnName) {
        const actualColIndex = headers.indexOf(params.actualColumnName) + 1;
        if (actualColIndex > 0) {
          sheet.getRange(rowIndex, actualColIndex).setValue(new Date());
        }
      }
    } else {
      // Create new record logic (Add Entry)
      rowIndex = sheet.getLastRow() + 1;
      for (let header in updates) {
        const colIndex = headers.indexOf(header.trim()) + 1;
        if (colIndex > 0) {
          sheet.getRange(rowIndex, colIndex).setValue(updates[header]);
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, rowIndex: rowIndex }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
