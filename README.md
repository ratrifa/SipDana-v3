# Sip-Dana-v2

<img width="1842" height="998" alt="image" src="https://github.com/user-attachments/assets/cb3d7f2d-531a-4034-be7e-8dc11c07648e" />

# 🏦 SipDana: Smart Personal Finance Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)

**SipDana** adalah platform manajemen keuangan pribadi modern yang dirancang untuk membantu pengguna menguasai arus kas mereka. Dengan fitur pelacakan transaksi real-time, visualisasi data cerdas, dan sistem rekomendasi strategi finansial, SipDana membuat pengelolaan uang menjadi lebih "Sip" dan terukur.

---

## 📌 Prasyarat

- Node.js (v18+ direkomendasikan)
- npm (atau yarn)
- MySQL (misalnya XAMPP/Laragon)
- (Opsional) Editor kode seperti VS Code

---

## 🔧 Konfigurasi `.env` (Backend)

Salin file `backend/.env` ke `backend/.env` (jika belum ada) dan sesuaikan nilai-nilai berikut:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sip_dana
JWT_SECRET=rahasia_super_aman_sipdana

# Kunci API Google Gemini (opsional)
# GEMINI_API_KEY=your_google_api_key
# GEMINI_MODEL=gemini-2.5-flash
```

> ⚠️ Pastikan `JWT_SECRET` diisi dengan nilai yang kuat dan tidak dibagikan publik.

---

## 🧱 Skema Database Utama

> Pastikan database `sip_dana` sudah dibuat dan struktur tabel sudah ada sebelum menjalankan aplikasi.

| Tabel             | Keterangan                       | Hubungan                     |
| :---------------- | :------------------------------- | :--------------------------- |
| `user`            | Data akun & password terenkripsi | `id_user` (PK)               |
| `transaksi`       | Catatan aliran uang              | FK: `id_user`, `id_kategori` |
| `saldo`           | Total dana kumulatif user        | FK: `id_user`                |
| `targetmenabung`  | Data rencana tabungan & progres  | FK: `id_user`                |
| `kategori`        | Master data kategori transaksi   | -                            |
| `metodemengelola` | Strategi rekomendasi finansial   | -                            |

---

## 🚀 Menjalankan Aplikasi

### Backend (API)

```bash
cd backend
npm install
npm run dev
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Akses aplikasi pada `http://localhost:5173` (default Vite) dan API backend pada `http://localhost:5000`.

---

## 🔎 Struktur Proyek

```text
Sip_dana/
├── backend/                # API Server (Node.js/Express)
│   ├── src/
│   │   ├── controllers/    # Logika bisnis (Auth, Report, Target, Transaksi, User)
│   │   ├── routes/         # Definisi endpoint API (Routing)
│   │   ├── middleware/     # Proteksi rute (Auth JWT Middleware)
│   │   ├── config/         # Koneksi database MySQL
│   │   └── types/          # Definisi interface/type TypeScript
│   └── .env                # Konfigurasi database & JWT secret
└── frontend/               # User Interface (React/Vite)
    ├── src/
    │   ├── components/     # Komponen UI (Sidebar, Modal, Charts)
    │   ├── pages/          # Halaman utama (Login, Dashboard, Analisis, dll)
    │   ├── services/       # Integrasi API (Axios instance & Services)
    │   ├── context/        # Global state management (AuthContext)
    │   ├── hooks/          # Custom hooks (useTimeFilter, dll)
    │   └── assets/         # Aset gambar, SVG, dan global styling
```

---

## 🧪 Catatan Pengujian (QA)

- **Keamanan:** Password di-hash menggunakan **Bcrypt** dan divalidasi ketat di sisi server (Backend).
- **Integritas:** Implementasi **SQL Transaction (ACID)** menjamin saldo tetap akurat meski terjadi kegagalan sistem saat mencatat transaksi.
- **Stabilitas:** Optimasi query menggunakan `ORDER BY` tetap (Fixed Ordering) agar data grafik dan rekomendasi tidak berubah-ubah saat halaman dimuat ulang.
- **User Experience:** Dilengkapi penanganan _state loading_ (Spinner) dan notifikasi error yang informatif bagi pengguna.

---

© 2026 **SipDana Team**. Dikembangkan untuk Proyek Mata Kuliah Implementasi dan Pengujian Perangkat Lunak (IPPL).
