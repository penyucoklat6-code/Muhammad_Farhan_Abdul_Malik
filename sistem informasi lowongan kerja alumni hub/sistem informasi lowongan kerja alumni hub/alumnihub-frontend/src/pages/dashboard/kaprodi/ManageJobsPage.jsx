import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { AuthContext } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import api, { STORAGE_URL } from '../../../services/api';
import { Plus, Edit, Trash2, Briefcase, Eye, Building2, MapPin, Calendar, GraduationCap } from 'lucide-react';

const ManageJobsPage = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingId, setViewingId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews/all-jobs', { params: { status: 'published' } });
      setJobs(res.data.data.data || []);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus lowongan "${title}"?`)) {
      try {
        await api.delete(`/jobs/${id}`);
        fetchJobs();
      } catch (error) {
        alert('Gagal menghapus lowongan: ' + (error.response?.data?.message || 'Error'));
      }
    }
  };

  const isOwnJob = (job) => job.user?.id === user?.id;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const cardClass = theme === 'dark' ? 'bg-dark text-white border-secondary' : '';

  return (
    <div className={`card shadow-sm border-0 rounded-4 ${cardClass}`}>
      <div className={`card-header border-0 py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 rounded-top-4 ${theme === 'dark' ? 'bg-dark border-bottom border-secondary' : 'bg-white'}`}>
        <div>
          <h5 className="mb-1 fw-bold d-flex align-items-center gap-2"><Briefcase size={20} className="text-primary" /> Kelola Lowongan Aktif</h5>
          <p className="text-muted small mb-0">Hanya menampilkan lowongan yang telah disetujui dan dipublikasikan.</p>
        </div>
        <div>
          <Link to="/dashboard/kaprodi/jobs/create" className="btn btn-sm btn-primary d-flex align-items-center gap-1 rounded-3 px-3 py-2 fw-medium">
            <Plus size={16} /> Buat Lowongan
          </Link>
        </div>
      </div>

      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <Briefcase size={48} className="mb-3 opacity-25" />
            <p className="mb-0">Tidak ada lowongan aktif yang ditemukan.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${theme === 'dark' ? 'table-dark' : ''}`}>
              <thead>
                <tr className={theme === 'dark' ? '' : 'table-light'}>
                  <th className="ps-4" style={{width: '30%'}}>Pekerjaan</th>
                  <th>Perusahaan</th>
                  <th>Pembuat</th>
                  <th className="text-end pe-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <React.Fragment key={job.id}>
                    <tr>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden bg-white border" style={{ width: '40px', height: '40px' }}>
                            {job.logo ? (
                              <img src={`${STORAGE_URL}/${job.logo}`} alt="" className="w-100 h-100" style={{ objectFit: 'contain', padding: '2px' }} />
                            ) : (
                              <Building2 size={18} className="text-primary" />
                            )}
                          </div>
                          <div>
                            <div className="fw-bold">{job.title}</div>
                            <small className="text-muted">{job.category?.name || '-'}</small>
                          </div>
                        </div>
                      </td>
                      <td><span className="fw-medium">{job.company}</span></td>
                      <td>
                        {isOwnJob(job) ? (
                          <span className="badge bg-warning text-dark px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1"><Building2 size={12} /> Kaprodi</span>
                        ) : (
                          <div>
                            <span className="fw-medium">{job.user?.name}</span><br/>
                            <span className="badge bg-primary text-white mt-1 px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}><GraduationCap size={12} /> Mahasiswa</span>
                          </div>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-1">
                          <button onClick={() => setViewingId(viewingId === job.id ? null : job.id)} 
                            className={`btn btn-sm ${viewingId === job.id ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-1 rounded-2`} title="Detail">
                            <Eye size={15} /> {viewingId === job.id ? 'Tutup' : 'Detail'}
                          </button>
                          {isOwnJob(job) && (
                            <Link to={`/dashboard/kaprodi/jobs/edit/${job.id}`} className="btn btn-sm btn-outline-primary rounded-2" title="Edit">
                              <Edit size={15} />
                            </Link>
                          )}
                          <button onClick={() => handleDelete(job.id, job.title)} className="btn btn-sm btn-outline-danger rounded-2" title="Hapus">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline Detail */}
                    {viewingId === job.id && (
                      <tr>
                        <td colSpan="4" className="p-0 border-bottom-0">
                          <div className={`p-4 m-3 rounded-4 border shadow-sm ${theme === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-white border-light'}`}>
                            <div className="d-flex flex-column align-items-start gap-3">
                              {job.logo ? (
                                <img src={`${STORAGE_URL}/${job.logo}`} alt="" style={{ maxHeight: '60px', objectFit: 'contain' }} />
                              ) : (
                                <div className="d-flex align-items-center gap-2 text-primary"><Building2 size={32} /> <span className="fs-5 fw-bold">{job.company}</span></div>
                              )}
                              <div>
                                <h3 className={`fw-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>{job.title} - {job.company}</h3>
                                <div className="d-flex align-items-start gap-2 mb-3 text-muted">
                                  <MapPin size={20} className="mt-1 flex-shrink-0" />
                                  <p className="mb-0 lh-base" style={{ fontSize: '1.05rem' }}>{job.location}</p>
                                </div>
                                <div className="d-flex align-items-center gap-2 text-muted">
                                  <Calendar size={20} />
                                  <span style={{ fontSize: '1.05rem' }}><strong className={theme === 'dark' ? 'text-light' : 'text-dark'}>Terdaftar:</strong> {formatDate(job.created_at)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                              <h6 className="fw-bold mb-2 text-primary">Deskripsi Pekerjaan:</h6>
                              <p className={`mb-4 lh-lg ${theme === 'dark' ? 'text-light' : 'text-muted'}`} style={{ whiteSpace: 'pre-line', fontSize: '0.95rem' }}>{job.description || 'Tidak ada deskripsi.'}</p>
                              <h6 className="fw-bold mb-2 mt-3 text-primary">Persyaratan:</h6>
                              <p className={`mb-0 lh-lg ${theme === 'dark' ? 'text-light' : 'text-muted'}`} style={{ whiteSpace: 'pre-line', fontSize: '0.95rem' }}>{job.requirements || 'Tidak ada persyaratan spesifik.'}</p>
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
    </div>
  );
};

export default ManageJobsPage;
