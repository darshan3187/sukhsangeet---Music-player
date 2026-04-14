# Quick Reference - Production-Ready Setup

## File Locations & Purpose

| File | Purpose | Status |
|------|---------|--------|
| `backend/config/settings.py` | Django configuration (production hardened) | ✅ |
| `backend/requirements.txt` | Python dependencies (Gunicorn + WhiteNoise included) | ✅ |
| `backend/Procfile` | Render deployment configuration | ✅ |
| `backend/build.sh` | Production build script | ✅ |
| `backend/.env.example` | Backend environment template | ✅ |
| `src/api/axios.js` | API client with env-based URLs | ✅ |
| `.env.example` | Reference for all environment variables | ✅ |
| `.env.example.frontend` | Frontend environment template | ✅ |
| `vercel.json` | Vercel deployment configuration | ✅ |
| `PRODUCTION_DEPLOYMENT.md` | Step-by-step deployment guide | ✅ |
| `PRODUCTION_CHECKLIST.md` | Complete production readiness checklist | ✅ |
| `SETUP_SUMMARY.md` | This project summary and next steps | ✅ |

---

## Essential Commands

### Backend (Development)
```bash
cd backend
.venv\Scripts\activate                    # Activate virtual environment
pip install -r requirements.txt           # Install dependencies
python manage.py runserver 0.0.0.0:8000  # Start dev server
python manage.py migrate                  # Run migrations
python manage.py createsuperuser          # Create admin user
```

### Backend (Production - Render)
```bash
# Via Procfile automatically:
# development:release: python manage.py migrate
# development:web: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

### Frontend (Development)
```bash
npm install                               # Install dependencies
npm run dev                               # Start dev server (http://localhost:5173)
npm run build                             # Build for production
npm run preview                           # Preview production build
npm run lint                              # Check code quality
```

### Database
```bash
# SQLite (dev)
python manage.py migrate                  # Apply migrations

# PostgreSQL (production)
# Migrations run automatically via Procfile on deployment
```

---

## Environment Variables

### Backend (.env file in backend/)
```bash
# Must Be Set (will fail without)
SECRET_KEY=<generate-new-one-for-production>
ALLOWED_HOSTS=localhost,127.0.0.1,your-api-domain.com
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-app.vercel.app
CSRF_TRUSTED_ORIGINS=http://localhost:5173,https://your-app.vercel.app

# Database
DATABASE_URL=sqlite:///db.sqlite3                    # Dev
# DATABASE_URL=postgresql://user:pass@host/db       # Production

# Environment
ENVIRONMENT=development                             # Or: production
DEBUG=True                                          # Set to False in production
```

### Frontend (.env.local or .env.production)
```bash
VITE_API_BASE_URL=http://localhost:8000/api        # Dev
# VITE_API_BASE_URL=https://api.yourdomain.com/api # Production
```

---

## Deployment URLs

### Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API: `http://localhost:8000/api`
- Admin: `http://localhost:8000/admin`

### Production (After Deployment)
- Frontend: `https://your-app-name.vercel.app`
- Backend: `https://your-api-name.onrender.com`
- API: `https://your-api-name.onrender.com/api`

---

## Build Artifacts

### Frontend Build Output
```bash
dist/
├── index.html              (1.55 KB)
├── assets/
│   ├── react-vendor.js     (223.78 KB → 71.64 KB gzipped)
│   ├── index.js            (149.95 KB → 46.21 KB gzipped)
│   ├── index.css           (58.82 KB → 10.14 KB gzipped)
│   └── icons-vendor.js     (12.36 KB → 4.83 KB gzipped)
```

### Backend Assets
```
staticfiles/                 (Collected by WhiteNoise)
├── admin/                   (Django admin assets)
└── (user-uploaded media)
```

---

## Key Security Settings (Already Configured)

✅ **DEBUG = False** in production
✅ **SECRET_KEY** enforced
✅ **SSL/HTTPS** redirect enabled
✅ **HSTS** headers (1 year)
✅ **CORS** restricted to specific domains
✅ **CSRF** protection enabled
✅ **Cookies** set to HttpOnly + Secure
✅ **Rate limiting** enabled (30/min anon, 120/min user)
✅ **JWT** with token refresh
✅ **Password validation** enabled

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'X'"
```bash
cd backend
.venv\Scripts\pip install -r requirements.txt
```

### "Secret key not set" error in production
```bash
# Generate a new secret key:
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Add to Render environment variables:
SECRET_KEY=<the-generated-key>
```

### CORS errors when accessing from frontend
1. Check `CORS_ALLOWED_ORIGINS` includes your frontend domain
2. Make sure trailing slash is removed from API URL
3. Verify backend is running and accessible

### Database connection errors
1. Verify `DATABASE_URL` is set and correct
2. For PostgreSQL: use `postgresql://` protocol
3. Check database exists and credentials are correct
4. For Render: use Internal Database URL, not External

### Build fails on Vercel/Render
1. Check logs in deployment dashboard
2. Ensure `npm run build` works locally
3. Verify environment variables are set
4. Check that Node.js/Python versions are compatible

---

## Performance Targets Met ✅

### Backend
- Query optimization: select_related + prefetch_related
- Bulk updates: No N+1 queries on playlist operations
- Static files: WhiteNoise compression (gzip)
- Concurrency: Gunicorn with 3+ workers
- Connection pooling: 60-600 second max age

### Frontend
- React bundle: 223.78 KB → 71.64 KB (gzip)
- CSS bundle: 58.82 KB → 10.14 KB (gzip)
- Build time: ~600ms (very fast with Vite)
- Code splitting: Ready (manual setup needed)

---

## What to Do Next

1. **TODAY**: Review all setup files and choose deployment timeline
2. **THIS WEEK**: Create Render/Vercel accounts, deploy to production
3. **AFTER DEPLOY**: Test login flow, user can create/manage playlists, add tracks
4. **MONITOR**: Check logs for errors, monitor API response times
5. **MAINTAIN**: Regular database backups, keep dependencies updated

---

## One-Click Production Deployment Checklist

Before hitting "Deploy" on Render/Vercel, verify:

- [ ] `SECRET_KEY` is generated (not default dev key)
- [ ] `DEBUG=False`
- [ ] `ALLOWED_HOSTS` includes your production domain
- [ ] `CORS_ALLOWED_ORIGINS` includes your Vercel frontend
- [ ] `DATABASE_URL` points to PostgreSQL (not SQLite)
- [ ] `VITE_API_BASE_URL` points to your Render backend
- [ ] `npm run build` completes successfully locally
- [ ] Backend Procfile is correct
- [ ] All sensitive data is in environment variables (not code)

---

## Useful Links

| Resource | URL |
|----------|-----|
| Django Docs | https://docs.djangoproject.com/ |
| DRF Tutorial | https://www.django-rest-framework.org/tutorial/quickstart/ |
| Render Getting Started | https://render.com/docs/deploy-flask |
| Vercel Getting Started | https://vercel.com/docs/deployments/overview |
| Free PostgreSQL | https://www.neon.tech/ (alternative to Render) |
| JWT Best Practices | https://tools.ietf.org/html/rfc8725 |

---

**Last Updated**: April 14, 2026  
**Status**: ✅ Production Ready  
**Ready to Deploy**: YES - Follow PRODUCTION_DEPLOYMENT.md for next steps
