# Gallapasal

Gallapasal is a comprehensive point-of-sale and ledger management web application. It handles inventory management, sales and purchases logging, PDF invoice generation, vendor tracking, and dual-calendar date tracking (Gregorian/AD and Nepali/BS).

## Tech Stack

- **Backend:** [Laravel 11](https://laravel.com/) (PHP 8.2+)
- **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite](https://vitejs.dev/) with `laravel-vite-plugin`
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Forms & Tables:** React Hook Form, TanStack Table v8
- **Database:** MySQL / MariaDB

> **Note on Architecture:** The frontend React code has been fully integrated into the Laravel backend using Vite. The legacy `frontend/` folder in the root directory is obsolete; all active frontend development happens inside `backend/resources/js/`.

## Local Development Setup

To run this application locally for development:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DRKAFLE123/Gallapasal.git
   cd Gallapasal/backend
   ```
2. **Install PHP and Node dependencies:**
   ```bash
   composer install
   npm install
   ```
3. **Environment Setup:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Make sure to update the `.env` file with your local MySQL database credentials.*
4. **Migrate the Database:**
   ```bash
   php artisan migrate
   ```
5. **Run the Development Servers:**
   You will need two terminal windows running inside the `backend/` directory:
   
   *Terminal 1 (Laravel PHP Server):*
   ```bash
   php artisan serve
   ```
   *Terminal 2 (Vite Frontend Hot-Reloading Server):*
   ```bash
   npm run dev
   ```
6. **Access the App:** Open `http://localhost:8000` in your browser.

---

## Production Deployment Guide

Deploying Gallapasal requires a standard PHP capable web server (like Nginx or Apache), Node.js (for building the frontend assets), and MySQL.

### 1. Server Requirements
- PHP >= 8.2
- Composer
- Node.js >= 18 & NPM
- MySQL >= 8.0 (or MariaDB)
- Extensions: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML (standard Laravel requirements)

### 2. Deployment Steps

Run the following commands on your production server via SSH:

```bash
# 1. Clone the repository to your web root (e.g., /var/www/gallapasal)
git clone https://github.com/DRKAFLE123/Gallapasal.git /var/www/gallapasal
cd /var/www/gallapasal/backend

# 2. Install PHP Dependencies (Optimized for production)
composer install --optimize-autoloader --no-dev

# 3. Setup Environment File
cp .env.example .env
php artisan key:generate

# Edit .env and set:
# APP_ENV=production
# APP_DEBUG=false
# APP_URL=https://yourdomain.com
# DB_DATABASE=...
# DB_USERNAME=...
# DB_PASSWORD=...

# 4. Install Node Dependencies and Build Frontend Assets
npm install
npm run build

# 5. Run Database Migrations
php artisan migrate --force

# 6. Link Storage (for file uploads if required)
php artisan storage:link

# 7. Cache Configuration & Routes for Performance
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 3. File Permissions
Ensure your web server (e.g., `www-data` or `nginx`) has write permissions to the `storage/` and `bootstrap/cache/` directories:
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 4. Web Server Configuration (Nginx Example)
Point your web server's document root to the `backend/public` directory. Here is an example Nginx server block:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/gallapasal/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock; # Ensure version matches
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Once your Nginx configuration is updated, restart the service:
```bash
sudo systemctl restart nginx
```

You are now ready to visit `yourdomain.com` and use the application in a production environment!
