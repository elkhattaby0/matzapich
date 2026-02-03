import { useState, useRef, useCallback } from 'react';
import BgCard from '../../components/common/BgCard';
import { useAuth } from '../../hooks/useAuth';
import { fileToWebpBlob } from '../../components/PostImages';
import detectDirection from '../../components/common/detectDirection';
import { createPost } from '../../utils/api';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

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
  const [rawVideo, setRawVideo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
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

    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    setRawImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const compressVideo = useCallback(async (file) => {
    setCompressing(true);
    try {
      const ffmpeg = new FFmpeg();
      const baseURL = await toBlobURL('/ffmpeg/', import.meta.url);

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}ffmpeg-core.js`, import.meta.url),
        wasmURL: await toBlobURL(`${baseURL}ffmpeg-core.wasm`, import.meta.url),
      });

      const outputName = `compressed_${Date.now()}.mp4`;
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));

      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-vcodec', 'libx264',
        '-crf', '28',
        '-preset', 'medium',
        '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease',
        '-c:a', 'aac',
        '-b:a', '96k',
        '-movflags', '+faststart',
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);
      return new File([data], outputName, { type: 'video/mp4' });
    } finally {
      setCompressing(false);
    }
  }, []);

  const handleVideoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('video/')) return;

    setRawVideo(file);
    setPreviewVideo(URL.createObjectURL(file));

    // Compress only if larger than 5MB
    if (file.size > 5 * 1024 * 1024) {
      const compressed = await compressVideo(file);
      setRawVideo(compressed);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !rawImage && !rawVideo) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('visibility', audience);
      if (content.trim()) {
        formData.append('content', content.trim());
      }

      if (rawImage) {
        const webpBlob = await fileToWebpBlob(rawImage, 0.7);
        const imageFile = new File([webpBlob], 'post.webp', {
          type: 'image/webp',
        });
        formData.append('image', imageFile);
      }

      if (rawVideo) {
        formData.append('video', rawVideo);
      }

      const newPost = await createPost(formData);

      setContent('');
      setRawImage(null);
      setRawVideo(null);
      setPreviewImage(null);
      setPreviewVideo(null);

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

          {previewImage && (
            <div className="preview">
              <img src={previewImage} alt="Preview" />
            </div>
          )}

          {previewVideo && (
            <div className="preview">
              <video
                src={previewVideo}
                controls
                className="max-w-xs rounded"
              />
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
                  onChange={handleImageChange}
                />
              </label>
            </li>
            <li>
              <label style={{ cursor: 'pointer' }}>
                <i
                  className="fa-solid fa-video"
                  style={{ color: '#f02849' }}
                ></i>
                Video
                <input
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={handleVideoChange}
                  disabled={compressing}
                />
              </label>
              {compressing && (
                <span style={{ marginLeft: 8 }}>Compressing...</span>
              )}
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
            disabled={
              loading ||
              compressing ||
              (!content.trim() && !rawImage && !rawVideo)
            }
            onClick={handlePost}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </BgCard>
  );
}
