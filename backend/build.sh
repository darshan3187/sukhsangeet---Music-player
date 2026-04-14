#!/bin/bash
# Backend deployment build script for Render/productions
# This script runs migrations and collects static files

set -o errexit  # Exit on any error

# Ensure commands run from the backend directory even when invoked from repo root.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Installing dependencies..."
python -m pip install -r requirements.txt

echo "Running database migrations..."
python manage.py migrate

echo "Checking admin bootstrap configuration..."
if [ -n "$RENDER_ADMIN_EMAIL" ] && [ -n "$RENDER_ADMIN_PASSWORD" ]; then
	ADMIN_USERNAME="${RENDER_ADMIN_USERNAME:-admin}"
	echo "Creating/updating admin user for $RENDER_ADMIN_EMAIL..."
	python manage.py shell -c "from apps.users.models import User; email='''$RENDER_ADMIN_EMAIL'''; username='''$ADMIN_USERNAME'''; password='''$RENDER_ADMIN_PASSWORD'''; user, _ = User.objects.get_or_create(email=email, defaults={'username': username}); user.username = username; user.is_staff = True; user.is_superuser = True; user.is_active = True; user.set_password(password); user.save(); print('Admin bootstrap complete for', user.email)"
else
	echo "Skipping admin bootstrap (set RENDER_ADMIN_EMAIL and RENDER_ADMIN_PASSWORD to enable)."
fi

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build complete!"
