import React, { useState, useEffect, useContext } from 'react';
import { MapPin, Phone, Mail, User, BookOpen, Briefcase, Award, Globe, FileText, Camera, Building2, Save, Shield, School, GraduationCap } from 'lucide-react';
import api, { STORAGE_URL } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import BiodataForm from '../../components/profile/BiodataForm';
import DocumentForm from '../../components/profile/DocumentForm';
import LanguageForm from '../../components/profile/LanguageForm';

const UHAMKA_FAKULTAS = [
  "FKIP (Keguruan dan Ilmu Pendidikan)",
  "FT (Teknik)",
  "FEB (Ekonomi dan Bisnis)",
  "FAI (Agama Islam)",
  "Farmasi dan Sains",
  "FIKES (Ilmu-ilmu Kesehatan)",
  "FPSI (Psikologi)",
  "FISIP (Ilmu Sosial dan Ilmu Politik)",
  "Sekolah Pascasarjana"
];

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isKaprodi = user?.role === 'kaprodi';

  const [activeTab, setActiveTab] = useState('biodata');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kaprodi edit states
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editFakultas, setEditFakultas] = useState('');
  const [editDomicile, setEditDomicile] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const mahasiswaMenuItems = [
    { id: 'biodata', label: 'Biodata', icon: <User size={18} /> },
    { id: 'cv', label: 'CV / Resume', icon: <FileText size={18} /> },
    { id: 'pendidikan', label: 'Pendidikan', icon: <BookOpen size={18} /> },
    { id: 'pelatihan', label: 'Pelatihan', icon: <Briefcase size={18} /> },
    { id: 'sertifikasi', label: 'Sertifikasi', icon: <Award size={18} /> },
    { id: 'pengalaman', label: 'Pengalaman', icon: <Briefcase size={18} /> },
    { id: 'keterampilan', label: 'Ketrampilan', icon: <Award size={18} /> },
    { id: 'pencapaian', label: 'Pencapaian', icon: <Award size={18} /> },
    { id: 'bahasa', label: 'Bahasa', icon: <Globe size={18} /> },
  ];

  const menuItems = isKaprodi ? [{ id: 'biodata', label: 'Informasi Kaprodi', icon: <Building2 size={18} /> }] : mahasiswaMenuItems;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data.success) {
          setProfileData(res.data.data);
          if (isKaprodi) {
            setEditName(res.data.data.name || '');
            setEditPhone(res.data.data.phone || '');
            setEditFakultas(res.data.data.address || '');
            setEditDomicile(res.data.data.domicile_address || '');
          }
        }
      } catch (err) {
        console.error("Gagal mengambil profil", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.post('/profile/avatar', formData);
      if (res.data.success) {
        setProfileData({ ...profileData, avatar: res.data.data.avatar });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengunggah foto.');
    }
  };

  const handleKaprodiSave = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await api.post('/profile/biodata', {
        name: editName,
        phone: editPhone,
        address: editFakultas,
        domicile_address: editDomicile,
      });
      if (res.data.success) {
        setProfileData({ ...profileData, name: editName, phone: editPhone, address: editFakultas, domicile_address: editDomicile });
        setSaveMsg('Profil berhasil disimpan!');
        setTimeout(() => setSaveMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan profil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="text-muted fw-medium">Memuat Profil...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return <div className="p-5 text-center text-danger">Gagal memuat profil.</div>;
  }

  const cardClass = 'border';
  const inputClass = '';
  const labelClass = '';

  return (
    <div className={`container-fluid max-w-7xl mx-auto p-0 ${theme === 'dark' ? 'text-light' : ''}`}>
      
      {/* Green Banner & Profile Info Card */}
      <div className="position-relative" style={{ marginBottom: '100px' }}>
        <div className="rounded-top-4 overflow-hidden position-relative" style={{ height: '180px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)' }}>
           <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px, 20px 20px'
          }}></div>
        </div>
        
        {/* Profile Card Overlapping */}
        <div className="shadow rounded-4 mx-3 mx-md-4 p-4 position-absolute w-auto start-0 end-0 d-flex align-items-center justify-content-between flex-wrap gap-3" style={{ bottom: '-80px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="d-flex align-items-center gap-3 gap-md-4">
             {/* Avatar Box */}
             <div className="shadow rounded-3 d-flex align-items-center justify-content-center position-relative" style={{ width: '100px', height: '100px', marginTop: '-40px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
               <div className="rounded-2 w-100 h-100 d-flex align-items-center justify-content-center h1 fw-bold mb-0 overflow-hidden" style={{ background: 'var(--light)', color: 'var(--text-muted)' }}>
                 {profileData.avatar ? (
                   <img src={`${STORAGE_URL}/${profileData.avatar}`} alt="Avatar" className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'top center' }} />
                 ) : (
                   <span style={{ color: 'var(--primary)' }}>{profileData.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                 )}
               </div>

               <label htmlFor="avatar-upload" className="position-absolute bottom-0 end-0 text-white rounded-circle p-2 shadow" style={{ cursor: 'pointer', transform: 'translate(25%, 25%)', background: 'var(--primary)', lineHeight: 0 }} title="Ubah Foto Profil">
                 <Camera size={14} />
               </label>
               <input id="avatar-upload" type="file" className="d-none" accept="image/*" onChange={handleAvatarChange} />
             </div>
             
             <div>
               <h4 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{profileData.name}</h4>
               <div className="d-flex align-items-center gap-2 flex-wrap">
                 {isKaprodi && <span className="badge bg-warning text-dark px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1"><Building2 size={12} /> Kaprodi</span>}
                 {!isKaprodi && <span className="badge bg-primary text-white px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1"><GraduationCap size={12} /> Mahasiswa</span>}
               </div>
               <div className="d-flex align-items-center gap-3 gap-md-4 flex-wrap small mt-2" style={{ color: 'var(--text-muted)' }}>
                 {isKaprodi && profileData.address && (
                   <span className="d-flex align-items-center gap-1"><Building2 size={14} /> {profileData.address}</span>
                 )}
                 {!isKaprodi && (
                   <span className="d-flex align-items-center gap-1"><MapPin size={14} /> {profileData.domicile_address || '-'}</span>
                 )}
                 <span className="d-flex align-items-center gap-1"><Phone size={14} /> {profileData.phone || '-'}</span>
                 <span className="d-flex align-items-center gap-1"><Mail size={14} /> {profileData.email}</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Details */}
      <div className="row mx-2" style={{ gap: '0' }}>
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="rounded-4 p-2 shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`w-100 text-start btn border-0 py-3 px-3 mb-1 d-flex align-items-center gap-3 fw-medium rounded-3 ${activeTab === item.id ? 'fw-semibold' : 'hover-bg-light'}`}
                style={activeTab === item.id ? { color: 'var(--primary)', backgroundColor: 'var(--primary-light)' } : { color: 'var(--text-muted)' }}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Detail Content */}
        <div className="col-md-9">
          {/* ── KAPRODI: Simplified Profile Form ──────────────── */}
          {isKaprodi && activeTab === 'biodata' && (
            <div className="rounded-4 shadow-sm p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                <Building2 size={20} className="text-primary" /> Informasi Kaprodi
              </h5>
              <p className="small mb-4" style={{ color: 'var(--text-muted)' }}>Kelola data profil Anda sebagai Kaprodi</p>

              {saveMsg && <div className="alert alert-success py-2 small">{saveMsg}</div>}

              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className={`form-label fw-medium small ${labelClass}`}>Nama Lengkap</label>
                  <input type="text" className={`form-control ${inputClass}`} value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nama Kaprodi" />
                </div>
                <div className="col-md-6">
                  <label className={`form-label fw-medium small ${labelClass}`}>Nomor Telepon</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: 'var(--light)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}><Phone size={16} /></span>
                    <input type="text" className={`form-control ${inputClass}`} value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="08xxxxxxxxxx" />
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className={`form-label fw-medium small ${labelClass}`}>Email</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: 'var(--light)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}><Mail size={16} /></span>
                    <input type="email" className="form-control" style={{ background: 'var(--light)', borderColor: 'var(--border)', color: 'var(--text-main)' }} value={profileData.email} disabled readOnly />
                  </div>
                  <small className={labelClass}>Email tidak dapat diubah.</small>
                </div>
                <div className="col-md-6">
                  <label className={`form-label fw-medium small ${labelClass}`}><School size={14} className="me-1" />Fakultas</label>
                  <select className={`form-select ${inputClass}`} value={editFakultas} onChange={(e) => setEditFakultas(e.target.value)}>
                    <option value="">Pilih Fakultas</option>
                    {UHAMKA_FAKULTAS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-12">
                  <label className={`form-label fw-medium small ${labelClass}`}><MapPin size={14} className="me-1" />Alamat Domisili (Opsional)</label>
                  <input type="text" className={`form-control ${inputClass}`} value={editDomicile} onChange={(e) => setEditDomicile(e.target.value)} placeholder="Alamat domisili" />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button className="btn btn-primary px-4 d-flex align-items-center gap-2 rounded-3 fw-medium shadow-sm" onClick={handleKaprodiSave} disabled={saving}>
                  <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          )}

          {/* ── MAHASISWA: Full Profile Tabs ──────────────────── */}
          {!isKaprodi && activeTab === 'biodata' && <BiodataForm profileData={profileData} setProfileData={setProfileData} />}
          
          {!isKaprodi && ['cv', 'pendidikan', 'pelatihan', 'sertifikasi', 'pengalaman', 'keterampilan', 'pencapaian'].includes(activeTab) && (
            <DocumentForm 
              key={activeTab}
              type={activeTab} 
              title={menuItems.find(m => m.id === activeTab).label}
              documents={profileData.documents || []} 
              setProfileData={setProfileData} 
            />
          )}

          {!isKaprodi && activeTab === 'bahasa' && (
            <LanguageForm 
              languages={profileData.languages || []} 
              setProfileData={setProfileData} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
