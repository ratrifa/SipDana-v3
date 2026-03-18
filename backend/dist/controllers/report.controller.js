"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalysisReport = exports.getHistoricalData = exports.getMonthlySummary = exports.getTransactionHistory = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const buildTimeFilter = (req) => {
    const { month, year, start_date, end_date } = req.query;
    let clause = '';
    let values = [];
    if (start_date && end_date) {
        clause = 'AND DATE(tanggal) BETWEEN ? AND ?';
        values.push(start_date, end_date);
    }
    else if (month) {
        clause = 'AND DATE_FORMAT(tanggal, "%Y-%m") = ?';
        values.push(month);
    }
    else if (year) {
        clause = 'AND YEAR(tanggal) = ?';
        values.push(year);
    }
    return { clause, values };
};
/**
 * [GET] Mengambil Riwayat Transaksi Terbaru
 */
const getTransactionHistory = async (req, res) => {
    const userId = req.user?.id_user;
    if (!userId)
        return res.status(401).json({ message: 'User ID tidak ditemukan.' });
    const { clause, values } = buildTimeFilter(req);
    try {
        const [rows] = await db_config_1.default.query(`
            SELECT 
                t.id_transaksi, t.jenis, t.jumlah, t.keterangan, t.tanggal, t.created_at, k.nama_kategori
            FROM transaksi t
            JOIN kategori k ON t.id_kategori = k.id_kategori
            WHERE t.id_user = ? ${clause}
            ORDER BY t.tanggal DESC, t.created_at DESC 
            LIMIT 10
            `, [userId, ...values]);
        res.status(200).json({
            message: 'Riwayat transaksi berhasil diambil.',
            data: rows
        });
    }
    catch (error) {
        console.error('Error saat mengambil riwayat transaksi:', error);
        res.status(500).json({ message: 'Gagal mengambil riwayat transaksi.' });
    }
};
exports.getTransactionHistory = getTransactionHistory;
/**
 * [GET] Mengambil Ringkasan Laporan (Saldo, Pemasukan, Pengeluaran)
 */
