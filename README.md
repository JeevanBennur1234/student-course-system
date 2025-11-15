# Student Course System (Lab 2)

This repository contains a simple student-course system with a `backend` (Node/Express/MongoDB) and a `frontend` (Vite + React + Tailwind).

Local run
- Backend (from `backend/`):
  - Create a `.env` in `backend/` with `MONGO_URI`, `JWT_SECRET`, `PORT`.
  - Install and run:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
- Frontend (from `frontend/`):
  - Install and run:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

Important notes before pushing to GitHub
- Do NOT commit secrets. This repo already ignores `.env` files.
- If you have accidentally committed `backend/.env` with your MongoDB URI and credentials, rotate those credentials immediately and remove the file from git tracking:
  ```bash
  git rm --cached backend/.env
  git commit -m "Remove tracked env file"
  ```
- For MongoDB Atlas access, ensure your current IP is whitelisted in Atlas or set Access from Anywhere (0.0.0.0/0) during development (not recommended for production). See: https://www.mongodb.com/docs/atlas/security-whitelist/

Create a GitHub repo and push
1. If you use GitHub CLI (`gh`) and are authenticated:
   ```bash
   gh repo create <your-username>/<repo-name> --public --source=. --remote=origin --push
   ```
2. Or create a repo on github.com, then run:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```

Optional: Deploy frontend to GitHub Pages
- Build the frontend and deploy using GitHub Pages or Vercel/Netlify. Example build:
  ```bash
  cd frontend
  npm run build
  ```

If you want, I can:
- Commit these doc files and `.gitignore` for you now.
- Check whether `backend/.env` is currently tracked and remove it from git history if necessary.
- Create the GitHub repo using `gh` (requires you to be authenticated in this environment).
