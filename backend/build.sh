#!/bin/bash
# Backend deployment build script for Render/productions
# This script runs migrations and collects static files

set -o errexit  # Exit on any error

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running database migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build complete!"
