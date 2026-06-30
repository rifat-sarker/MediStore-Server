import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARRY_CLOUD_NAME,
  api_key: process.env.CLOUDINARRY_API_KEY,
  api_secret: process.env.CLOUDINARRY_API_SECRET,
});

cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", { folder: "medistore/images" })
  .then(res => console.log("Success:", res.secure_url))
  .catch(err => console.error("Cloudinary Error:", err));
