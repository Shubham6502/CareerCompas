import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const profileStorage = new CloudinaryStorage({
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

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    resource_type: "raw",
    folder: "Resumes",
    public_id: Date.now() + "-" + file.originalname,
  }),
});


export const upload = multer({ storage: profileStorage });
export const resumeUpload = multer({ storage: resumeStorage });