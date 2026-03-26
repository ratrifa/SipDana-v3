# 🚀 QUICK DEPLOY CHECKLIST

## **STEP 1: Setup PlanetScale Database (5 menit)**

### A. Buat PlanetScale Account
```
1. Buka: https://planetscale.com
2. Login dengan GitHub
3. Skip billing (gratis tier)
```

### B. Buat Database
```
1. Klik "Create new database"
2. Nama: sipdana
3. Region: Asia/Singapore (terdekat ke Indonesia)
4. Klik "Create database"
```

### C. Import Data
```
1. Di PlanetScale Dashboard → Database "sipdana" → Branches → main
2. Klik "..." → "Take branch offline" (jika ada)
3. Buka "IDE" atau "CLI"
4. Copy-paste isi file: sip_dana.sql
5. Jalankan (Ctrl+Enter)
6. Tunggu selesai ✓
```

### D. Catat Connection String
```
1. Klik "Connect" → MySQL client
2. Copy string: mysql://[user]:[password]@[host]/sip_dana
3. Pisahkan menjadi:
   - DB_HOST = [host].mysql.database.azure.com
   - DB_USER = [user]
   - DB_PASSWORD = [password]
   - DB_NAME = sipdana
```

---

## **STEP 2: Deploy Backend ke Vercel (5 menit)**

### A. Pastikan Sudah Push ke GitHub
```bash
cd d:\project\sipdana\SipDana-v3
git add .
git commit -m "Setup for Vercel deployment"
git push origin main
```

### B. Di Vercel Dashboard
```
1. Buka: https://vercel.com/dashboard
2. Klik "Add New" → "Project"
3. Pilih repository: sipdana
4. Settings:
   - Root Directory: backend
   - Build Command: npm install && npm run build
```

### C. Tambah Environment Variables
```
DB_HOST=xxxxx.mysql.database.azure.com
DB_USER=xxxxx
DB_PASSWORD=xxxxx
DB_NAME=sipdana
JWT_SECRET=my-super-secret-key-32-chars-min
GEMINI_API_KEY=xxxxx
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### D. Deploy
```
Klik "Deploy" → Tunggu selesai
Catat URL: https://xxxxx.vercel.app
```

---

## **STEP 3: Deploy Frontend ke Vercel (3 menit)**

### A. Di Vercel Dashboard
```
1. Klik "Add New" → "Project"
2. Pilih repository: sipdana
3. Settings:
   - Root Directory: frontend
   - Build Command: npm run build
```

### B. Environment Variables
```
VITE_API_URL=https://xxxxx.vercel.app/api
```
(Gunakan URL backend dari STEP 2D)

### C. Deploy
```
Klik "Deploy" → Tunggu selesai
Catat URL: https://your-app.vercel.app
```

---

## **STEP 4: Finalisasi**

### A. Update Backend FRONTEND_URL
```
1. Buka Vercel Backend Project → Settings → Environment Variables
2. Update FRONTEND_URL = https://your-app.vercel.app
3. Redeploy (klik "Redeploy")
```

### B. Test
```bash
# Test backend API
curl https://xxxxx.vercel.app/api/health

# Test frontend
Buka di browser: https://your-app.vercel.app
Login dengan: Reyhan / password dari database
```

---

## **ENVIRONMENT VARIABLES YANG DIPERLUKAN**

### Backend (Vercel)
```
✓ DB_HOST           → dari PlanetScale
✓ DB_USER           → dari PlanetScale
✓ DB_PASSWORD       → dari PlanetScale
✓ DB_NAME           → sipdana
✓ JWT_SECRET        → random strong password
✓ GEMINI_API_KEY    → dari Google Cloud Console
✓ FRONTEND_URL      → https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
✓ VITE_API_URL      → https://your-backend.vercel.app/api
```

---

## **TROUBLESHOOTING**

| Problem | Solution |
|---------|----------|
| ❌ CORS Error | Pastikan FRONTEND_URL di backend env var sesuai |
| ❌ DB Connection Failed | Cek credentials PlanetScale, pastikan IP Vercel whitelisted (PlanetScale: Allow all public IPs) |
| ❌ Login Gagal | Pastikan database berhasil di-import (cek di PlanetScale IDE) |
| ❌ Build Timeout | Hapus package-lock.json, npm install ulang, push lagi |
| ❌ API 404 | Pastikan VITE_API_URL di frontend tidak ada trailing slash |

---

## **USEFUL LINKS**

- Vercel Dashboard: https://vercel.com/dashboard
- PlanetScale: https://planetscale.com
- Google Gemini API: https://aistudio.google.com/apikey
- Postman Test Backend: https://www.postman.com

---

**Estimasi Total Waktu: 15-20 menit** ⏱️
