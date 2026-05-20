import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, GraduationCap, Users, Briefcase, ShieldCheck, TrendingUp, Building2 } from 'lucide-react';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="text-center" style={{ padding: '80px 24px 40px' }}>
        <div className="slide-up" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h1 style={{ 
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--text-main)',
            letterSpacing: '-1px',
            marginBottom: '20px'
          }}>
            Temukan Peluang Anda<br />di Alumni Hub
          </h1>
          <p style={{ 
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            maxWidth: '540px',
            margin: '0 auto 40px'
          }}>
            Platform lamaran kerja eksklusif untuk mahasiswa dan alumni, menghubungkan Anda dengan lowongan yang dikurasi oleh Kaprodi dan rekan sejawat.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="d-flex align-items-center mx-auto" style={{ 
            maxWidth: '500px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '6px 6px 6px 20px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border)'
          }}>
            <input 
              type="text" 
              placeholder="Cari lowongan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 shadow-none flex-grow-1"
              style={{ 
                background: 'transparent', 
                outline: 'none', 
                fontSize: '0.925rem',
                color: 'var(--text-main)',
                padding: '10px 0'
              }} 
            />
            <button 
              type="submit"
              className="btn d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* Alur Proses Rekrutmen */}
      <section className="slide-up" style={{ padding: '20px 24px 60px', animationDelay: '0.15s' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="text-center mb-4">
            <span className="d-inline-block px-3 py-1 rounded-pill mb-2" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', backgroundColor: 'var(--primary-light)' }}>
              Cara Kerja
            </span>
            <h5 className="fw-bold" style={{ color: 'var(--text-main)', fontSize: '1.15rem' }}>Alur Proses Rekrutmen</h5>
          </div>

          <div className="d-flex flex-wrap justify-content-center gap-3 gap-md-0 align-items-stretch">
            {[
              { step: '1', icon: <GraduationCap size={28} />, title: 'Daftar Akun', desc: 'Buat akun sebagai mahasiswa atau alumni UHAMKA' },
              { step: '2', icon: <Users size={28} />, title: 'Lengkapi Profil', desc: 'Isi biodata, upload dokumen, dan kemampuan bahasa' },
              { step: '3', icon: <Briefcase size={28} />, title: 'Lamar Pekerjaan', desc: 'Cari lowongan, lihat detail, dan kirim lamaran' },
              { step: '4', icon: <ShieldCheck size={28} />, title: 'Proses & Diterima', desc: 'Tunggu review Kaprodi dan pantau status lamaran' }
            ].map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="text-center px-2" style={{ flex: '1 1 160px', maxWidth: '200px' }}>
                  <div className="d-flex align-items-center justify-content-center mx-auto mb-2 rounded-circle" style={{
                    width: '56px', height: '56px', background: 'var(--primary-light)', color: 'var(--primary)'
                  }}>
                    {item.icon}
                  </div>
                  <div className="mb-1" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.5px' }}>LANGKAH {item.step}</div>
                  <h6 className="fw-bold mb-1" style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{item.title}</h6>
                  <p className="mb-0" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="d-none d-md-flex align-items-center" style={{ color: 'var(--border)', fontSize: '1.5rem', margin: '0 -4px', paddingBottom: '40px' }}>
                    <ChevronRight size={24} style={{ color: 'var(--primary)', opacity: 0.3 }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '40px 24px 60px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="text-center mb-5">
            <span className="d-inline-block px-3 py-1 rounded-pill mb-3" style={{ 
              fontSize: '0.8rem', 
              fontWeight: 600,
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-light)',
            }}>
              Mengapa Alumni Hub?
            </span>
            <h2 className="fw-bold" style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: 'var(--text-main)' }}>
              Platform Karir Terpercaya UHAMKA
            </h2>
          </div>

          <div className="row g-4">
            {[
              { 
                icon: <ShieldCheck size={28} />, 
                title: 'Terverifikasi Kaprodi',
                desc: 'Setiap lowongan dikurasi dan disetujui oleh Kaprodi untuk memastikan kualitas dan keamanan.'
              },
              { 
                icon: <TrendingUp size={28} />, 
                title: 'Proses Cepat',
                desc: 'Lamar dengan sekali klik menggunakan profil yang sudah lengkap. Tanpa upload berulang.'
              },
              { 
                icon: <Briefcase size={28} />, 
                title: 'Mitra Terpercaya',
                desc: 'Terhubung dengan perusahaan mitra resmi yang berkolaborasi langsung dengan UHAMKA.'
              }
            ].map((feature, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="text-center p-4 h-100" style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-3" style={{ 
                    width: '56px', height: '56px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)'
                  }}>
                    {feature.icon}
                  </div>
                  <h6 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>{feature.title}</h6>
                  <p className="mb-0" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '40px 24px 60px' }}>
        <div className="row g-4" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="col-md-6">
            <div className="p-4 h-100 d-flex flex-column" style={{
              background: 'var(--primary-light)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)'
            }}>
              <div className="d-flex align-items-center justify-content-center rounded-circle mb-3" style={{ 
                width: '48px', height: '48px',
                backgroundColor: 'var(--bg-card)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <GraduationCap size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <h6 className="fw-bold mb-2" style={{ color: 'var(--primary)' }}>Mencari Pekerjaan?</h6>
              <p className="mb-3" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daftar dan temukan pekerjaan impian Anda.</p>
              <Link to="/register" className="btn btn-primary mt-auto align-self-start px-4 py-2 fw-medium" style={{ fontSize: '0.85rem' }}>
                Daftar Sekarang <ChevronRight size={16} />
              </Link>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-4 h-100 d-flex flex-column" style={{
              background: 'rgba(245, 158, 11, 0.08)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(245, 158, 11, 0.15)'
            }}>
              <div className="d-flex align-items-center justify-content-center rounded-circle mb-3" style={{ 
                width: '48px', height: '48px',
                backgroundColor: 'var(--bg-card)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Building2 size={24} style={{ color: '#D97706' }} />
              </div>
              <h6 className="fw-bold mb-2" style={{ color: '#D97706' }}>Tertarik Bermitra?</h6>
              <p className="mb-3" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daftarkan perusahaan Anda sebagai mitra program.</p>
              <Link to="/about" className="btn mt-auto align-self-start px-4 py-2 fw-medium" style={{ 
                fontSize: '0.85rem',
                backgroundColor: '#D97706',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)'
              }}>
                Pelajari Lebih Lanjut <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
