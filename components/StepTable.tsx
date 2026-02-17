import React from 'react';
import { EmployeeData, StepConfig } from '../types';
import { Edit3, CheckCircle, AlertCircle, Clock as ClockIcon, ExternalLink, ClipboardList } from 'lucide-react';

interface StepTableProps {
  data: EmployeeData[];
  config: StepConfig;
  onAction: (row: EmployeeData) => void;
}

const StepTable: React.FC<StepTableProps> = ({ data, config, onAction }) => {
  const formatValue = (val: any, colName: string) => {
    if (!val) return null;

    const isDateField =
      colName.toLowerCase().includes('date') ||
      colName.toLowerCase().includes('timestamp') ||
      colName.toLowerCase().includes('planned') ||
      colName.toLowerCase().includes('actual');

    if (val instanceof Date) return val.toLocaleDateString('en-GB');

    if (isDateField && typeof val === 'string' && val.length > 5) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d.toLocaleDateString('en-GB');
    }

    if (typeof val === 'object' && val !== null) return JSON.stringify(val);
    return val?.toString() || null;
  };

  return (
    <div
      className="flex-1 min-h-0 rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f7fee7 100%)',
        border: '1.5px solid #bbf7d0',
        boxShadow: '0 8px 40px rgba(52,211,153,0.10), 0 1.5px 6px rgba(52,211,153,0.07)',
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{
          background: 'linear-gradient(90deg, #ecfdf5 60%, #f0fdf4 100%)',
          borderBottom: '1.5px solid #d1fae5',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ background: '#d1fae5', color: '#059669' }}
          >
            <ClipboardList size={16} strokeWidth={2.2} />
          </span>
          <span className="text-sm font-bold" style={{ color: '#064e3b' }}>
            {config.title ?? 'Step Records'}
          </span>
        </div>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: '#d1fae5', color: '#065f46', letterSpacing: '0.06em' }}
        >
          {data.length} {data.length === 1 ? 'Record' : 'Records'}
        </span>
      </div>

      {/* Table scroll */}
      <div
        className="flex-1 overflow-auto relative"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#a7f3d0 #f0fdf4' }}
      >
        <table className="w-full text-left border-separate border-spacing-0 min-w-[1200px]">
          <thead className="sticky top-0 z-20">
            <tr style={{ background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)' }}>
              {config.tableColumns.map((col) => (
                <th
                  key={col}
                  className="px-5 py-3.5 whitespace-nowrap"
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#047857',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    borderBottom: '1.5px solid #bbf7d0',
                  }}
                >
                  {col}
                </th>
              ))}
              <th
                className="px-5 py-3.5 whitespace-nowrap text-center"
                style={{
                  fontSize: '10px', fontWeight: 800, color: '#047857',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  borderBottom: '1.5px solid #bbf7d0',
                }}
              >
                Status
              </th>
              <th
                className="px-5 py-3.5 whitespace-nowrap text-right sticky right-0 z-30"
                style={{
                  fontSize: '10px', fontWeight: 800, color: '#047857',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  borderBottom: '1.5px solid #bbf7d0',
                  background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)',
                  boxShadow: '-4px 0 16px rgba(167,243,208,0.5)',
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, idx) => {
              const isCompleted = !!row[config.actualColumn as keyof EmployeeData];
              const isPlanned   = !!row[config.plannedColumn as keyof EmployeeData];
              const isEven      = idx % 2 === 0;

              return (
                <tr
                  key={idx}
                  className="group transition-all duration-150"
                  style={{ background: isEven ? 'rgba(255,255,255,0.65)' : 'rgba(236,253,245,0.45)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f0fdf4')}
                  onMouseLeave={e => (e.currentTarget.style.background = isEven ? 'rgba(255,255,255,0.65)' : 'rgba(236,253,245,0.45)')}
                >
                  {config.tableColumns.map((col) => {
                    /* Increment Form link */
                    if (col === 'Increment Form') {
                      const link = row[col as keyof EmployeeData];
                      return (
                        <td key={col} className="px-5 py-3.5" style={{ borderBottom: '1px solid #d1fae5' }}>
                          {link ? (
                            <a
                              href={link.toString()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all"
                              style={{ background: '#d1fae5', color: '#065f46', textDecoration: 'none' }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#a7f3d0')}
                              onMouseLeave={e => (e.currentTarget.style.background = '#d1fae5')}
                            >
                              <ExternalLink size={11} />
                              View Form
                            </a>
                          ) : (
                            <span style={{ color: '#cbd5e1', fontSize: '12px' }}>—</span>
                          )}
                        </td>
                      );
                    }

                    /* Regular cell */
                    const isLongField =
                      col.toLowerCase().includes('feedback') ||
                      col.toLowerCase().includes('remark') ||
                      col.toLowerCase().includes('name');
                    const formatted = formatValue(row[col as keyof EmployeeData], col);

                    return (
                      <td
                        key={col}
                        className={`px-5 py-3.5 text-xs font-medium ${isLongField ? 'min-w-[200px] whitespace-normal break-words' : 'whitespace-nowrap'}`}
                        style={{ color: formatted ? '#1e4d3b' : '#94a3b8', borderBottom: '1px solid #d1fae5' }}
                      >
                        {formatted ?? <span style={{ color: '#cbd5e1' }}>—</span>}
                      </td>
                    );
                  })}

                  {/* Status badge */}
                  <td className="px-5 py-3.5 whitespace-nowrap text-center" style={{ borderBottom: '1px solid #d1fae5' }}>
                    {isCompleted ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: '#ecfdf5', color: '#059669' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#10b981' }} />
                        Done
                      </span>
                    ) : isPlanned ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: '#f0fdf4', color: '#16a34a' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#84cc16' }} />
                        Ready
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: '#f8fafc', color: '#94a3b8' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#cbd5e1' }} />
                        Wait
                      </span>
                    )}
                  </td>

                  {/* Action button — sticky right */}
                  <td
                    className="px-5 py-3.5 whitespace-nowrap text-right sticky right-0 z-10 transition-colors"
                    style={{
                      background: isEven ? 'rgba(255,255,255,0.95)' : 'rgba(236,253,245,0.95)',
                      borderBottom: '1px solid #d1fae5',
                      boxShadow: '-4px 0 16px rgba(167,243,208,0.35)',
                    }}
                  >
                    <button
                      onClick={() => onAction(row)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-200 active:scale-95"
                      style={
                        isCompleted
                          ? {
                              background: '#f0fdf4',
                              color: '#059669',
                              border: '1.5px solid #bbf7d0',
                            }
                          : {
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                              boxShadow: '0 4px 14px rgba(16,185,129,0.30)',
                              border: '1.5px solid transparent',
                            }
                      }
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        if (isCompleted) {
                          el.style.background = '#d1fae5';
                        } else {
                          el.style.boxShadow = '0 6px 20px rgba(16,185,129,0.42)';
                        }
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        if (isCompleted) {
                          el.style.background = '#f0fdf4';
                        } else {
                          el.style.boxShadow = '0 4px 14px rgba(16,185,129,0.30)';
                        }
                      }}
                    >
                      <Edit3 size={12} strokeWidth={2.3} />
                      {isCompleted ? 'Edit' : 'Action'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div
          className="flex-1 flex flex-col items-center justify-center py-20"
          style={{ background: 'rgba(240,253,244,0.5)' }}
        >
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{ background: '#d1fae5', color: '#34d399' }}
          >
            <ClipboardList size={30} strokeWidth={1.5} />
          </div>
          <p
            className="font-bold text-xs uppercase tracking-widest"
            style={{ color: '#6ee7b7', letterSpacing: '0.22em' }}
          >
            No pending records
          </p>
          <p className="text-xs mt-1.5" style={{ color: '#a7f3d0' }}>
            All steps are up to date
          </p>
        </div>
      )}
    </div>
  );
};

export default StepTable;