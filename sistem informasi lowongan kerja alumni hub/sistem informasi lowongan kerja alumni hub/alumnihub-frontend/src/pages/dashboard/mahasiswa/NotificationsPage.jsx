import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import api from '../../../services/api';
import { Bell, Check, Trash2, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationsPage = () => {
  const { theme } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.data.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Gagal menandai notifikasi dibaca', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Gagal menandai semua dibaca', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus notifikasi ini?')) return;
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error('Gagal menghapus notifikasi', err);
    }
  };

  const getIconByType = (type) => {
    if (type === 'success') return <CheckCircle size={20} className="text-success" />;
    if (type === 'warning') return <AlertCircle size={20} className="text-warning" />;
    return <Info size={20} className="text-primary" />;
  };

  const formatDate = (ds) => {
    if (!ds) return '-';
    return new Date(ds).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className={`card shadow-sm border-0 rounded-4 ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
      <div className={`card-header border-0 py-3 d-flex align-items-center justify-content-between rounded-top-4 ${theme === 'dark' ? 'bg-dark border-bottom border-secondary' : 'bg-white'}`}>
        <div className="d-flex align-items-center gap-2">
          <Bell className="text-primary" size={20} />
          <h5 className="mb-0 fw-bold">Notifikasi</h5>
          {unreadCount > 0 && <span className="badge bg-danger rounded-pill">{unreadCount} Baru</span>}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 rounded-3">
            <Check size={14} /> Tandai Semua Dibaca
          </button>
        )}
      </div>
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <Bell size={48} className="mb-3 opacity-25" />
            <p>Belum ada notifikasi.</p>
          </div>
        ) : (
          <div className="list-group list-group-flush rounded-bottom-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`list-group-item p-4 d-flex align-items-start gap-3 border-bottom ${!notif.is_read ? (theme === 'dark' ? 'bg-primary bg-opacity-10' : 'bg-light') : (theme === 'dark' ? 'bg-transparent border-secondary' : 'bg-white')}`}
              >
                <div className="mt-1 flex-shrink-0">
                  {getIconByType(notif.type)}
                </div>
                <div className="flex-grow-1">
                  <h6 className={`mb-1 ${!notif.is_read ? 'fw-bold' : 'fw-medium'}`}>{notif.title}</h6>
                  <p className="mb-2 small" style={{ color: 'var(--text-main)', opacity: 0.8 }}>{notif.message}</p>
                  <small className="text-muted">{formatDate(notif.created_at)}</small>
                </div>
                <div className="d-flex flex-column gap-2 flex-shrink-0">
                  {!notif.is_read && (
                    <button onClick={() => handleMarkAsRead(notif.id)} className="btn btn-sm btn-light border p-1 rounded-circle text-primary" title="Tandai Dibaca">
                      <Check size={14} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(notif.id)} className="btn btn-sm btn-light border p-1 rounded-circle text-danger" title="Hapus Notifikasi">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
