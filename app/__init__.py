from pathlib import Path

# Expose backend/app as the top-level "app" package so
# "uvicorn app.main:app" works from the repository root.
__path__ = [str(Path(__file__).resolve().parent.parent / "backend" / "app")]
