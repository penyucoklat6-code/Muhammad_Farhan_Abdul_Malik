import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sun, Moon, GraduationCap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const MainLayout = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Glassmorphism Shell */}
      <div className="app-shell d-flex flex-column">
        {/* Navbar */}
        <nav className="d-flex align-items-center justify-content-between px-4 px-lg-5 py-3" style={{ flexShrink: 0 }}>
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

          {/* Nav Links + Actions */}
          <div className="d-flex align-items-center gap-2 gap-lg-4">
            {/* Navigation Links */}
            <div className="d-none d-md-flex align-items-center gap-1 gap-lg-3">
              <Link 
                to="/" 
                className="text-decoration-none px-3 py-2 rounded-3 fw-medium"
                style={{ 
                  fontSize: '0.9rem',
                  color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: isActive('/') ? 'var(--primary-light)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Beranda
              </Link>
              <Link 
                to="/jobs" 
                className="text-decoration-none px-3 py-2 rounded-3 fw-medium"
                style={{ 
                  fontSize: '0.9rem',
                  color: isActive('/jobs') ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: isActive('/jobs') ? 'var(--primary-light)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Lowongan
              </Link>
              <Link 
                to="/companies" 
                className="text-decoration-none px-3 py-2 rounded-3 fw-medium"
                style={{ 
                  fontSize: '0.9rem',
                  color: isActive('/companies') ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: isActive('/companies') ? 'var(--primary-light)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Perusahaan
              </Link>
              <Link 
                to="/about" 
                className="text-decoration-none px-3 py-2 rounded-3 fw-medium"
                style={{ 
                  fontSize: '0.9rem',
                  color: isActive('/about') ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: isActive('/about') ? 'var(--primary-light)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Tentang Kami
              </Link>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="btn p-2 border-0 shadow-none rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                background: 'transparent',
                color: 'var(--text-muted)',
                width: '38px',
                height: '38px'
              }}
            >
              {theme === 'dark' ? <Sun size={18} className="text-warning"/> : <Moon size={18} />}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <Link 
                to={user.role === 'kaprodi' ? '/dashboard/kaprodi/overview' : '/dashboard/profile'} 
                className="btn px-4 py-2 fw-medium d-flex align-items-center gap-2"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  border: 'none'
                }}
              >
                Dashboard <LayoutDashboard size={16} />
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="btn px-4 py-2 fw-medium"
                style={{ 
                  border: '1.5px solid var(--text-main)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  backgroundColor: 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Masuk
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button 
              className="btn d-md-none p-2 border-0 shadow-none" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#mobileNav"
              style={{ color: 'var(--text-main)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="collapse d-md-none" id="mobileNav">
          <div className="d-flex flex-column gap-1 px-4 pb-3">
            <Link to="/" className="text-decoration-none py-2 px-3 rounded-3 fw-medium" style={{ color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)', backgroundColor: isActive('/') ? 'var(--primary-light)' : 'transparent' }}>Beranda</Link>
            <Link to="/jobs" className="text-decoration-none py-2 px-3 rounded-3 fw-medium" style={{ color: isActive('/jobs') ? 'var(--primary)' : 'var(--text-muted)', backgroundColor: isActive('/jobs') ? 'var(--primary-light)' : 'transparent' }}>Lowongan</Link>
            <Link to="/companies" className="text-decoration-none py-2 px-3 rounded-3 fw-medium" style={{ color: isActive('/companies') ? 'var(--primary)' : 'var(--text-muted)', backgroundColor: isActive('/companies') ? 'var(--primary-light)' : 'transparent' }}>Perusahaan</Link>
            <Link to="/about" className="text-decoration-none py-2 px-3 rounded-3 fw-medium" style={{ color: isActive('/about') ? 'var(--primary)' : 'var(--text-muted)', backgroundColor: isActive('/about') ? 'var(--primary-light)' : 'transparent' }}>Tentang Kami</Link>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow-1">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="px-4 px-lg-5 py-4 mt-auto" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center justify-content-center rounded-3" style={{ 
                width: '36px', height: '36px', 
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
              }}>
                <GraduationCap size={18} className="text-white" />
              </div>
              <div>
                <p className="fw-semibold mb-0" style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Biro Kemahasiswaan dan Alumni</p>
                <p className="mb-0" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Universitas Muhammadiyah Prof. DR. HAMKA</p>
              </div>
            </div>
            <p className="mb-0" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              &copy; {new Date().getFullYear()} <span style={{ color: 'var(--primary)', fontWeight: 500 }}>UHAMKA</span>. Hak Cipta Dilindungi.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
