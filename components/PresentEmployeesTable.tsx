import React from 'react';
import { PresentEmployeeData } from '../types';
import { PRESENT_EMPLOYEES_COLUMNS } from '../constants';
import { Users, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface PresentEmployeesTableProps {
  data: PresentEmployeeData[];
}

const PresentEmployeesTable: React.FC<PresentEmployeesTableProps> = ({ data }) => {
  const formatDate = (val: any, colName: string) => {
    if (!val) return null;

    const isDateField =
      colName.toLowerCase().includes('date') ||
      colName.toLowerCase().includes('timestamp');

    if (val instanceof Date) return val.toLocaleDateString('en-GB');

    if (isDateField && typeof val === 'string' && val.length > 5) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d.toLocaleDateString('en-GB');
    }

    return val.toString();
  };

  const isImageUrl = (url: string) => {
    if (typeof url !== 'string') return false;
    return (
      url.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null ||
      url.includes('drive.google.com') ||
      url.startsWith('http')
    );
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
            <Users size={16} strokeWidth={2.2} />
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: '#064e3b' }}
          >
            Present Employees
          </span>
        </div>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: '#d1fae5', color: '#065f46', letterSpacing: '0.06em' }}
        >
          {data.length} {data.length === 1 ? 'Employee' : 'Employees'}
        </span>
      </div>

      {/* Table scroll area */}
      <div
        className="flex-1 overflow-auto relative"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#a7f3d0 #f0fdf4' }}
      >
        <table className="w-full text-left border-separate border-spacing-0 min-w-[3000px]">
          <thead className="sticky top-0 z-20">
            <tr style={{ background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)' }}>
              {PRESENT_EMPLOYEES_COLUMNS.map((col) => (
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
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <tr
                  key={idx}
                  className="group transition-all duration-150"
                  style={{ background: isEven ? 'rgba(255,255,255,0.65)' : 'rgba(236,253,245,0.45)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f0fdf4')}
                  onMouseLeave={e => (e.currentTarget.style.background = isEven ? 'rgba(255,255,255,0.65)' : 'rgba(236,253,245,0.45)')}
                >
                  {PRESENT_EMPLOYEES_COLUMNS.map((col) => {
                    const value = row[col as keyof PresentEmployeeData];
                    const isName  = col.toLowerCase().includes('name');
                    const isPhoto = col.toLowerCase() === 'photo';

                    /* ── Photo cell ── */
                    if (isPhoto) {
                      const url = value?.toString();
                      return (
                        <td key={col} className="px-5 py-3" style={{ borderBottom: '1px solid #d1fae5' }}>
                          {url && isImageUrl(url) ? (
                            <div className="flex items-center gap-3">
                              <div
                                className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200"
                                style={{
                                  border: '2px solid #bbf7d0',
                                  boxShadow: '0 2px 8px rgba(52,211,153,0.12)',
                                }}
                              >
                                <img
                                  src={url}
                                  alt="Employee"
                                  className="w-full h-full object-cover"
                                  onError={e => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=N/A';
                                  }}
                                />
                                {/* Hover overlay */}
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ background: 'rgba(6,78,59,0.55)' }}
                                >
                                  <ExternalLink size={13} color="white" />
                                </a>
                              </div>
                              <span
                                className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ color: '#34d399' }}
                              >
                                View
                              </span>
                            </div>
                          ) : (
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                background: '#f0fdf4',
                                border: '2px dashed #bbf7d0',
                                color: '#a7f3d0',
                              }}
                            >
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </td>
                      );
                    }

                    /* ── Regular cell ── */
                    const formatted = formatDate(value, col);
                    return (
                      <td
                        key={col}
                        className={`px-5 py-3.5 text-xs ${isName ? 'min-w-[220px] whitespace-normal break-words font-bold' : 'whitespace-nowrap font-medium'}`}
                        style={{
                          color: formatted ? (isName ? '#064e3b' : '#1e4d3b') : '#cbd5e1',
                          borderBottom: '1px solid #d1fae5',
                        }}
                      >
                        {formatted ?? <span style={{ color: '#cbd5e1' }}>—</span>}
                      </td>
                    );
                  })}
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
            <Users size={30} strokeWidth={1.5} />
          </div>
          <p
            className="font-bold text-xs uppercase tracking-widest"
            style={{ color: '#6ee7b7', letterSpacing: '0.22em' }}
          >
            No employees found
          </p>
          <p className="text-xs mt-1.5" style={{ color: '#a7f3d0' }}>
            Present Employees list is empty
          </p>
        </div>
      )}
    </div>
  );
};

export default PresentEmployeesTable;