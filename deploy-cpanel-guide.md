# Gallapasal — cPanel Deployment Guide

## Overview

This project is a **Laravel 11 + React (Vite) SPA**. The React frontend is compiled
into `public/build/` by Vite. For cPanel shared hosting, files are split into two locations:

| What | Where on cPanel server |
|---|---|
| Laravel app code | `/home/<user>/gallapasal/` |
| Web root (public) | `/home/<user>/public_html/` |

---

## Step 1 — Build Locally

Open PowerShell in the project root (`e:\Gallapasal\`) and run:

```powershell
.\build-for-cpanel.ps1
```

This will:
- Compile React/Vite assets (`npm run build`)
- Organize files into `dist/`
- Patch `index.php` with correct cPanel paths
- Create `gallapasal-cpanel.zip`

---

## Step 2 — Create cPanel Database

1. Log into cPanel → **MySQL Databases**
2. Create a new database, e.g. `cpanelusername_gallapasal`
3. Create a new database user with a strong password
4. Add the user to the database with **All Privileges**
5. Note the database name, username, and password for Step 4

---

## Step 3 — Upload Files via cPanel File Manager

1. Open **File Manager** in cPanel
2. Navigate to your home directory (`/home/<user>/`)
3. Upload `gallapasal-cpanel.zip` to the home directory
4. Extract the ZIP — it creates two folders:
   - `gallapasal/` — Laravel app
   - `public_html/` — web root files

> [!IMPORTANT]
> The ZIP extracts directly into your home directory. If `public_html/` already has files
> (old WordPress etc.), back them up first.

---

## Step 4 — Configure .env

1. In File Manager, navigate to `/home/<user>/gallapasal/`
2. Copy `.env.example` → rename to `.env`
3. Edit `.env` and set:

```ini
APP_NAME=Gallapasal
APP_ENV=production
APP_KEY=                          # ← leave blank, generate in Step 6
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=cpanelusername_gallapasal
DB_USERNAME=cpanelusername_dbuser
DB_PASSWORD=your_db_password
```

---

## Step 5 — Install Composer Dependencies

### Option A — SSH/Terminal (Recommended)
```bash
cd ~/gallapasal
composer install --no-dev --optimize-autoloader
```

### Option B — cPanel Terminal
Go to cPanel → **Terminal** and run the same commands.

### Option C — No SSH (Pre-bundle vendor/)
Before running `build-for-cpanel.ps1`, run locally:
```powershell
cd e:\Gallapasal\backend
composer install --no-dev --optimize-autoloader
```
Then re-run `.\build-for-cpanel.ps1 -IncludeVendor`. The `vendor/` folder will be included in the ZIP.

> [!WARNING]
> The `vendor/` folder is ~50 MB. Uploading via File Manager is slow.
> If you have SSH/Terminal access, use Option A or B.

---

## Step 6 — Run Artisan Commands (via SSH/Terminal)

```bash
cd ~/gallapasal

# 1. Generate application key
php artisan key:generate

# 2. Run database migrations
php artisan migrate --force

# 3. Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 4. Fix storage permissions
chmod -R 755 storage bootstrap/cache
php artisan storage:link
```

---

## Step 7 — Verify

1. Visit `https://yourdomain.com` — React app should load
2. Try logging in / using the app
3. Visit `https://yourdomain.com/api/...` — should return JSON (not HTML)

---

## Troubleshooting

| Problem | Fix |
|---|---|
| White screen / 500 error | Set `APP_DEBUG=true` temporarily, check `gallapasal/storage/logs/laravel.log` |
| 404 on page refresh | Ensure `public_html/.htaccess` exists and `mod_rewrite` is enabled |
| DB connection failed | Double-check DB name format: `cpanelusername_dbname` |
| Assets not loading | Run `php artisan config:clear` then re-check `build/` folder exists in `public_html/` |
| `php artisan` not found | Use full path: `/usr/local/bin/php artisan ...` |

---

## Folder Structure After Deployment

```
/home/username/
├── public_html/          ← domain points here
│   ├── index.php         (patched to point ../gallapasal/)
│   ├── .htaccess
│   ├── favicon.ico
│   └── build/            (compiled React + JS/CSS assets)
└── gallapasal/           ← Laravel app (private, not web-accessible)
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── database/
    ├── resources/
    ├── routes/
    ├── storage/
    ├── vendor/
    └── .env
```
