<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BackupController extends Controller
{
    /**
     * Generate a MySQL backup file and trigger a download.
     */
    public function download()
    {
        $databaseName = env('DB_DATABASE');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD');
        $host = env('DB_HOST', '127.0.0.1');
        $port = env('DB_PORT', '3306');

        $date = now()->format('Y-m-d_H-i-s');
        $filename = "backup-{$databaseName}-{$date}.sql";
        $storagePath = storage_path("app/backups");

        // Ensure the directory exists
        if (!file_exists($storagePath)) {
            mkdir($storagePath, 0755, true);
        }

        $filePath = "{$storagePath}/{$filename}";

        // Securely pass password via environment variable to mysqldump
        $command = sprintf(
            'mysqldump --user="%s" --password="%s" --host="%s" --port="%s" "%s" > "%s"',
            $username,
            $password,
            $host,
            $port,
            $databaseName,
            $filePath
        );

        $output = [];
        $returnVar = 0;
        exec($command, $output, $returnVar);

        if ($returnVar !== 0) {
            return response()->json([
                'message' => 'Backup failed to generate. Ensure mysqldump is installed and accessible.',
                'error' => implode("\n", $output)
            ], 500);
        }

        return response()->download($filePath)->deleteFileAfterSend(true);
    }
}
