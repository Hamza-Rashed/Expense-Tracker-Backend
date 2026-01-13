import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.startegy';
import * as fs from 'fs';
import * as path from 'path';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { AbilityFactory } from './ability/ability.factory';
import { AbilityGuard } from './guards/ability.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        privateKey: fs.readFileSync(path.resolve(configService.get('JWT_PRIVATE_KEY_PATH') || 'private.pem'), 'utf8'),
        publicKey: fs.readFileSync(path.resolve(configService.get('JWT_PUBLIC_KEY_PATH') || 'public.pem'), 'utf8'),
        signOptions: {
          algorithm: 'RS256',
          expiresIn: configService.get('ACCESS_TOKEN_EXPIRY', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, DatabaseService, AbilityFactory, AbilityGuard, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, AbilityFactory, AbilityGuard, JwtAuthGuard],
})
export class AuthModule {}