import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { AuthContext } from '../../../context/AuthContext';
import api, { STORAGE_URL } from '../../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, MapPin, Building2, Trash2, Briefcase, Calendar, BookOpen, X, CheckCircle, Send, Eye, FileText, ExternalLink } from 'lucide-react';

const BookmarksPage = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detail modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookmarks');
      setBookmarks(res.data.data.data || []);
    } catch (err) {
      console.error('Failed to fetch bookmarks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (jobId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Hapus dari daftar tersimpan?')) return;
    try {
      await api.delete(`/bookmarks/${jobId}`);
      setBookmarks(bookmarks.filter(b => b.job_id !== jobId));
      if (showDetailModal && selectedJob?.id === jobId) {
        setShowDetailModal(false);
        setSelectedJob(null);
      }
    } catch (err) {
      alert('Gagal menghapus bookmark');
    }
  };

  const handleOpenDetail = async (job) => {
    setShowDetailModal(true);
    setDetailLoading(true);
    try {
      const res = await api.get(`/jobs/${job.id}`);
      setSelectedJob(res.data.data);
    } catch (err) {
      // Jika gagal ambil dari API, gunakan data dari bookmark
      setSelectedJob(job);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApplyClick = async (jobId) => {
    if (!user) { navigate('/login'); return; }
    if (!window.confirm('Kirim lamaran untuk lowongan ini?')) return;
    try {
      const res = await api.post(`/applications/${jobId}`);
      alert(res.data.message || 'Lamaran berhasil dikirim!');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengirim lamaran.');
    }
  };

  const formatDate = (ds) => {
    if (!ds) return '-';
    return new Date(ds).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const cardBg = theme === 'dark' ? 'bg-dark text-white' : '';
  const borderClass = theme === 'dark' ? 'border-secondary' : 'border-light';

  return (
    <>
      <div className={`card shadow-sm border-0 rounded-4 ${cardBg}`}>
        <div className={`card-header border-0 py-3 d-flex align-items-center gap-2 rounded-top-4 ${theme === 'dark' ? 'bg-dark border-bottom border-secondary' : 'bg-white'}`}>
          <Bookmark className="text-primary" size={20} />
          <h5 className="mb-0 fw-bold">Lowongan Tersimpan</h5>
          {bookmarks.length > 0 && <span className="badge bg-primary rounded-pill ms-2">{bookmarks.length}</span>}
        </div>
        <div className="card-body p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <Bookmark size={48} className="mb-3 opacity-25" />
              <p className="fw-medium">Anda belum menyimpan lowongan apa pun.</p>
              <Link to="/jobs" className="btn btn-primary mt-2 rounded-pill px-4">Cari Lowongan</Link>
            </div>
          ) : (
            <div className="row g-4">
              {bookmarks.map((bookmark) => {
                const job = bookmark.job;
                if (!job) return null;
                
                return (
                  <div className="col-12 col-md-6 col-lg-4" key={bookmark.id}>
                    <div 
                      className={`card h-100 border rounded-4 ${borderClass} ${theme === 'dark' ? 'bg-black bg-opacity-25' : 'bg-white'}`}
                      style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="rounded-3 d-flex align-items-center justify-content-center overflow-hidden border" style={{ width: 60, height: 60, background: 'var(--bg-card)' }}>
                            {job.logo ? (
                              <img src={`${STORAGE_URL}/${job.logo}`} alt="logo" className="w-100 h-100" style={{ objectFit: 'contain', padding: '5px' }} />
                            ) : (
                              <Building2 className="text-primary opacity-50" size={24} />
                            )}
                          </div>
                          <button onClick={(e) => handleRemoveBookmark(job.id, e)} className="btn btn-sm btn-outline-danger border-0 p-2 rounded-circle" title="Hapus Bookmark">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <h5 className="fw-bold mb-1 text-truncate" title={job.title}>{job.title}</h5>
                        <p className="text-primary small mb-3 text-truncate fw-medium" title={job.company}>{job.company}</p>
                        
                        <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                          <MapPin size={14} /> <span className="text-truncate">{job.location || '-'}</span>
                        </div>
                        
                        <div className="d-flex gap-2 flex-wrap mb-3">
                          {job.type && <span className="badge bg-light text-dark fw-normal border">{job.type}</span>}
                          {job.work_arrangement && <span className="badge bg-light text-dark fw-normal border">{job.work_arrangement}</span>}
                        </div>
                      </div>
                      
                      <div className={`card-footer border-top-0 p-4 pt-0 ${theme === 'dark' ? 'bg-transparent' : 'bg-white'}`}>
                        <div className="d-flex gap-2">
                          <button 
                            onClick={() => handleOpenDetail(job)} 
                            className="btn btn-outline-primary flex-grow-1 fw-medium rounded-pill d-flex align-items-center justify-content-center gap-1"
                          >
                            <Eye size={16} /> Lihat Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ──────────────────────────── */}
      {showDetailModal && (
        <>
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }} onClick={() => setShowDetailModal(false)} />
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 1051 }}>
            <div className="w-100" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="rounded-4 shadow-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {detailLoading ? (
                  <div className="text-center py-5 px-4">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3 text-muted">Memuat detail lowongan...</p>
                  </div>
                ) : selectedJob ? (
                  <>
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start p-4 pb-0">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-3 d-flex align-items-center justify-content-center overflow-hidden border flex-shrink-0" style={{ width: 70, height: 70, background: 'var(--bg-card)' }}>
                          {selectedJob.logo ? (
                            <img src={`${STORAGE_URL}/${selectedJob.logo}`} alt="logo" className="w-100 h-100" style={{ objectFit: 'contain', padding: '8px' }} />
                          ) : (
                            <Building2 className="text-primary opacity-50" size={28} />
                          )}
                        </div>
                        <div>
                          <h4 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{selectedJob.title}</h4>
                          <p className="fw-bold mb-0 text-primary">{selectedJob.company}</p>
                        </div>
                      </div>
                      <button className="btn btn-link p-1 text-muted" onClick={() => setShowDetailModal(false)}>
                        <X size={22} />
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="px-4 pt-3">
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        {selectedJob.location && (
                          <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary small fw-medium"><MapPin size={14} /> {selectedJob.location}</span>
                        )}
                        {selectedJob.type && (
                          <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary small fw-medium"><Briefcase size={14} /> {selectedJob.type}</span>
                        )}
                        {selectedJob.work_arrangement && (
                          <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary small fw-medium"><Building2 size={14} /> {selectedJob.work_arrangement}</span>
                        )}
                        {selectedJob.major && (
                          <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill border small fw-medium"><BookOpen size={14} /> {selectedJob.major.name}</span>
                        )}
                        {selectedJob.deadline && (
                          <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-danger bg-opacity-10 text-danger small fw-medium"><Calendar size={14} /> Ditutup: {formatDate(selectedJob.deadline)}</span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="px-4 mb-4">
                      <h6 className="fw-bold mb-2 d-flex align-items-center gap-2"><FileText size={16} className="text-primary" /> Deskripsi Pekerjaan</h6>
                      <div className="p-3 rounded-3 small" style={{ background: 'var(--light)', border: '1px solid var(--border)', whiteSpace: 'pre-wrap', lineHeight: '1.7', color: 'var(--text-main)' }}>
                        {selectedJob.description || 'Tidak ada deskripsi.'}
                      </div>
                    </div>

                    {/* Requirements */}
                    {selectedJob.requirements && (
                      <div className="px-4 mb-4">
                        <h6 className="fw-bold mb-2 d-flex align-items-center gap-2"><CheckCircle size={16} className="text-primary" /> Persyaratan</h6>
                        <div className="p-3 rounded-3 small" style={{ background: 'var(--light)', border: '1px solid var(--border)', whiteSpace: 'pre-wrap', lineHeight: '1.7', color: 'var(--text-main)' }}>
                          {selectedJob.requirements}
                        </div>
                      </div>
                    )}

                    {/* External link */}
                    {selectedJob.external_link && (
                      <div className="px-4 mb-4">
                        <a href={selectedJob.external_link} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm rounded-pill d-inline-flex align-items-center gap-1">
                          <ExternalLink size={14} /> Buka Link Eksternal
                        </a>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="p-4 pt-2 d-flex gap-2 flex-wrap">
                      <button 
                        onClick={() => handleApplyClick(selectedJob.id)} 
                        className="btn btn-primary flex-grow-1 fw-medium rounded-pill py-2 d-flex align-items-center justify-content-center gap-2"
                      >
                        <Send size={16} /> Lamar Pekerjaan Ini
                      </button>
                      <button 
                        onClick={(e) => handleRemoveBookmark(selectedJob.id, e)} 
                        className="btn btn-outline-danger rounded-pill py-2 d-flex align-items-center justify-content-center gap-2 px-4"
                      >
                        <Trash2 size={16} /> Hapus Bookmark
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-5 px-4">
                    <p className="text-muted">Lowongan tidak ditemukan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BookmarksPage;
