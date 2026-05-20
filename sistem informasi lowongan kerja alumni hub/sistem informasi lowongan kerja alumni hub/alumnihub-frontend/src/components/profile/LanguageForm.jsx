import React, { useState } from 'react';
import api, { STORAGE_URL } from '../../services/api';
import { Globe, Trash2, Upload, ExternalLink } from 'lucide-react';

const worldLanguages = [
  "Inggris", "Mandarin", "Arab", "Jepang", "Korea", "Prancis", "Jerman", 
  "Spanyol", "Rusia", "Italia", "Belanda", "Hindi", "Indonesia"
];

const LanguageForm = ({ languages, setProfileData }) => {
  const [language, setLanguage] = useState('');
  const [score, setScore] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!language || !score) {
      setError('Bahasa dan Nilai wajib diisi.');
      return;
    }
    
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('language', language);
    formData.append('score', score);
    if (file) {
      formData.append('file', file);
    }

    try {
      const res = await api.post('/profile/languages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        const profileRes = await api.get('/profile');
        setProfileData(profileRes.data.data);
        setLanguage('');
        setScore('');
        setFile(null);
        document.getElementById('lang-file').value = '';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan bahasa.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus bahasa ini?')) return;
    
    try {
      await api.delete(`/profile/languages/${id}`);
      const profileRes = await api.get('/profile');
      setProfileData(profileRes.data.data);
    } catch (err) {
      alert('Gagal menghapus bahasa.');
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <Globe size={20} className="text-primary" /> Penguasaan Bahasa
      </h5>

      {error && <div className="alert alert-danger p-2 small">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-4 bg-light p-3 rounded-3 border">
        <h6 className="fw-bold mb-3 text-dark">Tambah Bahasa Baru</h6>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label text-muted small">Pilih Bahasa</label>
            <select 
              className="form-select" 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            >
              <option value="">-- Pilih Bahasa Dunia --</option>
              {worldLanguages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small">Nilai / Skor (Angka saja)</label>
            <input 
              type="number" 
              className="form-control" 
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
              min="0"
              placeholder="Contoh: 85 atau 500"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label text-muted small">Upload Sertifikat (PDF) <span className="fst-italic opacity-75">- Opsional</span></label>
          <input 
            type="file" 
            id="lang-file"
            className="form-control" 
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        
        <button type="submit" className="btn btn-primary d-flex align-items-center gap-2 px-4" disabled={loading}>
          <Upload size={16} /> {loading ? 'Menyimpan...' : 'Tambah Bahasa'}
        </button>
      </form>

      <h6 className="fw-bold mb-3 text-muted">Daftar Bahasa Anda</h6>
      {languages.length === 0 ? (
        <div className="text-center py-4 text-muted border rounded-3 border-dashed">
          <Globe size={32} className="opacity-25 mb-2" />
          <p className="mb-0 small">Belum ada bahasa yang ditambahkan.</p>
        </div>
      ) : (
        <div className="list-group">
          {languages.map(lang => (
            <div key={lang.id} className="list-group-item list-group-item-action p-3 d-flex justify-content-between align-items-center">
              <div className="me-3">
                <h6 className="mb-1 text-dark fw-bold">{lang.language} <span className="badge bg-success ms-2">Skor: {lang.score}</span></h6>
                {lang.file_path ? (
                  <a href={`${STORAGE_URL}/${lang.file_path}`} target="_blank" rel="noreferrer" className="text-decoration-none small text-primary d-inline-flex align-items-center gap-1">
                    <ExternalLink size={14} /> Lihat Sertifikat
                  </a>
                ) : (
                  <span className="small text-muted fst-italic">Tanpa file bukti</span>
                )}
              </div>
              <button onClick={() => handleDelete(lang.id)} className="btn btn-outline-danger btn-sm p-2 rounded-circle" title="Hapus">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageForm;
