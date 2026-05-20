import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { AuthContext } from '../../../context/AuthContext';
import api, { STORAGE_URL } from '../../../services/api';
import { Users, Briefcase, CheckCircle, Clock, Edit2, Save, Mail, TrendingUp, Building2, Eye, Phone, XCircle, FileText, Globe, Download, ChevronLeft, MapPin, Calendar, User } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OverviewPage = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending_jobs: 0, active_jobs: 0, total_applicants: 0 });
  const [publishedJobs, setPublishedJobs] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);
  
  // Profile edit
  const [isEditingName, setIsEditingName] = useState(false);
  const [kaprodiName, setKaprodiName] = useState(user?.name || '');
  const [savingName, setSavingName] = useState(false);

  // Applicants Panel State
  const [applicantsJobId, setApplicantsJobId] = useState(null);
  const [applicantsJob, setApplicantsJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [expandedApplicant, setExpandedApplicant] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // Fetch avatar
    const fetchAvatar = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data.success && res.data.data.avatar) {
          setAvatarUrl(`${STORAGE_URL}/${res.data.data.avatar}`);
        }
      } catch (err) { /* silent */ }
    };
    fetchAvatar();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/kaprodi/overview');
      const data = res.data.data;
      setStats(data.stats);
      setPublishedJobs(data.published_jobs);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!kaprodiName.trim()) return;
    try {
      setSavingName(true);
      await api.post('/profile/biodata', { name: kaprodiName });
      setIsEditingName(false);
      alert('Nama berhasil diperbarui');
    } catch (error) {
      alert('Gagal memperbarui nama');
    } finally {
      setSavingName(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // UHAMKA Colors for charts
  const APPLICANTS_COLORS = ['#1A6FB5', '#F59E0B', '#10B981', '#EF4444']; // Dikirim, Interview, Diterima, Ditolak

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-3 shadow-lg ${theme === 'dark' ? 'bg-dark border border-secondary text-white' : 'bg-white border text-dark'}`}>
          <p className="mb-1 fw-bold">{payload[0].name}</p>
          <p className="mb-0 fw-medium d-flex align-items-center gap-2" style={{color: payload[0].payload.fill}}>
            <Users size={14} /> {payload[0].value} Pelamar
          </p>
        </div>
      );
    }
    return null;
  };

  // ── Applicants Functions ─────────────────────
  const openApplicantsPanel = async (job) => {
    setApplicantsJobId(job.id);
    setApplicantsJob(job);
    setApplicantsLoading(true);
    setExpandedApplicant(null);
    try {
      const res = await api.get(`/jobs/${job.id}/applications`);
      setApplicants(res.data.data.data || []);
    } catch (err) {
      console.error('Failed to fetch applicants', err);
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const closeApplicantsPanel = () => {
    setApplicantsJobId(null);
    setApplicantsJob(null);
    setApplicants([]);
    setExpandedApplicant(null);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    const labels = { interview: 'Interview', diterima: 'Diterima', ditolak: 'Ditolak' };
    if (!window.confirm(`Ubah status pelamar ke "${labels[newStatus]}"? Email akan dikirim ke pelamar.`)) return;

    setStatusUpdating(applicationId);
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      // Refresh applicants list and overview data
      if (applicantsJobId) {
        const res = await api.get(`/jobs/${applicantsJobId}/applications`);
        setApplicants(res.data.data.data || []);
        fetchDashboardData(); // update stats
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengubah status.');
    } finally {
      setStatusUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      dikirim:   { label: 'Dikirim',   cls: 'bg-info bg-opacity-10 text-info border-info' },
      interview: { label: 'Interview', cls: 'bg-warning bg-opacity-10 text-warning border-warning' },
      diterima:  { label: 'Diterima',  cls: 'bg-success bg-opacity-10 text-success border-success' },
      ditolak:   { label: 'Ditolak',   cls: 'bg-danger bg-opacity-10 text-danger border-danger' },
    };
    const c = config[status] || config.dikirim;
    return <span className={`badge ${c.cls} border border-opacity-25 px-2 py-1 rounded-pill small fw-medium`}>{c.label}</span>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // ═══════════ APPLICANTS VIEW ═══════════
  if (applicantsJobId && applicantsJob) {
    const chartData = [
      { name: 'Dikirim', value: applicantsJob.status_counts?.dikirim || 0, fill: '#1A6FB5' },
      { name: 'Interview', value: applicantsJob.status_counts?.interview || 0, fill: '#F59E0B' },
      { name: 'Diterima', value: applicantsJob.status_counts?.diterima || 0, fill: '#10B981' },
      { name: 'Ditolak', value: applicantsJob.status_counts?.ditolak || 0, fill: '#EF4444' },
    ].filter(item => item.value > 0);

    return (
      <div className="container-fluid p-0">
        <div className={`card shadow-sm border-0 rounded-4 ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
          <div className={`card-header border-0 py-3 d-flex align-items-center gap-3 rounded-top-4 ${theme === 'dark' ? 'bg-dark border-bottom border-secondary' : 'bg-white'}`}>
            <button className="btn btn-outline-primary btn-sm rounded-3 d-flex align-items-center gap-1" onClick={closeApplicantsPanel}>
              <ChevronLeft size={16} /> Kembali ke Dashboard
            </button>
            <div>
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2"><Users size={20} className="text-primary" /> Detail Pelamar Lowongan</h5>
              <small className="text-muted">{applicantsJob.title} — {applicantsJob.company}</small>
            </div>
          </div>

          <div className="card-body p-3 p-md-4">
            {/* Job Specific Chart */}
            <div className="row mb-5">
              <div className="col-12 col-md-6">
                <div className={`p-4 rounded-4 border h-100 ${theme === 'dark' ? 'border-secondary bg-black bg-opacity-25' : 'bg-light'}`}>
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
                    <CheckCircle size={18} /> Ringkasan Status Pelamar
                  </h6>
                  {chartData.length === 0 ? (
                    <div className="text-muted text-center py-4">Belum ada pelamar.</div>
                  ) : (
                    <div style={{ height: '200px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={chartData} 
                            cx="50%" cy="50%" 
                            innerRadius={40}
                            outerRadius={70} 
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={`p-4 rounded-4 border h-100 d-flex flex-column justify-content-center ${theme === 'dark' ? 'border-secondary bg-black bg-opacity-25' : 'bg-light'}`}>
                  <h6 className="fw-bold mb-4 text-primary">Statistik:</h6>
                  <div className="d-flex justify-content-between mb-2"><span>Total Pelamar:</span> <strong>{applicantsJob.applications_count}</strong></div>
                  <div className="d-flex justify-content-between mb-2 text-info"><span>Dikirim (Menunggu Review):</span> <strong>{applicantsJob.status_counts?.dikirim || 0}</strong></div>
                  <div className="d-flex justify-content-between mb-2 text-warning"><span>Interview:</span> <strong>{applicantsJob.status_counts?.interview || 0}</strong></div>
                  <div className="d-flex justify-content-between mb-2 text-success"><span>Diterima:</span> <strong>{applicantsJob.status_counts?.diterima || 0}</strong></div>
                  <div className="d-flex justify-content-between text-danger"><span>Ditolak:</span> <strong>{applicantsJob.status_counts?.ditolak || 0}</strong></div>
                </div>
              </div>
            </div>

            {/* Applicant List */}
            <h6 className="fw-bold mb-3">Daftar Mahasiswa yang Melamar:</h6>
            {applicantsLoading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <Users size={48} className="mb-3 opacity-25" />
                <p className="small mb-0">Belum ada mahasiswa yang melamar pada lowongan ini.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {applicants.map((app) => (
                  <div key={app.id} className={`rounded-4 border overflow-hidden ${theme === 'dark' ? 'border-secondary' : 'border-light'}`}>
                    <div className={`p-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 ${theme === 'dark' ? 'bg-black bg-opacity-25' : 'bg-white'}`}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden border" 
                             style={{ width: '50px', height: '50px', background: app.user?.avatar ? 'transparent' : 'var(--primary-light, #E8F0FE)', color: 'var(--primary)' }}>
                          {app.user?.avatar ? (
                            <img src={`${STORAGE_URL}/${app.user.avatar}`} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                          ) : (
                            <span className="fw-bold">{app.user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                          )}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{app.user?.name}</h6>
                          <small className="text-muted d-flex align-items-center gap-1"><Mail size={12} /> {app.user?.email}</small>
                          <small className="text-muted d-flex align-items-center gap-1"><Calendar size={12} /> Melamar: {formatDate(app.applied_at)}</small>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        {getStatusBadge(app.status)}

                        {/* Action Buttons berdasarkan status */}
                        {app.status === 'dikirim' && (
                          <>
                            <button className="btn btn-sm btn-outline-primary rounded-2 d-flex align-items-center gap-1" onClick={() => setExpandedApplicant(expandedApplicant === app.id ? null : app.id)}>
                              <Eye size={14} /> Profil
                            </button>
                            <button className="btn btn-sm btn-warning rounded-2 d-flex align-items-center gap-1 fw-medium"
                              onClick={() => handleUpdateStatus(app.id, 'interview')} disabled={statusUpdating === app.id}>
                              <Phone size={14} /> Interview
                            </button>
                            <button className="btn btn-sm btn-outline-danger rounded-2 d-flex align-items-center gap-1"
                              onClick={() => handleUpdateStatus(app.id, 'ditolak')} disabled={statusUpdating === app.id}>
                              <XCircle size={14} /> Tolak
                            </button>
                          </>
                        )}
                        {app.status === 'interview' && (
                          <>
                            <button className="btn btn-sm btn-outline-primary rounded-2 d-flex align-items-center gap-1" onClick={() => setExpandedApplicant(expandedApplicant === app.id ? null : app.id)}>
                              <Eye size={14} /> Profil
                            </button>
                            <button className="btn btn-sm btn-success rounded-2 d-flex align-items-center gap-1 fw-medium"
                              onClick={() => handleUpdateStatus(app.id, 'diterima')} disabled={statusUpdating === app.id}>
                              <CheckCircle size={14} /> Accept
                            </button>
                            <button className="btn btn-sm btn-danger rounded-2 d-flex align-items-center gap-1 fw-medium"
                              onClick={() => handleUpdateStatus(app.id, 'ditolak')} disabled={statusUpdating === app.id}>
                              <XCircle size={14} /> Reject
                            </button>
                          </>
                        )}
                        {(app.status === 'diterima' || app.status === 'ditolak') && (
                          <button className="btn btn-sm btn-outline-secondary rounded-2 d-flex align-items-center gap-1" onClick={() => setExpandedApplicant(expandedApplicant === app.id ? null : app.id)}>
                            <Eye size={14} /> Profil Lengkap
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Applicant Profile */}
                    {expandedApplicant === app.id && (
                      <div className={`p-4 border-top ${theme === 'dark' ? 'border-secondary' : 'bg-light'}`}>
                        <div className="row g-4">
                          {/* Biodata */}
                          <div className="col-md-6">
                            <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-1"><User size={16} /> Biodata Lengkap</h6>
                            <div className={`p-3 rounded-3 border ${theme === 'dark' ? 'border-secondary bg-black bg-opacity-25' : 'bg-white'}`}>
                              <table className="table table-sm table-borderless mb-0 small" style={{ '--bs-table-bg': 'transparent', '--bs-table-color': 'var(--text-main)' }}>
                                <tbody>
                                  <tr><td className="text-muted" style={{width:'35%'}}>Nama</td><td className="fw-medium">{app.user?.name}</td></tr>
                                  <tr><td className="text-muted">NIM/NIP</td><td className="fw-medium">{app.user?.nim || app.user?.nip || '-'}</td></tr>
                                  <tr><td className="text-muted">Email</td><td className="fw-medium">{app.user?.email}</td></tr>
                                  <tr><td className="text-muted">Telepon</td><td className="fw-medium">{app.user?.phone || '-'}</td></tr>
                                  <tr><td className="text-muted">Gender</td><td className="fw-medium">{app.user?.gender || '-'}</td></tr>
                                  <tr><td className="text-muted">Fakultas</td><td className="fw-medium">{app.user?.fakultas || '-'}</td></tr>
                                  <tr><td className="text-muted">Jurusan</td><td className="fw-medium">{app.user?.jurusan || '-'}</td></tr>
                                  <tr><td className="text-muted">Alamat Asal</td><td className="fw-medium">{app.user?.address || '-'}</td></tr>
                                  <tr><td className="text-muted">Domisili</td><td className="fw-medium">{app.user?.domicile_address || '-'}</td></tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Documents */}
                          <div className="col-md-6">
                            <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-1"><FileText size={16} /> Dokumen Pendukung</h6>
                            {app.user?.documents?.length > 0 ? (
                              <div className="d-flex flex-column gap-2">
                                {app.user.documents.map((doc) => (
                                  <div key={doc.id} className={`p-2 px-3 rounded-3 border d-flex justify-content-between align-items-center ${theme === 'dark' ? 'border-secondary bg-black bg-opacity-25' : 'bg-white'}`}>
                                    <div>
                                      <span className="badge bg-primary bg-opacity-10 text-primary me-2 px-2 py-1 rounded-pill small text-capitalize">{doc.type}</span>
                                      <span className="small">{doc.description || 'Dokumen'}</span>
                                    </div>
                                    {doc.file_path && (
                                      <a href={`${STORAGE_URL}/${doc.file_path}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary rounded-2 d-flex align-items-center gap-1">
                                        <Download size={13} /> Unduh
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className={`p-3 rounded-3 border text-center text-muted small ${theme === 'dark' ? 'border-secondary' : 'bg-white'}`}>
                                Belum ada dokumen yang diunggah.
                              </div>
                            )}

                            {/* Languages */}
                            {app.user?.languages?.length > 0 && (
                              <div className="mt-3">
                                <h6 className="fw-bold text-primary mb-2 d-flex align-items-center gap-1"><Globe size={16} /> Kemampuan Bahasa</h6>
                                <div className="d-flex flex-wrap gap-2">
                                  {app.user.languages.map((lang) => (
                                    <span key={lang.id} className={`badge bg-secondary bg-opacity-10 text-secondary border px-2 py-1 rounded-pill small`}>
                                      {lang.language} — {lang.proficiency}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ MAIN DASHBOARD VIEW ═══════════
  return (
    <div className="container-fluid p-0">
      {/* Welcome Banner — Green Theme */}
      <div className="rounded-4 mb-4 overflow-hidden position-relative shadow-sm" style={{ border: '1px solid var(--border)' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
          zIndex: 0 
        }}></div>
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            zIndex: 1
        }}></div>
        
        <div className="position-relative p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 text-white" style={{ zIndex: 2 }}>
          <div className="d-flex align-items-center gap-4">
            <div className="rounded-circle d-flex align-items-center justify-content-center shadow-lg overflow-hidden flex-shrink-0" style={{ width: 80, height: 80, background: '#fff', border: '4px solid rgba(255,255,255,0.25)' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-100 h-100" style={{ objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--primary)' }}>{kaprodiName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h6 className="mb-1 fw-medium" style={{ opacity: 0.7, letterSpacing: '1px', fontSize: '0.75rem' }}>SELAMAT DATANG DI ALUMNIHUB</h6>
              {isEditingName ? (
                <div className="d-flex gap-2 align-items-center mt-2">
                  <input 
                    type="text" className="form-control form-control-sm bg-white border-0 text-dark" 
                    value={kaprodiName} onChange={e => setKaprodiName(e.target.value)} placeholder="Nama Kaprodi" style={{ width: '250px' }}
                  />
                  <button onClick={handleSaveName} disabled={savingName} className="btn btn-sm btn-success d-flex align-items-center gap-1 shadow-sm">
                    <Save size={14} /> Simpan
                  </button>
                  <button onClick={() => setIsEditingName(false)} className="btn btn-sm btn-light text-dark shadow-sm">Batal</button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  <h2 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}>{kaprodiName}</h2>
                  <button onClick={() => setIsEditingName(true)} className="btn btn-sm rounded-circle btn-outline-light p-2 border-0" title="Edit Nama">
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
              <div className="d-flex align-items-center gap-2 mt-2 small" style={{ opacity: 0.7 }}>
                <span className="badge bg-warning text-dark px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1"><Building2 size={12} /> Kaprodi</span>
                <span className="d-flex align-items-center gap-1"><Mail size={14} /> {user?.email}</span>
              </div>
            </div>
          </div>
          <div className="text-md-end">
            <p className="mb-0 small" style={{ opacity: 0.6 }}>Sistem Informasi Lowongan Kerja</p>
            <p className="mb-0 fw-medium">Universitas Muhammadiyah Prof. DR. HAMKA</p>
          </div>
        </div>
      </div>

      {/* Ringkasan Stats */}
      <div className="row g-4 mb-4">
        {/* Pending Jobs */}
        <div className="col-12 col-md-4">
          <div className="h-100 rounded-4 shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="p-4 position-relative overflow-hidden">
              <div className="position-absolute end-0 bottom-0 opacity-5" style={{ transform: 'translate(15%, 15%)' }}>
                <Clock size={60} />
              </div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="p-3 rounded-4" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}><Clock size={24} strokeWidth={2.5} /></div>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{stats.pending_jobs}</h3>
              <p className="fw-medium mb-0" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Menunggu Approval</p>
            </div>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="col-12 col-md-4">
          <div className="h-100 rounded-4 shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="p-4 position-relative overflow-hidden">
              <div className="position-absolute end-0 bottom-0 opacity-5" style={{ transform: 'translate(15%, 15%)' }}>
                <CheckCircle size={60} />
              </div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="p-3 rounded-4" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}><CheckCircle size={24} strokeWidth={2.5} /></div>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{stats.active_jobs}</h3>
              <p className="fw-medium mb-0" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lowongan Aktif</p>
            </div>
          </div>
        </div>

        {/* Total Applicants */}
        <div className="col-12 col-md-4">
          <div className="h-100 rounded-4 shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="p-4 position-relative overflow-hidden">
              <div className="position-absolute end-0 bottom-0 opacity-5" style={{ transform: 'translate(15%, 15%)' }}>
                <Users size={60} />
              </div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="p-3 rounded-4" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}><TrendingUp size={24} strokeWidth={2.5} /></div>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{stats.total_applicants}</h3>
              <p className="fw-medium mb-0" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Pelamar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Lowongan Aktif & Jumlah Pelamar */}
      <div className="rounded-4 shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="py-4 px-4">
          <h5 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <Briefcase size={20} style={{ color: 'var(--primary)' }} /> Daftar Lowongan Aktif
          </h5>
          <p className="small mb-0 mt-1" style={{ color: 'var(--text-muted)' }}>Pantau lowongan yang sedang aktif dan lihat siapa saja yang mendaftar.</p>
        </div>
        <div className="p-0">
          <div className="table-responsive">
            <table className="table mb-0 align-middle table-hover" style={{ '--bs-table-bg': 'transparent', '--bs-table-color': 'var(--text-main)', '--bs-table-hover-bg': 'var(--light)' }}>
              <thead style={{ background: 'var(--light)' }}>
                <tr>
                  <th className="ps-4 py-3 border-bottom-0" style={{width: '40%', color: 'var(--text-muted)', fontSize: '0.8rem'}}>Lowongan & Perusahaan</th>
                  <th className="text-center py-3 border-bottom-0" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Status Pelamar</th>
                  <th className="text-end pe-4 py-3 border-bottom-0" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {publishedJobs.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
                      <div className="d-flex flex-column align-items-center">
                        <Briefcase size={48} className="mb-3 opacity-25" />
                        <p className="mb-0">Belum ada lowongan yang dipublikasikan.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  publishedJobs.map(job => (
                    <tr key={job.id}>
                      <td className="ps-4 py-3 border-bottom fw-medium" style={{ color: 'var(--text-main)' }}>
                        <div className="d-flex align-items-center gap-3">
                           <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden" style={{ width: 50, height: 50, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                             {job.logo ? (
                               <img src={`${STORAGE_URL}/${job.logo}`} alt="logo" className="w-100 h-100" style={{ objectFit: 'contain', padding: '4px' }} />
                             ) : (
                               <Building2 size={24} style={{ color: 'var(--primary)', opacity: 0.5 }} />
                             )}
                           </div>
                           <div>
                             <h6 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{job.title}</h6>
                             <small style={{ color: 'var(--primary)' }}>{job.company}</small>
                           </div>
                        </div>
                      </td>
                      <td className="py-3 border-bottom text-center">
                        {job.applications_count > 0 ? (
                          <div className="d-flex flex-column align-items-center justify-content-center gap-1">
                            <span className="badge rounded-pill px-3 py-2 fw-bold" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                              {job.applications_count} Total Pelamar
                            </span>
                          </div>
                        ) : (
                          <span className="small" style={{ color: 'var(--text-muted)' }}>Belum ada pelamar</span>
                        )}
                      </td>
                      <td className="text-end pe-4 py-3 border-bottom">
                        <button 
                          className="btn btn-outline-primary rounded-3 d-inline-flex align-items-center gap-2 fw-medium px-4"
                          onClick={() => openApplicantsPanel(job)}
                        >
                          <Users size={16} /> Lihat Pelamar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
