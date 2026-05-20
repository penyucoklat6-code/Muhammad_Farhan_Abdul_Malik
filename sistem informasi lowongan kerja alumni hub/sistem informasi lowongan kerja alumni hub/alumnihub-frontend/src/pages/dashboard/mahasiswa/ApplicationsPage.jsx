import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import api, { STORAGE_URL } from '../../../services/api';
import { Link } from 'react-router-dom';
import { FileText, Building2, Calendar, MapPin, Briefcase } from 'lucide-react';

const ApplicationsPage = () => {
  const { theme } = useContext(ThemeContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/my-applications');
      setApplications(res.data.data.data || []);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      dikirim: { label: 'Terkirim', cls: 'bg-info bg-opacity-10 text-info border-info' },
      interview: { label: 'Dipanggil Interview', cls: 'bg-warning bg-opacity-10 text-warning border-warning' },
      diterima: { label: 'Diterima', cls: 'bg-success bg-opacity-10 text-success border-success' },
      ditolak: { label: 'Ditolak', cls: 'bg-danger bg-opacity-10 text-danger border-danger' },
    };
    const c = config[status] || config.dikirim;
    return <span className={`badge ${c.cls} border border-opacity-25 px-3 py-2 rounded-pill small fw-medium`}>{c.label}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className={`card shadow-sm border-0 rounded-4 ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
      <div className={`card-header border-0 py-3 d-flex align-items-center gap-2 rounded-top-4 ${theme === 'dark' ? 'bg-dark border-bottom border-secondary' : 'bg-white'}`}>
        <FileText className="text-primary" size={20} />
        <h5 className="mb-0 fw-bold">Lamaran Saya</h5>
      </div>
      <div className="card-body p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FileText size={48} className="mb-3 opacity-25" />
            <p>Anda belum melamar pekerjaan apa pun.</p>
            <Link to="/jobs" className="btn btn-primary mt-2">Cari Lowongan</Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {applications.map((app) => {
              const job = app.job;
              if (!job) return null;
              
              return (
                <div key={app.id} className={`rounded-4 border overflow-hidden hover-shadow transition ${theme === 'dark' ? 'border-secondary bg-black bg-opacity-25' : 'border-light bg-white'}`}>
                  <div className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                    
                    {/* Left: Job Info */}
                    <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">
                      <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden border" style={{ width: 80, height: 80, background: 'var(--bg-card)' }}>
                        {job.logo ? (
                          <img src={`${STORAGE_URL}/${job.logo}`} alt="" className="w-100 h-100" style={{ objectFit: 'contain', padding: '5px' }} />
                        ) : (
                          <Building2 className="text-primary opacity-50" size={32} />
                        )}
                      </div>
                      
                      <div>
                        <h5 className="fw-bold mb-1">
                          <Link to={`/jobs/${job.id}`} className={`text-decoration-none ${theme === 'dark' ? 'text-white' : 'text-dark'} hover-primary`}>
                            {job.title}
                          </Link>
                        </h5>
                        <p className="text-primary fw-medium mb-2">{job.company}</p>
                        
                        <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                          <span className="d-flex align-items-center gap-1"><MapPin size={14} /> {job.location || '-'}</span>
                          <span className="d-flex align-items-center gap-1"><Briefcase size={14} /> {job.type}</span>
                          <span className="d-flex align-items-center gap-1"><Calendar size={14} /> Melamar: {formatDate(app.applied_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right: Status */}
                    <div className="d-flex flex-column align-items-start align-items-md-end gap-2">
                      <div className="mb-2 mb-md-0">{getStatusBadge(app.status)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
