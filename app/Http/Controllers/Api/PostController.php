<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request)
    {
        // simple feed, later you can filter by friends/visibility
        $posts = Post::with('user')
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
        ]);

        $mediaPath = null;

        if ($request->hasFile('image')) {
            $mediaPath = $this->storeWebpImage($request->file('image'));
        }

        $post = Post::create([
            'user_id'    => $user->id,
            'content'    => $validated['content'] ?? null,
            'media_path' => $mediaPath,
            'visibility' => $validated['visibility'],
        ]);

        return response()->json($post->load('user'), 201);
    }

    protected function storeWebpImage($file): ?string
    {
        // original tmp path
        $image = imagecreatefromstring(file_get_contents($file->getRealPath()));
        if (!$image) {
            return null;
        }

        $filename = Str::uuid().'.webp';
        $path = 'posts/'.$filename; // storage/app/public/posts

        // ensure dir exists
        Storage::disk('public')->makeDirectory('posts');

        // save webp to storage/app/public/posts
        $full = Storage::disk('public')->path($path);
        imagewebp($image, $full, 80); // quality 0‑100
        imagedestroy($image);

        return $path; // store relative path
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

        // remove old image if requested
        if (!empty($validated['remove_image']) && $post->media_path) {
            Storage::disk('public')->delete($post->media_path);
            $post->media_path = null;
        }

        // replace with new image if uploaded
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
        if ($post->user_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($post->media_path) {
            Storage::disk('public')->delete($post->media_path);
        }

        $post->delete();

        return response()->json(null, 204);
    }

}

