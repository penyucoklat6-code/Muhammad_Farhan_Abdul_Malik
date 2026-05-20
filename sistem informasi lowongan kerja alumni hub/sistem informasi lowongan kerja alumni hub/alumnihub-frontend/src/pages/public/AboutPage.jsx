import React from 'react';
import { Briefcase, Users, ShieldCheck, TrendingUp, GraduationCap } from 'lucide-react';

const AboutPage = () => {
  return (
    <div style={{ padding: '40px 24px' }}>
      <div className="text-center mb-5">
        <span className="d-inline-block px-3 py-1 rounded-pill mb-3" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', backgroundColor: 'var(--primary-light)' }}>Tentang Kami</span>
        <h1 className="fw-bold" style={{ color: 'var(--text-main)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>Perusahaan & Mitra Kami</h1>
        <p className="lead" style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Berkolaborasi dengan industri terkemuka untuk karir gemilang alumni UHAMKA.</p>
      </div>

      <div className="row g-5 align-items-center mb-5 pb-5" style={{ borderBottom: '1px solid var(--border)', maxWidth: '900px', margin: '0 auto' }}>
        <div className="col-md-6 text-center">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: '220px', height: '220px', background: 'var(--primary-light)' }}>
            <GraduationCap size={80} style={{ color: 'var(--primary)', opacity: 0.5 }} />
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Membangun Ekosistem Karir yang Kuat</h2>
          <p className="mb-4" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Alumni Hub adalah platform yang menjembatani lulusan Universitas Muhammadiyah Prof. DR. HAMKA dengan perusahaan-perusahaan terkemuka di Indonesia.
          </p>
          <div className="row g-3">
            <div className="col-6">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '48px', height: '48px', background: 'var(--primary-light)', color: 'var(--primary)', flexShrink: 0 }}><Users size={22} /></div>
                <div><h4 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>5k+</h4><span className="small" style={{ color: 'var(--text-muted)' }}>Alumni</span></div>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '48px', height: '48px', background: 'rgba(245,158,11,0.1)', color: '#D97706', flexShrink: 0 }}><Briefcase size={22} /></div>
                <div><h4 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>300+</h4><span className="small" style={{ color: 'var(--text-muted)' }}>Perusahaan</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-5" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h3 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Mengapa Bermitra dengan Kami?</h3>
        <div className="row g-4">
          {[
            { icon: <ShieldCheck size={28} />, title: 'Talenta Terverifikasi', desc: 'Semua lulusan yang mendaftar telah diverifikasi langsung oleh pihak kampus.', color: 'var(--primary)', bg: 'var(--primary-light)' },
            { icon: <TrendingUp size={28} />, title: 'Proses Rekrutmen Cepat', desc: 'Platform yang didesain khusus memudahkan perusahaan memfilter dan menyeleksi kandidat.', color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
            { icon: <Users size={28} />, title: 'Jaringan Luas', desc: 'Akses ke ribuan alumni dari berbagai program studi dengan kualifikasi yang beragam.', color: 'var(--secondary)', bg: 'rgba(74,140,111,0.1)' },
          ].map((item, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="h-100 p-4 text-center" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '56px', height: '56px', background: item.bg, color: item.color }}>{item.icon}</div>
                <h5 className="fw-bold" style={{ color: 'var(--text-main)' }}>{item.title}</h5>
                <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
