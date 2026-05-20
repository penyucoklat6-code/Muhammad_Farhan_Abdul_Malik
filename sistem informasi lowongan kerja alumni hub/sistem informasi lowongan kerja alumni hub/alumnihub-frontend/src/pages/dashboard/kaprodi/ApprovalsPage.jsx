import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import api, { STORAGE_URL } from '../../../services/api';
import { CheckCircle, XCircle, RefreshCw, Eye, Building2, MapPin, Calendar, Briefcase, MessageSquare, X } from 'lucide-react';

const ApprovalsPage = () => {
  const { theme } = useContext(ThemeContext);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingId, setViewingId] = useState(null);
  
  // Modal for reject/revision reason
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonAction, setReasonAction] = useState(''); // 'rejected' or 'revision'
  const [reasonJobId, setReasonJobId] = useState(null);
  const [reasonJobTitle, setReasonJobTitle] = useState('');
  const [reasonText, setReasonText] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reviews/pending');
      setPendingJobs(response.data.data.data);
    } catch (error) {
      console.error('Failed to fetch pending jobs', error);
    } finally {
      setLoading(false);
    }
  };

  // Approve — langsung tanpa alasan
  const handleApprove = async (jobId) => {
    if (!window.confirm('Yakin ingin menyetujui dan mempublikasikan lowongan ini?')) return;
    setProcessing(true);
    try {
      await api.post(`/reviews/${jobId}`, { status: 'approve', reason: '' });
      fetchPendingJobs();
    } catch (error) {
      alert('Gagal menyetujui lowongan: ' + (error.response?.data?.message || 'Error'));
    } finally {
      setProcessing(false);
    }
  };

  // Reject / Revision — butuh alasan (modal)
  const openReasonModal = (jobId, jobTitle, action) => {
    setReasonJobId(jobId);
    setReasonJobTitle(jobTitle);
    setReasonAction(action);
    setReasonText('');
    setShowReasonModal(true);
  };

  const handleSubmitReason = async () => {
    if (!reasonText.trim()) {
      alert('Alasan wajib diisi untuk menolak atau meminta revisi.');
      return;
    }
    setProcessing(true);
    try {
      await api.post(`/reviews/${reasonJobId}`, { status: reasonAction, reason: reasonText });
      setShowReasonModal(false);
      fetchPendingJobs();
    } catch (error) {
      alert('Gagal memproses review: ' + (error.response?.data?.message || 'Error'));
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const cardClass = theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white';
  const inputClass = theme === 'dark' ? 'bg-dark text-white border-secondary' : '';

  return (
    <div className={`card shadow-sm border-0 rounded-4 ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
      <div className={`card-header border-0 py-3 d-flex justify-content-between align-items-center rounded-top-4 ${theme === 'dark' ? 'bg-dark border-bottom border-secondary' : 'bg-white'}`}>
        <div>
          <h5 className="mb-1 fw-bold d-flex align-items-center gap-2"><CheckCircle size={20} className="text-success" /> Persetujuan Lowongan</h5>
          <p className="text-muted small mb-0">Lowongan dari mahasiswa yang menunggu review Kaprodi.</p>
        </div>
      </div>
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        ) : pendingJobs.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <CheckCircle size={48} className="mb-3 text-success opacity-25" />
            <h6 className="fw-bold">Semua Beres!</h6>
            <p className="mb-0">Tidak ada lowongan yang menunggu persetujuan saat ini.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${theme === 'dark' ? 'table-dark' : ''}`}>
              <thead>
                <tr className={theme === 'dark' ? '' : 'table-light'}>
                  <th className="ps-4">Lowongan</th>
                  <th>Pengirim</th>
                  <th>Tanggal</th>
                  <th className="text-center pe-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingJobs.map((job) => (
                  <React.Fragment key={job.id}>
                    <tr>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden bg-white border" 
                               style={{ width: '40px', height: '40px' }}>
                            {job.logo ? (
                              <img src={`${STORAGE_URL}/${job.logo}`} alt="" className="w-100 h-100" style={{ objectFit: 'contain', padding: '2px' }} />
                            ) : (
                              <Building2 size={18} className="text-primary" />
                            )}
                          </div>
                          <div>
                            <div className="fw-bold">{job.title}</div>
                            <small className="text-muted">{job.company}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="fw-medium">{job.user?.name}</span>
                        <br />
                        <small className="text-muted">{job.user?.email}</small>
                      </td>
                      <td className="text-muted small">{formatDate(job.created_at)}</td>
                      <td className="text-center pe-4">
                        <div className="d-flex gap-1 justify-content-center flex-wrap">
                          <button 
                            onClick={() => setViewingId(viewingId === job.id ? null : job.id)}
                            className={`btn btn-sm ${viewingId === job.id ? 'btn-primary' : 'btn-outline-info'} d-flex align-items-center gap-1 rounded-2`}
                            title="Lihat Detail"
                          >
                            <Eye size={14} /> Detail
                          </button>
                          <button 
                            onClick={() => handleApprove(job.id)} 
                            className="btn btn-sm btn-success d-flex align-items-center gap-1 rounded-2" 
                            disabled={processing}
                            title="Langsung Setujui"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button 
                            onClick={() => openReasonModal(job.id, job.title, 'revision')} 
                            className="btn btn-sm btn-warning d-flex align-items-center gap-1 rounded-2"
                            title="Minta Revisi"
                          >
                            <RefreshCw size={14} /> Revisi
                          </button>
                          <button 
                            onClick={() => openReasonModal(job.id, job.title, 'rejected')} 
                            className="btn btn-sm btn-danger d-flex align-items-center gap-1 rounded-2"
                            title="Tolak"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline Detail Panel */}
                    {viewingId === job.id && (
                      <tr>
                        <td colSpan="4" className="p-0 border-0">
                          <div className={`p-4 m-3 rounded-4 border shadow-sm ${theme === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-light border-light'}`}>
                            <div className="d-flex flex-column flex-md-row gap-4">
                              <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden bg-white border" 
                                   style={{ width: '100px', height: '100px' }}>
                                {job.logo ? (
                                  <img src={`${STORAGE_URL}/${job.logo}`} alt="" className="w-100 h-100" style={{ objectFit: 'contain', padding: '10px' }} />
                                ) : (
                                  <Building2 size={40} className="text-primary opacity-25" />
                                )}
                              </div>
                              <div className="flex-grow-1">
                                <h4 className="fw-bold mb-1">{job.title}</h4>
                                <h6 className="text-primary fw-bold mb-3">{job.company}</h6>
                                
                                <div className="d-flex flex-wrap gap-3 text-muted small mb-4">
                                  <span className="d-flex align-items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                  <span className="d-flex align-items-center gap-1"><Briefcase size={14} /> {job.type}</span>
                                  <span className="d-flex align-items-center gap-1"><Calendar size={14} /> Deadline: {formatDate(job.deadline)}</span>
                                </div>

                                <div className="row">
                                  <div className="col-md-6 mb-3">
                                    <h6 className="fw-bold text-primary border-bottom pb-2">Deskripsi Pekerjaan</h6>
                                    <p className="small mb-0 lh-lg" style={{ whiteSpace: 'pre-line' }}>{job.description || 'Tidak ada deskripsi.'}</p>
                                  </div>
                                  <div className="col-md-6">
                                    <h6 className="fw-bold text-primary border-bottom pb-2">Persyaratan</h6>
                                    <p className="small mb-0 lh-lg" style={{ whiteSpace: 'pre-line' }}>{job.requirements || 'Tidak ada persyaratan spesifik.'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reason Modal — hanya untuk Reject / Revisi */}
      {showReasonModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className={`modal-content rounded-4 border-0 shadow-lg ${theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}`}>
                <div className={`modal-header border-0 pb-0 ${theme === 'dark' ? 'border-secondary' : ''}`}>
                  <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                    {reasonAction === 'rejected' ? (
                      <><XCircle size={20} className="text-danger" /> Tolak Lowongan</>
                    ) : (
                      <><RefreshCw size={20} className="text-warning" /> Minta Revisi</>
                    )}
                  </h5>
                  <button type="button" className={`btn-close ${theme === 'dark' ? 'btn-close-white' : ''}`} onClick={() => setShowReasonModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="text-muted small mb-3">
                    Lowongan: <strong className={theme === 'dark' ? 'text-white' : 'text-dark'}>{reasonJobTitle}</strong>
                  </p>
                  <label className={`form-label fw-medium small ${theme === 'dark' ? 'text-light' : ''}`}>
                    <MessageSquare size={14} className="me-1" />
                    Alasan {reasonAction === 'rejected' ? 'Penolakan' : 'Revisi'} <span className="text-danger">*</span>
                  </label>
                  <textarea 
                    className={`form-control ${inputClass}`}
                    rows="4"
                    value={reasonText}
                    onChange={(e) => setReasonText(e.target.value)}
                    placeholder={reasonAction === 'rejected' 
                      ? 'Jelaskan mengapa lowongan ini ditolak...' 
                      : 'Jelaskan apa yang harus diperbaiki mahasiswa...'}
                  ></textarea>
                  <small className="text-muted">Alasan ini akan dikirim ke mahasiswa agar dapat memahami keputusan Anda.</small>
                </div>
                <div className={`modal-footer border-0 ${theme === 'dark' ? 'border-secondary' : ''}`}>
                  <button className="btn btn-light rounded-3" onClick={() => setShowReasonModal(false)}>Batal</button>
                  <button 
                    className={`btn rounded-3 fw-medium ${reasonAction === 'rejected' ? 'btn-danger' : 'btn-warning'}`}
                    onClick={handleSubmitReason}
                    disabled={processing || !reasonText.trim()}
                  >
                    {processing ? 'Memproses...' : (reasonAction === 'rejected' ? 'Tolak Lowongan' : 'Kirim Revisi')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApprovalsPage;
