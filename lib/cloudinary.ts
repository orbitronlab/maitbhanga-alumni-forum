import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export async function uploadImage(
  file: string | Buffer,
  folder: string = 'alumni-forum'
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(
    typeof file === 'string' ? file : `data:image/webp;base64,${file.toString('base64')}`,
    {
      folder: `maitbhanga/${folder}`,
      transformation: [
        { quality: 'auto:best' },
        { fetch_format: 'auto' },
      ],
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      max_bytes: 5 * 1024 * 1024, // 5MB limit
    }
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    size: result.bytes,
  };
}

export async function uploadProfilePhoto(
  file: string | Buffer
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(
    typeof file === 'string' ? file : `data:image/webp;base64,${file.toString('base64')}`,
    {
      folder: 'maitbhanga/profiles',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    }
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    size: result.bytes,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getOptimizedUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: string } = {}
): string {
  return cloudinary.url(publicId, {
    width: options.width,
    height: options.height,
    quality: options.quality ?? 'auto:good',
    fetch_format: 'auto',
    secure: true,
  });
}

export default cloudinary;
