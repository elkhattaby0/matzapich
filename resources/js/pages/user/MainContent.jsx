import { useEffect, useState } from 'react';
import Post from '../../components/common/Post';
import { useAuth } from '../../hooks/useAuth';
import CreatePost from './CreatePost';
import { getPosts, updatePost, deletePost } from '../../utils/api';

export default function MainContent() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const APP_URL = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';

  if (!user) return null;

  const currentAvatarUrl = user.avatar
    ? `${APP_URL}/storage/${user.avatar}`
    : `${APP_URL}/storage/avatars/noavatar.png`;

  const loadPosts = async (pageToLoad = 1) => {
    if (pageToLoad === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await getPosts(pageToLoad); // GET /api/posts?page=n

      // Laravel paginate(): { data: [...], current_page, last_page, ... }
      const items = Array.isArray(data.data) ? data.data : data;

      setPosts(prev =>
        pageToLoad === 1 ? items : [...prev, ...items]
      );

      if (data.current_page && data.last_page) {
        setPage(data.current_page);
        setHasMore(data.current_page < data.last_page);
      } else {
        setHasMore(false);
      }
    } finally {
      if (pageToLoad === 1) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPosts(1);
  }, []);

  const handleUpdatePost = async (id, payload) => {
    const updated = await updatePost(id, payload);
    setPosts(prev =>
      prev.map(p => (p.id === id ? updated : p))
    );
  };

  const handleDeletePost = async (id) => {
    await deletePost(id);
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="MainContent">
      <CreatePost
        onPostCreated={(newPost) => {
          // optimistic prepend
          setPosts(prev => [newPost, ...prev]);
        }}
      />

      {loading && <p>Loading posts...</p>}
      {!loading && posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((p) => (
        <Post
          key={p.id}
          id={p.id}
          visibility={p.visibility}
          userimg={
            p.user?.avatar
              ? `${APP_URL}/storage/${p.user.avatar}`
              : `${APP_URL}/storage/avatars/noavatar.png`
          }
          name={`${p.user?.firstName} ${p.user?.lastName}`}
          date={new Date(p.created_at).toLocaleDateString()}
          time={new Date(p.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          post={p.content}
          imgPost={p.media_url ? p.media_url : null}
          videoUrl={p.video_url}
          onUpdate={handleUpdatePost}
          onDelete={handleDeletePost}
          currentUserId={user?.id}
          postUserId={p.user_id}
        />
      ))}

      {!loading && hasMore && (
        <button
          type="button"
          onClick={() => loadPosts(page + 1)}
          disabled={loadingMore}
          className="showMore"
        >
          {loadingMore ? 'Loading...' : 'Show more'}
        </button>
      )}
    </div>
  );
}
