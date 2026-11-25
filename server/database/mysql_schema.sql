-- SIMONA MySQL Schema & Seed Data
-- Run this in MySQL Workbench

CREATE DATABASE IF NOT EXISTS `ep` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ep`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `upt` VARCHAR(20) DEFAULT '000111',
  `role` VARCHAR(50) DEFAULT 'user',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Satker table
CREATE TABLE IF NOT EXISTS `tb_satker` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kd_satker` VARCHAR(20),
  `nama_satker` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- SPM Program table
CREATE TABLE IF NOT EXISTS `tb_spm_program` (
  `id_spm_program` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_upt` VARCHAR(255),
  `bulan` VARCHAR(10),
  `tahun_anggaran` VARCHAR(10),
  `is_active` VARCHAR(5) DEFAULT '1',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- SPM Kegiatan table
CREATE TABLE IF NOT EXISTS `tb_spm_kegiatan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_spm_program` INT,
  `kd_unit` VARCHAR(50),
  `nama_upt` VARCHAR(255),
  `kode_kegiatan` VARCHAR(50),
  `nama_kegiatan` VARCHAR(255),
  `pagu_revisi` DECIMAL(15,2) DEFAULT 0,
  `realisasi_sd_periode` DECIMAL(15,2) DEFAULT 0,
  `sisa_anggaran` DECIMAL(15,2) DEFAULT 0,
  `upt_id` VARCHAR(20),
  `bulan` VARCHAR(10),
  `tahun_anggaran` VARCHAR(10),
  `is_active` VARCHAR(5) DEFAULT '1',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed: Admin user (password: password123, bcrypt hash)
INSERT IGNORE INTO `users` (`username`, `password`, `upt`, `role`) VALUES
('admin', '$2b$10$K77h2bTz4mzaQ34y71m5B./oVlFXsCK69MrtRqZfrGkBd4e81PYkG', '000111', 'admin');

-- Seed: Satker data
INSERT IGNORE INTO `tb_satker` (`kd_satker`, `nama_satker`) VALUES
('000111', 'BPPMHKP Pusat'),
('000222', 'BPPMHKP Wilayah');

-- Seed: Sample SPM Kegiatan
INSERT IGNORE INTO `tb_spm_kegiatan` (`nama_upt`, `bulan`, `tahun_anggaran`, `kode_kegiatan`, `nama_kegiatan`, `pagu_revisi`, `realisasi_sd_periode`, `sisa_anggaran`, `upt_id`, `is_active`) VALUES
('UPT Test', '01', '2026', '1.01.01', 'Test Kegiatan', 1000000, 500000, 500000, '000111', '1');