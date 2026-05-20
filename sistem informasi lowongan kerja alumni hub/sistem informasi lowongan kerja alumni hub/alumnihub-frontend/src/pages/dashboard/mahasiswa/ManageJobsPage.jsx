import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { ThemeContext } from '../../../context/ThemeContext';
import api, { STORAGE_URL } from '../../../services/api';
import { Plus, Edit, Trash2, Eye, Briefcase, MapPin, Calendar, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageJobsPage = () => {
  const { theme } = useContext(ThemeContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingId, setViewingId] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/my-jobs');
      setJobs(response.data.data.data); // data.data.data because of pagination wrapper
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin memindahkan lowongan ini ke Recycle Bin?')) {
      try {
        await api.delete(`/jobs/${id}`);
        fetchMyJobs();
      } catch (error) {
        alert('Gagal menghapus lowongan');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published': return <span className="badge bg-success">Dipublikasikan</span>;
      case 'pending': return <span className="badge bg-warning text-dark">Menunggu Review</span>;
      case 'rejected': return <span className="badge bg-danger">Ditolak</span>;
      case 'revision': return <span className="badge bg-info">Revisi</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={`card shadow-sm border-0 rounded-4 ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
      <div className={`card-header border-0 py-3 d-flex justify-content-between align-items-center rounded-top-4 ${theme === 'dark' ? 'bg-dark border-bottom border-secondary' : 'bg-white'}`}>
        <h5 className="mb-0 fw-bold">Kelola Lowongan Saya</h5>
        <Link to="/dashboard/mahasiswa/jobs/create" className="btn btn-primary d-flex align-items-center gap-2">
          <Plus size={18} /> Buat Lowongan Baru
        </Link>
      </div>
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <Briefcase size={48} className="mb-3 opacity-50" />
            <p>Anda belum pernah memposting lowongan pekerjaan.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className={`table align-middle mb-0 ${theme === 'dark' ? 'table-dark' : ''}`}>
              <thead className={theme === 'dark' ? '' : 'table-light'}>
                <tr>
                  <th className="ps-4">Posisi / Perusahaan</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Tanggal Dibuat</th>
                  <th className="text-end pe-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <React.Fragment key={job.id}>
                    <tr>
                      <td className="ps-4">
                        <div className="fw-bold">{job.title}</div>
                        <small className="text-muted">{job.company}</small>
                      </td>
                      <td>{job.category?.name || '-'}</td>
                      <td>{getStatusBadge(job.status)}</td>
                      <td>{formatDate(job.created_at)}</td>
                      <td className="text-end pe-4">
                        <div className="d-flex gap-2 justify-content-end">
                          <button 
                            onClick={() => setViewingId(viewingId === job.id ? null : job.id)}
                            className={`btn btn-sm ${viewingId === job.id ? 'btn-primary' : 'btn-outline-info'} rounded-2`} 
                            title="Detail"
                          >
                            <Eye size={16} />
                          </button>
                          <Link to={`/dashboard/mahasiswa/jobs/edit/${job.id}`} className="btn btn-sm btn-outline-primary rounded-2" title="Edit">
                            <Edit size={16} />
                          </Link>
                          <button onClick={() => handleDelete(job.id)} className="btn btn-sm btn-outline-danger rounded-2" title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Inline Detail View */}
                    {viewingId === job.id && (
                      <tr>
                        <td colSpan="5" className="p-0 border-0">
                          <div className={`p-4 border-bottom ${theme === 'dark' ? 'bg-black bg-opacity-25' : 'bg-light'}`}>
                            <div className="row">
                              <div className="col-md-auto mb-3 mb-md-0">
                                <div className="rounded-3 d-flex align-items-center justify-content-center overflow-hidden bg-white border" 
                                     style={{ width: '120px', height: '120px' }}>
                                  {job.logo ? (
                                    <img src={`${STORAGE_URL}/${job.logo}`} alt="logo" className="w-100 h-100" style={{ objectFit: 'contain', padding: '10px' }} />
                                  ) : (
                                    <Building2 size={48} className="text-primary opacity-25" />
                                  )}
                                </div>
                              </div>
                              <div className="col-md">
                                <h4 className="fw-bold mb-2">{job.title}</h4>
                                <h6 className="text-primary mb-3">{job.company}</h6>
                                
                                <div className="d-flex flex-wrap gap-4 text-muted small mb-4">
                                  <div className="d-flex align-items-center gap-1">
                                    <MapPin size={16} /> {job.location}
                                  </div>
                                  <div className="d-flex align-items-center gap-1">
                                    <Calendar size={16} /> Terdaftar: {formatDate(job.created_at)}
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-6 mb-3">
                                    <h6 className="fw-bold border-bottom pb-2">Deskripsi Pekerjaan</h6>
                                    <p className="small mb-0" style={{ whiteSpace: 'pre-line' }}>{job.description || 'Tidak ada deskripsi.'}</p>
                                  </div>
                                  <div className="col-md-6">
                                    <h6 className="fw-bold border-bottom pb-2">Persyaratan</h6>
                                    <p className="small mb-0" style={{ whiteSpace: 'pre-line' }}>{job.requirements || 'Tidak ada persyaratan.'}</p>
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
    </div>
  );
};

export default ManageJobsPage;
