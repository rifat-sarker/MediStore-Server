import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
  host: config.smtp_host,
  port: config.smtp_port,
  secure: false, // TLS via STARTTLS
  auth: {
    user: config.smtp_email,
    pass: config.smtp_pass,
  },
});

interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: IEmailOptions) => {
  await transporter.sendMail({
    from: `"MediStore" <${config.smtp_email}>`,
    to,
    subject,
    html,
  });
};

export const generateOtpEmailHtml = (otp: string, purpose: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background:#f4f7fb; margin:0; padding:0; }
    .container { max-width:520px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    .header { background:linear-gradient(135deg,#1a73e8,#0d47a1); padding:32px; text-align:center; }
    .header h1 { color:#fff; margin:0; font-size:22px; letter-spacing:0.5px; }
    .body { padding:32px; }
    .body p { color:#444; font-size:15px; line-height:1.6; }
    .otp-box { background:#f0f4ff; border:2px dashed #1a73e8; border-radius:10px; text-align:center; padding:20px; margin:24px 0; }
    .otp-code { font-size:38px; font-weight:800; color:#1a73e8; letter-spacing:8px; }
    .note { color:#888; font-size:13px; margin-top:8px; }
    .footer { background:#f9fafb; padding:16px 32px; text-align:center; color:#aaa; font-size:12px; border-top:1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>🏥 MediStore</h1></div>
    <div class="body">
      <p>Hi there,</p>
      <p>You requested a one-time password for <strong>${purpose}</strong>. Use the code below:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <div class="note">This code expires in <strong>5 minutes</strong></div>
      </div>
      <p>If you did not request this, please ignore this email or contact support immediately.</p>
      <p style="margin-top:24px;">— The MediStore Team</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} MediStore. All rights reserved.</div>
  </div>
</body>
</html>
`;
