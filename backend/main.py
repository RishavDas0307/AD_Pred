import os
import sys
from pathlib import Path

# Ensure backend directory is in sys.path for direct python execution
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import uvicorn
from app.main import app

if __name__ == "__main__":
    # Render automatically passes the PORT environment variable (e.g. 10000)
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)

