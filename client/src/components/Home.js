import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { apiService } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const [chartPagu, setChartPagu] = useState(null);
  const [chartRealisasi, setChartRealisasi] = useState(null);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const monthLabels = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  useEffect(() => {
    loadCharts();
  }, [tahun]);

  const loadCharts = async () => {
    try {
      setLoading(true);
      const [paguRes, realisasiRes] = await Promise.all([
        apiService.getChartPagu(tahun),
        apiService.getChartRealisasi(tahun)
      ]);

      if (paguRes.data.status === 'success') {
        const data = paguRes.data.data;
        setChartPagu({
          labels: monthLabels,
          datasets: [
            {
              label: 'Pagu (Miliar)',
              data: data.pagu,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            },
            {
              label: 'Realisasi (Miliar)',
              data: data.realisasi,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            },
            {
              label: 'Sisa (Miliar)',
              data: data.sisa,
              borderColor: 'rgb(255, 206, 86)',
              tension: 0.1
            }
          ]
        });
      }

      if (realisasiRes.data.status === 'success') {
        const data = realisasiRes.data.data;
        setChartRealisasi({
          labels: monthLabels,
          datasets: [
            {
              label: 'Persentase Realisasi (%)',
              data: data.persen,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.1)',
              tension: 0.1
            }
          ]
        });
      }
    } catch (err) {
      console.error('Error loading charts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid pt-4">
      <div className="row mb-4">
        <div className="col-md-12">
          <h1>Dashboard SPM</h1>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-12">
          <div className="form-group">
            <label>Pilih Tahun:</label>
            <select 
              className="form-control" 
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              style={{ maxWidth: '200px' }}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const y = new Date().getFullYear() - i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5>Chart Pagu, Realisasi & Sisa Anggaran</h5>
                </div>
                <div className="card-body">
                  {chartPagu ? (
                    <Line data={chartPagu} options={{ responsive: true }} />
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5>Persentase Realisasi</h5>
                </div>
                <div className="card-body">
                  {chartRealisasi ? (
                    <Line data={chartRealisasi} options={{ responsive: true }} />
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
