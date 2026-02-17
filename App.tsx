
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StepTable from './components/StepTable';
import RecordsTable from './components/RecordsTable';
import PresentEmployeesTable from './components/PresentEmployeesTable';
import UpdateForm from './components/UpdateForm';
import AddEntryForm from './components/AddEntryForm';
import Login from './components/Login';
import { AppStep, EmployeeData, User, UpcomingData, PresentEmployeeData } from './types';
import { STEPS_CONFIG, API_URL } from './constants';
import { fetchSheetData, updateSheetRow, createSheetRow } from './services/api';
import { RefreshCw, Search } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeStep, setActiveStep] = useState<AppStep>(AppStep.DASHBOARD);
  const [sheetData, setSheetData] = useState<EmployeeData[]>([]);
  const [masterData, setMasterData] = useState<any[]>([]);
  const [loginData, setLoginData] = useState<User[]>([]);
  const [upcomingData, setUpcomingData] = useState<UpcomingData[]>([]);
  const [presentData, setPresentData] = useState<PresentEmployeeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState<EmployeeData | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchSheetData(API_URL);
      setSheetData(response.fmsData);
      setMasterData(response.masterData);
      setLoginData(response.loginData);
      setUpcomingData(response.upcomingData);
      setPresentData(response.presentData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stepCounts = useMemo(() => {
    const hodCount = sheetData.filter(row => !row.Actual || row.Actual === "").length;
    const mgmtCount = sheetData.filter(row => !!row.Actual && row.Actual !== "" && (!row.Actual2 || row.Actual2 === "")).length;
    const salaryCount = sheetData.filter(row => !!row.Actual2 && row.Actual2 !== "" && (!row.Actual3 || row.Actual3 === "")).length;
    const completedCount = sheetData.filter(row => !!row.Actual3 && row.Actual3 !== "").length;

    return {
      [AppStep.HOD_COMMENTS]: hodCount,
      [AppStep.MGMT_COMMENTS]: mgmtCount,
      [AppStep.SALARY_INCREMENT]: salaryCount,
      [AppStep.RECORDS]: completedCount
    };
  }, [sheetData]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('fms_user', JSON.stringify(user));
    
    if (user.Dashboard === 'Yes') setActiveStep(AppStep.DASHBOARD);
    else if (user['Add New Entry'] === 'Yes') setActiveStep(AppStep.ADD_NEW);
    else if (user['HOD Approval'] === 'Yes') setActiveStep(AppStep.HOD_COMMENTS);
    else if (user['Management'] === 'Yes') setActiveStep(AppStep.MGMT_COMMENTS);
    else if (user['Salary Finalize'] === 'Yes') setActiveStep(AppStep.SALARY_INCREMENT);
    else if (user['Master Records'] === 'Yes') setActiveStep(AppStep.RECORDS);
    else setActiveStep(AppStep.PRESENT_EMPLOYEES);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fms_user');
    setActiveStep(AppStep.DASHBOARD);
  };

  const handleAction = (row: EmployeeData) => {
    setSelectedRow(row);
  };

  const handleFormSubmit = async (formData: any) => {
    if (!selectedRow) return;

    const currentConfig = STEPS_CONFIG.find(c => c.id === activeStep);
    if (!currentConfig) return;

    const isSalaryStep = activeStep === AppStep.SALARY_INCREMENT;
    
    const success = await updateSheetRow(
      API_URL, 
      selectedRow.rowIndex, 
      formData, 
      currentConfig.actualColumn,
      isSalaryStep
    );

    if (success) {
      await loadData();
      setSelectedRow(null);
    } else {
      alert("Failed to update sheet. Please check your connection.");
    }
  };

  const handleCreateSubmit = async (formData: any) => {
    const success = await createSheetRow(API_URL, formData);
    if (success) {
      alert("New record submitted successfully!");
      await loadData();
      setActiveStep(AppStep.RECORDS);
    } else {
      alert("Failed to submit new record.");
    }
  };

  if (!currentUser) {
    return <Login loginData={loginData} onLogin={handleLogin} loading={loading} />;
  }

  const filteredData = sheetData.filter(emp => 
    emp["Employee Name"]?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp["Employee Code"]?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp["Unique No."]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPresentData = presentData.filter(emp =>
    emp["Name As Per Aadhar"]?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp["Pmmpl-Ac"]?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp["Designation"]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout 
      activeStep={activeStep} 
      onStepChange={setActiveStep} 
      user={currentUser} 
      onLogout={handleLogout}
      counts={stepCounts}
    >
      {/* Utility Bar */}
      {activeStep !== AppStep.DASHBOARD && activeStep !== AppStep.ADD_NEW && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shrink-0">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm shadow-sm active:scale-95"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      )}

      {activeStep === AppStep.DASHBOARD && <Dashboard data={sheetData} upcomingData={upcomingData} />}
      {activeStep === AppStep.RECORDS && <RecordsTable data={filteredData.filter(row => !!row.Actual3 && row.Actual3 !== "")} />}
      {activeStep === AppStep.PRESENT_EMPLOYEES && <PresentEmployeesTable data={filteredPresentData} />}
      {activeStep === AppStep.ADD_NEW && (
        <AddEntryForm 
          onSubmit={handleCreateSubmit} 
          masterData={masterData}
          existingDataCount={sheetData.length}
        />
      )}
      
      {activeStep !== AppStep.DASHBOARD && activeStep !== AppStep.RECORDS && activeStep !== AppStep.ADD_NEW && activeStep !== AppStep.PRESENT_EMPLOYEES && (
        <>
          {(() => {
            const config = STEPS_CONFIG.find(c => c.id === activeStep);
            if (!config) return null;

            const pendingStepData = filteredData.filter(row => {
              const currentActual = row[config.actualColumn as keyof EmployeeData];
              const isCurrentPending = !currentActual || currentActual === "" || currentActual === "null";
              
              if (!isCurrentPending) return false;

              if (activeStep === AppStep.HOD_COMMENTS) {
                return true;
              } else if (activeStep === AppStep.MGMT_COMMENTS) {
                return !!row.Actual && row.Actual !== "";
              } else if (activeStep === AppStep.SALARY_INCREMENT) {
                return !!row.Actual2 && row.Actual2 !== "";
              }
              
              return true;
            });

            return (
              <StepTable 
                data={pendingStepData} 
                config={config} 
                onAction={handleAction} 
              />
            );
          })()}
        </>
      )}

      {selectedRow && (
        <UpdateForm 
          row={selectedRow}
          config={STEPS_CONFIG.find(c => c.id === activeStep)!}
          onClose={() => setSelectedRow(null)}
          onSubmit={handleFormSubmit}
        />
      )}
    </Layout>
  );
};

export default App;
