import Post from '../../components/common/Post';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import CreatePost from './CreatePost'
import { getPosts, updatePost, deletePost } from '../../utils/api';


export default function MainContent() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const APP_URL = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000'; 

  if (!user) return null;

  const currentAvatarUrl = user.avatar
    ? `${APP_URL}/storage/${user.avatar}`
    : `${APP_URL}/storage/avatars/noavatar.png`; 

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      try {
        const data = await getPosts(); // implements GET /api/posts
        if (!isMounted) return;

        // data.data if you use Laravel pagination
        const items = Array.isArray(data.data) ? data.data : data;
        setPosts(items);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);


  const handleUpdatePost = async (id, payload) => {
    const updated = await updatePost(id, payload);
    setPosts(prev =>
      prev.map(p => (p.id === id ? updated : p))
    );
  };
  const handleDeletePost = async (id) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="MainContent">
      <CreatePost
        onPostCreated={(newPost) => {
          // optimistic prepend
          setPosts((prev) => [newPost, ...prev]);
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
          onUpdate={handleUpdatePost}
          onDelete={handleDeletePost}
        />
      ))}
    </div>
  );
}
