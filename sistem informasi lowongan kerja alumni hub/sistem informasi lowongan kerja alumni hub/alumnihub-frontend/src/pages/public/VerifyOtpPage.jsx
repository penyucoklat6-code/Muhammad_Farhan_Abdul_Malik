import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const email = location.state?.email || '';

  useEffect(() => { if (!email) navigate('/register'); }, [email, navigate]);
  useEffect(() => { if (countdown <= 0) return; const timer = setTimeout(() => setCountdown((c) => c - 1), 1000); return () => clearTimeout(timer); }, [countdown]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp]; newOtp[index] = element.value; setOtp(newOtp);
    if (element.value && element.nextSibling) element.nextSibling.focus();
  };
  const handleKeyDown = (e, index) => { if (e.key === 'Backspace' && !otp[index] && index > 0) e.target.previousSibling?.focus(); };

  const handleVerify = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp_code: otp.join('') });
      if (res.data.success) {
        const { token, user } = res.data.data; login(user, token);
        setSuccess('Verifikasi berhasil! Mengarahkan ke dashboard...');
        setTimeout(() => navigate('/dashboard/profile'), 1200);
      }
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === 'OTP_EXPIRED') setError('Kode OTP sudah kedaluwarsa. Silakan kirim ulang OTP.');
      else setError(err.response?.data?.message || 'Kode OTP tidak valid.');
      setOtp(['', '', '', '', '', '']);
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (countdown > 0) return; setError(''); setSuccess(''); setResending(true);
    try {
      const res = await api.post('/auth/resend-otp', { email });
      if (res.data.success) { setSuccess('Kode OTP baru telah dikirim ke email Anda.'); setCountdown(60); setOtp(['', '', '', '', '', '']); }
    } catch (err) {
      if (err.response?.status === 429) { setError('Mohon tunggu 1 menit sebelum meminta OTP baru.'); setCountdown(60); }
      else setError(err.response?.data?.message || 'Gagal mengirim ulang OTP.');
    } finally { setResending(false); }
  };

  const otpComplete = otp.join('').length === 6;

  return (
    <div style={{ padding: '40px 24px', maxWidth: '460px', margin: '0 auto' }}>
      <Link to="/register" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-4" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <ArrowLeft size={18} /> Kembali
      </Link>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
        <div className="text-center py-4 px-4" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff' }}>
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
            <ShieldCheck size={26} />
          </div>
          <h4 className="fw-bold mb-0">Verifikasi Email</h4>
          <p className="mb-0 small" style={{ opacity: 0.8 }}>Masukkan 6 digit kode OTP</p>
        </div>

        <div className="p-4 p-md-5 text-center">
          <div className="d-inline-flex align-items-center gap-2 p-3 rounded-3 mb-4" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.85rem' }}>
            <Mail size={18} /> Kode dikirim ke <strong>{email}</strong>
          </div>

          {error && (<div className="alert alert-danger d-flex align-items-center gap-2 small py-2 mb-3 text-start" style={{ borderRadius: 'var(--radius-sm)' }}><AlertCircle size={16} className="flex-shrink-0" />{error}</div>)}
          {success && (<div className="alert alert-success small py-2 mb-3" style={{ borderRadius: 'var(--radius-sm)' }}>{success}</div>)}

          <form onSubmit={handleVerify}>
            <div className="d-flex justify-content-center gap-2 mb-4">
              {otp.map((data, index) => (
                <input key={index} id={`otp-${index}`} className="form-control text-center fw-bold fs-4" type="text" inputMode="numeric" name="otp" maxLength="1"
                  value={data} onChange={(e) => handleChange(e.target, index)} onKeyDown={(e) => handleKeyDown(e, index)} onFocus={(e) => e.target.select()}
                  style={{ width: '45px', height: '55px', background: 'var(--light)', borderColor: 'var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }} />
              ))}
            </div>
            <button type="submit" id="btn-verify-otp" className="btn btn-primary w-100 py-2 fw-bold d-flex justify-content-center align-items-center gap-2 mb-4" disabled={loading || !otpComplete}>
              {loading ? (<><span className="spinner-border spinner-border-sm" /> Memverifikasi...</>) : (<>Verifikasi OTP <ArrowRight size={18} /></>)}
            </button>
            <div className="text-center small" style={{ color: 'var(--text-muted)' }}>
              Belum menerima kode?{' '}
              <button type="button" id="btn-resend-otp" className="btn btn-link p-0 fw-bold text-decoration-none" style={{ color: 'var(--primary)' }} onClick={handleResend} disabled={resending || countdown > 0}>
                {resending ? (<><RefreshCw size={13} className="me-1" />Mengirim...</>) : countdown > 0 ? `Kirim Ulang (${countdown}s)` : 'Kirim Ulang'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
