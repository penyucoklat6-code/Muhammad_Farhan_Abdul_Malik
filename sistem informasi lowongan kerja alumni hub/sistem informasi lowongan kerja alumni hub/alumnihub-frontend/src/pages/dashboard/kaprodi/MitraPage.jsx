import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import api, { STORAGE_URL } from '../../../services/api';
import { Plus, Edit, Trash2, Building2, Save, MapPin, Calendar, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

const MitraPage = () => {
  const { theme } = useContext(ThemeContext);
  const [mitras, setMitras] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    logo: null,
    established_date: '',
    address: '',
    website_url: ''
  });
  const [previewLogo, setPreviewLogo] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMitras(currentPage);
  }, [currentPage]);

  const fetchMitras = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get('/mitras', { params: { page, per_page: 20 } });
      const data = res.data.data;
      if (data.data) {
        // Paginated
        setMitras(data.data);
        setCurrentPage(data.current_page);
        setTotalPages(data.last_page);
      } else {
        // Not paginated (fallback)
        setMitras(data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to fetch mitras', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleOpenModal = (mitra = null) => {
    if (mitra) {
      setIsEditing(true);
      setCurrentId(mitra.id);
      setFormData({ 
        name: mitra.name, 
        description: mitra.description || '', 
        established_date: mitra.established_date || '',
        address: mitra.address || '',
        website_url: mitra.website_url || '',
        logo: null 
      });
      setPreviewLogo(mitra.logo ? `${STORAGE_URL}/${mitra.logo}` : null);
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({ 
        name: '', 
        description: '', 
        established_date: '',
        address: '',
        website_url: '',
        logo: null 
      });
      setPreviewLogo(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const data = new FormData();
    data.append('name', formData.name);
    if (formData.description) data.append('description', formData.description);
    if (formData.established_date) data.append('established_date', formData.established_date);
    if (formData.address) data.append('address', formData.address);
    if (formData.website_url) data.append('website_url', formData.website_url);

    if (formData.logo) {
      data.append('logo', formData.logo);
    }
    
    if (isEditing) {
      data.append('_method', 'PUT');
    }

    try {
      if (isEditing) {
        await api.post(`/mitras/${currentId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Mitra berhasil diperbarui');
      } else {
        await api.post('/mitras', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Mitra berhasil ditambahkan');
      }
      setShowModal(false);
      fetchMitras(currentPage);
    } catch (error) {
      alert('Gagal menyimpan mitra: ' + (error.response?.data?.message || 'Error server'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus mitra "${name}"?`)) {
      try {
        await api.delete(`/mitras/${id}`);
        fetchMitras(currentPage);
      } catch (error) {
        alert('Gagal menghapus mitra');
      }
    }
  };

  return (
    <div className={`card shadow-sm border-0 rounded-4 ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
      <div className={`card-header border-0 py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 rounded-top-4 ${theme === 'dark' ? 'bg-dark border-bottom border-secondary' : 'bg-white'}`}>
        <div>
          <h5 className="mb-1 fw-bold d-flex align-items-center gap-2"><Building2 size={20} className="text-primary" /> Kelola Mitra Perusahaan</h5>
          <p className="text-muted small mb-0">Daftar perusahaan yang berkolaborasi dengan Alumni Hub.</p>
        </div>
        <div>
          <button onClick={() => handleOpenModal()} className="btn btn-sm btn-primary d-flex align-items-center gap-1 rounded-3 px-3 py-2 fw-medium">
            <Plus size={16} /> Tambah Mitra
          </button>
        </div>
      </div>

      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        ) : mitras.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <Building2 size={48} className="mb-3 opacity-25" />
            <p className="mb-0">Belum ada mitra perusahaan yang terdaftar.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${theme === 'dark' ? 'table-dark' : ''}`}>
              <thead>
                <tr className={theme === 'dark' ? '' : 'table-light'}>
                  <th className="ps-4">Perusahaan</th>
                  <th>Detail & Kontak</th>
                  <th className="text-end pe-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mitras.map((mitra) => (
                  <tr key={mitra.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden bg-white border" 
                             style={{ width: '50px', height: '50px' }}>
                          {mitra.logo ? (
                            <img src={`${STORAGE_URL}/${mitra.logo}`} alt="" className="w-100 h-100" style={{ objectFit: 'contain', padding: '4px' }} />
                          ) : (
                            <Building2 size={24} className="text-primary opacity-50" />
                          )}
                        </div>
                        <div>
                          <span className="fw-bold fs-6">{mitra.name}</span>
                          {mitra.established_date && (
                            <div className="small text-muted d-flex align-items-center gap-1 mt-1">
                              <Calendar size={12} /> Berdiri: {new Date(mitra.established_date).getFullYear()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small text-muted d-flex flex-column gap-1">
                        {mitra.address && <div className="d-flex align-items-start gap-1"><MapPin size={14} className="mt-1 flex-shrink-0" /> <span className="text-truncate" style={{maxWidth:'300px'}}>{mitra.address}</span></div>}
                        {mitra.website_url && <div className="d-flex align-items-center gap-1"><Globe size={14} /> <a href={mitra.website_url} target="_blank" rel="noreferrer" className="text-primary text-decoration-none">{mitra.website_url}</a></div>}
                        {!mitra.address && !mitra.website_url && <span>-</span>}
                      </div>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-1">
                        <button onClick={() => handleOpenModal(mitra)} className="btn btn-sm btn-outline-primary rounded-2" title="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => handleDelete(mitra.id, mitra.name)} className="btn btn-sm btn-outline-danger rounded-2" title="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={`card-footer border-0 d-flex justify-content-between align-items-center py-3 px-4 ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}>
          <span className="small text-muted">Halaman {currentPage} dari {totalPages}</span>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm btn-outline-primary rounded-2" 
              disabled={currentPage === 1} 
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              className="btn btn-sm btn-outline-primary rounded-2" 
              disabled={currentPage === totalPages} 
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modal Form Mitra */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className={`modal-content rounded-4 border-0 shadow-lg ${theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}`}>
                <div className={`modal-header ${theme === 'dark' ? 'border-secondary' : ''}`}>
                  <h5 className="modal-title fw-bold">
                    {isEditing ? 'Edit Mitra' : 'Tambah Mitra Baru'}
                  </h5>
                  <button type="button" className={`btn-close ${theme === 'dark' ? 'btn-close-white' : ''}`} onClick={handleCloseModal}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Nama Perusahaan <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className={`form-control ${theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}`}
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Tanggal Terdaftar / Berdiri</label>
                        <input 
                          type="date" 
                          className={`form-control ${theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}`}
                          value={formData.established_date} 
                          onChange={(e) => setFormData({...formData, established_date: e.target.value})} 
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label fw-medium">Alamat Lengkap</label>
                        <textarea 
                          className={`form-control ${theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}`}
                          rows="2" 
                          value={formData.address} 
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                        ></textarea>
                      </div>
                      <div className="col-md-12">
                        <label className="form-label fw-medium">Halaman Website (URL)</label>
                        <input 
                          type="url" 
                          className={`form-control ${theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}`}
                          placeholder="https://example.com"
                          value={formData.website_url} 
                          onChange={(e) => setFormData({...formData, website_url: e.target.value})} 
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label fw-medium">Deskripsi Singkat</label>
                        <textarea 
                          className={`form-control ${theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}`}
                          rows="3" 
                          value={formData.description} 
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                      </div>
                      <div className="col-md-12">
                        <label className="form-label fw-medium">Logo Perusahaan</label>
                        <input 
                          type="file" 
                          className={`form-control ${theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}`}
                          accept="image/*" 
                          onChange={handleFileChange} 
                        />
                        {previewLogo && (
                          <div className="mt-3 text-center p-3 border rounded bg-white" style={{ maxWidth: '150px' }}>
                            <img src={previewLogo} alt="Preview" className="img-fluid" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`modal-footer ${theme === 'dark' ? 'border-secondary' : ''}`}>
                    <button type="button" className="btn btn-light px-4 rounded-3" onClick={handleCloseModal}>Batal</button>
                    <button type="submit" className="btn btn-primary d-flex align-items-center gap-2 px-4 rounded-3" disabled={saving}>
                      <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Perusahaan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MitraPage;
