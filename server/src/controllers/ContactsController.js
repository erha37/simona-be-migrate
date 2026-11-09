const ContactsModels = require('../models/ContactsModels');
const path = require('path');
const fs = require('fs');

class ContactsController {
  async index(req, res) {
    try {
      const level = req.user?.level || '3';
      const user = req.user?.upt || '000111';

      const dataSatker = await ContactsModels.getSatker();
      const kdSatker = await ContactsModels.getKdSatker(level, user);

      const bulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];

      res.json({
        status: 'success',
        data: {
          dataSatker,
          kdSatker,
          bulan
        }
      });
    } catch (err) {
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }

  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ status: 'error', msg: 'File tidak ditemukan' });
      }

      const { nama_upt, bulan, tahunanggaran } = req.body;
      const uploadPath = path.join(__dirname, '../../uploads');

      // Create uploads dir if not exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const newFileName = `${nama_upt}-${tahunanggaran}${bulan}-${req.file.originalname}`;
      const filePath = path.join(uploadPath, newFileName);

      // Move file
      fs.renameSync(req.file.path, filePath);

      const fileData = {
        nama_upt: nama_upt,
        bulan: bulan,
        tahun_anggaran: tahunanggaran,
        file_path: `/uploads/${newFileName}`,
        original_name: req.file.originalname,
        file_type: req.file.mimetype,
        tgl_upload: new Date()
      };

      // Parse Excel jika ada xlsx library
      if (req.file.mimetype.includes('spreadsheet') || req.file.originalname.endsWith('.xlsx')) {
        // TODO: Parse Excel dan insert data
        // const XLSX = require('xlsx');
        // const workbook = XLSX.readFile(filePath);
        // // Process rows...
      }

      res.json({
        status: 'success',
        msg: 'File berhasil diupload',
        data: fileData
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }

  async create(req, res) {
    try {
      const dataSatker = await ContactsModels.getSatker();
      const bulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];

      res.json({
        status: 'success',
        data: { dataSatker, bulan }
      });
    } catch (err) {
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }
}

module.exports = new ContactsController();
