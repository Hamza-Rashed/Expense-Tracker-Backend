import { Controller, Post, Body, HttpCode, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { Errors } from 'src/errors/errors.factory';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() createAuthDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {

    const user = await this.authService.validateUser(
      createAuthDto.email,
      createAuthDto.password,
    );

    const tokens = await this.authService.login(user);

    // Set HttpOnly cookie for refresh token
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return{
      accessToken: tokens.accessToken,
      user: tokens.user,
    }
  }

  // Refresh token endpoint
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
        
    // Get refresh token from HttpOnly cookie
    const refreshToken = req.get('Cookie')?.split('=')[1];
    if (!refreshToken) {
      throw Errors.Unauthorized('No refresh token provided');
    }

    // Validate and get refresh tokens
    const tokens = await this.authService.refreshTokens(
      refreshToken,
    );

    // Set new HttpOnly cookie for refresh token
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return {
      accessToken: tokens.accessToken,
      user: tokens.user,
    };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    
    // Get refresh token from HttpOnly cookie
    const refreshToken = req.get('Cookie')?.split('=')[1];
    if (!refreshToken) {
      throw Errors.Unauthorized('You already logged out');
    }

    // Get jti from access token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw Errors.Unauthorized('Coold not find authorization header');
    }

    // Extract token and decode
    const token = authHeader.split(' ')[1];
    const decoded = this.authService['jwtService'].decode(token) as any;    

    if (decoded?.jti) {
      await this.authService.logout(decoded.jti);
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

    return { success: 'You Logged out successfully' };

  }
}