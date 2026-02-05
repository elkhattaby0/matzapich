import { useState, useEffect } from 'react';

const AvatarUploader = ({ onImageCompressed, currentAvatar }) => {
  const [compressedImage, setCompressedImage] = useState(null);
  const [preview, setPreview] = useState(currentAvatar || null);
  const [loading, setLoading] = useState(false);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
    },
    avatarPreview: {
      position: 'relative',
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      overflow: 'hidden',
      border: '3px solid #0000FFB4',
      cursor: 'pointer',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '14px',
      fontWeight: 'bold',
      opacity: 0,
      transition: 'opacity 0.3s',
    },
    uploadBtn: {
      backgroundColor: '#0000FFB4',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s',
    },
    removeBtn: {
      backgroundColor: '#e74c3c',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '12px',
    },
    loading: {
      textAlign: 'center',
      color: '#0000FFB4',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    hiddenInput: {
      display: 'none',
    },
  };

  useEffect(() => {
    if (!compressedImage) {
      setPreview(currentAvatar || null);
    }
  }, [currentAvatar, compressedImage]);

  const compressImage = async (file) => {
    setLoading(true);
    try {
      const imageBitmap = await createImageBitmap(file);

      const maxSize = 500;
      let { width, height } = imageBitmap;
      const ratio = Math.min(maxSize / width, maxSize / height, 1);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageBitmap, 0, 0, width, height);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/webp', 0.8)
      );

      if (!blob) {
        throw new Error('Failed to create blob from canvas');
      }

      const compressedFile = new File([blob], 'avatar.webp', {
        type: 'image/webp',
      });

      setCompressedImage(compressedFile);
      setPreview(URL.createObjectURL(compressedFile));
      if (onImageCompressed) {
        onImageCompressed(compressedFile);
      }
    } catch (error) {
      console.error('Compression error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      compressImage(file);
    }
  };

  const handleRemove = () => {
    setCompressedImage(null);
    setPreview(currentAvatar || null);
    if (onImageCompressed) {
      onImageCompressed(null);
    }
  };

  return (
    <div style={styles.container}>
      <label htmlFor="avatar-upload" style={styles.avatarPreview}>
        {preview ? (
          <>
            <img src={preview} alt="Avatar" style={styles.avatarImage} />
            <div style={styles.overlay} className="avatar-overlay">
              {loading ? '⏳ Loading...' : '📷 Change Photo'}
            </div>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              backgroundColor: '#ecf0f1',
              fontSize: '48px',
              color: '#95a5a6',
            }}
          >
            👤
          </div>
        )}
      </label>

      <label htmlFor="avatar-upload" style={styles.uploadBtn}>
        {loading ? (
          'Uploading...'
        ) : (
          <>
            <i className="fa-solid fa-camera"></i> Change Avatar
          </>
        )}
      </label>

      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={styles.hiddenInput}
        disabled={loading}
      />

      {compressedImage && (
        <button onClick={handleRemove} style={styles.removeBtn}>
          <i className="fa-solid fa-trash"></i> Remove
        </button>
      )}

      {loading && (
        <div style={styles.loading}>
          ⏳ Compressing image...
        </div>
      )}

      <style>{`
        label[for="avatar-upload"]:hover .avatar-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default AvatarUploader;
