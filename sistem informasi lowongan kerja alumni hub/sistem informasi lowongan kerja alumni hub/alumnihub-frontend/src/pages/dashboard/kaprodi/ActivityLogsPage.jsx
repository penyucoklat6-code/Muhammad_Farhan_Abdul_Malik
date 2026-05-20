import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import api from '../../../services/api';
import { List } from 'lucide-react';

const ActivityLogsPage = () => {
  const { theme } = useContext(ThemeContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/activity-logs');
      setLogs(response.data.data.data);
    } catch (error) {
      console.error('Failed to fetch activity logs', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card shadow-sm border-0 ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
      <div className={`card-header border-0 py-3 d-flex justify-content-between align-items-center ${theme === 'dark' ? 'bg-dark border-bottom border-secondary' : 'bg-white'}`}>
        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2"><List size={20}/> Log Aktivitas Sistem</h5>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <List size={48} className="mb-3 opacity-50" />
            <p>Belum ada aktivitas terekam.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className={`table align-middle ${theme === 'dark' ? 'table-dark' : ''}`}>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Pengguna</th>
                  <th>Aksi</th>
                  <th>Deskripsi</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.created_at).toLocaleString('id-ID')}</td>
                    <td>
                      {log.user?.name || 'Sistem'} <br />
                      <small className="text-muted">{log.user?.role}</small>
                    </td>
                    <td><span className="badge bg-secondary">{log.action}</span></td>
                    <td>{log.description}</td>
                    <td><small className="text-muted">{log.ip_address || '-'}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsPage;
