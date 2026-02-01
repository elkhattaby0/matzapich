export function fileToWebpBlob(file, quality = 0.7) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxSize = 1280;
      let { width, height } = img;

      if (width > height && width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      } else if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = (e) => reject(e);
    img.src = URL.createObjectURL(file);
  });
}
