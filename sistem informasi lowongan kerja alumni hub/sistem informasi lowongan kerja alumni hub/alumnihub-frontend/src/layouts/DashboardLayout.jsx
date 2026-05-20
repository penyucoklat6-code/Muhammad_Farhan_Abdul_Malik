import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Home, Search, List, LogOut, Briefcase, GraduationCap, Building2, LayoutDashboard, User, Users, CheckCircle, ClipboardList, BookmarkIcon, Bell, FileText } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import api, { STORAGE_URL } from '../services/api';
import LiveChat from '../components/LiveChat';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data.success && res.data.data.avatar) {
          setAvatarUrl(`${STORAGE_URL}/${res.data.data.avatar}`);
        }
      } catch (err) {
        console.error('Failed to fetch avatar');
      }
    };
    fetchAvatar();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const isActive = (path) => location.pathname.includes(path);

  // Menu items berdasarkan role
  const mahasiswaMenuItems = [
    { path: '/dashboard/profile', icon: <User size={18} />, label: 'Profil', exact: true },
    { path: '/dashboard/mahasiswa/jobs', icon: <Briefcase size={18} />, label: 'Kelola Lowongan' },
    { path: '/dashboard/mahasiswa/applications', icon: <FileText size={18} />, label: 'Lamaran Saya' },
    { path: '/dashboard/mahasiswa/bookmarks', icon: <BookmarkIcon size={18} />, label: 'Bookmark' },
  ];

  const kaprodiMenuItems = [
    { path: '/dashboard/profile', icon: <User size={18} />, label: 'Profil', exact: true },
    { path: '/dashboard/kaprodi/overview', icon: <Users size={18} />, label: 'Proses Seleksi' },
    { path: '/dashboard/kaprodi/jobs', icon: <Briefcase size={18} />, label: 'Kelola Lowongan' },
    { path: '/dashboard/kaprodi/mitra', icon: <Building2 size={18} />, label: 'Mitra' },
    { path: '/dashboard/kaprodi/approvals', icon: <CheckCircle size={18} />, label: 'Approval' },
    { path: '/dashboard/kaprodi/activity-logs', icon: <ClipboardList size={18} />, label: 'Activity Logs' },
  ];

  const menuItems = user?.role === 'kaprodi' ? kaprodiMenuItems : mahasiswaMenuItems;

  const checkActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path || location.pathname === '/dashboard';
    }
    if (item.matchPath) {
      return location.pathname === item.matchPath;
    }
    return location.pathname.includes(item.path);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Glassmorphism Shell */}
      <div className="app-shell d-flex flex-column">
        {/* Top Navbar */}
        <nav className="d-flex align-items-center justify-content-between px-4 px-lg-5 py-3" style={{ flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
          {/* Logo */}
          <Link className="d-flex align-items-center text-decoration-none gap-2" to="/">
            <div className="d-flex align-items-center justify-content-center rounded-3" style={{ background: 'var(--primary)', color: 'white', width: '36px', height: '36px' }}>
              <GraduationCap size={22} strokeWidth={2.5} />
            </div>
            <span style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontStyle: 'italic', 
              fontSize: '1.5rem', 
              fontWeight: 600,
              color: 'var(--text-main)',
              letterSpacing: '-0.5px',
              marginTop: '2px'
            }}>
              Alumni<span style={{ fontWeight: 700, color: 'var(--primary)' }}> Hub</span>
            </span>
          </Link>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-2 gap-lg-4">
            {/* Public nav links */}
            <div className="d-none d-lg-flex align-items-center gap-3">
              <Link to="/" className="text-decoration-none fw-medium" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Beranda</Link>
              <Link to="/jobs" className="text-decoration-none fw-medium" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Lowongan</Link>
              <Link to="/companies" className="text-decoration-none fw-medium" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Perusahaan</Link>
              <Link to="/about" className="text-decoration-none fw-medium" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tentang Kami</Link>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="btn p-2 border-0 shadow-none rounded-circle d-flex align-items-center justify-content-center"
              style={{ background: 'transparent', color: 'var(--text-muted)', width: '38px', height: '38px' }}
            >
              {theme === 'dark' ? <Sun size={18} className="text-warning" /> : <Moon size={18} />}
            </button>

            {/* User dropdown with logout */}
            <div className="dropdown">
              <div 
                className="rounded-3 d-flex align-items-center justify-content-center fw-bold overflow-hidden" 
                data-bs-toggle="dropdown" 
                aria-expanded="false" 
                style={{ 
                  width: '40px', height: '40px', cursor: 'pointer',
                  background: avatarUrl ? 'transparent' : 'var(--primary-light)',
                  color: 'var(--primary)',
                  border: avatarUrl ? '2px solid var(--primary)' : '1px solid var(--border)',
                  fontSize: '0.85rem'
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'top center' }} />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <ul className="dropdown-menu dropdown-menu-end border shadow-sm mt-2" style={{ borderColor: 'var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', minWidth: '180px' }}>
                <li>
                  <div className="dropdown-header py-2">
                    <div className="fw-bold" style={{ color: 'var(--text-main)' }}>{user?.name || 'User'}</div>
                    <small className="text-capitalize" style={{ color: 'var(--text-muted)' }}>{user?.role || 'Guest'}</small>
                  </div>
                </li>
                <li><hr className="dropdown-divider" style={{ borderColor: 'var(--border)' }} /></li>
                <li>
                  <button onClick={handleLogout} className="dropdown-item d-flex align-items-center gap-2 py-2" style={{ color: '#EF4444', fontSize: '0.875rem' }}>
                    <LogOut size={16} /> Keluar
                  </button>
                </li>
              </ul>
            </div>

            {/* Mobile sidebar toggle */}
            <button 
              className="btn d-lg-none p-2 border-0 shadow-none" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ color: 'var(--text-main)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
          </div>
        </nav>

        {/* Body: Sidebar + Content */}
        <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div 
              className="d-lg-none position-fixed top-0 start-0 w-100 h-100" 
              style={{ zIndex: 1040, backgroundColor: 'rgba(0,0,0,0.3)' }}
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside 
            className={`d-flex flex-column py-4 px-3 ${sidebarOpen ? 'd-flex' : 'd-none d-lg-flex'}`}
            style={{ 
              width: '220px', 
              flexShrink: 0,
              borderRight: '1px solid var(--border)',
              position: sidebarOpen ? 'fixed' : 'relative',
              top: sidebarOpen ? 0 : 'auto',
              left: 0,
              height: sidebarOpen ? '100vh' : 'auto',
              zIndex: sidebarOpen ? 1050 : 'auto',
              backgroundColor: sidebarOpen ? 'var(--bg-glass-strong)' : 'transparent',
              backdropFilter: sidebarOpen ? 'blur(20px)' : 'none',
              overflowY: 'auto'
            }}
          >
            {/* Mobile close + user info */}
            {sidebarOpen && (
              <div className="d-lg-none mb-3 px-2">
                <button className="btn btn-sm border-0 shadow-none mb-3 p-1" onClick={() => setSidebarOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  ✕ Tutup
                </button>
              </div>
            )}

            {/* User Info in Sidebar */}
            <div className="d-flex align-items-center gap-3 px-2 mb-4">
              <div 
                className="rounded-3 d-flex align-items-center justify-content-center fw-bold overflow-hidden flex-shrink-0"
                style={{ 
                  width: '40px', height: '40px',
                  background: avatarUrl ? 'transparent' : 'var(--primary-light)',
                  color: 'var(--primary)',
                  border: avatarUrl ? '2px solid var(--primary)' : 'none',
                  fontSize: '0.85rem'
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'top center' }} />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <p className="fw-semibold mb-0 text-truncate" style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{user?.name || 'User'}</p>
                <p className="mb-0 text-capitalize" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role || 'Guest'}</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="d-flex flex-column gap-1">
              {menuItems.map((item, idx) => {
                const active = checkActive(item);
                return (
                  <Link
                    key={idx}
                    to={item.path}
                    className="d-flex align-items-center gap-3 text-decoration-none px-3 py-2 rounded-3"
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: active ? 600 : 400,
                      color: active ? 'var(--primary)' : 'var(--text-muted)',
                      backgroundColor: active ? 'var(--primary-light)' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ opacity: active ? 1 : 0.7 }}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>

          </aside>

          {/* Main Dashboard Content */}
          <main className="flex-grow-1 p-4 p-lg-5" style={{ minWidth: 0, overflowY: 'auto' }}>
            <Outlet />
          </main>
        </div>
      </div>

      {/* Floating Live Chat */}
      <LiveChat />
    </div>
  );
};

export default DashboardLayout;
