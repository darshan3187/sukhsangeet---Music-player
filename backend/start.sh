#!/bin/bash
set -o errexit

# Always run from backend directory so Django module paths resolve.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

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

exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:"$PORT" \
  --workers "${WEB_CONCURRENCY:-3}" \
  --worker-class sync \
  --timeout 30 \
  --access-logfile - \
  --error-logfile -
