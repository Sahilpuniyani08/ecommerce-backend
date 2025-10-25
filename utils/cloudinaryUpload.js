import fs from "fs";
import cloudinary from "../config/cloudinary.js";


// Upload to Cloudinary
export const uploadToCloudinary = (filePath, originalName) => {
  console.log("sahil",filePath,originalName)

  return new Promise((resolve, reject) => {
    const fileBaseName = originalName.split(".")[0];
    const publicId = `${Date.now()}-${fileBaseName}`;

    cloudinary.uploader.upload(
      filePath,
      {
        resource_type: "image",
        folder: "products",
        public_id: publicId,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
      (error, result) => {
        if (error) {
          console.log("sahil",error)
          reject(error);
        } else {
          resolve(result?.secure_url || "");
        }

        // delete temp file
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });
      }
    );
  });
};
