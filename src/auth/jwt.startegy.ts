import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { Errors } from 'src/errors/errors.factory';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {
    const publicKeyPath = configService.get('JWT_PUBLIC_KEY_PATH') || 'public.pem';
    const publicKey = fs.readFileSync(path.resolve(publicKeyPath), 'utf8');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
      algorithms: ['RS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      // Check if token is revoked
      const tokenRevoked = await this.databaseService.refreshToken.findFirst({
        where: {
          jti: payload.jti,
          revokedAt: { not: null },
        },
      });

      if (tokenRevoked) {
        throw Errors.InvalidToken();
      }

      // Check if user exists and is active
      const user = await this.databaseService.user.findUnique({
        where: { id: payload.userID },
      });

      if (!user || user.status === 'inactive') {
        throw Errors.UserNotFound(payload.email);
      }

      return {
        userId: user.id,
        email: user.email,
        jti: payload.jti,
        role: user.role,
      };
    } catch (error) {
      throw Errors.Unauthorized('Invalid token');
    }
  }
}
