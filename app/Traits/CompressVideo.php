<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;
use FFMpeg\Format\Video\X264;
use FFMpeg\Coordinate\Dimension;

trait CompressVideo
{
    public function compressVideoIfNeeded(string $videoPath, int $postId): string
    {
        $fullPath = Storage::disk('public')->path($videoPath);

        if (! file_exists($fullPath)) {
            return $videoPath;
        }

        if (str_contains($videoPath, 'compressed_')) {
            return $videoPath;
        }

        $outputPath = "posts/{$postId}/compressed_" . basename($videoPath);

        FFMpeg::fromDisk('public')
            ->open($videoPath)
            ->addFilter(function ($filters) {
                // Resize only; REMOVE FrameRate::fromInteger
                $filters->resize(new Dimension(1280, 720));
            })
            ->export()
            ->toDisk('public')
            ->inFormat(
                (new X264('aac', 'libx264'))
                    ->setKiloBitrate(800)
                    ->setAdditionalParameters(['-crf', '28', '-movflags', '+faststart'])
            )
            ->save($outputPath);

        return $outputPath;
    }
}
