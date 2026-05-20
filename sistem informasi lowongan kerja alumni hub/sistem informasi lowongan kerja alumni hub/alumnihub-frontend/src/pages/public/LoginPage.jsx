import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user } = res.data.data;
        login(user, token);
        if (user.role === 'kaprodi') navigate('/dashboard/kaprodi/overview');
        else navigate('/dashboard/profile');
      }
    } catch (err) {
      const code = err.response?.data?.code;
      const message = err.response?.data?.message;
      if (code === 'OTP_NOT_VERIFIED') navigate('/verify-otp', { state: { email } });
      else if (err.response?.status === 401) setError('Email atau password salah. Silakan coba lagi.');
      else setError(message || 'Terjadi kesalahan. Coba lagi nanti.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '460px', margin: '0 auto' }}>
      <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-4" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <ArrowLeft size={18} /> Kembali ke Beranda
      </Link>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
        {/* Header */}
        <div className="text-center py-4 px-4" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff' }}>
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
            <LogIn size={26} />
          </div>
          <h4 className="fw-bold mb-1">Selamat Datang Kembali</h4>
          <p className="mb-0 small" style={{ opacity: 0.8 }}>Masuk ke akun Alumni Hub Anda</p>
        </div>

        {/* Body */}
        <div className="p-4 p-md-5">
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 small py-2 mb-4" style={{ borderRadius: 'var(--radius-sm)' }}>
              <AlertCircle size={16} className="flex-shrink-0" /> {error}
            </div>
          )}
          <form onSubmit={handleLogin} noValidate>
            <div className="mb-4">
              <label className="form-label fw-medium small" style={{ color: 'var(--text-muted)' }}>Email Address</label>
              <div className="input-group">
                <span className="input-group-text border-end-0" style={{ background: 'var(--light)', borderColor: 'var(--border)' }}><Mail size={18} style={{ color: 'var(--text-muted)' }} /></span>
                <input type="email" id="login-email" className="form-control border-start-0 py-2 px-3" style={{ background: 'var(--light)', borderColor: 'var(--border)' }}
                  placeholder="Masukkan email Anda" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label fw-medium small mb-0" style={{ color: 'var(--text-muted)' }}>Password</label>
                <a href="#" className="small text-decoration-none" style={{ color: 'var(--primary)' }}>Lupa Password?</a>
              </div>
              <div className="input-group">
                <span className="input-group-text border-end-0" style={{ background: 'var(--light)', borderColor: 'var(--border)' }}><Lock size={18} style={{ color: 'var(--text-muted)' }} /></span>
                <input type={showPassword ? 'text' : 'password'} id="login-password" className="form-control border-start-0 border-end-0 py-2 px-3" style={{ background: 'var(--light)', borderColor: 'var(--border)' }}
                  placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="input-group-text border-start-0" style={{ background: 'var(--light)', borderColor: 'var(--border)' }} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? <EyeOff size={16} style={{ color: 'var(--text-muted)' }} /> : <Eye size={16} style={{ color: 'var(--text-muted)' }} />}
                </button>
              </div>
            </div>
            <button type="submit" id="btn-login" disabled={loading} className="btn btn-primary w-100 py-2 fw-bold d-flex justify-content-center align-items-center gap-2 mb-4">
              {loading ? (<><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> Memproses...</>) : (<><LogIn size={18} /> Masuk Sekarang</>)}
            </button>
            <div className="text-center small" style={{ color: 'var(--text-muted)' }}>
              Belum punya akun? <Link to="/register" className="fw-bold text-decoration-none" style={{ color: 'var(--primary)' }}>Daftar di sini</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
