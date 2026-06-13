import nodemailer from 'nodemailer';

// Lazy-create transporter so env vars are always loaded
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT ?? '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certs in dev
    },
  });
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const transporter = createTransporter();

  if (!process.env.SMTP_USER || process.env.SMTP_USER.includes('your_')) {
    console.warn('⚠️  SMTP not configured — email not sent to:', options.to);
    console.warn('   Set SMTP_USER and SMTP_PASS in .env to enable emails.');
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}

export function getEmailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Maitbhanga Alumni Forum</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f4f6f9; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0F2D52, #1D4E87); padding: 32px 40px; text-align: center; }
    .header h1 { color: #D4AF37; margin: 0; font-size: 22px; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 40px; color: #333; line-height: 1.7; }
    .footer { background: #f8f9fa; padding: 24px 40px; text-align: center; border-top: 1px solid #eee; }
    .footer p { color: #999; font-size: 12px; margin: 4px 0; }
    .btn { display: inline-block; background: #0F2D52; color: #fff !important; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; font-size: 16px; }
    .highlight { background: #FDF8E7; border-left: 4px solid #D4AF37; padding: 12px 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }
    h2 { color: #0F2D52; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏫 Maitbhanga High School Alumni Forum</h1>
      <p>Sandwip, Chattogram, Bangladesh</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Maitbhanga High School Alumni Forum. All rights reserved.</p>
      <p>Sandwip, Chattogram, Bangladesh | info@maitbhangaalumni.org</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendOtpEmail(
  email: string,
  name: string,
  otp: string
): Promise<void> {
  // Format OTP with a space in the middle for readability: 123 456
  const formattedOtp = `${otp.slice(0, 3)} ${otp.slice(3)}`;

  const html = getEmailTemplate(`
    <h2>Welcome, ${name}! 🎉</h2>
    <p>Thank you for registering with <strong>Maitbhanga High School Alumni Forum</strong>.</p>
    <p>Use the OTP below to verify your email address:</p>

    <div style="text-align: center; margin: 28px 0;">
      <div style="display: inline-block; background: linear-gradient(135deg, #0F2D52, #1D4E87); border-radius: 16px; padding: 24px 40px;">
        <p style="color: #D4AF37; font-size: 13px; font-weight: 600; letter-spacing: 3px; margin: 0 0 8px 0; text-transform: uppercase;">Your OTP Code</p>
        <p style="color: #ffffff; font-size: 44px; font-weight: 900; letter-spacing: 12px; margin: 0; font-family: 'Courier New', monospace;">${formattedOtp}</p>
      </div>
    </div>

    <div class="highlight">
      <strong>⏳ This OTP expires in 10 minutes.</strong><br/>
      Do NOT share this code with anyone.
    </div>
    <p style="color:#666; font-size:14px;">If you didn't register for this account, please ignore this email.</p>
  `);

  await sendEmail({
    to: email,
    subject: `${formattedOtp} is your Maitbhanga Alumni Forum OTP`,
    html,
  });
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  // Legacy function - calls OTP email for backward compatibility
  await sendOtpEmail(email, name, token);
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  const html = getEmailTemplate(`
    <h2>Password Reset Request 🔐</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>We received a request to reset your password for your Maitbhanga Alumni Forum account.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${resetUrl}" class="btn">🔑 Reset My Password</a>
    </div>
    <div class="highlight">
      <strong>⏳ This link expires in 1 hour.</strong><br/>
      If the button doesn't work, copy and paste this link:<br/>
      <small style="word-break:break-all;">${resetUrl}</small>
    </div>
    <p style="color:#666; font-size:14px;">If you didn't request a password reset, please ignore this email. Your account is safe.</p>
  `);

  await sendEmail({
    to: email,
    subject: '🔑 Reset your password — Maitbhanga Alumni Forum',
    html,
  });
}

export async function sendDonationReceiptEmail(params: {
  email: string;
  name: string;
  amount: number;
  receiptNumber: string;
  donationType: string;
  paymentMethod: string;
  date: string;
}): Promise<void> {
  const html = getEmailTemplate(`
    <h2>Thank you for your donation! 🙏</h2>
    <p>Dear <strong>${params.name}</strong>,</p>
    <p>Your generous contribution has been received successfully.</p>
    <div class="highlight">
      <strong>📄 Receipt #${params.receiptNumber}</strong><br/>
      Amount: <strong>৳${params.amount.toLocaleString()}</strong><br/>
      Type: ${params.donationType}<br/>
      Method: ${params.paymentMethod}<br/>
      Date: ${params.date}
    </div>
    <p>Your support helps us build a better future for Maitbhanga High School and its students.</p>
    <p>You can download your receipt from your member dashboard.</p>
  `);

  await sendEmail({
    to: params.email,
    subject: `📄 Donation Receipt #${params.receiptNumber} — Maitbhanga Alumni Forum`,
    html,
  });
}

export async function sendMemberApprovalEmail(
  email: string,
  name: string
): Promise<void> {
  const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`;
  const html = getEmailTemplate(`
    <h2>Your membership has been approved! ✅</h2>
    <p>Dear <strong>${name}</strong>,</p>
    <p>Congratulations! Your membership application to <strong>Maitbhanga High School Alumni Forum</strong> has been reviewed and approved.</p>
    <p>You can now log in to access your member dashboard, connect with fellow alumni, and participate in events.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${loginUrl}" class="btn">🚀 Log In Now</a>
    </div>
    <p>Welcome to our community! 🏫</p>
  `);

  await sendEmail({
    to: email,
    subject: '✅ Membership Approved — Maitbhanga Alumni Forum',
    html,
  });
}
