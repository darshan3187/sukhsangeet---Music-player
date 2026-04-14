#!/bin/bash
set -o errexit

# Always run from backend directory so Django module paths resolve.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:"$PORT" \
  --workers "${WEB_CONCURRENCY:-3}" \
  --worker-class sync \
  --timeout 30 \
  --access-logfile - \
  --error-logfile -
