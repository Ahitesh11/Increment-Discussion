import React, { useState } from 'react';
import { EmployeeData, StepConfig, AppStep } from '../types';
import { X, Send, User, ChevronRight, CheckSquare, Square, ChevronDown } from 'lucide-react';

interface UpdateFormProps {
  row: EmployeeData;
  config: StepConfig;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ row, config, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<any>(() => {
    const initial: any = {};
    config.fields.forEach(f => {
      if (config.id === AppStep.SALARY_INCREMENT) {
        if (f === 'Action')         initial[f] = 'Yes';
        else if (f === 'Employee ID')    initial[f] = row["Employee Code"] || '';
        else if (f === 'Current Salary') initial[f] = row["Current Salary"] || '';
        else                             initial[f] = row[f as keyof EmployeeData] || '';
      } else {
        initial[f] = row[f as keyof EmployeeData] || '';
      }
    });
    return initial;
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked ? 'Yes' : '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleToggleDone = () => {
    const current = formData['Mark Done'];
    setFormData({ ...formData, 'Mark Done': current === 'Yes' ? '' : 'Yes' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (config.fields.includes('Mark Done') && formData['Mark Done'] !== 'Yes') {
      alert("Please check 'Mark Done' to confirm completion.");
      return;
    }
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    onClose();
  };

  const shouldShowField = (fieldName: string) => {
    if (config.id === AppStep.SALARY_INCREMENT) {
      const action = formData['Action'];
      if (action === 'No') return fieldName === 'Action' || fieldName === 'Mark Done';
    }
    return true;
  };

  const inputBase: React.CSSProperties = {
    width: '100%',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: 600,
    outline: 'none',
    transition: 'all 0.2s',
    color: '#064e3b',
  };

  const getInputStyle = (field: string): React.CSSProperties => ({
    ...inputBase,
    background: focusedField === field ? '#ffffff' : '#f0fdf4',
    border: `1.5px solid ${focusedField === field ? '#34d399' : '#bbf7d0'}`,
    boxShadow: focusedField === field ? '0 0 0 4px rgba(52,211,153,0.12)' : 'none',
    padding: (field.toLowerCase().includes('amount') || field.toLowerCase().includes('salary'))
      ? '14px 20px 14px 36px'
      : '14px 20px',
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{ background: 'rgba(6,78,59,0.45)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="relative w-full sm:max-w-lg h-full flex flex-col animate-in slide-in-from-right duration-300"
        style={{
          background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 40%)',
          borderLeft: '1.5px solid #bbf7d0',
          boxShadow: '-8px 0 40px rgba(6,78,59,0.18)',
        }}
      >
        {/* ── Drawer Header ── */}
        <div
          className="shrink-0 flex items-center justify-between px-7 py-5"
          style={{
            background: 'linear-gradient(90deg, #ecfdf5 60%, #f0fdf4 100%)',
            borderBottom: '1.5px solid #d1fae5',
          }}
        >
          <div>
            <span
              style={{ fontSize: '9px', fontWeight: 800, color: '#34d399', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}
            >
              Task Action
            </span>
            <h3 className="text-xl font-black leading-none" style={{ color: '#064e3b' }}>
              {config.label}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
            style={{ background: '#d1fae5', color: '#059669' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#a7f3d0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#d1fae5')}
          >
            <X size={18} strokeWidth={2.3} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div
          className="flex-1 overflow-y-auto px-7 py-7 space-y-7"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#a7f3d0 transparent' }}
        >
          {/* Employee Context Card */}
          <div
            className="relative overflow-hidden rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
              boxShadow: '0 8px 28px rgba(6,78,59,0.25)',
            }}
          >
            {/* Decorative bg icon */}
            <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
              <User size={90} color="white" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(52,211,153,0.25)' }}
                >
                  <User size={20} color="#34d399" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-bold leading-tight truncate" style={{ color: 'white' }}>
                    {row["Employee Name"]}
                  </h4>
                  <p className="text-[10px] mt-0.5 truncate" style={{ color: '#6ee7b7' }}>
                    {row["Employee Code"]} · {row["Unique No."]}
                  </p>
                </div>
              </div>

              <div
                className="grid grid-cols-2 gap-4 pt-4"
                style={{ borderTop: '1px solid rgba(167,243,208,0.2)' }}
              >
                <div>
                  <p style={{ fontSize: '8px', color: '#6ee7b7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Designation</p>
                  <p className="text-xs font-semibold truncate mt-0.5" style={{ color: 'white' }}>{row["Designation"]}</p>
                </div>
                <div>
                  <p style={{ fontSize: '8px', color: '#6ee7b7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Department</p>
                  <p className="text-xs font-semibold truncate mt-0.5" style={{ color: 'white' }}>{row["Department"]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Form Fields ── */}
          <form id="workflow-form" onSubmit={handleFormSubmit} className="space-y-5">
            {config.fields.map(field => {
              if (!shouldShowField(field)) return null;

              /* Mark Done toggle */
              if (field === 'Mark Done') {
                const isChecked = formData[field] === 'Yes';
                return (
                  <div key={field}>
                    <button
                      type="button"
                      onClick={handleToggleDone}
                      className="w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200"
                      style={{
                        background: isChecked ? '#ecfdf5' : '#f8fafc',
                        border: `2px solid ${isChecked ? '#10b981' : '#bbf7d0'}`,
                        boxShadow: isChecked ? '0 0 0 4px rgba(16,185,129,0.10)' : 'none',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {isChecked
                          ? <CheckSquare size={20} style={{ color: '#10b981' }} />
                          : <Square size={20} style={{ color: '#a7f3d0' }} />
                        }
                        <span
                          style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: isChecked ? '#059669' : '#94a3b8' }}
                        >
                          {field}
                        </span>
                      </div>
                      {isChecked && (
                        <span
                          className="text-[9px] font-black uppercase px-2.5 py-1 rounded-lg"
                          style={{ background: '#10b981', color: 'white', letterSpacing: '0.1em' }}
                        >
                          Confirmed
                        </span>
                      )}
                    </button>
                  </div>
                );
              }

              /* Action dropdown */
              if (field === 'Action') {
                return (
                  <div key={field} className="space-y-1.5">
                    <label style={{ fontSize: '10px', fontWeight: 800, color: '#059669', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{field}</span>
                      <ChevronRight size={11} style={{ color: '#bbf7d0' }} />
                    </label>
                    <div className="relative">
                      <select
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        style={{
                          ...inputBase,
                          padding: '14px 44px 14px 20px',
                          background: '#f0fdf4',
                          border: '1.5px solid #bbf7d0',
                          appearance: 'none',
                          cursor: 'pointer',
                        }}
                        onFocus={e => {
                          e.target.style.background = '#ffffff';
                          e.target.style.border = '1.5px solid #34d399';
                          e.target.style.boxShadow = '0 0 0 4px rgba(52,211,153,0.12)';
                        }}
                        onBlur={e => {
                          e.target.style.background = '#f0fdf4';
                          e.target.style.border = '1.5px solid #bbf7d0';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <ChevronDown size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#34d399', pointerEvents: 'none' }} />
                    </div>
                  </div>
                );
              }

              /* Textarea fields */
              const isTextarea =
                field.toLowerCase().includes('note') ||
                field.toLowerCase().includes('feedback') ||
                field.toLowerCase().includes('remark');

              /* Currency prefix */
              const isCurrency =
                field.toLowerCase().includes('amount') ||
                field.toLowerCase().includes('salary');

              return (
                <div key={field} className="space-y-1.5">
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#059669', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{field}</span>
                    <ChevronRight size={11} style={{ color: '#bbf7d0' }} />
                  </label>

                  {isTextarea ? (
                    <textarea
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={`Enter ${field.toLowerCase()}…`}
                      required={shouldShowField(field)}
                      style={{
                        ...inputBase,
                        padding: '14px 20px',
                        minHeight: '130px',
                        resize: 'none',
                        background: focusedField === field ? '#ffffff' : '#f0fdf4',
                        border: `1.5px solid ${focusedField === field ? '#34d399' : '#bbf7d0'}`,
                        boxShadow: focusedField === field ? '0 0 0 4px rgba(52,211,153,0.12)' : 'none',
                      }}
                    />
                  ) : (
                    <div className="relative">
                      {isCurrency && (
                        <span
                          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6ee7b7', fontWeight: 700, fontSize: '15px', pointerEvents: 'none' }}
                        >
                          ₹
                        </span>
                      )}
                      <input
                        type={
                          field.toLowerCase().includes('date') ? 'date'
                          : (isCurrency || field.toLowerCase().includes('month')) ? 'number'
                          : 'text'
                        }
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        onFocus={() => setFocusedField(field)}
                        onBlur={() => setFocusedField(null)}
                        placeholder={`Enter ${field.toLowerCase()}…`}
                        required={shouldShowField(field)}
                        style={getInputStyle(field)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </form>
        </div>

        {/* ── Footer Submit ── */}
        <div
          className="shrink-0 px-7 py-5"
          style={{
            borderTop: '1.5px solid #d1fae5',
            background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)',
          }}
        >
          <button
            form="workflow-form"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-white uppercase tracking-widest text-[11px] transition-all duration-200 active:scale-[0.98]"
            style={{
              background: loading
                ? '#6ee7b7'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: loading ? 'none' : '0 6px 24px rgba(16,185,129,0.30)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(16,185,129,0.42)'; }}
            onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(16,185,129,0.30)'; }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing…</span>
              </>
            ) : (
              <>
                <Send size={16} strokeWidth={2.3} />
                <span>Complete Task</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateForm;