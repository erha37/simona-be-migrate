const ContactsModels = require('../models/ContactsModels');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const { SpmProgram } = require('../models');

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

  async parseExcel(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Skip header row, process data rows
      const dataRows = jsonData.slice(1);
      const parsedData = [];
      
      for (const row of dataRows) {
        if (!row || row.length === 0) continue;
        
        // Expected columns: kode_kegiatan, nama_kegiatan, pagu_revisi, realisasi_sd_periode, sisa_anggaran
        // Adjust based on actual Excel structure
        const item = {
          kode_kegiatan: row[0] || '',
          nama_kegiatan: row[1] || '',
          pagu_revisi: parseFloat(row[2]) || 0,
          realisasi_sd_periode: parseFloat(row[3]) || 0,
          sisa_anggaran: parseFloat(row[4]) || 0
        };
        
        if (item.kode_kegiatan && item.nama_kegiatan) {
          parsedData.push(item);
        }
      }
      
      return parsedData;
    } catch (err) {
      console.error('Excel parse error:', err);
      throw err;
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

      // Parse Excel jika spreadsheet
      let parsedCount = 0;
      if (req.file.mimetype.includes('spreadsheet') || req.file.originalname.endsWith('.xlsx') || req.file.originalname.endsWith('.xls')) {
        try {
          const parsedData = await this.parseExcel(filePath);
          
          // Get or create id_spm_program based on nama_upt, bulan, tahunanggaran
          const [program] = await SpmProgram.findOrCreate({
            where: {
              nama_upt,
              bulan,
              tahun_anggaran: tahunanggaran,
              is_active: '1'
            }
          });
          const id_spm_program = program.id_spm_program;

          if (id_spm_program) {
            for (const item of parsedData) {
              const insertData = {
                id_spm_program,
                kd_unit: req.user?.upt || '000111',
                nama_upt,
                kode_kegiatan: item.kode_kegiatan,
                nama_kegiatan: item.nama_kegiatan,
                pagu_revisi: item.pagu_revisi,
                realisasi_sd_periode: item.realisasi_sd_periode,
                sisa_anggaran: item.sisa_anggaran,
                upt_id: req.user?.upt || '000111',
                bulan: parseInt(bulan),
                tahun_anggaran: parseInt(tahunanggaran)
              };
              
              await ContactsModels.insertKegiatan(insertData);
              parsedCount++;
            }
          }
        } catch (parseErr) {
          console.error('Parse/insert error:', parseErr);
          // Continue - file uploaded but parse failed
        }
      }

      res.json({
        status: 'success',
        msg: `File berhasil diupload${parsedCount > 0 ? `, ${parsedCount} data kegiatan diimport` : ''}`,
        data: { ...fileData, parsedCount }
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
