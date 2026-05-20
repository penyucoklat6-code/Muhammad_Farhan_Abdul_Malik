import React, { useState, useEffect, useContext } from 'react';
import { Search, MapPin, Briefcase, Calendar, Building2, Eye, Send, X, CheckCircle, FileText, BookOpen, Award, Globe, AlertTriangle, Loader2, Bookmark } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api, { STORAGE_URL } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const JobsPage = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
  const [majors, setMajors] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyJob, setApplyJob] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyResult, setApplyResult] = useState(null);

  useEffect(() => {
    fetchJobs();
    if (user && user.role === 'mahasiswa') fetchBookmarks();
    // Fetch majors for filter
    const fetchMajors = async () => {
      try { const res = await api.get('/majors'); setMajors(res.data.data || res.data || []); }
      catch (err) { console.error('Failed to fetch majors', err); }
    };
    fetchMajors();
  }, [user]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs', { params: { keyword: keyword || undefined } });
      if (res.data.success) setJobs(res.data.data.data || []);
    } catch (error) { console.error('Failed to fetch jobs', error); }
    finally { setLoading(false); setIsSearching(false); }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/bookmarks');
      if (res.data.success) { const marks = res.data.data.data || []; setBookmarkedJobIds(marks.map(b => b.job_id)); }
    } catch (err) { console.error('Failed to fetch bookmarks', err); }
  };

  const handleSearch = (e) => { e.preventDefault(); setIsSearching(true); fetchJobs(); };
  const formatDate = (ds) => { if (!ds) return '-'; return new Date(ds).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); };

  const handleToggleBookmark = async (jobId, e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'mahasiswa') { alert('Hanya mahasiswa yang dapat menyimpan lowongan.'); return; }
    const isBookmarked = bookmarkedJobIds.includes(jobId);
    try {
      if (isBookmarked) { await api.delete(`/bookmarks/${jobId}`); setBookmarkedJobIds(prev => prev.filter(id => id !== jobId)); }
      else { await api.post(`/bookmarks/${jobId}`); setBookmarkedJobIds(prev => [...prev, jobId]); }
    } catch (err) { console.error('Failed to toggle bookmark', err); alert(err.response?.data?.message || 'Gagal menyimpan lowongan.'); }
  };

  const handleOpenDetail = (job) => { setSelectedJob(job); setShowDetailModal(true); };

  const handleApplyClick = async (job) => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'mahasiswa') { alert('Hanya mahasiswa yang dapat melamar pekerjaan.'); return; }
    setApplyJob(job); setApplyResult(null); setShowApplyModal(true); setShowDetailModal(false);
    setProfileLoading(true);
    try { const res = await api.get('/profile'); if (res.data.success) setProfileData(res.data.data); }
    catch (err) { console.error('Failed to fetch profile', err); }
    finally { setProfileLoading(false); }
  };

  const handleConfirmApply = async () => {
    if (!applyJob) return;
    setApplyLoading(true); setApplyResult(null);
    try { const res = await api.post(`/applications/${applyJob.id}`); setApplyResult({ success: true, message: res.data.message || 'Lamaran berhasil dikirim!' }); }
    catch (err) { setApplyResult({ success: false, message: err.response?.data?.message || 'Gagal mengirim lamaran.' }); }
    finally { setApplyLoading(false); }
  };

  const closeApplyModal = () => { setShowApplyModal(false); setApplyJob(null); setProfileData(null); setApplyResult(null); };
  const getDocsByType = (type) => { if (!profileData?.documents) return []; return profileData.documents.filter(d => d.type === type); };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    if (typeFilter && job.type !== typeFilter) return false;
    if (locationFilter && job.location && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    if (majorFilter && String(job.major_id) !== String(majorFilter)) return false;
    return true;
  });

  const selectStyle = { flex: '0 0 auto', width: 'auto', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-main)', backgroundColor: 'var(--bg-card)', padding: '8px 32px 8px 12px' };

  return (
    <div style={{ padding: '0 8px' }}>
      {/* Header */}
      <h2 className="fw-bold mb-4" style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: 'var(--text-main)' }}>
        Temukan Lowongan yang Sesuai
      </h2>

      {/* Search + Filters — all inline horizontal */}
      <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
        <form onSubmit={handleSearch} className="d-flex align-items-center" style={{
          flex: '1 1 220px', maxWidth: '300px',
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: '4px 4px 4px 16px',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)'
        }}>
          <input type="text" placeholder="Cari lowongan..." value={keyword} onChange={(e) => setKeyword(e.target.value)}
            className="border-0 shadow-none flex-grow-1" style={{ background: 'transparent', outline: 'none', fontSize: '0.85rem', color: 'var(--text-main)', padding: '8px 0' }} />
          <button type="submit" className="btn d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <Search size={15} />
          </button>
        </form>

        <select className="form-select form-select-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={selectStyle}>
          <option value="">Semua Jenis</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Magang</option>
          <option value="contract">Contract</option>
          <option value="freelance">Freelance</option>
        </select>

        <input type="text" placeholder="Lokasi..." value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
          className="form-control form-control-sm" style={{ ...selectStyle, width: '140px', padding: '8px 12px' }} />

        <select className="form-select form-select-sm" value={majorFilter} onChange={(e) => setMajorFilter(e.target.value)} style={selectStyle}>
          <option value="">Semua Jurusan</option>
          {Array.isArray(majors) && majors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {/* Jobs Grid */}
      <div className="row g-3">
        {loading ? (
          <div className="col-12 text-center py-5"><div className="spinner-border" style={{ color: 'var(--primary)' }} role="status"><span className="visually-hidden">Loading...</span></div></div>
        ) : filteredJobs.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="p-5 rounded-4" style={{ border: '2px dashed var(--border)', background: 'var(--bg-card)' }}>
              <Briefcase size={48} style={{ color: 'var(--text-muted)', opacity: 0.25 }} className="mb-3" />
              <h5 className="fw-bold" style={{ color: 'var(--text-muted)' }}>Belum ada lowongan</h5>
              <p style={{ color: 'var(--text-muted)' }} className="mb-0">Tidak ditemukan lowongan yang sesuai dengan filter Anda.</p>
            </div>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isBookmarked = bookmarkedJobIds.includes(job.id);
            return (
              <div className="col-md-6" key={job.id}>
                <div className="h-100 d-flex flex-column position-relative" style={{
                  background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)', transition: 'all 0.25s ease', overflow: 'hidden'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Bookmark */}
                  <button className="btn btn-link position-absolute top-0 end-0 p-3 text-decoration-none" style={{ zIndex: 10, color: isBookmarked ? '#F59E0B' : '#9CA3AF' }}
                    onClick={(e) => handleToggleBookmark(job.id, e)} title={isBookmarked ? 'Hapus Bookmark' : 'Simpan Lowongan'}>
                    <Bookmark size={20} fill={isBookmarked ? '#F59E0B' : 'none'} strokeWidth={isBookmarked ? 1 : 2} />
                  </button>

                  <div className="p-4 flex-grow-1">
                    <h6 className="fw-bold mb-1 pe-4" style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{job.title} — {job.company}</h6>
                    {job.major && <p className="mb-1" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>{job.major.name}</p>}
                    <div className="d-flex flex-wrap align-items-center gap-3 mb-2" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span className="d-flex align-items-center gap-1"><MapPin size={14} /> {job.location || '-'}</span>
                      <span className="d-flex align-items-center gap-1"><Calendar size={14} /> {job.deadline ? formatDate(job.deadline) : formatDate(job.created_at)}</span>
                      {job.work_arrangement && <span className="badge rounded-pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 600 }}>{job.work_arrangement}</span>}
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {job.status === 'approved' && (
                        <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                          <CheckCircle size={14} /> Disetujui Kaprodi
                        </span>
                      )}
                      <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <Building2 size={14} /> {job.user?.role === 'kaprodi' ? 'Kaprodi' : 'Mahasiswa'}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex gap-2 p-4 pt-0">
                    <button onClick={() => handleOpenDetail(job)} className="btn flex-grow-1 py-2 fw-medium d-flex align-items-center justify-content-center gap-1"
                      style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-main)', backgroundColor: 'var(--bg-card)' }}>
                      Lihat Detail
                    </button>
                    <button onClick={() => handleApplyClick(job)} className="btn flex-grow-1 py-2 fw-medium d-flex align-items-center justify-content-center gap-1"
                      style={{ borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#fff', backgroundColor: 'var(--primary)', border: 'none' }}>
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedJob && (
        <>
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }} onClick={() => setShowDetailModal(false)} />
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1051 }}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable m-3" style={{ maxHeight: '90vh' }}>
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 'var(--radius-xl)', background: 'var(--bg-card)' }}>
                <div className="modal-header border-0 pb-0">
                  <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)} />
                </div>
                <div className="modal-body p-4 pt-0">
                  <div className="row">
                    <div className="col-md-auto mb-4 mb-md-0 text-center text-md-start">
                      <div className="rounded-4 d-flex align-items-center justify-content-center overflow-hidden border mx-auto mx-md-0" style={{ width: '130px', height: '130px', background: 'var(--bg-card)' }}>
                        {selectedJob.logo ? (
                          <img src={`${STORAGE_URL}/${selectedJob.logo}`} alt="logo" className="w-100 h-100" style={{ objectFit: 'contain', padding: '15px' }} />
                        ) : (
                          <Building2 size={56} style={{ color: 'var(--primary)', opacity: 0.25 }} />
                        )}
                      </div>
                    </div>
                    <div className="col-md ps-md-4">
                      <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{selectedJob.title}</h2>
                      <h5 className="fw-bold mb-3" style={{ color: 'var(--primary)' }}>{selectedJob.company}</h5>
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill" style={{ fontSize: '0.8rem', background: 'var(--primary-light)', color: 'var(--primary)' }}><MapPin size={14} /> {selectedJob.location}</span>
                        <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill" style={{ fontSize: '0.8rem', background: 'var(--primary-light)', color: 'var(--primary)' }}><Briefcase size={14} /> {selectedJob.type}</span>
                        {selectedJob.work_arrangement && (
                          <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill" style={{ fontSize: '0.8rem', background: 'var(--primary-light)', color: 'var(--primary)' }}><Building2 size={14} /> {selectedJob.work_arrangement}</span>
                        )}
                        {selectedJob.major && (
                          <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill" style={{ fontSize: '0.8rem', background: 'var(--light)', color: 'var(--text-main)', border: '1px solid var(--border)' }}><BookOpen size={14} /> {selectedJob.major.name}</span>
                        )}
                        {selectedJob.deadline && (
                          <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill" style={{ fontSize: '0.8rem', background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}><Calendar size={14} /> {formatDate(selectedJob.deadline)}</span>
                        )}
                      </div>
                      <div className="mb-4">
                        <h6 className="fw-bold mb-2" style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Deskripsi Pekerjaan</h6>
                        <p style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{selectedJob.description || 'Tidak ada deskripsi.'}</p>
                      </div>
                      <div className="mb-4">
                        <h6 className="fw-bold mb-2" style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Persyaratan</h6>
                        <p style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{selectedJob.requirements || 'Tidak ada persyaratan.'}</p>
                      </div>
                      <div className="d-flex gap-2 justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                        <button className="btn px-4" style={{ borderRadius: 'var(--radius-sm)', background: 'var(--light)', color: 'var(--text-main)' }} onClick={() => setShowDetailModal(false)}>Tutup</button>
                        <button className="btn btn-primary px-5 fw-bold d-flex align-items-center gap-2" onClick={() => handleApplyClick(selectedJob)}>
                          <Send size={16} /> Lamar Sekarang
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Apply Modal */}
      {showApplyModal && applyJob && (
        <>
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1055 }} onClick={closeApplyModal} />
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1056 }}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable m-3" style={{ maxHeight: '90vh' }}>
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 'var(--radius-xl)', background: 'var(--bg-card)' }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold d-flex align-items-center gap-2"><Send size={20} style={{ color: 'var(--primary)' }} /> Konfirmasi Lamaran</h5>
                  <button type="button" className="btn-close" onClick={closeApplyModal} />
                </div>
                <div className="modal-body p-4">
                  {applyResult && (
                    <div className={`alert ${applyResult.success ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-2 rounded-3`}>
                      {applyResult.success ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                      <div><strong>{applyResult.success ? 'Berhasil!' : 'Gagal'}</strong><p className="mb-0 small">{applyResult.message}</p></div>
                    </div>
                  )}
                  {!applyResult && (
                    <>
                      <div className="p-3 rounded-3 border mb-4" style={{ background: 'var(--light)' }}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-2 d-flex align-items-center justify-content-center overflow-hidden border" style={{ width: '50px', height: '50px', background: 'var(--bg-card)', flexShrink: 0 }}>
                            {applyJob.logo ? <img src={`${STORAGE_URL}/${applyJob.logo}`} alt="" className="w-100 h-100" style={{ objectFit: 'contain', padding: '5px' }} /> : <Building2 size={24} style={{ color: 'var(--primary)', opacity: 0.25 }} />}
                          </div>
                          <div><h6 className="fw-bold mb-0">{applyJob.title}</h6><small className="fw-bold" style={{ color: 'var(--primary)' }}>{applyJob.company}</small><span className="ms-2 small" style={{ color: 'var(--text-muted)' }}>— {applyJob.location}</span></div>
                        </div>
                      </div>
                      {profileLoading ? (
                        <div className="text-center py-4"><div className="spinner-border mb-2" style={{ color: 'var(--primary)' }} /><p className="small" style={{ color: 'var(--text-muted)' }}>Memuat data profil Anda...</p></div>
                      ) : profileData ? (
                        <div>
                          <p className="small mb-3" style={{ color: 'var(--text-muted)' }}>Data berikut akan dikirim bersama lamaran Anda:</p>
                          <div className="p-3 rounded-3 border mb-3">
                            <h6 className="fw-bold small mb-2 d-flex align-items-center gap-1" style={{ color: 'var(--primary)' }}><FileText size={14} /> Biodata</h6>
                            <div className="row small">
                              <div className="col-6"><strong>Nama:</strong> {profileData.name}</div>
                              <div className="col-6"><strong>Email:</strong> {profileData.email}</div>
                              <div className="col-6 mt-1"><strong>Telepon:</strong> {profileData.phone || '-'}</div>
                              <div className="col-6 mt-1"><strong>Fakultas:</strong> {profileData.fakultas || '-'}</div>
                              <div className="col-6 mt-1"><strong>Jurusan:</strong> {profileData.jurusan || '-'}</div>
                            </div>
                          </div>
                          {[
                            { type: 'cv', label: 'CV / Resume', icon: <FileText size={14} /> },
                            { type: 'pendidikan', label: 'Pendidikan', icon: <BookOpen size={14} /> },
                            { type: 'pelatihan', label: 'Pelatihan', icon: <Briefcase size={14} /> },
                            { type: 'sertifikasi', label: 'Sertifikasi', icon: <Award size={14} /> },
                            { type: 'pengalaman', label: 'Pengalaman Kerja', icon: <Briefcase size={14} /> },
                            { type: 'keterampilan', label: 'Ketrampilan', icon: <Award size={14} /> },
                          ].map(({ type, label, icon }) => {
                            const docs = getDocsByType(type);
                            return (
                              <div key={type} className="p-2 px-3 rounded-3 border mb-2 d-flex justify-content-between align-items-center">
                                <span className="small d-flex align-items-center gap-1">{icon} {label}</span>
                                {docs.length > 0 ? <span className="badge rounded-pill small" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '4px 10px' }}>{docs.length} dokumen</span>
                                : <span className="badge rounded-pill small" style={{ background: 'rgba(156,163,175,0.1)', color: 'var(--text-muted)', padding: '4px 10px' }}>Belum ada</span>}
                              </div>
                            );
                          })}
                          <div className="p-2 px-3 rounded-3 border mb-3 d-flex justify-content-between align-items-center">
                            <span className="small d-flex align-items-center gap-1"><Globe size={14} /> Bahasa</span>
                            {profileData.languages?.length > 0 ? <span className="badge rounded-pill small" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '4px 10px' }}>{profileData.languages.length} bahasa</span>
                            : <span className="badge rounded-pill small" style={{ background: 'rgba(156,163,175,0.1)', color: 'var(--text-muted)', padding: '4px 10px' }}>Belum ada</span>}
                          </div>
                          {getDocsByType('cv').length === 0 && (
                            <div className="alert alert-warning py-2 rounded-3 d-flex align-items-center gap-2 small">
                              <AlertTriangle size={16} /><span>Anda belum mengunggah CV. Sebaiknya lengkapi profil terlebih dahulu di <Link to="/dashboard/profile" className="fw-bold">halaman profil</Link>.</span>
                            </div>
                          )}
                          <div className="alert py-2 rounded-3 small" style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(45,90,61,0.15)' }}>
                            💡 Klik <strong>"Kirim Lamaran"</strong> untuk mengirim data profil Anda ke perusahaan.
                          </div>
                        </div>
                      ) : (<div className="alert alert-danger">Gagal memuat data profil.</div>)}
                    </>
                  )}
                </div>
                <div className="modal-footer border-0">
                  {applyResult?.success ? (
                    <button className="btn btn-primary px-4 fw-medium" style={{ borderRadius: 'var(--radius-sm)' }} onClick={closeApplyModal}>Selesai</button>
                  ) : (
                    <>
                      <button className="btn px-4" style={{ borderRadius: 'var(--radius-sm)', background: 'var(--light)' }} onClick={closeApplyModal}>Batal</button>
                      <button className="btn btn-primary px-4 fw-medium d-flex align-items-center gap-2" onClick={handleConfirmApply} disabled={applyLoading || profileLoading || applyResult}>
                        {applyLoading ? (<><Loader2 size={16} className="spinner-border spinner-border-sm" /> Mengirim...</>) : (<><Send size={16} /> Kirim Lamaran</>)}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JobsPage;
