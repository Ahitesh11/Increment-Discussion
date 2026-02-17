import React from 'react';
import { EmployeeData } from '../types';
import { MASTER_COLUMNS } from '../constants';
import { CheckCircle, Clock, AlertCircle, ExternalLink, FileText } from 'lucide-react';

interface RecordsTableProps {
  data: EmployeeData[];
}

const RecordsTable: React.FC<RecordsTableProps> = ({ data }) => {
  const getOverallStatus = (row: EmployeeData) => {
    if (row.Actual3) return { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', icon: CheckCircle };
    if (row.Actual2) return { label: 'Mgmt Approved', bg: 'bg-lime-50', text: 'text-lime-700', dot: 'bg-lime-500', icon: AlertCircle };
    if (row.Actual) return { label: 'HOD Approved', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-400', icon: AlertCircle };
    return { label: 'Pending', bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-300', icon: Clock };
  };

  const formatDate = (val: any, colName: string) => {
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

    return val.toString();
  };

  const progressColors = [
    'bg-slate-200',
    'bg-lime-300',
    'bg-lime-400',
    'bg-emerald-500',
  ];

  const progressBarWidth = (count: number) => `${(count / 3) * 100}%`;

  return (
    <div className="flex-1 min-h-0 rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f7fee7 100%)',
        boxShadow: '0 8px 40px rgba(52,211,153,0.10), 0 1.5px 6px rgba(52,211,153,0.07)',
        border: '1.5px solid #bbf7d0',
      }}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-green-100"
        style={{ background: 'linear-gradient(90deg, #ecfdf5 60%, #f0fdf4 100%)' }}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600">
            <FileText size={16} strokeWidth={2.2} />
          </span>
          <span className="text-sm font-bold text-emerald-800 tracking-tight">Employee Records</span>
        </div>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: '#d1fae5', color: '#065f46', letterSpacing: '0.06em' }}
        >
          {data.length} {data.length === 1 ? 'Record' : 'Records'}
        </span>
      </div>

      {/* Table Scroll Area */}
      <div className="flex-1 overflow-auto relative" style={{ scrollbarWidth: 'thin', scrollbarColor: '#a7f3d0 #f0fdf4' }}>
        <table className="w-full text-left border-separate border-spacing-0 min-w-[2000px]">
          <thead className="sticky top-0 z-20">
            <tr style={{ background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)' }}>
              {MASTER_COLUMNS.map((col, i) => (
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
                    background: i === 0 ? 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)' : undefined,
                  }}
                >
                  {col}
                </th>
              ))}
              <th
                className="px-5 py-3.5 whitespace-nowrap"
                style={{
                  fontSize: '10px', fontWeight: 800, color: '#047857',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  borderBottom: '1.5px solid #bbf7d0',
                }}
              >
                Status
              </th>
              <th
                className="px-5 py-3.5 whitespace-nowrap sticky right-0 z-30"
                style={{
                  fontSize: '10px', fontWeight: 800, color: '#047857',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  borderBottom: '1.5px solid #bbf7d0',
                  background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)',
                  boxShadow: '-4px 0 16px rgba(167,243,208,0.5)',
                }}
              >
                Progress
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const status = getOverallStatus(row);
              const progressCount = [row.Actual, row.Actual2, row.Actual3].filter(Boolean).length;
              const isEven = idx % 2 === 0;

              return (
                <tr
                  key={idx}
                  className="group transition-all duration-150"
                  style={{
                    background: isEven ? 'rgba(255,255,255,0.65)' : 'rgba(236,253,245,0.45)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f0fdf4')}
                  onMouseLeave={e => (e.currentTarget.style.background = isEven ? 'rgba(255,255,255,0.65)' : 'rgba(236,253,245,0.45)')}
                >
                  {MASTER_COLUMNS.map((col) => {
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
                              style={{
                                background: '#d1fae5',
                                color: '#065f46',
                                textDecoration: 'none',
                              }}
                              onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.background = '#a7f3d0';
                              }}
                              onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.background = '#d1fae5';
                              }}
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

                    const value = row[col as keyof EmployeeData];
                    const isLongField =
                      col.toLowerCase().includes('feedback') ||
                      col.toLowerCase().includes('remark') ||
                      col.toLowerCase().includes('name');
                    const formatted = formatDate(value, col);

                    return (
                      <td
                        key={col}
                        className={`px-5 py-3.5 text-xs font-medium ${isLongField ? 'min-w-[220px] whitespace-normal break-words' : 'whitespace-nowrap'}`}
                        style={{ color: formatted ? '#1e4d3b' : '#94a3b8', borderBottom: '1px solid #d1fae5' }}
                      >
                        {formatted ?? <span style={{ color: '#cbd5e1' }}>—</span>}
                      </td>
                    );
                  })}

                  {/* Status Badge */}
                  <td className="px-5 py-3.5 whitespace-nowrap" style={{ borderBottom: '1px solid #d1fae5' }}>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot} flex-shrink-0`} />
                      {status.label}
                    </span>
                  </td>

                  {/* Progress Column */}
                  <td
                    className="px-5 py-3.5 whitespace-nowrap sticky right-0 z-10 transition-colors"
                    style={{
                      background: isEven ? 'rgba(255,255,255,0.95)' : 'rgba(236,253,245,0.95)',
                      borderBottom: '1px solid #d1fae5',
                      boxShadow: '-4px 0 16px rgba(167,243,208,0.35)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Step Dots */}
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map((step) => (
                          <span
                            key={step}
                            className="block rounded-full transition-all duration-300"
                            style={{
                              width: step < progressCount ? '22px' : '8px',
                              height: '8px',
                              background: step < progressCount
                                ? (progressCount === 3 ? '#10b981' : '#84cc16')
                                : '#e2e8f0',
                              boxShadow: step < progressCount ? '0 0 6px rgba(132,204,22,0.4)' : 'none',
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="text-[10px] font-black tabular-nums"
                        style={{ color: progressCount === 3 ? '#059669' : progressCount > 0 ? '#65a30d' : '#94a3b8' }}
                      >
                        {progressCount}/3
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-20" style={{ background: 'rgba(240,253,244,0.5)' }}>
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{ background: '#d1fae5', color: '#34d399' }}
          >
            <Clock size={32} strokeWidth={1.5} />
          </div>
          <p className="font-bold text-xs uppercase tracking-widest" style={{ color: '#6ee7b7', letterSpacing: '0.22em' }}>
            No records found
          </p>
          <p className="text-xs mt-1.5" style={{ color: '#a7f3d0' }}>
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default RecordsTable;