import React, { useState } from 'react';
import { AppStep, User as UserType } from '../types';
import { APP_NAME } from '../constants';
import {
  LayoutDashboard,
  Settings,
  TrendingUp,
  UserCheck,
  ClipboardList,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Users,
  ChevronRight,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeStep: AppStep;
  onStepChange: (step: AppStep) => void;
  user: UserType | null;
  onLogout: () => void;
  counts?: Record<string, number>;
}

const Layout: React.FC<LayoutProps> = ({ children, activeStep, onStepChange, user, onLogout, counts }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logoUrl = "https://drive.google.com/thumbnail?id=1ga6EEhBzqPylYvG1kJN5FuW1Tthx_PEi&sz=w1000";

  const allMenuItems = [
    { id: AppStep.DASHBOARD,         label: 'Dashboard',         icon: LayoutDashboard, permissionKey: 'Dashboard' },
    { id: AppStep.ADD_NEW,           label: 'Add New Entry',     icon: PlusCircle,      permissionKey: 'Add New Entry' },
    { id: AppStep.HOD_COMMENTS,      label: 'HOD Approval',      icon: UserCheck,       permissionKey: 'HOD Approval' },
    { id: AppStep.MGMT_COMMENTS,     label: 'Management',        icon: Settings,        permissionKey: 'Management' },
    { id: AppStep.SALARY_INCREMENT,  label: 'Salary Finalize',   icon: TrendingUp,      permissionKey: 'Salary Finalize' },
    { id: AppStep.RECORDS,           label: 'Master Records',    icon: ClipboardList,   permissionKey: 'Master Records' },
    { id: AppStep.PRESENT_EMPLOYEES, label: 'Present Employees', icon: Users,           permissionKey: 'Present Employees' },
  ];

  const menuItems = allMenuItems.filter(item => {
    if (!user) return false;
    const permission = user[item.permissionKey as keyof UserType];
    return permission === 'Yes' || item.id === AppStep.PRESENT_EMPLOYEES;
  });

  const handleStepChange = (step: AppStep) => {
    onStepChange(step);
    setIsSidebarOpen(false);
  };

  const activeLabel = allMenuItems.find(i => i.id === activeStep)?.label ?? '';
  const userInitials = (user?.Name || 'AD').substring(0, 2).toUpperCase();

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 60%, #f7fee7 100%)' }}
    >
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm"
          style={{ background: 'rgba(6,78,59,0.45)' }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:static h-full z-50 flex flex-col transition-all duration-300
          ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 lg:w-72'}`}
        style={{
          background: 'linear-gradient(180deg, #064e3b 0%, #065f46 60%, #047857 100%)',
          boxShadow: '4px 0 32px rgba(6,78,59,0.18)',
        }}
      >
        {/* Logo area */}
        <div
          className="shrink-0 px-6 py-8 flex flex-col items-center relative"
          style={{ borderBottom: '1px solid rgba(167,243,208,0.15)' }}
        >
          {/* Mobile close */}
          <button
            className="absolute top-4 right-4 lg:hidden rounded-xl p-1.5 transition-colors"
            style={{ color: '#6ee7b7' }}
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>

          {/* Logo */}
          <div
            className="w-20 h-20 mb-4 rounded-2xl flex items-center justify-center overflow-hidden transition-transform hover:scale-105"
            style={{
              background: 'white',
              boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
              border: '2px solid rgba(167,243,208,0.3)',
            }}
          >
            <img
              src={logoUrl}
              alt="Logo"
              className="w-full h-full object-contain"
              crossOrigin="anonymous"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                if (!t.src.includes('lh3.googleusercontent.com')) {
                  t.src = "https://lh3.googleusercontent.com/d/1ga6EEhBzqPylYvG1kJN5FuW1Tthx_PEi";
                } else {
                  t.src = 'https://via.placeholder.com/150?text=LOGO';
                }
              }}
            />
          </div>

          <h1
            className="text-base font-black uppercase tracking-widest text-center"
            style={{ color: 'white', letterSpacing: '0.16em' }}
          >
            {APP_NAME}
          </h1>
          <div
            className="mt-1.5 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
            style={{ background: 'rgba(167,243,208,0.15)', color: '#6ee7b7', letterSpacing: '0.18em' }}
          >
           
          </div>
        </div>

        {/* Nav items */}
        <nav
          className="flex-1 overflow-y-auto px-4 py-6 space-y-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {menuItems.map((item) => {
            const isActive = activeStep === item.id;
            const itemCount = counts?.[item.id];

            return (
              <button
                key={item.id}
                onClick={() => handleStepChange(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left"
                style={{
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(167,243,208,0.22) 0%, rgba(167,243,208,0.08) 100%)'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(167,243,208,0.25)' : '1px solid transparent',
                  color: isActive ? 'white' : '#6ee7b7',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(167,243,208,0.08)';
                    (e.currentTarget as HTMLElement).style.color = 'white';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = '#6ee7b7';
                  }
                }}
              >
                {/* Left accent bar */}
                <div
                  className="w-0.5 h-5 rounded-full flex-shrink-0 transition-all"
                  style={{ background: isActive ? '#34d399' : 'transparent' }}
                />

                <item.icon
                  size={17}
                  strokeWidth={isActive ? 2.4 : 2}
                  style={{ color: isActive ? '#34d399' : 'currentColor', flexShrink: 0 }}
                />

                <span className="flex-1 text-sm font-semibold">{item.label}</span>

                {itemCount !== undefined && itemCount > 0 ? (
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: '#f59e0b', color: 'white', minWidth: '22px', textAlign: 'center' }}
                  >
                    {itemCount}
                  </span>
                ) : isActive ? (
                  <ChevronRight size={13} style={{ color: '#34d399' }} />
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          className="shrink-0 px-4 py-5"
          style={{ borderTop: '1px solid rgba(167,243,208,0.12)' }}
        >
          {/* User row */}
          <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl" style={{ background: 'rgba(167,243,208,0.08)' }}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
              style={{ background: 'rgba(52,211,153,0.2)', color: '#34d399' }}
            >
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate" style={{ color: 'white' }}>{user?.Name || 'User'}</p>
              <p className="text-[9px] font-semibold" style={{ color: '#6ee7b7' }}>Active session</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ color: '#6ee7b7', border: '1px solid rgba(167,243,208,0.15)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)';
              (e.currentTarget as HTMLElement).style.color = '#fca5a5';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#6ee7b7';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(167,243,208,0.15)';
            }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">

        {/* Header */}
        <header
          className="shrink-0 z-30 flex items-center justify-between px-5 lg:px-10 py-4"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1.5px solid #bbf7d0',
            boxShadow: '0 2px 16px rgba(52,211,153,0.07)',
          }}
        >
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl transition-colors"
              style={{ color: '#059669' }}
              onClick={() => setIsSidebarOpen(true)}
              onMouseEnter={e => (e.currentTarget.style.background = '#d1fae5')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-lg lg:text-xl font-black leading-tight" style={{ color: '#064e3b' }}>
                {activeLabel}
              </h2>
              <nav className="hidden sm:flex items-center gap-1.5 mt-0.5" style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                <span style={{ color: '#6ee7b7' }}>{APP_NAME}</span>
                <ChevronRight size={9} style={{ color: '#bbf7d0' }} />
                <span style={{ color: '#059669' }}>{activeStep.replace(/_/g, ' ')}</span>
              </nav>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-xs font-black" style={{ color: '#064e3b' }}>{user?.Name || 'User'}</p>
              <span
                className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5"
                style={{ background: '#d1fae5', color: '#059669', letterSpacing: '0.12em' }}
              >
                ● Active
              </span>
            </div>
            <div
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center font-black text-sm transition-transform hover:scale-110 hover:rotate-3"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                boxShadow: '0 4px 14px rgba(16,185,129,0.30)',
              }}
            >
              {userInitials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <section className="flex-1 min-h-0 px-4 lg:px-10 py-5 overflow-hidden flex flex-col">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;