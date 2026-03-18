"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contributeToTarget = exports.createTarget = exports.getActiveTargets = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
/**
 * [GET] Mengambil semua target menabung user yang aktif
 */
const getActiveTargets = async (req, res) => {
    const userId = req.user?.id_user;
    try {
        const [rows] = await db_config_1.default.query('SELECT id_target, id_user, nama_target, target_jumlah, jumlah_terkumpul, tanggal_target, status FROM targetmenabung WHERE id_user = ? ORDER BY created_at DESC', [userId]);
        res.status(200).json({ data: rows });
    }
    catch (error) {
        console.error('ERROR DATABASE (getActiveTargets):', error.message);
        res.status(500).json({ message: 'Gagal mengambil data target.' });
    }
};
exports.getActiveTargets = getActiveTargets;
/**
 * [POST] Membuat target menabung baru
 */
const createTarget = async (req, res) => {
    const userId = req.user?.id_user;
    const { nama_target, target_jumlah, tanggal_target } = req.body;
    try {
        await db_config_1.default.execute('INSERT INTO targetmenabung (id_user, nama_target, target_jumlah, tanggal_target, jumlah_terkumpul, status) VALUES (?, ?, ?, ?, 0, "dalam_proses")', [userId, nama_target, target_jumlah, tanggal_target]);
        res.status(201).json({ message: 'Target berhasil dibuat.' });
    }
    catch (error) {
        console.error('ERROR CREATE TARGET:', error.message);
        res.status(500).json({ message: 'Gagal membuat target.' });
    }
};
exports.createTarget = createTarget;
/**
 * [POST] Kontribusi Saldo ke Target Menabung
 */
const contributeToTarget = async (req, res) => {
    const userId = req.user?.id_user;
    const { id_target, jumlah } = req.body;
    if (!id_target || !jumlah || jumlah <= 0) {
        return res.status(400).json({ message: 'Data tidak valid.' });
    }
    const connection = await db_config_1.default.getConnection();
    try {
        await connection.beginTransaction();
        const [targetRows] = await connection.query('SELECT nama_target FROM targetmenabung WHERE id_target = ? AND id_user = ?', [id_target, userId]);
        if (targetRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Target tidak ditemukan.' });
        }
        const namaTarget = targetRows[0].nama_target;
        const [saldoRows] = await connection.query('SELECT saldo_sekarang FROM saldo WHERE id_user = ?', [userId]);
        const saldoSekarang = saldoRows[0]?.saldo_sekarang || 0;
        if (saldoSekarang < jumlah) {
            await connection.rollback();
            return res.status(400).json({ message: 'Saldo utama tidak mencukupi.' });
        }
        await connection.execute('UPDATE saldo SET saldo_sekarang = saldo_sekarang - ? WHERE id_user = ?', [jumlah, userId]);
        await connection.execute('UPDATE targetmenabung SET jumlah_terkumpul = jumlah_terkumpul + ? WHERE id_target = ? AND id_user = ?', [jumlah, id_target, userId]);
        await connection.execute(`INSERT INTO transaksi (id_user, id_kategori, jenis, jumlah, keterangan, tanggal) VALUES 
            (?, (SELECT id_kategori FROM kategori WHERE nama_kategori = 'Tabungan' LIMIT 1), 'pengeluaran', ?, ?, NOW())`, [
            userId,
            jumlah,
            `Kontribusi Target: ${namaTarget}`
        ]);
        await connection.execute('UPDATE targetmenabung SET status = "tercapai" WHERE id_target = ? AND jumlah_terkumpul >= target_jumlah', [id_target]);
        await connection.commit();
        res.status(200).json({ message: 'Kontribusi berhasil!' });
    }
    catch (error) {
        await connection.rollback();
        console.error('Error kontribusi target:', error.message);
        res.status(500).json({ message: 'Terjadi kesalahan saat memproses kontribusi.' });
    }
    finally {
        connection.release();
    }
};
exports.contributeToTarget = contributeToTarget;
