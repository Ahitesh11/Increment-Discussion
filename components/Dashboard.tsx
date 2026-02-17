import React, { useState, useMemo } from 'react';
import { EmployeeData, UpcomingData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, CheckCircle2, Clock, IndianRupee, Calendar, Filter, TrendingUp, Sparkles } from 'lucide-react';

interface DashboardProps {
  data: EmployeeData[];
  upcomingData: UpcomingData[];
}

const Dashboard: React.FC<DashboardProps> = ({ data, upcomingData }) => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  }, []);

  const totalEmployees = data.length;
  const completedHOD    = data.filter(d => !!d.Actual).length;
  const completedMgmt   = data.filter(d => !!d.Actual2).length;
  const completedSalary = data.filter(d => !!d.Actual3).length;
  const pendingSteps    = (totalEmployees * 3) - (completedHOD + completedMgmt + completedSalary);

  const stats = [
    { label: 'Total Files',    value: totalEmployees, icon: Users,         accent: '#10b981', light: '#d1fae5', dark: '#064e3b' },
    { label: 'HOD Cleared',    value: completedHOD,   icon: CheckCircle2,  accent: '#34d399', light: '#ecfdf5', dark: '#065f46' },
    { label: 'Mgmt Approved',  value: completedMgmt,  icon: IndianRupee,   accent: '#84cc16', light: '#f7fee7', dark: '#365314' },
    { label: 'Pending Steps',  value: pendingSteps,   icon: Clock,         accent: '#f59e0b', light: '#fffbeb', dark: '#78350f' },
  ];

  const chartData = [
    { name: 'HOD Approval',   value: completedHOD,    total: totalEmployees },
    { name: 'Management',     value: completedMgmt,   total: totalEmployees },
    { name: 'Salary Process', value: completedSalary, total: totalEmployees },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const pct = totalEmployees > 0
      ? ((payload[0].value / payload[0].payload.total) * 100).toFixed(1)
      : '0.0';
    return (
      <div style={{
        background: 'white',
        border: '1.5px solid #bbf7d0',
        borderRadius: '14px',
        padding: '12px 16px',
        boxShadow: '0 8px 24px rgba(52,211,153,0.15)',
      }}>
        <p style={{ fontSize: '10px', fontWeight: 800, color: '#047857', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ fontSize: '20px', fontWeight: 900, color: '#064e3b', marginTop: '4px' }}>
          {payload[0].value}
          <span style={{ fontSize: '12px', color: '#6ee7b7', fontWeight: 600, marginLeft: '4px' }}>/ {payload[0].payload.total}</span>
        </p>
        <p style={{ fontSize: '10px', color: '#34d399', fontWeight: 700, marginTop: '2px' }}>{pct}% complete</p>
      </div>
    );
  };

  const filteredUpcoming = upcomingData.filter(item => {
    const d = item["Next Increment Date"];
    if (!d) return false;
    const date = new Date(d);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  const selectStyle: React.CSSProperties = {
    appearance: 'none' as const,
    background: '#f0fdf4',
    border: '1.5px solid #bbf7d0',
    borderRadius: '10px',
    padding: '6px 28px 6px 12px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#047857',
    outline: 'none',
    cursor: 'pointer',
    letterSpacing: '0.04em',
  };

  return (
    <div
      className="flex-1 overflow-y-auto space-y-7 pb-10 px-4 lg:px-6"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#a7f3d0 #f0fdf4' }}
    >

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.025]"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
              border: '1.5px solid #bbf7d0',
              boxShadow: '0 2px 12px rgba(52,211,153,0.08)',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 28px rgba(52,211,153,0.18)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(52,211,153,0.08)')}
          >
            {/* Decorative circle */}
            <div
              className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
              style={{ background: stat.accent }}
            />

            <div className="flex items-start justify-between mb-4">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-transform group-hover:scale-110"
                style={{ background: stat.light }}
              >
                <stat.icon size={20} style={{ color: stat.accent }} strokeWidth={2.2} />
              </div>
              <TrendingUp size={14} style={{ color: '#bbf7d0' }} />
            </div>

            <p className="text-3xl font-black" style={{ color: stat.dark, lineHeight: 1 }}>{stat.value}</p>
            <p className="text-xs font-semibold mt-1.5" style={{ color: '#6ee7b7', letterSpacing: '0.06em' }}>{stat.label}</p>

            {/* Bottom accent bar */}
            <div
              className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
              style={{ background: `linear-gradient(90deg, ${stat.accent}, transparent)` }}
            />
          </div>
        ))}
      </div>

      {/* ── Chart + Upcoming ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Workflow Bar Chart */}
        <div
          className="rounded-2xl p-6 flex flex-col"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            border: '1.5px solid #bbf7d0',
            boxShadow: '0 2px 12px rgba(52,211,153,0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold" style={{ color: '#064e3b' }}>Workflow Status</h3>
              <p className="text-[10px] font-bold mt-0.5" style={{ color: '#6ee7b7', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Approval pipeline
              </p>
            </div>
            <span
              className="text-[10px] font-black px-3 py-1 rounded-full"
              style={{ background: '#d1fae5', color: '#047857', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Live
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="35%">
                <defs>
                  <linearGradient id="barGrad0" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a7f3d0" />
                    <stop offset="100%" stopColor="#6ee7b7" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1fae5" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#047857', fontSize: 11, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6ee7b7', fontSize: 11 }}
                  domain={[0, totalEmployees || 10]}
                  ticks={[0, Math.ceil((totalEmployees || 10) / 2), totalEmployees || 10]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(167,243,208,0.15)' }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={48}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#barGrad${index})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 flex justify-center gap-5">
            {[
              { label: 'HOD',   color: '#10b981' },
              { label: 'Mgmt',  color: '#34d399' },
              { label: 'Salary',color: '#a7f3d0' },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#6ee7b7' }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Upcoming Increments */}
        <div
          className="rounded-2xl p-6 flex flex-col min-h-[400px]"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            border: '1.5px solid #bbf7d0',
            boxShadow: '0 2px 12px rgba(52,211,153,0.08)',
          }}
        >
          {/* Panel header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
            <div>
              <h3 className="text-base font-bold" style={{ color: '#064e3b' }}>Upcoming Increments</h3>
              <p className="text-[10px] font-bold mt-0.5" style={{ color: '#6ee7b7', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Filter by month
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Month */}
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(parseInt(e.target.value))}
                  style={selectStyle}
                >
                  {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
                <Filter size={11} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#34d399', pointerEvents: 'none' }} />
              </div>

              {/* Year */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(parseInt(e.target.value))}
                  style={selectStyle}
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <Filter size={11} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#34d399', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#a7f3d0 transparent' }}>
            {filteredUpcoming.length > 0 ? (
              filteredUpcoming.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-xl group transition-all duration-200"
                  style={{ background: '#f0fdf4', border: '1.5px solid #d1fae5' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.border = '1.5px solid #6ee7b7';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(52,211,153,0.12)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.border = '1.5px solid #d1fae5';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
                      style={{ background: '#d1fae5', color: '#059669' }}
                    >
                      <Calendar size={16} strokeWidth={2.2} />
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight" style={{ color: '#064e3b' }}>
                        {item["Name As Per Aadhar"]}
                      </p>
                      <p className="text-[10px] font-semibold mt-0.5" style={{ color: '#6ee7b7', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {item["Employee ID"]} · {item["Designation"]}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-black" style={{ color: '#047857' }}>
                      {new Date(item["Next Increment Date"]).toLocaleDateString('en-GB')}
                    </p>
                    <p className="text-[9px] font-bold mt-0.5" style={{ color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {item["Company Name"]}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className="flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                  style={{ background: '#d1fae5', color: '#6ee7b7' }}
                >
                  <Calendar size={26} strokeWidth={1.5} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6ee7b7' }}>
                  No records for {months[selectedMonth]} {selectedYear}
                </p>
                <p className="text-[10px] mt-1.5" style={{ color: '#a7f3d0' }}>Try a different month or year</p>
              </div>
            )}
          </div>

          {filteredUpcoming.length > 0 && (
            <div
              className="mt-4 pt-3 text-center shrink-0"
              style={{ borderTop: '1px solid #d1fae5' }}
            >
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: '#6ee7b7' }}
              >
                {filteredUpcoming.length} record{filteredUpcoming.length !== 1 ? 's' : ''} found
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer Bar ── */}
      <div
        className="rounded-2xl px-6 py-3.5 flex items-center justify-between"
        style={{
          background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)',
          border: '1.5px solid #bbf7d0',
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={13} style={{ color: '#34d399' }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6ee7b7' }}>
            Last updated
          </span>
        </div>
        <span className="text-[11px] font-semibold" style={{ color: '#047857' }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

    </div>
  );
};

export default Dashboard;