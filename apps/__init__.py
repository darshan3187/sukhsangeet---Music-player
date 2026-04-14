from pathlib import Path

# Expose backend/apps as top-level "apps" package for root-start deployments.
_BACKEND_APPS = Path(__file__).resolve().parent.parent / "backend" / "apps"
__path__ = [str(_BACKEND_APPS)]
