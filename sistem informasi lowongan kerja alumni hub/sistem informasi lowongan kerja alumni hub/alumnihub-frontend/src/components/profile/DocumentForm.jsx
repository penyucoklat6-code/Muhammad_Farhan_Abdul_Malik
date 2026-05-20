import React, { useState } from 'react';
import api, { STORAGE_URL } from '../../services/api';
import { FileText, Trash2, Upload, ExternalLink } from 'lucide-react';

const DocumentForm = ({ type, title, documents, setProfileData }) => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentDocs = documents.filter(doc => doc.type === type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('File PDF harus diunggah.');
      return;
    }
    
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('type', type);
    formData.append('description', description);
    formData.append('file', file);

    try {
      const res = await api.post('/profile/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        // Refresh data profil
        const profileRes = await api.get('/profile');
        setProfileData(profileRes.data.data);
        setDescription('');
        setFile(null);
        // reset file input
        document.getElementById(`file-${type}`).value = '';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan dokumen.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus dokumen ini?')) return;
    
    try {
      await api.delete(`/profile/documents/${id}`);
      const profileRes = await api.get('/profile');
      setProfileData(profileRes.data.data);
    } catch (err) {
      alert('Gagal menghapus dokumen.');
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <FileText size={20} className="text-primary" /> {title}
      </h5>

      {error && <div className="alert alert-danger p-2 small">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-4 bg-light p-3 rounded-3 border">
        <h6 className="fw-bold mb-3 text-dark">Tambah {title} Baru</h6>
        <div className="mb-3">
          <label className="form-label text-muted small">Penjelasan Singkat</label>
          <textarea 
            className="form-control" 
            rows="2" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Tuliskan deskripsi atau penjelasan..."
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label text-muted small">Upload Bukti (PDF)</label>
          <input 
            type="file" 
            id={`file-${type}`}
            className="form-control" 
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary d-flex align-items-center gap-2 px-4" disabled={loading}>
          <Upload size={16} /> {loading ? 'Mengunggah...' : 'Unggah & Simpan'}
        </button>
      </form>

      {/* List Uploaded Documents */}
      <h6 className="fw-bold mb-3 text-muted">Daftar {title} Anda</h6>
      {currentDocs.length === 0 ? (
        <div className="text-center py-4 text-muted border rounded-3 border-dashed">
          <FileText size={32} className="opacity-25 mb-2" />
          <p className="mb-0 small">Belum ada data yang ditambahkan.</p>
        </div>
      ) : (
        <div className="list-group">
          {currentDocs.map(doc => (
            <div key={doc.id} className="list-group-item list-group-item-action p-3 d-flex justify-content-between align-items-center">
              <div className="me-3">
                <p className="mb-1 text-dark">{doc.description}</p>
                <a href={`${STORAGE_URL}/${doc.file_path}`} target="_blank" rel="noreferrer" className="text-decoration-none small text-primary d-inline-flex align-items-center gap-1">
                  <ExternalLink size={14} /> Lihat File PDF
                </a>
              </div>
              <button onClick={() => handleDelete(doc.id)} className="btn btn-outline-danger btn-sm p-2 rounded-circle" title="Hapus">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentForm;
