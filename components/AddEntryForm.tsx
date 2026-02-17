import React, { useState, useEffect } from 'react';
import { Send, UserPlus, Info, Wallet, Search, Sparkles } from 'lucide-react';

interface AddEntryFormProps {
  onSubmit: (formData: any) => Promise<void>;
  masterData: any[];
  existingDataCount: number;
}

const AddEntryForm: React.FC<AddEntryFormProps> = ({ onSubmit, masterData, existingDataCount }) => {
  const [formData, setFormData] = useState({
    "Unique No.": "",
    "Employee Code": "",
    "Employee Name": "",
    "Designation": "",
    "Date of Joining": "",
    "Joining Company Name": "",
    "Joining Salary": "",
    "Current Salary": "",
    "Department": "",
    "Last Increment Amount": "",
    "Last Increment Date": "",
    "HOD": ""
  });
  const [loading, setLoading] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  useEffect(() => {
    const nextId = existingDataCount + 1;
    const formattedId = `FMS-${nextId.toString().padStart(4, '0')}`;
    setFormData(prev => ({ ...prev, "Unique No.": formattedId }));
  }, [existingDataCount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "Employee Code") {
      const selectedEmp = masterData.find(emp => emp["Employee Code"] === value);
      if (selectedEmp) {
        const formatDate = (val: any) => {
          if (!val) return "";
          const d = new Date(val);
          if (isNaN(d.getTime())) return val;
          return d.toISOString().split('T')[0];
        };
        setFormData(prev => ({
          ...prev,
          "Employee Code": value,
          "Employee Name": selectedEmp["Employee Name"] || "",
          "Designation": selectedEmp["Designation"] || "",
          "Department": selectedEmp["Department"] || "",
          "Date of Joining": formatDate(selectedEmp["Date of Joining"]),
          "Joining Company Name": selectedEmp["Joining Company Name"] || "",
          "Joining Salary": selectedEmp["Joining Salary"] || "",
          "Current Salary": selectedEmp["Current Salary"] || "",
          "Last Increment Amount": selectedEmp["Last Increment Amount"] || "",
          "Last Increment Date": formatDate(selectedEmp["Last Increment Date"]),
          "HOD": selectedEmp["HOD"] || ""
        }));
        setAutoFilled(true);
        setTimeout(() => setAutoFilled(false), 2000);
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
        setAutoFilled(false);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const today = new Date();
    const dateOnly = today.toLocaleDateString('en-GB');
    await onSubmit({ ...formData, "Timestamp": dateOnly });
    setLoading(false);
    const nextId = existingDataCount + 2;
    const formattedId = `FMS-${nextId.toString().padStart(4, '0')}`;
    setFormData({
      "Unique No.": formattedId,
      "Employee Code": "",
      "Employee Name": "",
      "Designation": "",
      "Date of Joining": "",
      "Joining Company Name": "",
      "Joining Salary": "",
      "Current Salary": "",
      "Department": "",
      "Last Increment Amount": "",
      "Last Increment Date": "",
      "HOD": ""
    });
    setAutoFilled(false);
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: '#d1fae5' }}>
        <Icon size={14} style={{ color: '#059669' }} strokeWidth={2.3} />
      </div>
      <span style={{ fontSize: '10px', fontWeight: 800, color: '#047857', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        {title}
      </span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #bbf7d0, transparent)' }} />
    </div>
  );

  const inputBase = `w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200`;
  const inputStyle = {
    background: '#f0fdf4',
    border: '1.5px solid #bbf7d0',
    color: '#1e4d3b',
  };
  const inputFocusStyle = `focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400`;
  const disabledStyle = { background: '#ecfdf5', color: '#6ee7b7', cursor: 'not-allowed' };

  const InputField = ({
    label, name, type = 'text', required = true, disabled = false
  }: {
    label: string; name: string; type?: string; required?: boolean; disabled?: boolean;
  }) => (
    <div className="space-y-1.5">
      <label style={{ fontSize: '10px', fontWeight: 700, color: '#059669', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={(formData as any)[name]}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className={`${inputBase} ${inputFocusStyle}`}
        style={disabled ? { ...inputStyle, ...disabledStyle } : inputStyle}
        placeholder={disabled ? '' : `Enter ${label.toLowerCase()}…`}
      />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 max-w-4xl mx-auto w-full">

      {/* ── Header ── */}
      <div
        className="shrink-0 rounded-t-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 60%, #f7fee7 100%)',
          border: '1.5px solid #bbf7d0',
          borderBottom: 'none',
          boxShadow: '0 4px 24px rgba(52,211,153,0.10)',
        }}
      >
        <div className="px-8 py-6 flex items-center gap-4">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-2xl shadow-md"
            style={{ background: 'linear-gradient(135deg, #34d399, #10b981)', boxShadow: '0 4px 14px rgba(52,211,153,0.35)' }}
          >
            <UserPlus size={22} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#064e3b' }}>New Increment File</h2>
            <p className="text-xs mt-0.5" style={{ color: '#6ee7b7' }}>Select an employee to auto-fill details</p>
          </div>
          {/* Unique No. pill */}
          <div className="ml-auto">
            <span
              className="text-xs font-black px-3 py-1.5 rounded-full"
              style={{ background: '#d1fae5', color: '#047857', letterSpacing: '0.1em' }}
            >
              {formData["Unique No."]}
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
          border: '1.5px solid #bbf7d0',
          borderTop: 'none',
          borderBottom: 'none',
          scrollbarWidth: 'thin',
          scrollbarColor: '#a7f3d0 #f0fdf4',
        }}
      >
        <form id="add-entry-form" onSubmit={handleFormSubmit} className="px-8 py-8 space-y-10">

          {/* Auto-fill toast */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-500 overflow-hidden"
            style={{
              background: autoFilled ? '#d1fae5' : 'transparent',
              color: '#059669',
              maxHeight: autoFilled ? '48px' : '0px',
              opacity: autoFilled ? 1 : 0,
              padding: autoFilled ? undefined : '0 16px',
              marginBottom: autoFilled ? undefined : '-32px',
            }}
          >
            <Sparkles size={13} />
            Employee details auto-filled successfully
          </div>

          {/* Information Section */}
          <div>
            <SectionHeader icon={Info} title="Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* Unique No. — disabled */}
              <InputField label="Unique No." name="Unique No." disabled />

              {/* Employee Code dropdown */}
              <div className="space-y-1.5">
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#059669', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Employee Code
                </label>
                <div className="relative">
                  <select
                    name="Employee Code"
                    value={formData["Employee Code"]}
                    onChange={handleChange}
                    required
                    className={`${inputBase} ${inputFocusStyle} appearance-none pr-10`}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">Select employee…</option>
                    {masterData.map((emp, i) => (
                      <option key={i} value={emp["Employee Code"]}>
                        {emp["Employee Code"]} — {emp["Employee Name"]}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none" style={{ color: '#34d399' }}>
                    <Search size={15} />
                  </div>
                </div>
              </div>

              <InputField label="Employee Name" name="Employee Name" />
              <InputField label="Designation" name="Designation" />
              <InputField label="Department" name="Department" />
              <InputField label="Date of Joining" name="Date of Joining" type="date" />
            </div>
          </div>

          {/* Finance Section */}
          <div>
            <SectionHeader icon={Wallet} title="Finance" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <InputField label="Joining Company" name="Joining Company Name" />
              <InputField label="Joining Salary" name="Joining Salary" type="number" />
              <InputField label="Current Salary" name="Current Salary" type="number" />
              <InputField label="Last Increment Amt" name="Last Increment Amount" type="number" />
              <InputField label="Last Incr. Date" name="Last Increment Date" type="date" />
              <InputField label="Assign HOD" name="HOD" />
            </div>
          </div>

        </form>
      </div>

      {/* ── Footer ── */}
      <div
        className="shrink-0 px-8 py-6 rounded-b-3xl"
        style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
          border: '1.5px solid #bbf7d0',
          borderTop: '1px solid #d1fae5',
          boxShadow: '0 -4px 20px rgba(52,211,153,0.08)',
        }}
      >
        <button
          form="add-entry-form"
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-white text-sm tracking-wide transition-all duration-200 active:scale-[0.98]"
          style={{
            background: loading
              ? '#6ee7b7'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: loading ? 'none' : '0 6px 24px rgba(16,185,129,0.30)',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={e => {
            if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(16,185,129,0.40)';
          }}
          onMouseLeave={e => {
            if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(16,185,129,0.30)';
          }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing…</span>
            </>
          ) : (
            <>
              <Send size={16} strokeWidth={2.3} />
              <span>Save Entry</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddEntryForm;