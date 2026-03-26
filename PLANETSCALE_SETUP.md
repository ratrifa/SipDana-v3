# ⚠️ PlanetScale - NO LONGER FREE (ARCHIVED)

**Update 2024:** PlanetScale sudah menghapus free tier. 

**👉 Gunakan alternatif gratis lainnya:**
- **db4free.net** - MySQL gratis selamanya (RECOMMENDED)
- **Vercel Postgres** - PostgreSQL gratis, integrated dengan Vercel
- **Railway** - $5/month free tier
- **Upstash MySQL** - MySQL serverless gratis

📖 Lihat: [DATABASE_FREE_OPTIONS.md](DATABASE_FREE_OPTIONS.md) untuk semua pilihan.

---

## **ARCHIVE: Old PlanetScale Setup Guide**
Dokumentasi ini disimpan untuk referensi, tapi **TIDAK LAGI APPLICABLE** karena no free tier.

---

## **STEP 1: Buat PlanetScale Account** (2 menit)

### A. Daftar
```
1. Buka: https://planetscale.com
2. Klik "Sign up"
3. Pilih "Sign up with GitHub"
4. Authorize PlanetScale
5. Dashboard terbuka ✓
```

### B. Accept Terms
- Baca terms (atau skip)
- Klik "Accept"

---

## **STEP 2: Buat Database** (2 menit)

### A. Di Dashboard
```
1. Klik "+ Create new database"
2. Nama database: "sipdana"
3. Region: Asia (Southeast) / Singapore
4. Klik "Create database"
5. Tunggu selesai (~30 detik)
```

### B. Database Ready
```
Status: Ready ✓
Branches: main (available)
```

---

## **STEP 3: Import Database Anda** (5 menit)

### A. Buka Database IDE
```
1. Database "sipdana" → tab "IDE"
2. Akan terbuka editor SQL
```

### B. Import sip_dana.sql
**OPSI 1: Paste langsung (RECOMMENDED)**
```
1. Buka file: sip_dana.sql
2. Copy semua isi (Ctrl+A, Ctrl+C)
3. Paste di PlanetScale IDE
4. Klik ▶ "Execute" (atau Ctrl+Enter)
5. Tunggu query selesai (status hijau)
6. Done! ✓
```

**OPSI 2: Upload file (jika ada**
```
1. Klik "Upload"
2. Pilih sip_dana.sql
3. Execute
```

### C. Verify Data
```
1. Di IDE, jalankan:
   SELECT COUNT(*) FROM user;
   SELECT COUNT(*) FROM transaksi;
   
2. Harusnya keluar hasil (1 user, 14 transaksi, dst)
```

---

## **STEP 4: Dapatkan Connection String** (2 menit)

### A. Klik "Connect"
```
1. Database "sipdana" → Klik "Connect" button
2. Pilih "MySQL Client"
```

### B. Copy String
```
Akan ada string seperti:
mysql://[username]:[password]@[host]:3306/sipdana

PISAHKAN MENJADI:
DB_HOST = [host] (contoh: abcd.mysql.database.azure.com)
DB_USER = [username]
DB_PASSWORD = [password]
DB_NAME = sipdana
```

### C. Contoh Connection String
```
Asli:
mysql://myuser:mypassword123@abcd123.mysql.database.azure.com:3306/sipdana

Di-pisah menjadi:
DB_HOST=abcd123.mysql.database.azure.com
DB_USER=myuser
DB_PASSWORD=mypassword123
DB_NAME=sipdana
```

---

## **STEP 5: Setting IP Whitelist** (1 menit)

### ⚠️ PENTING untuk Vercel!

```
1. Database settings → klik "Settings"
2. Scroll ke "Network"
3. Pilih "Allow public IPs"
   (PlanetScale akan allow akses dari mana saja)
4. Klik "Confirm"
```

**Kenapa?** Vercel servers butuh akses ke database dari IP manapun.

---

## **STEP 6: Gunakan di Vercel** (1 menit)

### Backend Vercel Environment Variables
```
DB_HOST=abcd123.mysql.database.azure.com
DB_USER=myuser
DB_PASSWORD=mypassword123
DB_NAME=sipdana
JWT_SECRET=generate-random-secure-key
GEMINI_API_KEY=your-google-api-key
FRONTEND_URL=https://your-app.vercel.app
```

---

## **VERIFIKASI SETUP**

### A. Test Connection Lokal (Optional)
```bash
# Install MySQL client (jika belum ada)
# Windows: https://dev.mysql.com/downloads/shell/

mysql -h abcd123.mysql.database.azure.com -u myuser -p
# Masukkan password
# Ketik: USE sipdana;
# Show tables;
```

### B. Test di Vercel
```
1. Deploy backend ke Vercel
2. Curl:
   curl https://your-backend.vercel.app/api/health
   
3. Harusnya return:
   {"status": "Server is running"}
```

### C. Test Login
```
1. Kunjungi frontend: https://your-app.vercel.app
2. Login dengan:
   Username: Reyhan
   Password: (cek di database atau reset di PlanetScale)
```

---

## **FREE TIER LIMITS (Cukup untuk production kecil)**

| Feature | Free Tier |
|---------|-----------|
| Databases | 1 database |
| Storage | 500 MB* |
| Queries | Unlimited |
| Reads/Writes | Unlimited |
| Branches | 5 branches |
| Backups | 7 days |

*Aplikasi Anda: ~10 MB saja (dengan sample data)

---

## **DATABASE MANAGEMENT DI PLANETSCALE**

### Lihat Data
```
1. Database → IDE
2. Ketik SQL query:
   SELECT * FROM user;
   SELECT * FROM transaksi WHERE id_user = 1;
```

### Update/Delete
```
1. IDE → Ketik query:
   UPDATE transaksi SET jumlah = 500000 WHERE id_transaksi = 1;
2. Execute (Ctrl+Enter)
```

### Backup
```
1. Database → "Backups"
2. PlanetScale otomatis backup setiap hari
3. Klik restore kalau butuh
```

---

## **PRICING (Selamanya Gratis!)**

```
Free Tier: $0
  ✓ Perfect untuk project kecil/medium
  ✓ Unlimited queries
  ✓ 500 MB storage (cukup untuk app Anda)
  ✓ High availability (2+ replicas)

Pro Tier: $29/bulan (optional, kalau sudah production skala besar)
```

---

## **TIPS & TRICKS**

### 1. Backup Manual
```
Jika khawatir, export data:
1. IDE → SELECT * FROM user;
2. Copy hasil → paste di Excel
3. Atau buat SQL dump
```

### 2. Monitor Usage
```
Dashboard → Database → Insights
  - Queries/detik
  - Storage usage
  - Replication lag
```

### 3. Upgrade ke Pro (Optional)
```
Kalau sudah production skala besar:
1. Database settings → upgrade
2. Unlimited storage & advanced features
```

---

## **TROUBLESHOOTING**

### ❌ "Can't connect from Vercel"
```
✓ Pastikan "Allow public IPs" sudah di-enable
✓ Cek credentials (DB_HOST, USER, PASSWORD)
✓ Test connection string lokal dulu
```

### ❌ "401 Authentication failed"
```
✓ Password salah - copy dari Connect string lagi
✓ Pastikan tidak ada typo
```

### ❌ "Connection timeout"
```
✓ Tunggu 30 detik (PlanetScale sedang startup)
✓ Refresh page, coba lagi
```

### ❌ "Out of storage"
```
✓ Upgrade ke Pro ($29/bulan)
✓ Atau delete data yang tidak perlu
✓ Aplikasi Anda seharusnya jauh dari batas ini
```

---

## **NEXT STEPS**

1. ✅ Daftar PlanetScale
2. ✅ Import sip_dana.sql
3. ✅ Copy credentials
4. ✅ Set di Vercel environment variables
5. ✅ Deploy backend
6. ✅ Test koneksi

**Semuanya GRATIS dan PRODUCTION-READY!** 🎉

---

**Butuh bantuan? Tanya saja!** 💬
