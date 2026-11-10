const HomeModels = require('../models/HomeModels');

class HomeController {
  async index(req, res) {
    try {
      const upt = req.user?.upt || '000111';
      const tahun = new Date().getFullYear().toString();

      const chartPagu = await HomeModels.chartPagu(upt, tahun);
      const chartRealisasi = await HomeModels.chartRealisasi(upt, tahun);

      res.json({
        status: 'success',
        data: { chartPagu, chartRealisasi }
      });
    } catch (err) {
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }

  async getChartData(req, res) {
    try {
      const upt = req.user?.upt || '000111';
      const tahun = req.query.tahun || new Date().getFullYear().toString();

      const data = await HomeModels.chartPagu(upt, tahun);

      if (!data || Object.keys(data).length === 0) {
        return res.json({
          status: 'error',
          msg: 'No data found'
        });
      }

      res.json({
        status: 'success',
        msg: '',
        data: data
      });
    } catch (err) {
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }

  async getChartRealisasi(req, res) {
    try {
      const upt = req.user?.upt || '000111';
      const tahun = req.query.tahunrealisasi || new Date().getFullYear().toString();

      const data = await HomeModels.chartRealisasi(upt, tahun);

      if (!data || Object.keys(data).length === 0) {
        return res.json({
          status: 'error',
          msg: 'No data found'
        });
      }

      res.json({
        status: 'success',
        msg: '',
        data: data
      });
    } catch (err) {
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }

  async getSummary(req, res) {
    try {
      const upt = req.user?.upt || '000111';
      const tahun = req.query.tahun || new Date().getFullYear().toString();

      const summary = await HomeModels.getSummary(upt, tahun);

      res.json({
        status: 'success',
        data: summary
      });
    } catch (err) {
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }

  async getTopKegiatan(req, res) {
    try {
      const upt = req.user?.upt || '000111';
      const tahun = req.query.tahun || new Date().getFullYear().toString();
      const limit = parseInt(req.query.limit) || 5;

      const top = await HomeModels.getTopKegiatan(upt, tahun, limit);

      res.json({
        status: 'success',
        data: top
      });
    } catch (err) {
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }
}

module.exports = new HomeController();