const getMonthlySummary = async (req, res) => {
    const userId = req.user?.id_user;
    if (!userId)
        return res.status(401).json({ message: 'User ID tidak ditemukan.' });
    const { clause, values } = buildTimeFilter(req);
    try {
        const [saldoRow] = await db_config_1.default.query('SELECT saldo_sekarang FROM saldo WHERE id_user = ?', [userId]);
        const saldoAkhir = saldoRow.length > 0 ? saldoRow[0].saldo_sekarang : 0;
        const [summaryRows] = await db_config_1.default.query(`
            SELECT 
                SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE 0 END) AS totalPemasukan,
                SUM(CASE WHEN jenis = 'pengeluaran' THEN jumlah ELSE 0 END) AS totalPengeluaran
            FROM transaksi
            WHERE id_user = ? ${clause}
            `, [userId, ...values]);
        const summary = summaryRows[0];
        const totalPemasukan = summary?.totalPemasukan || 0;
        const totalPengeluaran = summary?.totalPengeluaran || 0;
        const neto = totalPemasukan - totalPengeluaran;
        res.status(200).json({
            message: `Ringkasan berhasil diambil.`,
            data: { totalPemasukan, totalPengeluaran, neto, saldoAkhir }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Gagal mengambil ringkasan.' });
    }
};
exports.getMonthlySummary = getMonthlySummary;
/**
 * [GET] Mengambil Data Historis DINAMIS (Mingguan / Bulanan / Tahunan)
 */
const getHistoricalData = async (req, res) => {
    const userId = req.user?.id_user;
    if (!userId)
        return res.status(401).json({ message: 'User ID tidak ditemukan.' });
    const { unit } = req.query;
    let groupBy = '';
    let labelField = '';
    let limit = 6;
    switch (unit) {
        case 'mingguan':
            groupBy = 'YEARWEEK(tanggal, 1)';
            labelField = "DATE_FORMAT(DATE_SUB(tanggal, INTERVAL WEEKDAY(tanggal) DAY), '%d %b')";
            limit = 8;
            break;
        case 'tahunan':
            groupBy = 'YEAR(tanggal)';
            labelField = 'YEAR(tanggal)';
            limit = 5;
            break;
        case 'bulanan':
        default:
            groupBy = 'DATE_FORMAT(tanggal, "%Y-%m")';
            labelField = 'DATE_FORMAT(tanggal, "%b")';
            limit = 6;
            break;
    }
    try {
        const [rows] = await db_config_1.default.query(`
            SELECT
                ${groupBy} AS groupKey,
                ${labelField} AS label,
                SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE 0 END) AS pemasukan,
                SUM(CASE WHEN jenis = 'pengeluaran' THEN jumlah ELSE 0 END) AS pengeluaran
            FROM transaksi
            WHERE id_user = ?
            GROUP BY groupKey, label
            ORDER BY groupKey DESC
            LIMIT ?
            `, [userId, limit]);
        const chartData = rows.reverse().map(row => ({
            label: row.label,
            pemasukan: parseFloat(row.pemasukan) || 0,
            pengeluaran: parseFloat(row.pengeluaran) || 0
        }));
        res.status(200).json({
            message: `Data historis ${unit || 'bulanan'} berhasil diambil.`,
            data: chartData
        });
    }
    catch (error) {
        console.error('Error Historical Data:', error);
        res.status(500).json({ message: 'Gagal mengambil data historis.' });
    }
};
exports.getHistoricalData = getHistoricalData;
/**
 * [GET] Mengambil Laporan Analisis Lengkap
 */
const getAnalysisReport = async (req, res) => {
    const userId = req.user?.id_user;
    if (!userId)
        return res.status(401).json({ message: 'User ID tidak ditemukan.' });
    const { clause, values } = buildTimeFilter(req);
    try {
        const [summaryQuery] = await db_config_1.default.query(`SELECT 
                SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE 0 END) AS totalPemasukan,
                SUM(CASE WHEN jenis = 'pengeluaran' THEN jumlah ELSE 0 END) AS totalPengeluaran
            FROM transaksi
            WHERE id_user = ? ${clause}`, [userId, ...values]);
        const totalPemasukan = summaryQuery[0]?.totalPemasukan || 0;
        const totalPengeluaran = summaryQuery[0]?.totalPengeluaran || 0;
        const neto = totalPemasukan - totalPengeluaran;
        const [topOut] = await db_config_1.default.query(`SELECT k.nama_kategori, SUM(t.jumlah) AS jumlah
            FROM transaksi t
            JOIN kategori k ON t.id_kategori = k.id_kategori
            WHERE t.id_user = ? AND t.jenis = 'pengeluaran' ${clause}
            GROUP BY k.nama_kategori ORDER BY jumlah DESC LIMIT 1`, [userId, ...values]);
        let tipe;
        if (totalPemasukan === 0 && totalPengeluaran === 0) {
            tipe = 'Umum';
        }
        else if (neto < 0) {
            tipe = 'Kontrol Pengeluaran';
        }
        else if (neto > totalPemasukan * 0.2) {
            tipe = 'Optimasi Keuangan';
        }
        else {
            tipe = 'Umum';
        }
        const [rows] = await db_config_1.default.query(`SELECT 
                r.tipeRekomendasi, r.detailRekomendasi, m.namaMetode, 
                m.deskripsiMetode, m.langkah_implementasi 
             FROM rekomendasi r
             LEFT JOIN metodemengelola m ON r.id_metode = m.id_metode
             WHERE r.tipeRekomendasi = ?
             ORDER BY m.id_metode ASC LIMIT 1`, [tipe]);
        res.status(200).json({
            message: 'Laporan analisis berhasil diambil.',
            data: {
                summary: { totalPemasukan, totalPengeluaran, neto },
                topPengeluaran: topOut[0] || null,
                recommendation: rows[0] || null
            }
        });
    }
    catch (error) {
        console.error('Error Analysis:', error);
        res.status(500).json({ message: 'Gagal mengambil data analisis.' });
    }
};
exports.getAnalysisReport = getAnalysisReport;
