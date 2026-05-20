import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { User, Phone, Mail, MapPin, School, BookOpen } from 'lucide-react';

const UHAMKA_DATA = {
  "FKIP (Keguruan dan Ilmu Pendidikan)": [
    "Pendidikan Guru Sekolah Dasar (PGSD)",
    "Pendidikan Anak Usia Dini (PAUD)",
    "Pendidikan Bahasa dan Sastra Indonesia",
    "Pendidikan Bahasa Inggris",
    "Pendidikan Matematika",
    "Pendidikan Biologi",
    "Pendidikan Fisika",
    "Pendidikan Kimia",
    "Pendidikan Ekonomi",
    "Pendidikan Geografi",
    "Pendidikan Sejarah",
    "Pendidikan Pancasila dan Kewarganegaraan",
    "Bimbingan dan Konseling"
  ],
  "FT (Teknik)": [
    "Teknik Informatika",
    "Teknik Elektro",
    "Teknik Industri",
    "Teknik Mesin"
  ],
  "FEB (Ekonomi dan Bisnis)": [
    "Akuntansi",
    "Manajemen",
    "Ekonomi Islam",
    "Perpajakan (D3)"
  ],
  "FAI (Agama Islam)": [
    "Pendidikan Agama Islam",
    "Perbankan Syariah",
    "Komunikasi Penyiaran Islam",
    "Pendidikan Guru Madrasah Ibtidaiyah"
  ],
  "Farmasi dan Sains": [
    "Farmasi"
  ],
  "FIKES (Ilmu-ilmu Kesehatan)": [
    "Kesehatan Masyarakat",
    "Gizi",
    "Keperawatan (D3)",
    "Keperawatan (S1)",
    "Teknik Kardiovaskular (D3)"
  ],
  "FPSI (Psikologi)": [
    "Psikologi"
  ],
  "FISIP (Ilmu Sosial dan Ilmu Politik)": [
    "Ilmu Komunikasi",
    "Ilmu Politik"
  ],
  "Sekolah Pascasarjana": [
    "Administrasi Pendidikan",
    "Pendidikan Bahasa Indonesia",
    "Pendidikan Bahasa Inggris",
    "Pendidikan Matematika",
    "Magister Manajemen",
    "Magister Kesehatan Masyarakat",
    "Magister Ilmu Farmasi",
    "Magister Pendidikan Dasar"
  ]
};

const BiodataForm = ({ profileData, setProfileData }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    address: '',
    domicile_address: '',
    fakultas: '',
    jurusan: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        gender: profileData.gender || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        domicile_address: profileData.domicile_address || '',
        fakultas: profileData.fakultas || '',
        jurusan: profileData.jurusan || ''
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fakultas') {
      setFormData({ ...formData, fakultas: value, jurusan: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await api.post('/profile/biodata', formData);
      if (res.data.success) {
        setMessage('Biodata berhasil disimpan!');
        setProfileData({ ...profileData, ...res.data.data });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan biodata.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <User size={20} className="text-primary" /> Informasi Dasar
      </h5>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6 mb-3 mb-md-0">
            <label className="form-label text-muted small">Nama Lengkap</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small">Jenis Kelamin</label>
            <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6 mb-3 mb-md-0">
            <label className="form-label text-muted small">Fakultas</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><School size={16} /></span>
              <select className="form-select border-start-0 ps-0" name="fakultas" value={formData.fakultas} onChange={handleChange}>
                <option value="">Pilih Fakultas</option>
                {Object.keys(UHAMKA_DATA).map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small">Jurusan / Program Studi</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><BookOpen size={16} /></span>
              <select 
                className="form-select border-start-0 ps-0" 
                name="jurusan" 
                value={formData.jurusan} 
                onChange={handleChange}
                disabled={!formData.fakultas}
              >
                <option value="">Pilih Jurusan</option>
                {formData.fakultas && UHAMKA_DATA[formData.fakultas].map(j => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6 mb-3 mb-md-0">
            <label className="form-label text-muted small">Nomor Telepon</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Phone size={16} /></span>
              <input type="text" className="form-control border-start-0 ps-0" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small">Email (Tidak dapat diubah)</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Mail size={16} /></span>
              <input type="email" className="form-control border-start-0 ps-0 bg-light" value={profileData?.email || ''} disabled />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label text-muted small">Alamat Sesuai KTP</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 align-items-start pt-2"><MapPin size={16} /></span>
            <textarea className="form-control border-start-0 ps-0" rows="2" name="address" value={formData.address} onChange={handleChange}></textarea>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label text-muted small">Alamat Domisili Sekarang</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 align-items-start pt-2"><MapPin size={16} /></span>
            <textarea className="form-control border-start-0 ps-0" rows="2" name="domicile_address" value={formData.domicile_address} onChange={handleChange}></textarea>
          </div>
        </div>

        <button type="submit" className="btn btn-primary px-4 fw-medium" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Biodata'}
        </button>
      </form>
    </div>
  );
};

export default BiodataForm;
