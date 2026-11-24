import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [bulan, setBulan] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const BULAN = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  useEffect(() => {
    loadGroups();
    loadSummary();
  }, [tahun, bulan]);

  const loadGroups = async () => {
    try {
      const res = await apiService.getGroups({ tahun, bulan });
      if (res.data.status === 'success') {
        setGroups(res.data.data || []);
      }
    } catch (err) {
      console.error('Error loading groups:', err);
    }
  };

  const loadSummary = async () => {
    try {
      const res = await apiService.getGroupSummary({ tahun });
      if (res.data.status === 'success') {
        setSummary(res.data.data || []);
      }
    } catch (err) {
      console.error('Error loading summary:', err);
    }
  };

  const handleGroupClick = async (group) => {
    setSelectedGroup(group);
    setDetailLoading(true);
    try {
      const res = await apiService.getGroupDetail(group.kode_kegiatan, { tahun, bulan });
      if (res.data.status === 'success') {
        setSelectedGroup({ ...group, detail: res.data.data });
      }
    } catch (err) {
      console.error('Error loading group detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedGroup(null);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatCurrency = (num) => {
    if (!num) return '0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="container-fluid pt-4">
      <div className="row mb-4">
        <div className="col-md-12">
          <h1>Laporan per Kegiatan (Groups)</h1>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <div className="form-group">
            <label>Tahun:</label>
            <select 
              className="form-control" 
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const y = new Date().getFullYear() - i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>Bulan:</label>
            <select 
              className="form-control" 
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
            >
              <option value="">-- Semua Bulan --</option>
              {BULAN.map((b, idx) => (
                <option key={idx} value={idx + 1}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>Ringkasan per Kegiatan</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                        <th>Kode Kegiatan</th>
                        <th>Nama Kegiatan</th>
                        <th className="text-right">Total Pagu</th>
                        <th className="text-right">Total Realisasi</th>
                        <th className="text-right">Total Sisa</th>
                        <th className="text-right">% Realisasi</th>
                        <th className="text-right">Jumlah Record</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.length > 0 ? (
                        summary.map((item, idx) => (
                          <tr key={idx} onClick={() => handleGroupClick(item)} style={{ cursor: 'pointer' }}>
                            <td>{item.kode_kegiatan}</td>
                            <td>{item.nama_kegiatan}</td>
                            <td className="text-right">{formatCurrency(item.total_pagu)}</td>
                            <td className="text-right">{formatCurrency(item.total_realisasi)}</td>
                            <td className="text-right">{formatCurrency(item.total_sisa)}</td>
                            <td className="text-right">{item.persen_realisasi}%</td>
                            <td className="text-right">{item.jumlah_record}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">Belum ada data</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>Detail Kegiatan</h5>
            </div>
            <div className="card-body">
              {selectedGroup ? (
                <>
                  <div className="mb-3">
                    <h6>{selectedGroup.kode_kegiatan} - {selectedGroup.nama_kegiatan}</h6>
                    <small className="text-muted">
                      Bulan: {bulan ? BULAN[parseInt(bulan) - 1] : 'Semua'} / Tahun: {tahun}
                    </small>
                  </div>
                  <button className="btn btn-secondary btn-sm mb-3" onClick={handleCloseDetail}>
                    Tutup Detail
                  </button>
                  {selectedGroup.detail && (
                    <div className="table-responsive">
                      <table className="table table-striped table-sm">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Bulan</th>
                            <th>Pagu</th>
                            <th>Realisasi</th>
                            <th>Sisa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedGroup.detail.map((item, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{BULAN[parseInt(item.bulan) - 1] || item.bulan}</td>
                              <td className="text-right">{formatCurrency(item.pagu_revisi)}</td>
                              <td className="text-right">{formatCurrency(item.realisasi_sd_periode)}</td>
                              <td className="text-right">{formatCurrency(item.sisa_anggaran)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {detailLoading && <p>Loading detail...</p>}
                </>
              ) : (
                <p className="text-center text-muted">Klik baris kegiatan untuk melihat detail</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Groups;