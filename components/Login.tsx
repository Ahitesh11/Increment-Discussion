import React, { useState } from 'react';
import { User as UserType } from '../types';
import { APP_NAME } from '../constants';
import { LogIn, Lock, User as UserIcon, ShieldAlert } from 'lucide-react';

interface LoginProps {
  loginData: any[];
  onLogin: (user: UserType) => void;
  loading: boolean;
}

const Login: React.FC<LoginProps> = ({ loginData, onLogin, loading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const logoUrl = "https://lh3.googleusercontent.com/d/1ga6EEhBzqPylYvG1kJN5FuW1Tthx_PEi";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = loginData.find(
      u => u.Username === username && u.Password === password
    );

    if (user) {
      onLogin(user);
    } else {
      setError('Invalid username or password');
    }
  };

  // ─── Styles ───────────────────────────────────────────────────────
  const baseInput: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px 12px 42px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: '#f9fafb',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 32,
        padding: 40,
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
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
            <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: 0 }}>{APP_NAME}</h1>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8 }}>
            Authentication Required
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Username</label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={baseInput}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#f97316';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={baseInput}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#f97316';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 20,
              color: '#b91c1c',
              fontSize: 13,
              fontWeight: 500,
            }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
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
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        <p style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', marginTop: 32, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          © {new Date().getFullYear()} {APP_NAME}
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;