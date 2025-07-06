<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CleanupExpiredTokens extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'tokens:cleanup 
                            {--days=30 : Delete tokens older than this many days}
                            {--dry-run : Show what would be deleted without actually deleting}';

    /**
     * The console command description.
     */
    protected $description = 'Clean up expired API tokens and user sessions';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting token cleanup...');

        $days = (int) $this->option('days');
        $dryRun = $this->option('dry-run');

        try {
            $cleanupResults = [
                'expired_tokens' => $this->cleanupExpiredTokens($days, $dryRun),
                'old_sessions' => $this->cleanupOldSessions($days, $dryRun),
                'password_resets' => $this->cleanupPasswordResets($days, $dryRun),
                'failed_jobs' => $this->cleanupFailedJobs($days, $dryRun),
            ];

            $this->displayResults($cleanupResults, $dryRun);

            if (!$dryRun) {
                Log::info('Token cleanup completed', $cleanupResults);
                $this->info('Token cleanup completed successfully!');
            } else {
                $this->info('Dry run completed. Use without --dry-run to actually delete.');
            }

            return 0;
        } catch (\Exception $e) {
            $this->error('Token cleanup failed: ' . $e->getMessage());
            Log::error('Token cleanup command failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return 1;
        }
    }

    /**
     * Clean up expired personal access tokens
     */
    private function cleanupExpiredTokens(int $days, bool $dryRun): int
    {
        $cutoffDate = now()->subDays($days);

        if (!$this->tableExists('personal_access_tokens')) {
            $this->warn('Personal access tokens table does not exist, skipping token cleanup');
            return 0;
        }

        $query = DB::table('personal_access_tokens')
            ->where('created_at', '<', $cutoffDate)
            ->orWhere('last_used_at', '<', $cutoffDate);

        $count = $query->count();

        if (!$dryRun && $count > 0) {
            $deleted = $query->delete();
            $this->info("Deleted {$deleted} expired tokens");
            return $deleted;
        }

        if ($dryRun) {
            $this->info("Would delete {$count} expired tokens");
        }

        return $count;
    }

    /**
     * Clean up old session records
     */
    private function cleanupOldSessions(int $days, bool $dryRun): int
    {
        $cutoffDate = now()->subDays($days)->timestamp;

        if (!$this->tableExists('sessions')) {
            $this->warn('Sessions table does not exist, skipping session cleanup');
            return 0;
        }

        $query = DB::table('sessions')->where('last_activity', '<', $cutoffDate);
        $count = $query->count();

        if (!$dryRun && $count > 0) {
            $deleted = $query->delete();
            $this->info("Deleted {$deleted} old sessions");
            return $deleted;
        }

        if ($dryRun) {
            $this->info("Would delete {$count} old sessions");
        }

        return $count;
    }

    /**
     * Clean up old password reset tokens
     */
    private function cleanupPasswordResets(int $days, bool $dryRun): int
    {
        $cutoffDate = now()->subDays($days);

        if (!$this->tableExists('password_reset_tokens')) {
            $this->warn('Password reset tokens table does not exist, skipping password reset cleanup');
            return 0;
        }

        $query = DB::table('password_reset_tokens')->where('created_at', '<', $cutoffDate);
        $count = $query->count();

        if (!$dryRun && $count > 0) {
            $deleted = $query->delete();
            $this->info("Deleted {$deleted} old password reset tokens");
            return $deleted;
        }

        if ($dryRun) {
            $this->info("Would delete {$count} old password reset tokens");
        }

        return $count;
    }

    /**
     * Clean up old failed jobs
     */
    private function cleanupFailedJobs(int $days, bool $dryRun): int
    {
        $cutoffDate = now()->subDays($days);

        if (!$this->tableExists('failed_jobs')) {
            $this->warn('Failed jobs table does not exist, skipping failed jobs cleanup');
            return 0;
        }

        $query = DB::table('failed_jobs')->where('failed_at', '<', $cutoffDate);
        $count = $query->count();

        if (!$dryRun && $count > 0) {
            $deleted = $query->delete();
            $this->info("Deleted {$deleted} old failed jobs");
            return $deleted;
        }

        if ($dryRun) {
            $this->info("Would delete {$count} old failed jobs");
        }

        return $count;
    }

    /**
     * Check if a table exists
     */
    private function tableExists(string $table): bool
    {
        try {
            return DB::getSchemaBuilder()->hasTable($table);
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Display cleanup results
     */
    private function displayResults(array $results, bool $dryRun): void
    {
        $this->newLine();
        $this->info('Cleanup Results:');
        $this->info('================');

        $verb = $dryRun ? 'Would delete' : 'Deleted';

        foreach ($results as $type => $count) {
            $type = str_replace('_', ' ', ucwords($type, '_'));
            $this->info("{$verb} {$count} {$type}");
        }

        $total = array_sum($results);
        $this->info("Total: {$verb} {$total} records");

        if ($total === 0) {
            $this->info('No records to clean up.');
        }
    }
}
