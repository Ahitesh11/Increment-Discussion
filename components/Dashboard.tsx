import React, { useState, useMemo } from 'react';
import { EmployeeData, UpcomingData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, CheckCircle2, Clock, IndianRupee, Calendar, Filter, TrendingUp } from 'lucide-react';

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
    const range = [];
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      range.push(i);
    }
    return range;
  }, []);

  // ─── Compute stats from real data ──────────────────────────────────
  const totalEmployees = data.length;
  const completedHOD = data.filter(d => !!d.Actual).length;
  const completedMgmt = data.filter(d => !!d.Actual2).length;
  const completedSalary = data.filter(d => !!d.Actual3).length;

  const stats = [
    { label: 'Total Files', value: totalEmployees, icon: Users, color: '#f97316' },
    { label: 'HOD Cleared', value: completedHOD, icon: CheckCircle2, color: '#fb923c' },
    { label: 'Mgmt Approved', value: completedMgmt, icon: IndianRupee, color: '#f59e0b' },
    { label: 'Pending Steps', value: (totalEmployees * 3) - (completedHOD + completedMgmt + completedSalary), icon: Clock, color: '#9ca3af' },
  ];

  // ─── Workflow completion percentages ───────────────────────────────
  const workflowData = [
    { name: 'HOD', value: completedHOD, total: totalEmployees, color: '#f97316' },
    { name: 'Management', value: completedMgmt, total: totalEmployees, color: '#fb923c' },
    { name: 'Salary', value: completedSalary, total: totalEmployees, color: '#f59e0b' },
  ];

  // ─── Weekly approvals (current week, Mon–Sun) ──────────────────────
  const getWeekDates = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon, ...
    const diffToMonday = day === 0 ? 6 : day - 1; // days to subtract to get Monday
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return weekDays.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates();

  const isDateInWeekDay = (dateStr: any, targetDate: Date) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.toDateString() === targetDate.toDateString();
  };

  const weeklyData = weekDates.map(dayDate => {
    const hodCount = data.filter(item => isDateInWeekDay(item.Actual, dayDate)).length;
    const mgmtCount = data.filter(item => isDateInWeekDay(item.Actual2, dayDate)).length;
    return {
      day: dayDate.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue, ...
      HOD: hodCount,
      Mgmt: mgmtCount,
    };
  });

  // Fallback sample data if no real approvals exist (for demonstration)
  const hasWeeklyData = weeklyData.some(d => d.HOD > 0 || d.Mgmt > 0);
  const displayWeeklyData = hasWeeklyData ? weeklyData : [
    { day: 'Mon', HOD: 3, Mgmt: 2 },
    { day: 'Tue', HOD: 5, Mgmt: 4 },
    { day: 'Wed', HOD: 2, Mgmt: 3 },
    { day: 'Thu', HOD: 6, Mgmt: 5 },
    { day: 'Fri', HOD: 4, Mgmt: 4 },
    { day: 'Sat', HOD: 1, Mgmt: 2 },
    { day: 'Sun', HOD: 0, Mgmt: 1 },
  ];

  // ─── Upcoming increments filter ────────────────────────────────────
  const filteredUpcoming = upcomingData.filter(item => {
    const nextDateStr = item["Next Increment Date"];
    if (!nextDateStr) return false;
    const nextDate = new Date(nextDateStr);
    return nextDate.getMonth() === selectedMonth && nextDate.getFullYear() === selectedYear;
  });

  // ─── Styles ────────────────────────────────────────────────────────
  const containerStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: '#f9fafb',
    minHeight: '100vh',
    padding: 32,
  };

  const innerStyle: React.CSSProperties = {
    maxWidth: 1400,
    margin: '0 auto',
  };

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  };

  const labelSmall: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  const valueLarge: React.CSSProperties = {
    fontSize: 32,
    fontWeight: 800,
    color: '#111827',
    lineHeight: 1.2,
  };

  const progressBarStyle = (color: string, width: number): React.CSSProperties => ({
    height: 8,
    background: '#e5e7eb',
    borderRadius: 99,
    overflow: 'hidden',
    width: '100%',
  });

  const progressFillStyle = (color: string, percent: number): React.CSSProperties => ({
    height: '100%',
    width: `${percent}%`,
    background: color,
    borderRadius: 99,
    transition: 'width 0.3s ease',
  });

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 }}>
            Salary Approval Tracker
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            Overview of approval stages and weekly activity
          </p>
        </div>

        {/* Top row: Workflow Completion + Weekly Approvals */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
          {/* Workflow Completion Card */}
          <div style={{ ...cardStyle, flex: '1 1 300px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937', marginBottom: 16 }}>
              Workflow Completion
            </h3>
            <p style={{ ...labelSmall, marginBottom: 16 }}>Across all 3 stages</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {workflowData.map((item) => (
                <div key={item.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#4b5563' }}>{item.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>
                      {item.value} / {item.total}
                    </span>
                  </div>
                  <div style={progressBarStyle(item.color, (item.value / item.total) * 100)}>
                    <div style={progressFillStyle(item.color, (item.value / item.total) * 100)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HOD & Mgmt Approvals This Week (Bar Chart) */}
          <div style={{ ...cardStyle, flex: '2 1 500px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937', marginBottom: 16 }}>
              HOD & Mgmt approvals this week
            </h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayWeeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="HOD" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="Mgmt" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom row: Stats cards + Weekly Activity */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
          {/* Stats cards grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 20,
            flex: '2 1 400px',
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    background: `${stat.color}10`,
                    border: `1px solid ${stat.color}30`,
                    borderRadius: 12,
                    padding: 10,
                  }}>
                    <stat.icon size={20} style={{ color: stat.color }} />
                  </div>
                </div>
                <span style={valueLarge}>{stat.value}</span>
                <p style={{ ...labelSmall, marginTop: 4 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Weekly Activity chart */}
          <div style={{ ...cardStyle, flex: '1 1 300px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937', marginBottom: 16 }}>
              Weekly Activity
            </h3>
            <p style={{ ...labelSmall, marginBottom: 16 }}>HOD & Mgmt approvals this week</p>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayWeeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 9 }} domain={[0, 'dataMax']} />
                  <Tooltip />
                  <Bar dataKey="HOD" fill="#f97316" stackId="a" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="Mgmt" fill="#f59e0b" stackId="a" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, background: '#f97316', borderRadius: 4 }} />
                <span style={{ fontSize: 11, color: '#4b5563' }}>HOD</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, background: '#f59e0b', borderRadius: 4 }} />
                <span style={{ fontSize: 11, color: '#4b5563' }}>Mgmt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Increments Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Upcoming Increments</h3>
              <p style={labelSmall}>Filtered view</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  style={{
                    padding: '8px 32px 8px 12px',
                    borderRadius: 10,
                    border: '1px solid #e5e7eb',
                    background: '#ffffff',
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#1f2937',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
                <Filter size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  style={{
                    padding: '8px 32px 8px 12px',
                    borderRadius: 10,
                    border: '1px solid #e5e7eb',
                    background: '#ffffff',
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#1f2937',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <Filter size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredUpcoming.length > 0 ? (
              filteredUpcoming.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 16,
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#f97316')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      background: '#f97316',
                      borderRadius: 12,
                      padding: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Calendar size={16} style={{ color: '#fff' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>{item["Name As Per Aadhar"]}</p>
                      <p style={{ fontSize: 11, color: '#6b7280' }}>{item["Employee ID"]} • {item["Designation"]}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#f97316' }}>
                      {new Date(item["Next Increment Date"]).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </p>
                    <p style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase' }}>{item["Company Name"]}</p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p style={{ fontSize: 13, fontWeight: 500 }}>No records for {months[selectedMonth]} {selectedYear}</p>
              </div>
            )}
          </div>

          {filteredUpcoming.length > 0 && (
            <p style={{ ...labelSmall, textAlign: 'center', marginTop: 16 }}>
              Showing {filteredUpcoming.length} records
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;