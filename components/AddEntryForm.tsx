import React, { useState, useEffect } from 'react';
import { Send, UserPlus, Wallet, Hash, TrendingUp, UserCircle, ChevronDown } from 'lucide-react';

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
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const submissionData = { ...formData, "Timestamp": new Date().toLocaleString() };
    await onSubmit(submissionData);
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
  };

  // ─── Base Styles ─────────────────────────────────────────────────────
  const baseInput: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    color: '#1f2937',
    fontSize: 13,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
  };

  const Section = ({ icon: Icon, title, accent, children }: { icon: any; title: string; accent: string; children: React.ReactNode }) => (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: 18,
      padding: '24px',
      position: 'relative',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 24, right: 24, height: 2, background: accent, borderRadius: 99 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ background: `${accent}10`, border: `1px solid ${accent}30`, borderRadius: 10, padding: 8 }}>
          <Icon size={16} style={{ color: accent, display: 'block' }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</span>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, name, type = 'text', disabled = false, required = false, placeholder }: { label: string; name: string; type?: string; disabled?: boolean; required?: boolean; placeholder?: string }) => (
    <div>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={(formData as any)[name]}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
        style={{
          ...baseInput,
          ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = '#f97316';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </div>
  );

  const SelectField = () => (
    <div>
      <label style={labelStyle}>
        Employee Code <span style={{ color: '#ef4444' }}>*</span>
      </label>
      <div style={{ position: 'relative' }}>
        <select
          name="Employee Code"
          value={formData["Employee Code"]}
          onChange={handleChange}
          required
          style={{
            ...baseInput,
            appearance: 'none',
            WebkitAppearance: 'none',
            paddingRight: 38,
            cursor: 'pointer',
            background: '#f9fafb',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = '#f97316';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)';
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <option value="" style={{ background: '#fff' }}>Select employee…</option>
          {masterData.map((emp, i) => (
            <option key={i} value={emp["Employee Code"]} style={{ background: '#fff' }}>
              {emp["Employee Code"]} — {emp["Employee Name"]}
            </option>
          ))}
        </select>
        <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
      </div>
    </div>
  );

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: '#f9fafb',
      minHeight: '100vh',
      padding: '32px',
      color: '#1f2937',
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: '#f97316', textTransform: 'uppercase', marginBottom: 8 }}>
            HR Operations
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                background: 'linear-gradient(135deg, #f97316, #fb923c)',
                borderRadius: 14,
                padding: 12,
                boxShadow: '0 4px 12px rgba(249,115,22,0.2)',
              }}>
                <UserPlus size={22} style={{ color: '#fff', display: 'block' }} />
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>
                  New Increment Entry
                </h1>
                <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4, fontWeight: 500 }}>
                  Select an employee to auto-fill details
                </p>
              </div>
            </div>
            <div style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            }}>
              <Hash size={13} style={{ color: '#9ca3af' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', fontVariantNumeric: 'tabular-nums' }}>
                {formData["Unique No."]}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Section icon={UserCircle} title="Employee Identity" accent="#f97316">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <SelectField />
                <Field label="Employee Name" name="Employee Name" required />
                <Field label="Designation" name="Designation" />
                <Field label="Department" name="Department" />
                <Field label="Date of Joining" name="Date of Joining" type="date" />
                <Field label="HOD" name="HOD" />
              </div>
            </Section>

            <Section icon={Wallet} title="Salary Details" accent="#fb923c">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <Field label="Joining Company" name="Joining Company Name" />
                <Field label="Joining Salary" name="Joining Salary" type="number" placeholder="₹ 0" />
                <Field label="Current Salary" name="Current Salary" type="number" placeholder="₹ 0" />
              </div>
            </Section>

            <Section icon={TrendingUp} title="Increment Info" accent="#f59e0b">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <Field label="Last Increment Amount" name="Last Increment Amount" type="number" placeholder="₹ 0" />
                <Field label="Last Increment Date" name="Last Increment Date" type="date" />
              </div>
            </Section>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                border: 'none',
                background: loading ? '#e5e7eb' : '#f97316',
                color: loading ? '#6b7280' : '#fff',
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'background 0.2s, transform 0.1s',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(249,115,22,0.3)',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#ea580c'; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#f97316'; }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 18, height: 18, border: '2px solid #9ca3af',
                    borderTopColor: '#6b7280', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Processing…
                </>
              ) : (
                <>
                  <Send size={16} />
                  Save Increment Entry
                </>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: -8 }}>
              Fields marked <span style={{ color: '#ef4444' }}>*</span> are required. All other fields are optional.
            </p>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AddEntryForm;