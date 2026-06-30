import dotenv from "dotenv";
import path from "path";
dotenv.config();

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  cloudinary_cloud_name: process.env.CLOUDINARRY_CLOUD_NAME,
  cloudinary_api_secret: process.env.CLOUDINARRY_API_SECRET,
  cloudinary_api_key: process.env.CLOUDINARRY_API_KEY,
  // SSL Commerz
  ssl_store_id: process.env.SSL_STORE_ID,
  ssl_store_passwd: process.env.SSL_STORE_PASSWD,
  ssl_is_live: process.env.SSL_IS_LIVE === "true",
  // Redis
  redis_url: process.env.REDIS_URL,
  // Frontend
  frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",
  // SMTP (Google)
  smtp_host: process.env.SMTP_HOST || "smtp.gmail.com",
  smtp_port: Number(process.env.SMTP_PORT) || 587,
  smtp_email: process.env.SMTP_EMAIL,
  smtp_pass: process.env.SMTP_PASS,
  // Admin seed
  admin_name: process.env.ADMIN_NAME || "Super Admin",
  admin_email: process.env.ADMIN_EMAIL || "admin@medistore.com",
  admin_password: process.env.ADMIN_PASSWORD || "Admin@12345",
};
