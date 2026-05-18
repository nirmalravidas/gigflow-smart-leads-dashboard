import {transporter, sender} from './nodemailer';
import { generatePasswordResetEmail, generatePasswordResetSuccessEmail, generateVerificationCodeEmail, generateWelcomeEmail } from './emailTemplate';


export const sendWelcomeEmail = async (email: string, name: string) => {
    const htmlContent = generateWelcomeEmail(name);

    try {
        await transporter.sendMail({
            from: `${sender.name} <${sender.email}>`,
            to: email,
            subject: "Welcome",
            html: htmlContent,
        });
    } catch {
        throw new Error("Failed to send welcome email");
    }
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  const htmlContent = generatePasswordResetEmail(resetUrl);
  try {
    await transporter.sendMail({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Reset Password",
      html: htmlContent,
    });
  } catch (error) {
    console.log(error);
    throw new Error("failed to send password reset email");
  }
};

export const sendPasswordResetSuccessEmail = async (email: string) => {
  const htmlContent = generatePasswordResetSuccessEmail();
  try {
    await transporter.sendMail({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Password reset successfully.",
      html: htmlContent,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send password reset successful email");
  }
};

export const sendVerificationCodeEmail = async (email: string, verificationToken: string) => {
  const htmlContent = generateVerificationCodeEmail(verificationToken);
  try {
    await transporter.sendMail({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "verify your email.",
      html: htmlContent,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send email verification email.");
  }
};
