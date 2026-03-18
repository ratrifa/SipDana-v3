"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const protect = (req, res, next) => {
    let token;
    // 1. Cek token di header (Bearer Token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Ambil token dari "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];
            // 2. Verifikasi token
            // Di dalam middleware protect / auth
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = {
                id_user: decoded.id_user,
                username: decoded.username || '',
                email: decoded.email || ''
            };
            // Lanjutkan ke controller transaksi
            next();
        }
        catch (error) {
            console.error('Error saat verifikasi token:', error);
            return res.status(401).json({ message: 'Token tidak valid, otorisasi ditolak.' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Tidak ada token, otorisasi ditolak.' });
    }
};
exports.protect = protect;
