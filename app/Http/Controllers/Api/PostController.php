<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
// use App\Jobs\CompressPostVideo;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $posts = Post::with('user')
            ->where(function ($q) use ($user) {
                $q->where('visibility', 'public');

                if ($user) {
                    $q->orWhere('user_id', $user->id);
                }
            })
            ->latest()
            ->paginate(10);

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'content'    => ['nullable', 'string', 'max:2000'],
            'visibility' => ['required', 'in:public,friends,only_me'],
            'image'      => ['nullable', 'image', 'max:4096'], // 4MB
            'video'      => ['nullable', 'file', 'mimes:mp4,webm', 'max:10240'],
        ]);

        $mediaPath = null;
        $videoPath = null;

        if ($request->hasFile('image')) {
            $mediaPath = $this->storeWebpImage($request->file('image'));
        }

        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('posts/videos', 'public');
        }

        $post = Post::create([
            'user_id'    => $user->id,
            'content'    => $validated['content'] ?? null,
            'media_path' => $mediaPath,
            'video_path' => $videoPath,
            'visibility' => $validated['visibility'],
        ]);

        return response()->json($post->load('user'), 201);
    }

    protected function storeWebpImage($file): ?string
    {
        $image = imagecreatefromstring(file_get_contents($file->getRealPath()));
        if (!$image) {
            return null;
        }

        $filename = Str::uuid() . '.webp';
        // store under storage/app/public/posts/images
        $path = 'posts/images/' . $filename;

        // ensure dir exists
        Storage::disk('public')->makeDirectory('posts/images');

        // save webp to storage/app/public/posts/images
        $full = Storage::disk('public')->path($path);
        imagewebp($image, $full, 80);
        imagedestroy($image);

        return $path;
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validate([
            'content'      => ['nullable', 'string', 'max:2000'],
            'visibility'   => ['required', 'in:public,friends,only_me'],
            'image'        => ['nullable', 'image', 'max:4096'],
            'remove_image' => ['nullable', 'boolean'],
        ]);

        if (!empty($validated['remove_image']) && $post->media_path) {
            Storage::disk('public')->delete($post->media_path);
            $post->media_path = null;
        }

        if ($request->hasFile('image')) {
            if ($post->media_path) {
                Storage::disk('public')->delete($post->media_path);
            }
            $post->media_path = $this->storeWebpImage($request->file('image'));
        }

        if (array_key_exists('content', $validated)) {
            $post->content = $validated['content'];
        }

        if (array_key_exists('visibility', $validated)) {
            $post->visibility = $validated['visibility'];
        }

        $post->save();

        return response()->json($post->load('user'));
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        if ($post->media_path) {
            Storage::disk('public')->delete($post->media_path);
        }

        if ($post->video_path) {
            Storage::disk('public')->delete($post->video_path);
        }

        $post->delete();

        return response()->json(null, 204);
    }
}
