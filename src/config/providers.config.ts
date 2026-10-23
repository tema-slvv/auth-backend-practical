import { ConfigService } from '@nestjs/config';
import { TypeOptions } from 'src/auth/provider/providers.constants';
import { GoogleProvider } from 'src/auth/provider/services/google.provider';

export const getProvidersConfig = async (
  configService: ConfigService,
): Promise<TypeOptions> => ({
  baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
  services: [
    new GoogleProvider({
      client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      scopes: ['email', 'profile'],
    }),
  ],
});
