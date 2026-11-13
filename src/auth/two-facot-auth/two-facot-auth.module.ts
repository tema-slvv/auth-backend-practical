import { Module } from '@nestjs/common';
import { TwoFacotAuthService } from './two-facot-auth.service';
import { MailService } from 'src/libs/mail/mail.service';

@Module({
  providers: [TwoFacotAuthService, MailService],
})
export class TwoFacotAuthModule {}
