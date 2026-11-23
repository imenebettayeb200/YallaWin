const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Reads an image file and downsizes it to max 1000px JPEG so it fits in localStorage. */
export function readImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file selected.'));
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) return reject(new Error('Use a JPG, PNG or WebP image.'));
    if (file.size > MAX_UPLOAD_BYTES) return reject(new Error('Image is too large (max 10 MB).'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read this file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('This image could not be opened.'));
      img.onload = () => {
        const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    return reader.readAsDataURL(file);
  });
}
