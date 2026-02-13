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
  X
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
  const logoUrl = "https://lh3.googleusercontent.com/d/1ga6EEhBzqPylYvG1kJN5FuW1Tthx_PEi";

  const allMenuItems = [
    { id: AppStep.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, permissionKey: 'Dashboard' },
    { id: AppStep.ADD_NEW, label: 'Add New Entry', icon: PlusCircle, permissionKey: 'Add New Entry' },
    { id: AppStep.HOD_COMMENTS, label: 'HOD Approval', icon: UserCheck, permissionKey: 'HOD Approval' },
    { id: AppStep.MGMT_COMMENTS, label: 'Management', icon: Settings, permissionKey: 'Management' },
    { id: AppStep.SALARY_INCREMENT, label: 'Salary Finalize', icon: TrendingUp, permissionKey: 'Salary Finalize' },
    { id: AppStep.RECORDS, label: 'Master Records', icon: ClipboardList, permissionKey: 'Master Records' },
  ];

  const menuItems = allMenuItems.filter(item => user && user[item.permissionKey as keyof UserType] === 'Yes');

  const handleStepChange = (step: AppStep) => {
    onStepChange(step);
    setIsSidebarOpen(false);
  };

  // ─── Styles ─────────────────────────────────────────────────────────
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    background: '#f9fafb',
    overflow: 'hidden',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(4px)',
    zIndex: 40,
  };

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    background: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    boxShadow: '4px 0 12px rgba(0,0,0,0.02)',
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease',
    width: 280,
    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
  };

  // Responsive: on large screens the sidebar is always visible
  const desktopSidebarStyle: React.CSSProperties = {
    ...sidebarStyle,
    position: 'static',
    transform: 'none',
    width: 280,
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    marginLeft: isSidebarOpen ? 280 : 0,
    transition: 'margin-left 0.3s',
  };

  const headerStyle: React.CSSProperties = {
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  };

  const menuButtonStyle: React.CSSProperties = {
    display: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#4b5563',
    padding: 8,
    borderRadius: 12,
    transition: 'background 0.2s',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    padding: 32,
  };

  // 🔹 Increased gap further: margin '12px 12px'
  const navItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 20px',
    borderRadius: 16,
    margin: '12px 12px', // ← even bigger vertical gap
    cursor: 'pointer',
    background: isActive ? '#f97316' : 'transparent',
    color: isActive ? '#ffffff' : '#4b5563',
    fontWeight: 600,
    fontSize: 14,
    transition: 'background 0.2s, color 0.2s',
    border: 'none',
    width: 'calc(100% - 24px)',
    textAlign: 'left',
  });

  const badgeStyle: React.CSSProperties = {
    background: '#ef4444',
    color: '#fff',
    borderRadius: 20,
    padding: '2px 8px',
    fontSize: 10,
    fontWeight: 700,
    marginLeft: 'auto',
  };

  const activeDotStyle: React.CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#fff',
    marginLeft: 'auto',
  };

  return (
    <div style={containerStyle}>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div style={overlayStyle} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar - responsive */}
      <aside style={window.innerWidth >= 1024 ? desktopSidebarStyle : sidebarStyle}>
        <div style={{
          padding: 32,
          textAlign: 'center',
          borderBottom: '1px solid #e5e7eb',
          background: '#ffffff',
          position: 'relative',
          flexShrink: 0,
        }}>
          <button
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: window.innerWidth >= 1024 ? 'none' : 'block',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
            }}
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>

          <div style={{
            width: 80,
            height: 80,
            margin: '0 auto 16px',
            background: '#fff',
            borderRadius: 24,
            border: '1px solid #e5e7eb',
            padding: 8,
            boxShadow: '0 4px 12px rgba(249,115,22,0.1)',
          }}>
            <img
              src={logoUrl}
              alt="Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=LOGO';
              }}
            />
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: 0 }}>{APP_NAME}</h1>
          <p style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#f97316',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginTop: 4,
          }}>
            Increment Discussion Fms
          </p>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          {menuItems.map((item) => {
            const itemCount = counts?.[item.id];
            return (
              <button
                key={item.id}
                onClick={() => handleStepChange(item.id)}
                style={navItemStyle(activeStep === item.id)}
                onMouseEnter={e => {
                  if (activeStep !== item.id) {
                    e.currentTarget.style.background = '#f3f4f6';
                  }
                }}
                onMouseLeave={e => {
                  if (activeStep !== item.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <item.icon size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {itemCount !== undefined && itemCount > 0 && (
                  <span style={badgeStyle}>{itemCount}</span>
                )}
                {activeStep === item.id && itemCount === undefined && (
                  <span style={activeDotStyle} />
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: 24, borderTop: '1px solid #e5e7eb', flexShrink: 0 }}>
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: 12,
              background: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              color: '#ef4444',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={mainStyle}>
        <header style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              style={{
                ...menuButtonStyle,
                display: window.innerWidth >= 1024 ? 'none' : 'block',
              }}
              onClick={() => setIsSidebarOpen(true)}
              onMouseEnter={e => (e.currentTarget.style.background = '#fef2c0')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0 }}>
                {allMenuItems.find(i => i.id === activeStep)?.label}
              </h2>
              <nav style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 10,
                fontWeight: 700,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: 2,
              }}>
                <span style={{ cursor: 'default' }}>{APP_NAME}</span>
                <span style={{ margin: '0 4px' }}>/</span>
                <span style={{ color: '#f97316' }}>{activeStep.replace(/_/g, ' ')}</span>
              </nav>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0 }}>{user?.Name || 'User'}</p>
              <p style={{
                fontSize: 9,
                color: '#10b981',
                background: '#ecfdf5',
                padding: '2px 8px',
                borderRadius: 20,
                fontWeight: 600,
                marginTop: 2,
              }}>
                Active
              </p>
            </div>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 18,
              boxShadow: '0 4px 12px rgba(249,115,22,0.2)',
            }}>
              {(user?.Name || 'AD').substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        <section style={contentStyle}>
          {children}
        </section>
      </main>

      <style>{`
        @media (min-width: 1024px) {
          aside {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;