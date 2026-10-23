import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthMethod } from 'generated/prisma/enums';
import { User } from 'generated/prisma/client';
import type { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
  ) {}

  async register(req: Request, dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);

    if (isExists)
      throw new ConflictException('A user with this email already exists.');

    const newUser = await this.userService.create(
      dto.email,
      dto.password,
      dto.name,
      '',
      AuthMethod.CREDENTIALS,
      false,
    );
    return this.saveSession(req, newUser);
  }

  async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new NotFoundException('User not found.');
    }

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Incorrect password');
    }

    return this.saveSession(req, user);
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string,
  ) {
    const providerInstance = this.providerService.findByService(provider);
    if (providerInstance) {
      const profile = await providerInstance.findUserByCode(code);

      const account = await this.prismaService.account.findFirst({
        where: {
          id: profile.id,
          provider: profile.provider,
        },
      });

      let user = account?.userId
        ? await this.userService.findById(account.userId)
        : null;

      if (user) {
        return this.saveSession(req, user);
      }

      user = await this.userService.create(
        profile.email,
        '',
        profile?.name,
        profile?.picture,
        AuthMethod[profile.provider.toUpperCase()],
        true,
      );

      if (!account) {
        await this.prismaService.account.create({
          data: {
            userId: user.id,
            type: 'oauth',
            provider: profile.provider,
            accessToken: profile.access_token,
            refreshToken: profile.refresh_token,
            expiresAt: profile.expires_at!,
          },
        });
      }

      return this.saveSession(req, user);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException('Somthing went wrong:('),
          );
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }

  async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;

      req.session.save((error) => {
        if (error) {
          return reject(
            new InternalServerErrorException('Failed to save the session.'),
          );
        }
        resolve({ user });
      });
    });
  }
}
