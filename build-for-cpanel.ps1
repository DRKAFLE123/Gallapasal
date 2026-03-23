# =============================================================================
# Gallapasal — cPanel Build Script
# Run this from the project root: e:\Gallapasal\
# PowerShell: .\build-for-cpanel.ps1
# =============================================================================

param (
    [switch]$IncludeVendor
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$BackendDir  = Join-Path $ProjectRoot "backend"
$DistDir     = Join-Path $ProjectRoot "dist"
$AppDir      = Join-Path $DistDir "gallapasal"      # laravel app (outside public_html)
$PublicDir   = Join-Path $DistDir "public_html"      # web root

Write-Host "`n=== Gallapasal cPanel Build ===" -ForegroundColor Cyan

# ── Step 1: Build React/Vite assets ──────────────────────────────────────────
Write-Host "`n[1/5] Building frontend assets (npm run build)..." -ForegroundColor Yellow
Set-Location $BackendDir
npm run build
if ($LASTEXITCODE -ne 0) { throw "npm build failed!" }
Set-Location $ProjectRoot

# ── Step 2: Clean old dist ───────────────────────────────────────────────────
Write-Host "`n[2/5] Cleaning old dist/ folder..." -ForegroundColor Yellow
if (Test-Path $DistDir) { Remove-Item $DistDir -Recurse -Force }
New-Item -ItemType Directory -Path $AppDir  | Out-Null
New-Item -ItemType Directory -Path $PublicDir | Out-Null

# ── Step 3: Copy Laravel app files (excluding heavy/private folders) ─────────
Write-Host "`n[3/5] Copying Laravel app to dist/gallapasal/ ..." -ForegroundColor Yellow

$exclude = @(
    '.git', 'node_modules', '.env', '.env.*',
    'public', 'dist', 'build.log', 'lint.log', 'migrate.log',
    'migrate_err.txt', 'eslint_out.json', 'routes_report.txt',
    'check_indexes.php', '.fleet', '.idea', '.vscode'
)

if (-not $IncludeVendor) {
    $exclude += 'vendor'
}

Get-ChildItem -Path $BackendDir | Where-Object {
    $_.Name -notin $exclude
} | ForEach-Object {
    $dest = Join-Path $AppDir $_.Name
    if ($_.PSIsContainer) {
        Copy-Item $_.FullName $dest -Recurse -Force
    } else {
        Copy-Item $_.FullName $dest -Force
    }
}

# Copy .env.production.example as a reference (NOT as actual .env)
Copy-Item (Join-Path $BackendDir ".env.production.example") `
          (Join-Path $AppDir ".env.example") -Force -ErrorAction SilentlyContinue

# ── Step 4: Copy public/ → public_html/ ──────────────────────────────────────
Write-Host "`n[4/5] Copying public/ to dist/public_html/ ..." -ForegroundColor Yellow
Copy-Item (Join-Path $BackendDir "public\*") $PublicDir -Recurse -Force

# Patch index.php to point to the app folder outside public_html
$indexPath = Join-Path $PublicDir "index.php"
$indexContent = Get-Content $indexPath -Raw

# Replace the bootstrap paths — on cPanel the app lives at ../gallapasal/
# Matches Laravel 11 index.php format exactly
$indexContent = $indexContent `
    -replace [regex]::Escape("__DIR__.'/../storage/framework/maintenance.php'"), `
             "__DIR__.'/../gallapasal/storage/framework/maintenance.php'" `
    -replace [regex]::Escape("require __DIR__.'/../vendor/autoload.php';"), `
             "require __DIR__.'/../gallapasal/vendor/autoload.php';" `
    -replace [regex]::Escape("__DIR__.'/../bootstrap/app.php'"), `
             "__DIR__.'/../gallapasal/bootstrap/app.php'"

Set-Content $indexPath $indexContent -Encoding UTF8
Write-Host "   index.php patched for cPanel paths." -ForegroundColor Green

# ── Step 5: Create ZIP archive ───────────────────────────────────────────────
Write-Host "`n[5/5] Creating ZIP archive..." -ForegroundColor Yellow
$ZipPath = Join-Path $ProjectRoot "gallapasal-cpanel-ready.zip"
if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
Compress-Archive -Path "$DistDir\*" -DestinationPath $ZipPath
Write-Host "   ZIP created: $ZipPath" -ForegroundColor Green

Write-Host "`n=== BUILD COMPLETE ===" -ForegroundColor Cyan
Write-Host "Upload contents of the ZIP to your cPanel server." -ForegroundColor White
Write-Host "Read deploy-cpanel-guide.md for full instructions.`n" -ForegroundColor White
