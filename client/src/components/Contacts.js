import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    nama_upt: '',
    bulan: '',
    tahunanggaran: new Date().getFullYear()
  });
  const [satkerList, setSatkerList] = useState([]);
  const [bulanList, setBulanList] = useState([]);

  const BULAN = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const res = await apiService.getContactsList();
      if (res.data.status === 'success') {
        setContacts(res.data.data.kdSatker || []);
        setSatkerList(res.data.data.dataSatker || []);
        setBulanList(BULAN);
      }
    } catch (err) {
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Pilih file terlebih dahulu');
      return;
    }

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('nama_upt', formData.nama_upt);
      data.append('bulan', formData.bulan);
      data.append('tahunanggaran', formData.tahunanggaran);

      const res = await apiService.uploadFile(data);
      if (res.data.status === 'success') {
        alert('File berhasil diupload');
        setFile(null);
        setFormData({ nama_upt: '', bulan: '', tahunanggaran: new Date().getFullYear() });
        loadContacts();
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Gagal mengupload file');
    }
  };

  return (
    <div className="container-fluid pt-4">
      <div className="row mb-4">
        <div className="col-md-12">
          <h1>Upload Laporan Keuangan</h1>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Form Upload</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpload}>
                <div className="form-group mb-3">
                  <label>UPT</label>
                  <select 
                    name="nama_upt" 
                    className="form-control" 
                    value={formData.nama_upt}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Pilih UPT --</option>
                    {satkerList.map(satker => (
                      <option key={satker.kd_satker} value={satker.nama_satker}>
                        {satker.nama_satker}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label>Bulan</label>
                  <select 
                    name="bulan" 
                    className="form-control" 
                    value={formData.bulan}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Pilih Bulan --</option>
                    {bulanList.map((bulan, idx) => (
                      <option key={idx} value={idx + 1}>
                        {bulan}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label>Tahun Anggaran</label>
                  <input 
                    type="number" 
                    name="tahunanggaran" 
                    className="form-control" 
                    value={formData.tahunanggaran}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label>File (Excel)</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">Upload</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>Daftar Laporan</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>UPT</th>
                      <th>Bulan / Tahun</th>
                      <th>Tanggal Upload</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.length > 0 ? (
                      contacts.map((contact, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{contact.upt}</td>
                          <td>{contact.bulan} / {contact.tahun_anggaran}</td>
                          <td>{new Date(contact.tgl_upload).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">Belum ada data</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
