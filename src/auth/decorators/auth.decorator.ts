import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';
import { Roles } from './roles.decorator';
import { AuthGuard } from '../guards/auth.quard';
import { RolesGuard } from '../guards/roles.quard';

export function Authorization(...roles: UserRole[]) {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
  }

  return applyDecorators(Roles(...roles), UseGuards(AuthGuard));
}
