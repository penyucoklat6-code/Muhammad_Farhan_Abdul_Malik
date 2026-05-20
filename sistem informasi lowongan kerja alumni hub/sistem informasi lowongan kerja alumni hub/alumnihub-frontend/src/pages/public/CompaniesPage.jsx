import React, { useState, useEffect, useContext } from 'react';
import { Building2, Search, MapPin, Globe, Calendar, Briefcase } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import api, { STORAGE_URL } from '../../services/api';

const CompaniesPage = () => {
  const { theme } = useContext(ThemeContext);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/mitras');
      const data = res.data.data;
      if (data.data) setCompanies(data.data);
      else setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: '40px 24px' }}>
      {/* Header Section */}
      <div className="text-center mb-5">
        <span className="d-inline-block px-3 py-1 rounded-pill mb-3" style={{ 
          fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', backgroundColor: 'var(--primary-light)' 
        }}>
          Mitra Kami
        </span>
        <h1 className="fw-bold" style={{ color: 'var(--text-main)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>
          Mitra Perusahaan
        </h1>
        <p className="lead" style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Daftar perusahaan terkemuka yang telah bekerja sama dengan UHAMKA
        </p>
      </div>

      {/* Search Bar */}
      <div className="row mb-5 justify-content-center">
        <div className="col-lg-6">
          <form className="d-flex align-items-center" style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: '4px 4px 4px 16px',
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)'
          }}>
            <input type="text" placeholder="Cari nama perusahaan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 shadow-none flex-grow-1" style={{ background: 'transparent', outline: 'none', fontSize: '0.9rem', color: 'var(--text-main)', padding: '10px 0' }} />
            <div className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <Search size={16} />
            </div>
          </form>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="row g-4" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {loading ? (
          <div className="col-12 text-center py-5"><div className="spinner-border" style={{ color: 'var(--primary)' }} role="status"></div></div>
        ) : filteredCompanies.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="p-5 rounded-4" style={{ border: '2px dashed var(--border)', background: 'var(--bg-card)' }}>
              <Building2 size={48} style={{ color: 'var(--text-muted)', opacity: 0.25 }} className="mb-3" />
              <h5 className="fw-bold" style={{ color: 'var(--text-muted)' }}>Perusahaan tidak ditemukan</h5>
              <p style={{ color: 'var(--text-muted)' }} className="mb-0">Maaf, kami tidak menemukan perusahaan dengan kata kunci tersebut.</p>
            </div>
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <div className="col-md-6 col-lg-4" key={company.id}>
              <div className="h-100 d-flex flex-column" style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.25s ease', overflow: 'hidden'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div className="p-4 flex-grow-1">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden border" 
                      style={{ width: '64px', height: '64px', background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                      {company.logo ? (
                        <img src={`${STORAGE_URL}/${company.logo}`} alt="logo" className="w-100 h-100" style={{ objectFit: 'contain', padding: '8px' }} />
                      ) : (
                        <Building2 size={28} style={{ color: 'var(--primary)', opacity: 0.3 }} />
                      )}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{company.name}</h6>
                      {company.established_date && (
                        <span className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill" style={{ 
                          fontSize: '0.7rem', background: 'var(--primary-light)', color: 'var(--primary)' 
                        }}>
                          <Calendar size={11} /> Est. {new Date(company.established_date).getFullYear()}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mb-3 small" style={{ 
                    color: 'var(--text-muted)', lineHeight: 1.6,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                  }}>
                    {company.description || 'Tidak ada deskripsi.'}
                  </p>

                  <div className="d-flex flex-column gap-2 small">
                    {company.address && (
                      <div className="d-flex align-items-start gap-2">
                        <MapPin size={14} className="flex-shrink-0 mt-1" style={{ color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-main)' }}>{company.address}</span>
                      </div>
                    )}
                    {company.website_url && (
                      <div className="d-flex align-items-center gap-2">
                        <Globe size={14} className="flex-shrink-0" style={{ color: 'var(--primary)' }} />
                        <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="text-truncate" style={{ color: 'var(--primary)' }}>
                          {company.website_url.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
