<?php

namespace App\Jobs;

use App\Models\Post;
use App\Traits\CompressVideo;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class CompressPostVideo implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, CompressVideo;

    public function __construct(public Post $post)
    {
    }

    public function handle(): void
    {
        if (! $this->post->video_path) {
            return;
        }

        $original = $this->post->video_path;

        $compressed = $this->compressVideoIfNeeded($original, $this->post->id);

        if ($compressed !== $original) {
            Storage::disk('public')->delete($original);
            $this->post->update(['video_path' => $compressed]);
        }
    }
}
