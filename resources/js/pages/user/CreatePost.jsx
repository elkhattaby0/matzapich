import BgCard from '../../components/common/BgCard';
import { useAuth } from '../../hooks/useAuth';
import { useState, useRef } from 'react';
import { fileToWebpBlob } from '../../components/PostImages';
import { createPost } from '../../utils/api';
import detectDirection from '../../components/common/detectDirection'

const AUDIENCES = [
  { value: 'public', label: 'Public', icon: 'fa-solid fa-earth-africa' },
  { value: 'friends', label: 'Friends', icon: 'fa-solid fa-user-group' },
  { value: 'only_me', label: 'Only me', icon: 'fa-solid fa-lock' },
];

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [audience, setAudience] = useState('public');
  const [openAudience, setOpenAudience] = useState(false);
  const [content, setContent] = useState('');
  const [rawImage, setRawImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  const APP_URL = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';

  if (!user) return null;

  const currentAvatarUrl = user.avatar
    ? `${APP_URL}/storage/${user.avatar}`
    : `${APP_URL}/storage/avatars/noavatar.png`;

  const fullname = `${user.firstName} ${user.lastName}`;
  const currentAudience =
    AUDIENCES.find((a) => a.value === audience) ?? AUDIENCES[0];

  const handleContentChange = (e) => {
    setContent(e.target.value);

    // Auto-resize textarea
    const ta = textareaRef.current;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRawImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handlePost = async () => {
    if (!content.trim() && !rawImage) return;

    try {
      setLoading(true);
      let webpBlob = null;
      if (rawImage) {
        webpBlob = await fileToWebpBlob(rawImage, 0.7);
      }

      const imageForUpload = webpBlob
        ? new File([webpBlob], 'post.webp', { type: 'image/webp' })
        : null;

      const newPost = await createPost({
        content: content.trim(),
        visibility: audience,
        imageFile: imageForUpload,
      });
      
      setContent('');
      setRawImage(null);
      setPreviewUrl(null);

      if (onPostCreated) onPostCreated(newPost);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BgCard tag="createPost">
      <div className="createPost">
        <div className="top">
          <img src={currentAvatarUrl} alt={fullname} />

          <div className="topRight">
            <p className="name">{fullname}</p>

            <div className="audienceWrapper">
              <button
                type="button"
                className="audience"
                onClick={() => setOpenAudience((o) => !o)}
              >
                <span className="icon">
                  <i className={currentAudience.icon}></i>
                </span>
                <span>{currentAudience.label}</span>
                <i className="fa-solid fa-chevron-down"></i>
              </button>

              {openAudience && (
                <ul className="audienceMenu">
                  {AUDIENCES.map((opt) => (
                    <li
                      key={opt.value}
                      className={opt.value === audience ? 'active' : ''}
                      onClick={() => {
                        setAudience(opt.value);
                        setOpenAudience(false);
                      }}
                    >
                      <span className="icon">
                        <i className={opt.icon}></i>
                      </span>
                      <span>{opt.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="middle">
          <textarea
            dir={detectDirection(content)}
            ref={textareaRef}
            placeholder={`What's on your mind, ${user.firstName}?`}
            value={content}
            onChange={handleContentChange}
          />

          {previewUrl && (
            <div className="preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          )}

          <ul>
            <li>
              <label style={{ cursor: 'pointer' }}>
                <i
                  className="fa-solid fa-image"
                  style={{ color: '#45bd62' }}
                ></i>
                Photo
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </label>
            </li>
            <li>
              <i
                className="fa-solid fa-video"
                style={{ color: '#f02849' }}
              ></i>
              Video
            </li>
            <li>
              <i
                className="fa-solid fa-square-poll-vertical"
                style={{ color: '#f7b928' }}
              ></i>
              Poll
            </li>
            <li>
              <i
                className="fa-solid fa-face-grin-beam"
                style={{ color: '#f5533d' }}
              ></i>
              Feeling
            </li>
          </ul>
        </div>

        <div className="bottom">
          <button
            type="button"
            disabled={loading || (!content.trim() && !rawImage)}
            onClick={handlePost}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </BgCard>
  );
}
