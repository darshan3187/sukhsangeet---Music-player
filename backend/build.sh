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

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build complete!"
