#!/bin/bash
set -o errexit

# Root wrapper for Render when service root is repository root.
exec bash backend/start.sh
