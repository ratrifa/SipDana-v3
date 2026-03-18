"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDbConnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
// Muat variabel lingkungan dari file .env
dotenv_1.default.config();
// Konfigurasi koneksi
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
// Buat pool koneksi 
const pool = promise_1.default.createPool(dbConfig);
// Fungsi untuk menguji koneksi database saat server berjalan
const testDbConnection = async () => {
    try {
        // Tipe data yang diambil dari pool.getConnection() adalah PoolConnection
        const connection = await pool.getConnection();
        console.log('✅ Koneksi Database MySQL Berhasil!');
        connection.release(); // Sekarang .release() dikenali
    }
    catch (error) {
        console.error('❌ Gagal terhubung ke database MySQL:', error);
        // Hentikan aplikasi jika koneksi DB gagal
        process.exit(1);
    }
};
exports.testDbConnection = testDbConnection;
// Ekspor pool untuk digunakan di Controllers/Services
exports.default = pool;
