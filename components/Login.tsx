import React, { useState } from 'react';
import { User as UserType } from '../types';
import { APP_NAME } from '../constants';
import { LogIn, Lock, User as UserIcon, ShieldAlert, Leaf } from 'lucide-react';

interface LoginProps {
  loginData: any[];
  onLogin: (user: UserType) => void;
  loading: boolean;
}

const Login: React.FC<LoginProps> = ({ loginData, onLogin, loading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const logoUrl = "https://drive.google.com/thumbnail?id=1ga6EEhBzqPylYvG1kJN5FuW1Tthx_PEi&sz=w1000";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = loginData.find(u => u.Username === username && u.Password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid username or password');
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    paddingLeft: '48px',
    paddingRight: '20px',
    paddingTop: '14px',
    paddingBottom: '14px',
    background: focusedField === field ? '#ffffff' : '#f0fdf4',
    border: `1.5px solid ${focusedField === field ? '#34d399' : '#bbf7d0'}`,
    borderRadius: '14px',
    outline: 'none',
    fontSize: '14px',
    fontWeight: 600,
    color: '#064e3b',
    transition: 'all 0.2s',
    boxShadow: focusedField === field ? '0 0 0 4px rgba(52,211,153,0.12)' : 'none',
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #059669 100%)' }}
    >
      {/* Background pattern dots */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #6ee7b7 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative w-full max-w-md">

        {/* Glow behind card */}
        <div
          className="absolute inset-0 rounded-3xl blur-2xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 60%, #34d399, transparent 70%)', transform: 'scale(0.9) translateY(16px)' }}
        />

        {/* Card */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #ffffff 0%, #f0fdf4 100%)',
            border: '1.5px solid #bbf7d0',
            boxShadow: '0 32px 64px rgba(6,78,59,0.35), 0 4px 16px rgba(52,211,153,0.15)',
          }}
        >
          {/* Top decorative strip */}
          <div
            className="h-1.5 w-full"
            style={{ background: 'linear-gradient(90deg, #10b981, #34d399, #84cc16)' }}
          />

          <div className="px-10 pt-10 pb-10">

            {/* Logo + Title */}
            <div className="flex flex-col items-center mb-10">
              <div
                className="w-24 h-24 mb-5 rounded-2xl flex items-center justify-center overflow-hidden transition-transform hover:scale-105"
                style={{
                  background: 'white',
                  boxShadow: '0 8px 28px rgba(16,185,129,0.20)',
                  border: '2px solid #d1fae5',
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
                className="text-2xl font-black text-center tracking-tight"
                style={{ color: '#064e3b' }}
              >
                {APP_NAME}
              </h1>

              <div
                className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{ background: '#d1fae5' }}
              >
                <Leaf size={10} style={{ color: '#059669' }} />
                <span
                  style={{ fontSize: '9px', fontWeight: 800, color: '#059669', letterSpacing: '0.18em', textTransform: 'uppercase' }}
                >
                  
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div className="space-y-1.5">
                <label
                  style={{ fontSize: '10px', fontWeight: 800, color: '#059669', letterSpacing: '0.15em', textTransform: 'uppercase', paddingLeft: '4px', display: 'block' }}
                >
                  Username
                </label>
                <div className="relative">
                  <UserIcon
                    size={16}
                    strokeWidth={2.2}
                    style={{
                      position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                      color: focusedField === 'username' ? '#34d399' : '#a7f3d0',
                      transition: 'color 0.2s',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('username')}
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  style={{ fontSize: '10px', fontWeight: 800, color: '#059669', letterSpacing: '0.15em', textTransform: 'uppercase', paddingLeft: '4px', display: 'block' }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    strokeWidth={2.2}
                    style={{
                      position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                      color: focusedField === 'password' ? '#34d399' : '#a7f3d0',
                      transition: 'color 0.2s',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('password')}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{ background: '#fffbeb', border: '1.5px solid #fde68a' }}
                >
                  <ShieldAlert size={15} style={{ color: '#d97706', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400e' }}>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: loading
                    ? '#6ee7b7'
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(16,185,129,0.35)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.14em',
                  marginTop: '8px',
                }}
                onMouseEnter={e => {
                  if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(16,185,129,0.45)';
                }}
                onMouseLeave={e => {
                  if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(16,185,129,0.35)';
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} strokeWidth={2.3} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p
              className="mt-8 text-center"
              style={{ fontSize: '9px', fontWeight: 700, color: '#a7f3d0', letterSpacing: '0.18em', textTransform: 'uppercase' }}
            >
              © {new Date().getFullYear()} {APP_NAME}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;