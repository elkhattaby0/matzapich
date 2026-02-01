import { useState } from 'react';
import imageCompression from 'browser-image-compression';

const AvatarUploader = ({ onImageCompressed, currentAvatar }) => {
    const [compressedImage, setCompressedImage] = useState(null);
    const [preview, setPreview] = useState(currentAvatar || null);
    const [loading, setLoading] = useState(false);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
        },
        avatarPreview: {
            position: 'relative',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #3498db',
            cursor: 'pointer'
        },
        avatarImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
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
            transition: 'opacity 0.3s'
        },
        uploadBtn: {
            backgroundColor: '#3498db',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.3s'
        },
        removeBtn: {
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '12px'
        },
        loading: {
            textAlign: 'center',
            color: '#3498db',
            fontSize: '14px',
            fontWeight: 'bold'
        },
        hiddenInput: {
            display: 'none'
        }
    };

    const compressImage = async (file) => {
        setLoading(true);

        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 500,
            useWebWorker: true,
            fileType: 'image/webp',
            initialQuality: 0.8
        };

        try {
            const compressedFile = await imageCompression(file, options);
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
            {/* Avatar Preview */}
            <label htmlFor="avatar-upload" style={styles.avatarPreview}>
                {preview ? (
                    <>
                        <img src={preview} alt="Avatar" style={styles.avatarImage} />
                        <div style={styles.overlay} className="avatar-overlay">
                            {loading ? '⏳ Loading...' : '📷 Change Photo'}
                        </div>
                    </>
                ) : (
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        backgroundColor: '#ecf0f1',
                        fontSize: '48px',
                        color: '#95a5a6'
                    }}>
                        👤
                    </div>
                )}
            </label>

            {/* Upload Button */}
            <label htmlFor="avatar-upload" style={styles.uploadBtn}>
                {loading ? 'Uploading...' : <><i className="fa-solid fa-camera"></i> Change Avatar</>}
            </label>

            <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={styles.hiddenInput}
                disabled={loading}
            />

            {/* Remove Button */}
            {compressedImage && (
                <button onClick={handleRemove} style={styles.removeBtn}>
                    <i className="fa-solid fa-trash"></i> Remove
                </button>
            )}

            {/* Loading */}
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
