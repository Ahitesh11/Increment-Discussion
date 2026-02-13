import React from 'react';
import { EmployeeData } from '../types';
import { MASTER_COLUMNS } from '../constants';
import { CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';

interface RecordsTableProps {
  data: EmployeeData[];
}

const RecordsTable: React.FC<RecordsTableProps> = ({ data }) => {
  const getOverallStatus = (row: EmployeeData) => {
    if (row.Actual3) return { label: 'Completed', color: '#10b981', icon: CheckCircle };
    if (row.Actual2) return { label: 'Mgmt Approved', color: '#f97316', icon: AlertCircle };
    if (row.Actual) return { label: 'HOD Approved', color: '#f97316', icon: AlertCircle };
    return { label: 'Pending', color: '#9ca3af', icon: Clock };
  };

  const formatDate = (val: any) => {
    if (!val) return '-';
    if (val instanceof Date) return val.toLocaleDateString();
    return val.toString();
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
    border: 'none',
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
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1200 }}>
            <thead>
              <tr>
                {MASTER_COLUMNS.map(col => (
                  <th key={col} style={tableHeaderStyle}>{col}</th>
                ))}
                <th style={tableHeaderStyle}>Overall Status</th>
                <th style={{ ...tableHeaderStyle, position: 'sticky', right: 0, background: '#f97316' }}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const status = getOverallStatus(row);
                const progressCount = [row.Actual, row.Actual2, row.Actual3].filter(Boolean).length;
                return (
                  <tr key={idx} style={{ transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {MASTER_COLUMNS.map(col => {
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
                      const value = row[col as keyof EmployeeData];
                      return (
                        <td key={col} style={cellStyle}>
                          {formatDate(value)}
                        </td>
                      );
                    })}
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <status.icon size={14} style={{ color: status.color }} />
                        <span style={{ color: status.color, fontWeight: 600, fontSize: 12 }}>{status.label}</span>
                      </div>
                    </td>
                    <td style={stickyRightStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 80, height: 6, background: '#e5e7eb', borderRadius: 99 }}>
                          <div style={{ width: `${(progressCount / 3) * 100}%`, height: 6, background: '#f97316', borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280' }}>{progressCount}/3</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {data.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
            <Clock size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p style={{ fontSize: 14, fontWeight: 500 }}>No records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordsTable;