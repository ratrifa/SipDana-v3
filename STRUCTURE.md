# 📁 DEPLOYMENT STRUCTURE GUIDE

## Project Berlapis (Monorepo)

```
SipDana-v3/
├── backend/                    ← DEPLOY KE VERCEL #1
│   ├── api/
│   │   └── index.ts           ← Vercel serverless handler
│   ├── src/
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json            ← ⭐ Config untuk Vercel
│   ├── .env.example           ← ⭐ Template env vars
│   └── .env                   ← ⭐ LOCAL ONLY (jangan push!)
│
├── frontend/                   ← DEPLOY KE VERCEL #2
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── vercel.json            ← ⭐ Config untuk Vercel
│   ├── .env.example           ← ⭐ Template env vars
│   └── .env.local             ← ⭐ LOCAL ONLY (jangan push!)
│
├── sip_dana.sql               ← ⭐ Database dump
├── DEPLOYMENT.md              ← Dokumentasi lengkap
├── QUICK_DEPLOY.md            ← Panduan cepat
├── ENV_SETUP.txt              ← Credentials template
├── .gitignore                 ← Jangan push .env!
└── README.md

```

---

## DEPLOYMENT FLOW

```
┌─────────────────────────────────────────────────────────┐
│ 1. SETUP DATABASE                                       │
│ PlanetScale: Upload sip_dana.sql                        │
│ ✓ Database ready with data                              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ 2. PUSH TO GITHUB                                       │
│ git add . && git commit -m "Deploy" && git push         │
│ ✓ Code tersimpan di GitHub                              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ 3. DEPLOY BACKEND (Vercel)                              │
│ https://vercel.com/new                                  │
│ Root Dir: backend                                       │
│ Env Vars: DB_*, JWT_SECRET, GEMINI_API_KEY             │
│ ✓ Backend live di: https://xxxxx.vercel.app            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ 4. DEPLOY FRONTEND (Vercel)                             │
│ Root Dir: frontend                                      │
│ Env Vars: VITE_API_URL=backend-url/api                  │
│ ✓ Frontend live di: https://xxxxx.vercel.app           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ 5. FINALIZE                                             │
│ Update Backend: FRONTEND_URL=frontend-url               │
│ Test: Login & Create Transaction                        │
│ ✓ LIVE! 🎉                                              │
└─────────────────────────────────────────────────────────┘
```

---

## FILES PENTING UNTUK DEPLOYMENT

### Root Level Files
```
.gitignore               PENTING: Jangan push .env!
DEPLOYMENT.md           Dokumentasi detail
QUICK_DEPLOY.md         Panduan cepat
ENV_SETUP.txt           Credentials template
sip_dana.sql            Database dump untuk import
```

### Backend Files
```
backend/vercel.json              ✓ Config Vercel ServerLess
backend/.env.example             ✓ Template environment
backend/api/index.ts             ✓ Vercel handler
backend/package.json             ✓ Dependencies
backend/tsconfig.json            ✓ TypeScript config
backend/src/server.ts            ✓ Express app setup
backend/src/config/db.config.ts  ✓ Database connection
```

### Frontend Files
```
frontend/vercel.json             ✓ Config Vercel SPA
frontend/.env.example            ✓ Template environment  
frontend/vite.config.ts          ✓ Vite config
frontend/package.json            ✓ Dependencies
frontend/src/App.tsx             ✓ Main component
frontend/src/services/api.ts     ✓ API client
```

---

## CHECKLIST DEPLOYMENT

- [ ] Database credentials dari PlanetScale ✓
- [ ] Code push ke GitHub ✓
- [ ] Backend deploy dengan env vars ✓
- [ ] Frontend deploy dengan VITE_API_URL ✓
- [ ] Backend env var FRONTEND_URL updated ✓
- [ ] Health check: /api/health ✓
- [ ] Login test berhasil ✓
- [ ] Create transaction works ✓

---

## QUICK LINKS

| Layanan | Link |
|---------|------|
| Vercel Dashboard | https://vercel.com/dashboard |
| PlanetScale | https://planetscale.com |
| Google Gemini | https://aistudio.google.com/apikey |
| GitHub | https://github.com |

---

**Siap deploy? Baca QUICK_DEPLOY.md** 🚀
