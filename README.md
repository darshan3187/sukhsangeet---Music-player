# Sukh Sangeet - YouTube Playlist Music Player

![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Bundler-Vite%208-646CFF?logo=vite&logoColor=white)
![Django](https://img.shields.io/badge/Backend-Django%205-0C4B33?logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![Node](https://img.shields.io/badge/Node-18%2B-339933?logo=node.js&logoColor=white)

Sukh Sangeet is a full-stack music web app where users can create playlists, add songs from YouTube URLs, and listen through a custom queue/player experience.

## Table of Contents

- [What This Project Does](#what-this-project-does)
- [Why This Project Is Useful](#why-this-project-is-useful)
- [Tech Stack](#tech-stack)
- [How To Get Started](#how-to-get-started)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)
- [Where To Get Help](#where-to-get-help)
- [Who Maintains And Contributes](#who-maintains-and-contributes)

## What This Project Does

The app combines a React frontend and Django REST backend to provide:

- User registration, login, logout, and session persistence using JWT tokens.
- Personal playlist management (create, view, delete).
- Add tracks to playlists by pasting YouTube URLs.
- Queue-based playback UI with now-playing, queue drawer, and responsive layout.
- Drag-and-drop track reordering with persistent order in the backend.

Core backend routes are exposed under `api/auth/` and `api/playlists/`.

## Why This Project Is Useful

- Practical architecture: clean split between frontend client and API backend.
- Real auth flow: short-lived access token + refresh flow with token revocation handling.
- Real playlist workflows: create playlists, add/remove/reorder tracks, and play instantly.
- YouTube metadata ingestion: title, channel, duration, and thumbnail are fetched and cached.
- Good contributor ramp-up: small modular apps (`users`, `playlists`, `tracks`) and focused React components/hooks.

## Tech Stack

### Frontend

- React 19 + Vite 8
- React Router
- Axios
- Tailwind CSS 4
- `@dnd-kit` for drag-and-drop sorting
- Lucide icons

### Backend

- Django 5
- Django REST Framework
- SimpleJWT for auth tokens
- CORS headers
- SQLite (default local development database)
- Requests + YouTube Data API v3 integration

## How To Get Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- YouTube Data API key (required for adding tracks from YouTube URLs)

### 1. Clone And Install Frontend Dependencies

```bash
git clone <your-fork-or-repo-url>
cd Sukh_Sangeet
npm install
```

### 2. Set Up Backend Environment

```bash
cd backend
python -m venv .venv
```

Activate virtual environment:

- Windows PowerShell

```powershell
.\.venv\Scripts\Activate.ps1
```

- macOS/Linux

```bash
source .venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `backend/.env.example` to `backend/.env` and set values:

```env
SECRET_KEY=replace-me-with-a-strong-secret
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
YOUTUBE_API_KEY=your-youtube-data-api-key
```

Notes:

- `YOUTUBE_API_KEY` is required for `POST /api/playlists/<playlist_id>/tracks/`.
- Current settings use SQLite by default (`backend/db.sqlite3`) for local development.

### 4. Run Migrations And Start Backend

```bash
cd backend
python manage.py migrate
python manage.py runserver
```

Backend will run at `http://127.0.0.1:8000`.

### 5. Start Frontend

From the project root in a second terminal:

```bash
npm run dev
```

Frontend will run at `http://localhost:5173`.

## Usage Examples

### Auth Flow

1. Open the app and register a new user.
2. Log in with the same account.
3. The frontend stores access/refresh tokens in local storage and auto-refreshes access tokens when needed.

### Playlist Flow

1. Create a playlist.
2. Open the playlist and paste a YouTube URL.
3. Play tracks directly from the playlist.
4. Reorder tracks using drag-and-drop.

### API Examples

Register:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
	-H "Content-Type: application/json" \
	-d '{"username":"demo","email":"demo@example.com","password":"password123"}'
```

Create playlist (replace `<ACCESS_TOKEN>`):

```bash
curl -X POST http://127.0.0.1:8000/api/playlists/ \
	-H "Authorization: Bearer <ACCESS_TOKEN>" \
	-H "Content-Type: application/json" \
	-d '{"name":"Focus Mix","description":"Coding tracks"}'
```

Add YouTube track (replace IDs/tokens):

```bash
curl -X POST http://127.0.0.1:8000/api/playlists/<PLAYLIST_ID>/tracks/ \
	-H "Authorization: Bearer <ACCESS_TOKEN>" \
	-H "Content-Type: application/json" \
	-d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## Project Structure

```text
.
|- backend/
|  |- apps/
|  |  |- users/        # auth, tokens, profile endpoints
|  |  |- playlists/    # playlist CRUD + track ordering
|  |  |- tracks/       # YouTube lookup + track cache model
|  |- config/          # Django settings and URL routing
|- src/
|  |- api/             # Axios client + token helpers
|  |- components/      # Playlist UI, player, queue, modals
|  |- context/         # Auth and player state providers
|  |- hooks/           # data hooks for playlists/tracks
|  |- pages/           # Login/Register
```

## Where To Get Help

- Open an issue in this repository for bugs, feature requests, or setup problems.
- Check these key files first when debugging local setup:
	- [backend/config/settings.py](backend/config/settings.py)
	- [backend/.env.example](backend/.env.example)
	- [src/api/axios.js](src/api/axios.js)
- Official docs:
	- [Django Documentation](https://docs.djangoproject.com/)
	- [Django REST Framework](https://www.django-rest-framework.org/)
	- [React Documentation](https://react.dev/)
	- [Vite Documentation](https://vite.dev/)

## Who Maintains And Contributes

Maintainer:

- [darshan3187](https://github.com/darshan3187)

How to contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/your-change`).
3. Make focused changes.
4. Run local checks before opening a PR:

```bash
# frontend checks
npm run lint
npm run build

# backend basic check
cd backend
python manage.py check
```

5. Open a pull request with a clear description and testing notes.

If you plan to add major features, open an issue first to align on scope and design.
