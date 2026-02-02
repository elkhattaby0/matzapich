import BgCard from './BgCard';
import ShowMoreText from './ShowMoreText';
import { useState } from 'react';
import { fileToWebpBlob } from '../../components/PostImages';




export default function Post({
  id,
  userimg,
  name,
  date,
  time,
  post,
  imgPost,
  visibility,
  onDelete,
  onUpdate,
  currentUserId,
  postUserId,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post);
  const [editVisibility, setEditVisibility] = useState(visibility);
  const [saving, setSaving] = useState(false);
  const [editImageFile, setEditImageFile] = useState(null);
    const [editPreview, setEditPreview] = useState(imgPost);
    const [removeImage, setRemoveImage] = useState(false);
  const isOwner = currentUserId != null && postUserId != null && Number(currentUserId) === Number(postUserId);

  
  const visibilityIcon = (() => {
    switch (visibility) {
      case 'public':
        return 'fa-solid fa-earth-africa';
      case 'friends':
        return 'fa-solid fa-user-group';
      case 'only_me':
        return 'fa-solid fa-lock';
      default:
        return 'fa-solid fa-earth-africa';
    }
  })();

  const handleDeleteClick = async () => {
    if (!onDelete) return;
    await onDelete(id);
    setIsMenuOpen(false);
  };

  const handleSaveEdit = async () => {
    if (!onUpdate) return;
    try {
      setSaving(true);
      await onUpdate(id, {
        content: editContent,
        visibility: editVisibility,
        imageFile: editImageFile,
        removeImage
      });
      setIsEditing(false);
      setIsMenuOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleEditFileChange = async(e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const webpBlob = await fileToWebpBlob(file, 0.7);
      const compressedFile = new File([webpBlob], 'post.webp', { type: 'image/webp' });
    
      setEditImageFile(compressedFile);
      setEditPreview(URL.createObjectURL(compressedFile));
      setRemoveImage(false);
    };



  return (
    <BgCard tag="postinfo">
      <div className="content">
        
        <section>
          <div className="head">
            <img src={userimg} alt={name} className="userimg" />
            <div className="top">
              <div className="headRight">
                <div>
                  <p>{name}</p>
                  <p>
                    <span>{date} {time}</span>
                    <span> • </span>
                    <i className={visibilityIcon}></i>
                  </p>
                </div>
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(prev => !prev)}
                  >
                    {isMenuOpen ? (
                      <i className="fa-solid fa-xmark"></i>
                    ) : (
                      <i className="fa-solid fa-ellipsis"></i>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="middle">
            {isEditing ? (
              <div className="isEditing">
                <select
                  value={editVisibility}
                  onChange={e => setEditVisibility(e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends</option>
                  <option value="only_me">Only me</option>
                </select>

                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                />
                

                <div className="editImage">
                  {editPreview && !removeImage && (
                    <img src={editPreview} alt="Preview" />
                  )}

                  <div className="editImageActions">
                    <label style={{ cursor: 'pointer' }}>
                      <i className="fa-solid fa-image" /> Change image
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleEditFileChange}
                      />
                    </label>

                    {imgPost && (
                      <button
                        type="button"
                        onClick={() => {
                          setRemoveImage(true);
                          setEditImageFile(null);
                          setEditPreview(null);
                        }}
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="postTextWrapper">
                <ShowMoreText lines={2} text={post} />
                {imgPost && <img src={imgPost} alt="Post media" />}
              </div>
            )}

          </div>

          <div className="bottom">
            {isEditing ? (
              <>
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveEdit}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <>
                <button>
                  <i className="fa-regular fa-heart"></i> Like
                </button>
                <button>
                  <i className="fa-regular fa-comment"></i> Comment
                </button>
                <button>
                  <i className="fa-regular fa-share-from-square"></i> Share
                </button>
              </>
            )}
          </div>
        </section>
      </div>

      <ul
        className="postpopup"
        style={{ display: isMenuOpen ? 'flex' : 'none' }}
      >
        <li onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}>
          <i className="fa-solid fa-pen"></i> Edit
        </li>
        <li onClick={handleDeleteClick}>
          <i className="fa-solid fa-trash-can"></i> Delete
        </li>
      </ul>
    </BgCard>
  );
}
