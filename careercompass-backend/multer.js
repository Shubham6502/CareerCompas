import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pictures",
    allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [
      { width: 600, crop: "limit" },
      { quality: "auto:eco" },
      { fetch_format: "auto" }
    ],
  },
});

const upload = multer({ storage });

export default upload;
