import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CropOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function uploadImage(
  fileBuffer: Buffer,
  mimeType: string,
  alt: string,
  crop?: CropOptions
) {
  const base64 = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;

  const transformation: Record<string, unknown>[] = [];
  if (crop) {
    transformation.push({
      crop: "crop",
      x: Math.round(crop.x),
      y: Math.round(crop.y),
      width: Math.round(crop.width),
      height: Math.round(crop.height),
    });
  }
  // Resize to max 1600px wide for consistency
  transformation.push({ width: 1600, crop: "limit", quality: "auto", fetch_format: "auto" });

  const result = await cloudinary.uploader.upload(base64, {
    folder: "prima-photo",
    context: `alt=${alt}`,
    transformation,
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function uploadHeroImage(
  fileBuffer: Buffer,
  mimeType: string,
  alt: string
) {
  const base64 = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(base64, {
    folder: "prima-photo/hero",
    context: `alt=${alt}`,
    transformation: [
      { width: 2400, height: 1350, crop: "fill", gravity: "auto", quality: "auto", fetch_format: "auto" },
    ],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}
