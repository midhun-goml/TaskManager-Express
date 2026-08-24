export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class EmailService {
  public static async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const message = `You requested a password reset. Please make a POST request to: ${resetUrl} or submit token ${resetToken} on the reset page. Token is valid for 1 hour.`;

    console.log(`[EmailService Mock] Sending password reset email to: ${email}`);
    console.log(`[EmailService Mock] Reset URL: ${resetUrl}`);
    console.log(`[EmailService Mock] Token: ${resetToken}`);
  }
}
