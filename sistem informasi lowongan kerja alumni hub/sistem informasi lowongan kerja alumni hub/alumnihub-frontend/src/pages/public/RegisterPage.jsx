import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle, Hash, Briefcase } from 'lucide-react';
import api from '../../services/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('mahasiswa');
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [nip, setNip] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const handleNimChange = (e) => { const val = e.target.value; if (/^\d*$/.test(val)) setNim(val); };

  const handleRegister = async (e) => {
    e.preventDefault(); setErrors({}); setGlobalError(''); setLoading(true);
    try {
      const payload = { name, email, password, password_confirmation: passwordConfirmation, role, ...(role === 'mahasiswa' ? { nim } : { nip }) };
      const res = await api.post('/auth/register', payload);
      if (res.data.success) navigate('/verify-otp', { state: { email, message: res.data.message } });
    } catch (err) {
      if (err.response?.status === 422) { setErrors(err.response.data.errors || {}); setGlobalError(err.response.data.message || 'Data tidak valid.'); }
      else setGlobalError(err.response?.data?.message || 'Terjadi kesalahan.');
    } finally { setLoading(false); }
  };

  const FieldError = ({ field }) => errors[field] ? (
    <div className="d-flex align-items-center gap-1 mt-1"><AlertCircle size={13} className="text-danger flex-shrink-0" /><small className="text-danger">{errors[field][0]}</small></div>
  ) : null;

  const inputStyle = { background: 'var(--light)', borderColor: 'var(--border)' };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '520px', margin: '0 auto' }}>
      <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-4" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <ArrowLeft size={18} /> Kembali ke Beranda
      </Link>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
        <div className="text-center py-4 px-4" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff' }}>
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
            <UserPlus size={26} />
          </div>
          <h4 className="fw-bold mb-1">Buat Akun Baru</h4>
          <p className="mb-0 small" style={{ opacity: 0.8 }}>Bergabunglah dengan jaringan Alumni Hub UHAMKA</p>
        </div>

        <div className="p-4 p-md-5">
          {globalError && (<div className="alert alert-danger d-flex align-items-center gap-2 small py-2 mb-4" style={{ borderRadius: 'var(--radius-sm)' }}><AlertCircle size={16} className="flex-shrink-0" />{globalError}</div>)}

          <form onSubmit={handleRegister} noValidate>
            {/* Role */}
            <div className="mb-4">
              <label className="form-label fw-medium small" style={{ color: 'var(--text-muted)' }}>Daftar Sebagai</label>
              <div className="d-flex gap-3">
                <label className={`flex-grow-1 btn ${role === 'mahasiswa' ? 'btn-primary' : ''}`} style={role !== 'mahasiswa' ? { border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-card)' } : {}}>
                  <input type="radio" name="role" value="mahasiswa" className="d-none" checked={role === 'mahasiswa'} onChange={(e) => { setRole(e.target.value); setNim(''); setNip(''); setErrors({}); }} /> Mahasiswa
                </label>
                <label className={`flex-grow-1 btn ${role === 'kaprodi' ? 'btn-primary' : ''}`} style={role !== 'kaprodi' ? { border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-card)' } : {}}>
                  <input type="radio" name="role" value="kaprodi" className="d-none" checked={role === 'kaprodi'} onChange={(e) => { setRole(e.target.value); setNim(''); setNip(''); setErrors({}); }} /> Kaprodi
                </label>
              </div>
            </div>

            {/* Nama */}
            <div className="mb-3">
              <label className="form-label fw-medium small" style={{ color: 'var(--text-muted)' }}>Nama Lengkap</label>
              <div className="input-group">
                <span className="input-group-text border-end-0" style={inputStyle}><User size={18} style={{ color: 'var(--text-muted)' }} /></span>
                <input type="text" id="register-name" className={`form-control border-start-0 py-2 px-3 ${errors.name ? 'is-invalid' : ''}`} style={inputStyle} placeholder="Masukkan nama lengkap" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <FieldError field="name" />
            </div>

            {/* NIM */}
            {role === 'mahasiswa' && (
              <div className="mb-3">
                <label className="form-label fw-medium small" style={{ color: 'var(--text-muted)' }}>NIM <span style={{ fontSize: '11px' }}>(hanya angka)</span></label>
                <div className="input-group">
                  <span className="input-group-text border-end-0" style={inputStyle}><Hash size={18} style={{ color: 'var(--text-muted)' }} /></span>
                  <input type="text" id="register-nim" inputMode="numeric" pattern="\d*" className={`form-control border-start-0 py-2 px-3 ${errors.nim ? 'is-invalid' : ''}`} style={inputStyle} placeholder="Contoh: 2021010001" value={nim} onChange={handleNimChange} maxLength={20} required />
                </div>
                {nim && !/^\d+$/.test(nim) && (<div className="d-flex align-items-center gap-1 mt-1"><AlertCircle size={13} className="text-danger flex-shrink-0" /><small className="text-danger">NIM hanya boleh berisi angka.</small></div>)}
                <FieldError field="nim" />
              </div>
            )}

            {/* NIP */}
            {role === 'kaprodi' && (
              <div className="mb-3">
                <label className="form-label fw-medium small" style={{ color: 'var(--text-muted)' }}>NIP</label>
                <div className="input-group">
                  <span className="input-group-text border-end-0" style={inputStyle}><Briefcase size={18} style={{ color: 'var(--text-muted)' }} /></span>
                  <input type="text" id="register-nip" className={`form-control border-start-0 py-2 px-3 ${errors.nip ? 'is-invalid' : ''}`} style={inputStyle} placeholder="Masukkan NIP Anda" value={nip} onChange={(e) => setNip(e.target.value)} maxLength={20} required />
                </div>
                <FieldError field="nip" />
              </div>
            )}

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-medium small" style={{ color: 'var(--text-muted)' }}>Email Aktif</label>
              <div className="input-group">
                <span className="input-group-text border-end-0" style={inputStyle}><Mail size={18} style={{ color: 'var(--text-muted)' }} /></span>
                <input type="email" id="register-email" className={`form-control border-start-0 py-2 px-3 ${errors.email ? 'is-invalid' : ''}`} style={inputStyle} placeholder="Email aktif untuk menerima OTP" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <FieldError field="email" />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-medium small" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="input-group">
                <span className="input-group-text border-end-0" style={inputStyle}><Lock size={18} style={{ color: 'var(--text-muted)' }} /></span>
                <input type={showPassword ? 'text' : 'password'} id="register-password" className={`form-control border-start-0 border-end-0 py-2 px-3 ${errors.password ? 'is-invalid' : ''}`} style={inputStyle} placeholder="Minimal 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="input-group-text border-start-0" style={inputStyle} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? <EyeOff size={16} style={{ color: 'var(--text-muted)' }} /> : <Eye size={16} style={{ color: 'var(--text-muted)' }} />}
                </button>
              </div>
              <FieldError field="password" />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label fw-medium small" style={{ color: 'var(--text-muted)' }}>Konfirmasi Password</label>
              <div className="input-group">
                <span className="input-group-text border-end-0" style={inputStyle}><Lock size={18} style={{ color: 'var(--text-muted)' }} /></span>
                <input type={showConfirm ? 'text' : 'password'} id="register-password-confirm" className="form-control border-start-0 border-end-0 py-2 px-3" style={inputStyle} placeholder="Ulangi password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
                <button type="button" className="input-group-text border-start-0" style={inputStyle} onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                  {showConfirm ? <EyeOff size={16} style={{ color: 'var(--text-muted)' }} /> : <Eye size={16} style={{ color: 'var(--text-muted)' }} />}
                </button>
              </div>
              {passwordConfirmation && password !== passwordConfirmation && (<div className="d-flex align-items-center gap-1 mt-1"><AlertCircle size={13} className="text-danger flex-shrink-0" /><small className="text-danger">Password tidak cocok.</small></div>)}
              {passwordConfirmation && password === passwordConfirmation && (<div className="d-flex align-items-center gap-1 mt-1"><CheckCircle size={13} className="text-success flex-shrink-0" /><small className="text-success">Password cocok.</small></div>)}
            </div>

            <button type="submit" id="btn-register" disabled={loading} className="btn btn-primary w-100 py-2 fw-bold d-flex justify-content-center align-items-center gap-2 mb-4">
              {loading ? (<><span className="spinner-border spinner-border-sm" /> Mendaftarkan...</>) : (<><UserPlus size={18} /> Daftar Sekarang</>)}
            </button>
            <div className="text-center small" style={{ color: 'var(--text-muted)' }}>Sudah punya akun? <Link to="/login" className="fw-bold text-decoration-none" style={{ color: 'var(--primary)' }}>Masuk di sini</Link></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
