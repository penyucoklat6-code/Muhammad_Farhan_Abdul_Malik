import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, Building2, BookOpen, ChevronLeft, Bookmark, CheckCircle, FileText } from 'lucide-react';
import api, { STORAGE_URL } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyResult, setApplyResult] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data.data);
      
      if (user && user.role === 'mahasiswa') {
        try {
          const bmRes = await api.get('/bookmarks');
          const marks = bmRes.data.data.data || [];
          setIsBookmarked(marks.some(b => b.job_id === parseInt(id)));
        } catch (bmErr) {
          console.error('Failed to fetch bookmarks', bmErr);
        }
      }
    } catch (err) {
      console.error('Failed to fetch job detail', err);
      setError(err.response?.data?.message || 'Gagal memuat detail lowongan.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'mahasiswa') return;
    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${id}`);
        setIsBookmarked(false);
      } else {
        await api.post(`/bookmarks/${id}`);
        setIsBookmarked(true);
      }
    } catch (err) {
      alert('Gagal menyimpan lowongan');
    }
  };

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'mahasiswa') {
      alert('Hanya mahasiswa yang dapat melamar pekerjaan.');
      return;
    }
    
    if (!window.confirm(`Kirim lamaran untuk posisi ${job.title} di ${job.company}?`)) return;

    setApplying(true);
    setApplyResult(null);
    try {
      const res = await api.post(`/applications/${id}`);
      setApplyResult({ success: true, message: res.data.message || 'Lamaran berhasil dikirim!' });
    } catch (err) {
      setApplyResult({ success: false, message: err.response?.data?.message || 'Gagal mengirim lamaran.' });
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (ds) => {
    if (!ds) return '-';
    return new Date(ds).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary" /></div>;
  }

  if (!job) {
    return (
      <div className="container py-5 mt-5 text-center">
        <h3 className="fw-bold text-muted">{error || 'Lowongan tidak ditemukan'}</h3>
        <Link to="/jobs" className="btn btn-primary mt-3">Kembali ke Daftar Lowongan</Link>
      </div>
    );
  }

  return (
    <div className={`container-fluid max-w-7xl mx-auto p-4 p-md-5 pt-5 mt-5 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
      <Link to="/jobs" className="btn btn-link text-decoration-none p-0 mb-4 d-inline-flex align-items-center gap-1 fw-medium text-muted">
        <ChevronLeft size={18} /> Kembali
      </Link>

      {applyResult && (
        <div className={`alert ${applyResult.success ? 'alert-success' : 'alert-danger'} mb-4 d-flex align-items-center gap-2`}>
          {applyResult.success ? <CheckCircle size={20} /> : <div />}
          {applyResult.message}
        </div>
      )}

      <div className={`card border-0 rounded-4 shadow-sm mb-4 ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}>
        <div className="card-body p-4 p-md-5">
          <div className="row align-items-center mb-4">
            <div className="col-md-auto mb-4 mb-md-0 text-center text-md-start">
              <div className="rounded-4 d-flex align-items-center justify-content-center overflow-hidden border mx-auto mx-md-0" style={{ width: '130px', height: '130px', background: 'var(--bg-card)' }}>
                {job.logo ? (
                  <img src={`${STORAGE_URL}/${job.logo}`} alt="logo" className="w-100 h-100" style={{ objectFit: 'contain', padding: '15px' }} />
                ) : (
                  <Building2 size={56} style={{ color: 'var(--primary)', opacity: 0.25 }} />
                )}
              </div>
            </div>
            <div className="col-md">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h2 className="fw-bold mb-1">{job.title}</h2>
                  <h5 className="fw-bold text-primary mb-3">{job.company}</h5>
                </div>
                {user?.role === 'mahasiswa' && (
                  <button className="btn btn-link p-2" onClick={handleToggleBookmark} title={isBookmarked ? 'Hapus Bookmark' : 'Simpan Lowongan'}>
                    <Bookmark size={28} fill={isBookmarked ? '#F59E0B' : 'none'} color={isBookmarked ? '#F59E0B' : 'var(--text-muted)'} strokeWidth={isBookmarked ? 1 : 2} />
                  </button>
                )}
              </div>
              
              <div className="d-flex flex-wrap gap-2 mb-4">
                <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary small fw-medium"><MapPin size={14} /> {job.location}</span>
                <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary small fw-medium"><Briefcase size={14} /> {job.type}</span>
                {job.work_arrangement && (
                  <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary small fw-medium"><Building2 size={14} /> {job.work_arrangement}</span>
                )}
                {job.major && (
                  <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill border small fw-medium"><BookOpen size={14} /> {job.major.name}</span>
                )}
                {job.deadline && (
                  <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-danger bg-opacity-10 text-danger small fw-medium"><Calendar size={14} /> Ditutup: {formatDate(job.deadline)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2"><FileText size={18} className="text-primary" /> Deskripsi Pekerjaan</h5>
            <div className="p-4 rounded-4" style={{ background: 'var(--bg-card)', whiteSpace: 'pre-wrap', border: '1px solid var(--border)', color: 'var(--text-main)', lineHeight: '1.6' }}>
              {job.description}
            </div>
          </div>
          
          <div className="mb-5">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2"><CheckCircle size={18} className="text-primary" /> Persyaratan</h5>
            <div className="p-4 rounded-4" style={{ background: 'var(--bg-card)', whiteSpace: 'pre-wrap', border: '1px solid var(--border)', color: 'var(--text-main)', lineHeight: '1.6' }}>
              {job.requirements}
            </div>
          </div>

          {user?.role === 'mahasiswa' && (
            <div className="text-end">
              <button onClick={handleApply} disabled={applying} className="btn btn-primary px-5 py-3 fw-bold rounded-pill shadow-sm">
                {applying ? 'Mengirim...' : 'Lamar Pekerjaan Ini'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
