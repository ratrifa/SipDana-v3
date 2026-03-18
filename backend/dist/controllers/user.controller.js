"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updateProfile = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * [UPDATE] Memperbarui Nama dan Email Pengguna
 * Endpoint: PUT /api/users/profile
 */
const updateProfile = async (req, res) => {
    const userId = req.user?.id_user;
    if (!userId)
        return res.status(401).json({ message: 'User ID tidak ditemukan.' });
    const { username, email } = req.body;
    if (!username && !email) {
        return res.status(400).json({ message: 'Minimal satu field (username atau email) harus diisi.' });
    }
    let updates = [];
    let values = [];
    if (username) {
        const [existingUser] = await db_config_1.default.query('SELECT id_user FROM user WHERE username = ? AND id_user != ?', [username, userId]);
        if (existingUser.length > 0)
            return res.status(409).json({ message: 'Username sudah digunakan.' });
        updates.push('username = ?');
        values.push(username);
    }
    if (email) {
        const [existingEmail] = await db_config_1.default.query('SELECT id_user FROM user WHERE email = ? AND id_user != ?', [email, userId]);
        if (existingEmail.length > 0)
            return res.status(409).json({ message: 'Email sudah digunakan.' });
        updates.push('email = ?');
        values.push(email);
    }
    const query = `UPDATE user SET ${updates.join(', ')} WHERE id_user = ?`;
    values.push(userId);
    try {
        await db_config_1.default.query(query, values);
        res.status(200).json({ message: 'Profil berhasil diperbarui.' });
    }
    catch (error) {
        console.error('Error saat update profil:', error);
        res.status(500).json({ message: 'Gagal memperbarui profil.', error });
    }
};
exports.updateProfile = updateProfile;
/**
 * [UPDATE] Mengubah Password Pengguna
 * Endpoint: PUT /api/users/password
 */
const updatePassword = async (req, res) => {
    const userId = req.user?.id_user;
    if (!userId)
        return res.status(401).json({ message: 'User ID tidak ditemukan.' });
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Semua field password harus diisi.' });
    }
    try {
        const [rows] = await db_config_1.default.query('SELECT password FROM user WHERE id_user = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        const hashedPassword = rows[0].password;
        const isMatch = await bcryptjs_1.default.compare(currentPassword, hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password lama salah.' });
        }
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await db_config_1.default.query('UPDATE user SET password = ? WHERE id_user = ?', [hashedNewPassword, userId]);
        res.status(200).json({ message: 'Password berhasil diperbarui.' });
    }
    catch (error) {
        console.error('Error saat update password:', error);
        res.status(500).json({ message: 'Gagal memperbarui password.', error });
    }
};
exports.updatePassword = updatePassword;
