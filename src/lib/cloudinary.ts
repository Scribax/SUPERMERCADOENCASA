/**
 * Helper for uploading images to Cloudinary (optional external CDN).
 * If CLOUDINARY_CLOUD_NAME & CLOUDINARY_UPLOAD_PRESET (or CLOUDINARY_API_SECRET) are defined in .env,
 * this function uploads the file buffer directly to Cloudinary CDN.
 */
export async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'superencasa_preset';

  if (!cloudName) {
    return null; // Fallback to local storage
  }

  try {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(buffer)]);
    formData.append('file', blob, filename);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('Cloudinary upload failed:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.secure_url || data.url || null;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
}
