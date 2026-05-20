import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';
import { ArrowLeft, Save, Briefcase, FileText, Image, MapPin, DollarSign, Calendar, Building2 } from 'lucide-react';

const KaprodiJobFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [majors, setMajors] = useState([]);
  const [mitras, setMitras] = useState([]);
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', type: 'full-time', work_arrangement: 'WFO',
    category_id: '', major_id: '', description: '', requirements: '',
    salary_min: '', salary_max: '', deadline: '', external_link: ''
  });
  const [posterFile, setPosterFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, majRes, mitraRes] = await Promise.all([api.get('/categories'), api.get('/majors'), api.get('/mitras')]);
        setCategories(catRes.data.data || catRes.data);
        setMajors(majRes.data.data || majRes.data);
        const mitraData = mitraRes.data.data;
        setMitras(mitraData?.data || mitraData || []);
        if (isEdit) {
          const jobRes = await api.get(`/jobs/${id}`);
          const job = jobRes.data.data;
          setFormData({ title: job.title||'', company: job.company||'', location: job.location||'', type: job.type||'full-time', work_arrangement: job.work_arrangement||'WFO', category_id: job.category_id||'', major_id: job.major_id||'', description: job.description||'', requirements: job.requirements||'', salary_min: job.salary_min||'', salary_max: job.salary_max||'', deadline: job.deadline ? job.deadline.split('T')[0] : '', external_link: job.external_link||'' });
        }
      } catch (err) { console.error(err); setError('Gagal memuat data formulir.'); }
      finally { setFetching(false); }
    };
    fetchData();
  }, [id, isEdit]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    if (formData.salary_min && formData.salary_max && Number(formData.salary_min) > Number(formData.salary_max)) { setError('Gaji minimum harus lebih kecil dari gaji maksimum.'); setLoading(false); return; }
    const payload = new FormData();
    Object.keys(formData).forEach(key => { if (formData[key] !== null && formData[key] !== '') payload.append(key, formData[key]); });
    if (posterFile) payload.append('poster', posterFile);
    if (logoFile) payload.append('logo', logoFile);
    try {
      if (isEdit) { payload.append('_method', 'PUT'); await api.post(`/jobs/${id}`, payload); alert('Lowongan berhasil diperbarui!'); }
      else { await api.post('/jobs', payload); alert('Lowongan berhasil diterbitkan!'); }
      navigate('/dashboard/kaprodi/jobs');
    } catch (err) {
      if (err.response?.status === 401) { alert('Sesi Anda telah berakhir.'); navigate('/login'); return; }
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.');
      if (err.response?.data?.errors) alert(Object.values(err.response.data.errors).flat().join('\n'));
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="text-center p-5"><span className="spinner-border" style={{ color: 'var(--primary)' }}></span></div>;

  const labelStyle = { color: 'var(--text-muted)', fontSize: '0.875rem' };
  const inputStyle = { background: 'var(--light)', borderColor: 'var(--border)', color: 'var(--text-main)' };

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="d-flex align-items-center gap-3 p-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link to="/dashboard/kaprodi/jobs" className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-card)' }}>
          <ArrowLeft size={16} />
        </Link>
        <h5 className="mb-0 fw-bold" style={{ color: 'var(--text-main)' }}>{isEdit ? 'Edit Lowongan' : 'Buat Lowongan Baru (Kaprodi)'}</h5>
        {!isEdit && <span className="badge rounded-pill" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', fontSize: '0.75rem' }}>Auto-Publish</span>}
      </div>
      
      <div className="p-4">
        {error && <div className="alert alert-danger d-flex align-items-center gap-2 small py-2 mb-4" style={{ borderRadius: 'var(--radius-sm)' }}>{error}</div>}
        {!isEdit && (
          <div className="d-flex align-items-center gap-2 p-3 rounded-3 mb-4" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.85rem', border: '1px solid rgba(45,90,61,0.12)' }}>
            <Briefcase size={18} className="flex-shrink-0" /> Lowongan yang dibuat oleh Kaprodi akan <strong>otomatis dipublikasikan</strong> tanpa perlu proses approval.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium" style={labelStyle}><Briefcase size={14} className="me-1"/> Posisi Pekerjaan <span className="text-danger">*</span></label>
              <input type="text" name="title" className="form-control" style={inputStyle} value={formData.title} onChange={handleChange} required placeholder="Contoh: Frontend Developer" />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium" style={labelStyle}><Building2 size={14} className="me-1"/> Nama Perusahaan (Mitra) <span className="text-danger">*</span></label>
              <select name="company" className="form-select" style={inputStyle} value={formData.company} onChange={handleChange} required>
                <option value="">-- Pilih Mitra Perusahaan --</option>
                {Array.isArray(mitras) && mitras.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <label className="form-label fw-medium" style={labelStyle}><MapPin size={14} className="me-1"/> Lokasi <span className="text-danger">*</span></label>
              <input type="text" name="location" className="form-control" style={inputStyle} value={formData.location} onChange={handleChange} required placeholder="Jakarta Selatan" />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label fw-medium" style={labelStyle}>Sistem Kerja <span className="text-danger">*</span></label>
              <select name="work_arrangement" className="form-select" style={inputStyle} value={formData.work_arrangement} onChange={handleChange} required>
                <option value="WFO">WFO (Work From Office)</option>
                <option value="WFH">WFH (Work From Home)</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label fw-medium" style={labelStyle}>Tipe Pekerjaan <span className="text-danger">*</span></label>
              <select name="type" className="form-select" style={inputStyle} value={formData.type} onChange={handleChange} required>
                <option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="internship">Internship</option><option value="contract">Contract</option><option value="freelance">Freelance</option>
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label fw-medium" style={labelStyle}><Calendar size={14} className="me-1"/> Deadline <span className="text-danger">*</span></label>
              <input type="date" name="deadline" className="form-control" style={inputStyle} value={formData.deadline} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="mb-4 small text-muted" style={{ marginTop: '-15px', background: 'var(--light)', padding: '10px 15px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <strong>Catatan Sistem Kerja:</strong> Pilih <b>WFO</b> jika harus hadir ke kantor, <b>WFH</b> jika bekerja jarak jauh (remote), dan <b>Hybrid</b> jika kombinasi keduanya. Tidak selalu harus WFO dan tidak menutup kemungkinan WFH.
          </div>
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium" style={labelStyle}>Kategori <span className="text-danger">*</span></label>
              <select name="category_id" className="form-select" style={inputStyle} value={formData.category_id} onChange={handleChange} required>
                <option value="">-- Pilih Kategori --</option>
                {Array.isArray(categories) && categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium" style={labelStyle}>Jurusan Terkait (Opsional)</label>
              <select name="major_id" className="form-select" style={inputStyle} value={formData.major_id} onChange={handleChange}>
                <option value="">-- Semua Jurusan --</option>
                {Array.isArray(majors) && majors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium" style={labelStyle}><DollarSign size={14} className="me-1"/> Gaji Minimum (Opsional)</label>
              <input type="number" name="salary_min" className="form-control" style={inputStyle} value={formData.salary_min} onChange={handleChange} placeholder="5000000" />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium" style={labelStyle}><DollarSign size={14} className="me-1"/> Gaji Maksimum (Opsional)</label>
              <input type="number" name="salary_max" className="form-control" style={inputStyle} value={formData.salary_max} onChange={handleChange} placeholder="10000000" />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label fw-medium" style={labelStyle}><FileText size={14} className="me-1"/> Deskripsi Pekerjaan <span className="text-danger">*</span></label>
            <textarea name="description" className="form-control" style={inputStyle} rows="4" value={formData.description} onChange={handleChange} required placeholder="Jelaskan peran dan tanggung jawab..."></textarea>
          </div>
          <div className="mb-4">
            <label className="form-label fw-medium" style={labelStyle}><FileText size={14} className="me-1"/> Persyaratan <span className="text-danger">*</span></label>
            <textarea name="requirements" className="form-control" style={inputStyle} rows="4" value={formData.requirements} onChange={handleChange} required placeholder="Kualifikasi, skill yang dibutuhkan..."></textarea>
          </div>
          <div className="mb-4">
            <label className="form-label fw-medium" style={labelStyle}>Link Perusahaan (Opsional)</label>
            <input type="url" name="external_link" className="form-control" style={inputStyle} value={formData.external_link} onChange={handleChange} placeholder="https://perusahaan.com" />
          </div>
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium" style={labelStyle}><Image size={14} className="me-1"/> Poster Lowongan (Opsional)</label>
              <input type="file" className="form-control" style={inputStyle} accept="image/*" onChange={e => setPosterFile(e.target.files[0])} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium" style={labelStyle}><Image size={14} className="me-1"/> Logo Perusahaan (Opsional)</label>
              <input type="file" className="form-control" style={inputStyle} accept="image/*" onChange={e => setLogoFile(e.target.files[0])} />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <Link to="/dashboard/kaprodi/jobs" className="btn px-4" style={{ background: 'var(--light)', color: 'var(--text-main)', borderRadius: 'var(--radius-sm)' }}>Batal</Link>
            <button type="submit" className="btn btn-primary px-4 d-flex align-items-center gap-2" disabled={loading}>
              <Save size={18} /> {loading ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Terbitkan Lowongan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KaprodiJobFormPage;
