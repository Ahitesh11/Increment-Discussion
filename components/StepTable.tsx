import React from 'react';
import { EmployeeData, StepConfig } from '../types';
import { Edit3, CheckCircle, AlertCircle, Clock as ClockIcon, ExternalLink } from 'lucide-react';

interface StepTableProps {
  data: EmployeeData[];
  config: StepConfig;
  onAction: (row: EmployeeData) => void;
}

const StepTable: React.FC<StepTableProps> = ({ data, config, onAction }) => {
  const formatValue = (val: any) => {
    if (val instanceof Date) return val.toLocaleDateString();
    if (typeof val === 'object' && val !== null) return JSON.stringify(val);
    return val?.toString() || '-';
  };

  // ─── Styles ───────────────────────────────────────────────────────
  const tableHeaderStyle: React.CSSProperties = {
    background: '#f97316',
    color: '#ffffff',
    padding: '12px 16px',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    whiteSpace: 'nowrap',
  };

  const cellStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: 13,
    color: '#1f2937',
    borderBottom: '1px solid #e5e7eb',
    background: '#ffffff',
  };

  const stickyRightStyle: React.CSSProperties = {
    ...cellStyle,
    position: 'sticky',
    right: 0,
    background: '#ffffff',
    boxShadow: '-4px 0 8px rgba(0,0,0,0.02)',
  };

  const statusBadge = (isCompleted: boolean, isPlanned: boolean) => {
    if (isCompleted) {
      return { bg: '#ecfdf5', color: '#10b981', text: 'Done', icon: CheckCircle };
    } else if (isPlanned) {
      return { bg: '#fef2c0', color: '#f59e0b', text: 'Ready', icon: AlertCircle };
    } else {
      return { bg: '#f3f4f6', color: '#9ca3af', text: 'Wait', icon: ClockIcon };
    }
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: '#f9fafb',
      padding: 32,
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
            <thead>
              <tr>
                {config.tableColumns.map(col => (
                  <th key={col} style={tableHeaderStyle}>{col}</th>
                ))}
                <th style={tableHeaderStyle}>Status</th>
                <th style={{ ...tableHeaderStyle, position: 'sticky', right: 0, background: '#f97316' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const isCompleted = !!row[config.actualColumn as keyof EmployeeData];
                const isPlanned = !!row[config.plannedColumn as keyof EmployeeData];
                const badge = statusBadge(isCompleted, isPlanned);
                return (
                  <tr key={idx} style={{ transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {config.tableColumns.map(col => {
                      if (col === "Increment Form") {
                        const link = row[col as keyof EmployeeData];
                        return (
                          <td key={col} style={cellStyle}>
                            {link ? (
                              <a
                                href={link.toString()}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#f97316', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                              >
                                <ExternalLink size={12} />
                                View Form
                              </a>
                            ) : '-'}
                          </td>
                        );
                      }
                      return (
                        <td key={col} style={cellStyle}>
                          {formatValue(row[col as keyof EmployeeData])}
                        </td>
                      );
                    })}
                    <td style={cellStyle}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '4px 8px',
                        background: badge.bg,
                        color: badge.color,
                        borderRadius: 20,
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}>
                        <badge.icon size={12} />
                        {badge.text}
                      </div>
                    </td>
                    <td style={stickyRightStyle}>
                      <button
                        onClick={() => onAction(row)}
                        style={{
                          background: isCompleted ? '#e5e7eb' : '#f97316',
                          color: isCompleted ? '#6b7280' : '#fff',
                          border: 'none',
                          borderRadius: 12,
                          padding: '8px 16px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'background 0.2s',
                          boxShadow: isCompleted ? 'none' : '0 2px 8px rgba(249,115,22,0.2)',
                        }}
                        onMouseEnter={e => {
                          if (!isCompleted) (e.currentTarget as HTMLElement).style.background = '#ea580c';
                        }}
                        onMouseLeave={e => {
                          if (!isCompleted) (e.currentTarget as HTMLElement).style.background = '#f97316';
                        }}
                      >
                        <Edit3 size={12} />
                        {isCompleted ? 'Edit' : 'Action'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {data.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
            <ClockIcon size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p style={{ fontSize: 14, fontWeight: 500 }}>No pending records</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepTable;