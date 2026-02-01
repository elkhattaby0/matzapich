import { useState } from 'react';
import imageCompression from 'browser-image-compression';

const ImageCompressor = ({ onImagesCompressed, maxImages = 10 }) => {
    const [compressedImages, setCompressedImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState([]);

    const styles = {
        uploadSection: {
            display: 'flex',
            gap: '10px',
            marginBottom: '20px'
        },
        uploadBtn: {
        },
        resetBtn: {
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.3s',
            display: 'none'
        },
        loading: {
            textAlign: 'center',
            padding: '40px',
            color: 'gba(0, 0, 255, 0.706)',
            fontSize: '18px',
            fontWeight: 'bold'
        },
        previewGrid: {
            display: 'flex',
            gap: '15px',
            marginTop: '8px'
        },
        previewItem: {
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'white',
            aspectRatio: '1/1',
            width: '80px'
        },
        previewImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
        },
        removeBtn: {
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: 'rgba(231, 76, 60, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '0',
            height: '0',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '500',
            lineHeight: '1',
            padding: 10
        },
        imageStats: {
            padding: '10px',
            backgroundColor: '#f8f9fa',
            fontSize: '12px'
        },
        statLine: {
            margin: '4px 0',
            color: '#333'
        },
        reduction: {
            color: '#27ae60',
            fontWeight: 'bold',
            margin: '4px 0',

        },
        summary: {
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            color: '#155724',
            textAlign: 'center',
            fontWeight: 'bold',
            display: 'none'
        },
        hiddenInput: {
            display: 'none'
        }
    };

    const compressImages = async (files) => {
        setLoading(true);
        const compressed = [];
        const previewUrls = [];
        const compressionStats = [];

        const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 1080,
            useWebWorker: true,
            fileType: 'image/webp',
            initialQuality: 0.75
        };

        for (let i = 0; i < files.length; i++) {
            try {
                const file = files[i];
                const originalSize = file.size;

                const compressedFile = await imageCompression(file, options);
                const compressedSize = compressedFile.size;

                const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
                
                compressionStats.push({
                    original: (originalSize / 1024).toFixed(2) + ' KB',
                    compressed: (compressedSize / 1024).toFixed(2) + ' KB',
                    reduction: reduction + '%'
                });

                compressed.push(compressedFile);
                previewUrls.push(URL.createObjectURL(compressedFile));

            } catch (error) {
                console.error('Compression error:', error);
            }
        }

        setCompressedImages(compressed);
        setPreviews(previewUrls);
        setStats(compressionStats);
        setLoading(false);

        if (onImagesCompressed) {
            onImagesCompressed(compressed);
        }
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files).slice(0, maxImages);
        compressImages(files);
    };

    const handleRemoveImage = (index) => {
        const newCompressed = compressedImages.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        const newStats = stats.filter((_, i) => i !== index);
        
        setCompressedImages(newCompressed);
        setPreviews(newPreviews);
        setStats(newStats);

        if (onImagesCompressed) {
            onImagesCompressed(newCompressed);
        }
    };

    const handleReset = () => {
        setCompressedImages([]);
        setPreviews([]);
        setStats([]);
        
        if (onImagesCompressed) {
            onImagesCompressed([]);
        }
    };

    return (
        <div style={styles.container}>
            {/* Upload Section */}
            <div style={styles.uploadSection}>
                <label htmlFor="image-upload" style={styles.uploadBtn}>
                    {loading ? 'Compressing...' : <><i className="fa-regular fa-camera"></i> Photos</>}
                </label>
                <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={styles.hiddenInput}
                    disabled={loading}
                />
                {compressedImages.length > 0 && (
                    <button onClick={handleReset} style={styles.resetBtn}>
                        🗑️ Reset
                    </button>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div style={styles.loading}>
                    <p>⏳ Compressing images...</p>
                </div>
            )}

            {/* Preview Grid */}
            {previews.length > 0 && !loading && (
                <div style={styles.previewGrid}>
                    {previews.map((url, index) => (
                        <div key={index} style={styles.previewItem}>
                            <img src={url} alt={`Preview ${index}`} style={styles.previewImage} />
                            <button 
                                onClick={() => handleRemoveImage(index)}
                                style={styles.removeBtn}
                            >
                                ×
                            </button>
                            {/* <div style={styles.imageStats}>
                                <p style={styles.statLine}>📦 Original: {stats[index].original}</p>
                                <p style={styles.statLine}>✅ Compressed: {stats[index].compressed}</p>
                                <p style={styles.reduction}>↓ Reduced: {stats[index].reduction}</p>
                            </div> */}
                        </div>
                    ))}
                </div>
            )}

            {/* Summary */}
            {compressedImages.length > 0 && !loading && (
                <div style={styles.summary}>
                    ✨ {compressedImages.length} image(s) compressed and ready to upload
                </div>
            )}
        </div>
    );
};

export default ImageCompressor;
