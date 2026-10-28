import dotenv from "dotenv";
import path from "path";
dotenv.config();

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || "default_jwt_access_secret_key_12345",
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "default_jwt_refresh_secret_key_12345",
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  cloudinary_cloud_name: process.env.CLOUDINARRY_CLOUD_NAME,
  cloudinary_api_secret: process.env.CLOUDINARRY_API_SECRET,
  cloudinary_api_key: process.env.CLOUDINARRY_API_KEY,
  // SSL Commerz
  ssl_store_id: process.env.SSL_STORE_ID,
  ssl_store_passwd: process.env.SSL_STORE_PASSWD,
  ssl_is_live: process.env.SSL_IS_LIVE === "true",
  // Redis
  redis_url: process.env.REDIS_URL,
  // Frontend & Backend URLs
  frontend_url:
    process.env.FRONTEND_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://medistore-client-two.vercel.app"
      : "http://localhost:3000"),
  backend_url:
    process.env.BACKEND_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://medistore-server-li88.onrender.com"
      : "http://localhost:5001"),
  // SMTP (Google)
  smtp_host: process.env.SMTP_HOST || "smtp.gmail.com",
  smtp_port: Number(process.env.SMTP_PORT) || 587,
  smtp_email: process.env.SMTP_EMAIL,
  smtp_pass: process.env.SMTP_PASS,
  // Resend HTTP API Key (Port 443 — works everywhere on Render without port blocks)
  resend_api_key: process.env.RESEND_API_KEY,
  // Admin seed
  admin_name: process.env.ADMIN_NAME || "Super Admin",
  admin_email: process.env.ADMIN_EMAIL || "admin@medistore.com",
  admin_password: process.env.ADMIN_PASSWORD || "Admin@12345",
};
