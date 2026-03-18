"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMethods = exports.getCategories = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
/**
 * [READ] Ambil semua daftar Kategori
 * Endpoint: GET /api/utilities/categories
 */
const getCategories = async (req, res) => {
    try {
        const [categories] = await db_config_1.default.query('SELECT id_kategori, nama_kategori FROM kategori ORDER BY nama_kategori ASC');
        res.status(200).json({
            message: 'Daftar kategori berhasil diambil.',
            data: categories
        });
    }
    catch (error) {
        console.error('Error saat mengambil kategori:', error);
        res.status(500).json({ message: 'Gagal mengambil data kategori.', error });
    }
};
exports.getCategories = getCategories;
/**
 * [READ] Ambil semua daftar Metode Pengelolaan
 * Endpoint: GET /api/utilities/methods
 */
const getMethods = async (req, res) => {
    try {
        const [methods] = await db_config_1.default.query('SELECT id_metode, namaMetode, deskripsiMetode FROM metodemengelola ORDER BY id_metode ASC');
        res.status(200).json({
            message: 'Daftar metode pengelolaan berhasil diambil.',
            data: methods
        });
    }
    catch (error) {
        console.error('Error saat mengambil metode pengelolaan:', error);
        res.status(500).json({ message: 'Gagal mengambil data metode pengelolaan.', error });
    }
};
exports.getMethods = getMethods;
