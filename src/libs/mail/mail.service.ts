import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

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

  async sendEmail(to: string, subject: string, html: string): Promise<string> {
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
