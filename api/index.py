import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.API_server_original import app

# Export the Flask app for Vercel
def handler(request):
    return app
