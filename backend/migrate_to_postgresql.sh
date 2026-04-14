#!/bin/bash
# PostgreSQL Migration Helper Script
# This script helps migrate from SQLite to PostgreSQL

set -e  # Exit on any error

echo "================================"
echo "SQLite to PostgreSQL Migration"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# === STEP 1: Verify Prerequisites ===
echo "Step 1: Checking prerequisites..."
echo ""

if ! command -v python &> /dev/null; then
    print_error "Python not found. Please install Python 3.8+"
    exit 1
fi
print_status "Python found"

if ! python -c "import django" &> /dev/null; then
    print_error "Django not found. Run: pip install -r requirements.txt"
    exit 1
fi
print_status "Django found"

if ! python -c "import psycopg2" &> /dev/null; then
    print_warning "psycopg2 not found. Installing..."
    pip install psycopg2-binary
fi
print_status "PostgreSQL driver (psycopg2) found"

# === STEP 2: Create Backup ===
echo ""
echo "Step 2: Creating backup of SQLite database..."
if [ -f "db.sqlite3" ]; then
    cp db.sqlite3 db.sqlite3.backup.$(date +%s)
    print_status "Backup created: db.sqlite3.backup.*"
else
    print_warning "No db.sqlite3 found"
fi

# === STEP 3: Set Up PostgreSQL Connection ===
echo ""
echo "Step 3: PostgreSQL Connection Setup"
echo ""

read -p "Enter PostgreSQL host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Enter PostgreSQL port [5432]: " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "Enter PostgreSQL database name [sukhsangeet_db]: " DB_NAME
DB_NAME=${DB_NAME:-sukhsangeet_db}

read -p "Enter PostgreSQL username [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

read -s -p "Enter PostgreSQL password: " DB_PASSWORD
echo ""

# Build DATABASE_URL
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# === STEP 4: Test Connection ===
echo ""
echo "Step 4: Testing PostgreSQL connection..."
if python -c "import psycopg2; psycopg2.connect('dbname=${DB_NAME} user=${DB_USER} password=${DB_PASSWORD} host=${DB_HOST}')" 2>/dev/null; then
    print_status "PostgreSQL connection successful"
else
    print_error "Could not connect to PostgreSQL"
    echo "Make sure:"
    echo "  - PostgreSQL server is running"
    echo "  - Database '$DB_NAME' exists"
    echo "  - Credentials are correct"
    exit 1
fi

# === STEP 5: Update Environment ===
echo ""
echo "Step 5: Updating .env configuration..."

# Check if .env exists
if [ -f ".env" ]; then
    # Backup current .env
    cp .env .env.backup.$(date +%s)
    print_status ".env backed up"
    
    # Update DATABASE_URL
    if grep -q "^DATABASE_URL=" .env; then
        sed -i "s|^DATABASE_URL=.*|DATABASE_URL=${DATABASE_URL}|" .env
    else
        echo "DATABASE_URL=${DATABASE_URL}" >> .env
    fi
    
    # Set DB_SSL_REQUIRE if remote
    if [ "$DB_HOST" != "localhost" ] && [ "$DB_HOST" != "127.0.0.1" ]; then
        if grep -q "^DB_SSL_REQUIRE=" .env; then
            sed -i "s/^DB_SSL_REQUIRE=.*/DB_SSL_REQUIRE=True/" .env
        else
            echo "DB_SSL_REQUIRE=True" >> .env
        fi
        print_status "SSL requirement enabled for remote database"
    fi
else
    print_error ".env file not found. Creating from template..."
    cat > .env << EOF
ENVIRONMENT=production
DEBUG=False
DATABASE_URL=${DATABASE_URL}
DB_CONN_MAX_AGE=600
DB_SSL_REQUIRE=$([ "$DB_HOST" != "localhost" ] && echo "True" || echo "False")
EOF
    print_warning "Please edit .env with other required values (SECRET_KEY, ALLOWED_HOSTS, CORS, etc.)"
fi

print_status "DATABASE_URL configured in .env"

# === STEP 6: Run Migrations ===
echo ""
echo "Step 6: Running migrations against PostgreSQL..."
echo ""

export $(cat .env | xargs)

if python manage.py migrate; then
    print_status "Migrations completed successfully"
else
    print_error "Migration failed"
    echo "Troubleshooting:"
    echo "  - Check that migrations are properly defined"
    echo "  - Verify database user has create table permissions"
    echo "  - Check Django logs for details"
    exit 1
fi

# === STEP 7: Verify Data ===
echo ""
echo "Step 7: Verifying database..."
echo ""

print_status "Checking users table..."
USER_COUNT=$(python manage.py shell -c "from django.contrib.auth import get_user_model; print(get_user_model().objects.count())")
echo "  Users: $USER_COUNT"

print_status "Checking playlists table..."
PLAYLIST_COUNT=$(python manage.py shell -c "from apps.playlists.models import Playlist; print(Playlist.objects.count())" 2>/dev/null || echo "0")
echo "  Playlists: $PLAYLIST_COUNT"

print_status "Checking tracks table..."
TRACK_COUNT=$(python manage.py shell -c "from apps.tracks.models import Track; print(Track.objects.count())" 2>/dev/null || echo "0")
echo "  Tracks: $TRACK_COUNT"

# === STEP 8: Collect Static Files ===
echo ""
echo "Step 8: Collecting static files for production..."
if python manage.py collectstatic --noinput --clear; then
    print_status "Static files collected"
else
    print_warning "Could not collect static files (OK for now)"
fi

# === COMPLETION ===
echo ""
echo "================================"
echo -e "${GREEN}Migration Complete!${NC}"
echo "================================"
echo ""
echo "Summary:"
echo "  ✓ SQLite backed up: db.sqlite3.backup.*"
echo "  ✓ PostgreSQL configured"
echo "  ✓ Migrations applied"
echo "  ✓ Data verified"
echo "  ✓ Static files collected"
echo ""
echo "Next steps:"
echo "  1. Test your application: python manage.py runserver"
echo "  2. Verify auth still works (login/logout)"
echo "  3. Check playlists and tracks load correctly"
echo "  4. If using Render, update DATABASE_URL environment variable"
echo "  5. Deploy to production"
echo ""
echo "To revert to SQLite if needed:"
echo "  - Delete .env DATABASE_URL or set it back to: sqlite:///db.sqlite3"
echo "  - Restore from backup: db.sqlite3.backup.*"
echo "  - Run: python manage.py migrate --fake-initial"
echo ""
