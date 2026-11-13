import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { Resend } from 'resend';
import { ConfirmationTemplate } from './templates/confirmation.template';
import { ResetPasswordTemplate } from './templates/resend-password.template';
import { TwoFactorTemplate } from './templates/two-factor-auth.template';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(
      this.configService.getOrThrow<string>('RESEND_API_KEY'),
    );

    this.from = this.configService.get<string>(
      'RESEND_FROM_EMAIL',
      'onboarding@resend.dev',
    );
  }

  public async sendConfirmationEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ConfirmationTemplate({ domain, token }));

    return this.sendEmail(email, 'Confirm Email', html);
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ResetPasswordTemplate({ domain, token }));

    return this.sendEmail(email, 'Reset password', html);
  }

  public async sendTwoFactorTokenEmail(email: string, token: string) {
    const html = await render(TwoFactorTemplate({ token }));

    return this.sendEmail(email, 'Two-factor auth', html);
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<string> {
    const { data, error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject,
      html,
    });

    if (error || !data) {
      throw new InternalServerErrorException('Failed to send email');
    }

    return data.id;
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Welcome to our application!',
      text: `Hello, ${name}! Your account has been successfully created.`,
    });

    if (error) {
      throw new InternalServerErrorException('Failed to send welcome email.');
    }
  }
}
