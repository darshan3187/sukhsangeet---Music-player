# Production Deployment Guide - SukhSangeet Music Player

## Table of Contents
1. [Database Migration (SQLite → PostgreSQL)](#database-migration)
2. [Backend Deployment to Render](#backend-deployment)
3. [Frontend Deployment to Vercel](#frontend-deployment)
4. [Environment Variables Setup](#environment-variables)
5. [Local Development Setup](#local-development)
6. [Production Checklist](#final-checklist)

---

## Database Migration (SQLite → PostgreSQL)

### Step 1: Backup Your SQLite Data
```bash
# Backup the current SQLite database
cp backend/db.sqlite3 backend/db.sqlite3.backup
```

### Step 2: Set Up PostgreSQL Locally (for testing)

**Windows with PostgreSQL installed:**
```bash
# Create database
createdb sukhsangeet_db

# Create user (optional, use default postgres user)
createuser sukhsangeet_user
```

**Or use PostgreSQL via Docker:**
```bash
docker run --name sukhsangeet-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

### Step 3: Update Django Settings for PostgreSQL

Your Django settings already support this! Just update your `.env` file:

```bash
# .env (backend)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sukhsangeet_db
DB_CONN_MAX_AGE=600
DB_SSL_REQUIRE=False  # Set to True for Render/production
```

### Step 4: Run Migrations
```bash
cd backend

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Run migrations against PostgreSQL
python manage.py migrate

# Create superuser (if needed)
python manage.py createsuperuser
```

### Step 5: Verify Success
```bash
python manage.py shell
# In Python shell:
# >>> from apps.playlists.models import Playlist
# >>> Playlist.objects.count()  # Should list any existing playlists
```

---

## Backend Deployment to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create a free PostgreSQL database

### Step 2: Create PostgreSQL Database on Render
1. Dashboard → Create New → PostgreSQL
2. Name: `sukhsangeet-db`
3. Region: Select closest to you
4. PostgreSQL Version: 15
5. Plan: Free (0.0015/hour)
6. Create Database
7. **Copy the Internal Database URL** (you'll need this)

### Step 3: Deploy Backend Web Service
1. Dashboard → Create New → Web Service
2. Connect your GitHub repo (darshan3187/sukhsangeet---Music-player)
3. **Settings:**
   - Name: `sukhsangeet-api`
   - Environment: `Python 3.11`
   - Build Command: `bash backend/build.sh`
   - Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3`

### Step 4: Set Environment Variables on Render
Go to Web Service → Settings → Environment

Add these variables (replace with your actual values):
```
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=[Generate a new secret key - see below]
ALLOWED_HOSTS=sukhsangeet-api.onrender.com,your-frontend-domain.com
DATABASE_URL=[Paste the Internal Database URL from Step 2]
DB_CONN_MAX_AGE=600
DB_SSL_REQUIRE=True

CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-frontend-domain.vercel.app

SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True

LOG_LEVEL=INFO
DRF_THROTTLE_ANON=30/min
DRF_THROTTLE_USER=120/min
```

### Step 5: Generate Secret Key
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
Copy the output and paste into Render's SECRET_KEY variable.

### Step 6: Deploy
1. Click "Deploy" on Render
2. Wait for build to complete (check Logs tab)
3. Once deployed, you'll get a URL like: `https://sukhsangeet-api.onrender.com`

---

## Frontend Deployment to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your GitHub repo

### Step 2: Deploy Frontend
1. Select Project: `darshan3187/sukhsangeet---Music-player`
2. Framework Preset: Vite
3. Root Directory: `./` (default)
4. Build Command: `npm run build` (auto-detected)
5. Output Directory: `dist` (auto-detected)

### Step 3: Set Environment Variables on Vercel
1. Settings → Environment Variables
2. Add Production Variable:
   ```
   VITE_API_BASE_URL=https://sukhsangeet-api.onrender.com/api
   ```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build
3. Get your frontend URL: `https://your-project.vercel.app`

### Step 5: Update Backend CORS
After getting your Vercel frontend URL, update Render backend:
- Go back to Render → Web Service → Settings → Environment
- Update `CORS_ALLOWED_ORIGINS` with your Vercel URL
- Manual deploy to apply changes

---

## Environment Variables Setup

### Backend (.env) - Production Values
```bash
# .env (backend directory)
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=your-generated-secret-key-here

# Your actual domain (or Render URL)
ALLOWED_HOSTS=sukhsangeet-api.onrender.com,api.yourdomain.com

# PostgreSQL on Render
DATABASE_URL=postgresql://user:password@host:port/dbname
DB_CONN_MAX_AGE=600
DB_SSL_REQUIRE=True

# Your Vercel frontend URL
CORS_ALLOWED_ORIGINS=https://sukhsangeet.vercel.app
CSRF_TRUSTED_ORIGINS=https://sukhsangeet.vercel.app

SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True

LOG_LEVEL=INFO
```

### Frontend (.env.local or .env.production)
```bash
# For development (.env.local):
VITE_API_BASE_URL=http://localhost:8000/api

# For production (.env.production):
VITE_API_BASE_URL=https://sukhsangeet-api.onrender.com/api
```

---

## Local Development Setup

### Step 1: Clone and Setup
```bash
git clone https://github.com/darshan3187/sukhsangeet---Music-player.git
cd Sukh_Sangeet

# Backend
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Create .env from .env.example
cp .env.example .env

# Run migrations
python manage.py migrate

# Start backend
python manage.py runserver 0.0.0.0:8000
```

### Step 2: Frontend (new terminal)
```bash
# From project root
npm install
npm run dev
```

### Step 3: Access
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API: http://localhost:8000/api

---

## Performance Optimization Checklist

### Backend (Django)
- ✅ WhiteNoise configured for static files
- ✅ Gunicorn with multiple workers (3+)
- ✅ Database queries optimized with `select_related()` and `prefetch_related()`
- ✅ Bulk updates used instead of individual saves
- ✅ Rate limiting enabled (30/min anon, 120/min user)
- ✅ Logging configured for production debugging

### Frontend (React/Vite)
- ✅ Lazy-loaded components ready (use `React.lazy()`)
- ✅ Environment-based API URL configuration
- ✅ Axios timeout configured (15s)
- ✅ Build optimized by Vite

---

## Troubleshooting

### Backend Won't Start on Render
- Check Logs tab in Render dashboard
- Verify DATABASE_URL is correct
- Ensure SECRET_KEY is set
- Check DEBUG=False

### Frontend CORS Errors
- Verify CORS_ALLOWED_ORIGINS includes your Vercel domain
- Ensure trailing slash is removed from API_BASE_URL
- Check that CSRF_TRUSTED_ORIGINS matches

### Database Connection Issues
- Test PostgreSQL connection locally first
- Verify DB_SSL_REQUIRE setting matches your host
- Check that DATABASE_URL format is correct

---

## Final Checklist

- [ ] PostgreSQL database created and tested locally
- [ ] Backend environment variables set correctly
- [ ] Frontend environment variables set correctly
- [ ] DEBUG=False in production settings
- [ ] SECRET_KEY generated and set
- [ ] ALLOWED_HOSTS updated for your domain
- [ ] CORS_ALLOWED_ORIGINS includes frontend domain
- [ ] Build command works: `npm run build`
- [ ] Backend migrations run successfully
- [ ] Static files collected successfully
- [ ] Gunicorn starts without errors
- [ ] SSL redirect enabled in production
- [ ] HSTS headers configured
- [ ] Database backups configured
- [ ] Error tracking/monitoring set up (optional)
- [ ] CDN configured for static assets (optional)
