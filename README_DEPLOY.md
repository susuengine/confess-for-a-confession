# Deploying Your Confession Site

## Quick Deploy on Render.com

1. Sign up at https://render.com (free tier available).
2. Click "New Web Service" and connect your GitHub repo (push this code to GitHub first).
3. Set the build and start commands:
   - **Build Command:** (leave blank)
   - **Start Command:** `flask run --host=0.0.0.0 --port=10000`
4. Set environment variables:
   - `FLASK_APP=app.py`
   - `FLASK_ENV=production`
5. Choose Python 3.10+ as the runtime.
6. Hit "Create Web Service". Your site will build and deploy!

## Notes
- Your SQLite database (`confessions.db`) will persist as long as the service is not destroyed.
- For a custom domain, add it in Render's dashboard.
- You can also use Railway.app with similar steps.

## Local Development
```
pip install -r requirements.txt
flask run
```

---

If you need help pushing to GitHub or want a one-click deploy button, let me know!
