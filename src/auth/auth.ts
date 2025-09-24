import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export const jwtConstants = {
  secret: 'R9t7vB8qF3xZ!p2Lk6sD1wY@eU5mN0a',
};

@Injectable()
export class AuthService {
  async generateResetToken(): Promise<string> {
    return crypto.randomBytes(32).toString('hex');
  }
}