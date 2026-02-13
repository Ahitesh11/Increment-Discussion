import React, { useState } from 'react';
import { EmployeeData, StepConfig } from '../types';
import { X, Send, User, ChevronRight, CheckSquare, Square } from 'lucide-react';

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
      initial[f] = row[f as keyof EmployeeData] || '';
    });
    return initial;
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  // ─── Styles ───────────────────────────────────────────────────────
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

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 480,
        height: '100%',
        background: '#ffffff',
        borderLeft: '1px solid #e5e7eb',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease-out',
      }}>
        {/* Header */}
        <div style={{
          padding: 24,
          borderBottom: '1px solid #e5e7eb',
          background: '#f97316',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
              Task Action
            </span>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '4px 0 0' }}>{config.label}</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: 12,
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {/* Employee Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                background: '#f97316',
                borderRadius: 12,
                padding: 10,
                color: '#fff',
              }}>
                <User size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937', margin: 0 }}>{row["Employee Name"]}</h4>
                <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0' }}>
                  {row["Employee Code"]} • {row["Unique No."]}
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Designation</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>{row["Designation"]}</p>
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Department</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>{row["Department"]}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {config.fields.map(field => {
              if (field === 'Mark Done') {
                const isChecked = formData[field] === 'Yes';
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={handleToggleDone}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: 16,
                      borderRadius: 16,
                      border: `2px solid ${isChecked ? '#f97316' : '#e5e7eb'}`,
                      background: isChecked ? '#fff7ed' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {isChecked ? <CheckSquare size={20} color="#f97316" /> : <Square size={20} color="#9ca3af" />}
                      <span style={{ fontSize: 13, fontWeight: 700, color: isChecked ? '#f97316' : '#4b5563' }}>{field}</span>
                    </div>
                    {isChecked && (
                      <span style={{ background: '#f97316', color: '#fff', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                        Confirmed
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <div key={field}>
                  <label style={labelStyle}>
                    {field}
                    <ChevronRight size={12} style={{ marginLeft: 4, color: '#9ca3af' }} />
                  </label>
                  {field.toLowerCase().includes('feedback') || field.toLowerCase().includes('remark') ? (
                    <textarea
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      style={{ ...baseInput, minHeight: 100, resize: 'vertical' }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor = '#f97316';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)';
                      }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder={`Enter ${field.toLowerCase()}`}
                      required
                    />
                  ) : (
                    <div style={{ position: 'relative' }}>
                      {field.toLowerCase().includes('amount') && (
                        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontWeight: 600 }}>₹</span>
                      )}
                      <input
                        type={field.toLowerCase().includes('amount') || field.toLowerCase().includes('salary') ? 'number' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        style={{
                          ...baseInput,
                          paddingLeft: field.toLowerCase().includes('amount') ? 32 : 14,
                        }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor = '#f97316';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)';
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        placeholder={`Enter ${field.toLowerCase()}`}
                        required
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: 24, borderTop: '1px solid #e5e7eb', background: '#ffffff' }}>
          <button
            type="submit"
            form="workflow-form"
            disabled={loading}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 16,
              border: 'none',
              background: loading ? '#e5e7eb' : '#f97316',
              color: loading ? '#6b7280' : '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 0.2s',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(249,115,22,0.2)',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#ea580c'; }}
            onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#f97316'; }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 16, height: 16, border: '2px solid #9ca3af',
                  borderTopColor: '#6b7280', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Processing...
              </>
            ) : (
              <>
                <Send size={16} />
                Complete Task
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UpdateForm;