import { Controller, Post, Body, HttpCode, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { Errors } from 'src/errors/errors.factory';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiCookieAuth, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login with email and password' })
  @ApiBody({
      type: LoginDto,
      examples: {
        example: {
          value: {
            email: 'admin@email.com',
            password: '12345678',
          },
        },
      },
    })
  @ApiResponse({ status: 200, description: 'Login successful, returns accessToken and sets refreshToken cookie', schema: {
    example: {
      accessToken: 'JWT_ACCESS_TOKEN',
      user: {
        id: 1,
        fullName: 'John Doe',
        email: 'admin@example.com',
        role: 'admin'
      }
    }
  }})
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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

    return {
      accessToken: tokens.accessToken,
      user: tokens.user,
    };
  }

  @Post('refresh-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh access token using HttpOnly refreshToken cookie' })
  @ApiCookieAuth('refreshToken')
  @ApiResponse({ status: 200, description: 'New accessToken and refreshToken returned', schema: {
    example: {
      accessToken: 'NEW_JWT_ACCESS_TOKEN',
      user: {
        id: 1,
        fullName: 'John Doe',
        email: 'admin@example.com',
        role: 'admin'
      }
    }
  }})
  @ApiResponse({ status: 401, description: 'No refresh token provided or token invalid' })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.get('Cookie')?.split('=')[1];
    if (!refreshToken) {
      throw Errors.Unauthorized('No refresh token provided');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: tokens.accessToken,
      user: tokens.user,
    };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout user by revoking refresh token and clearing cookie' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User logged out successfully', schema: {
    example: { success: 'You Logged out successfully' }
  }})
  @ApiResponse({ status: 401, description: 'No refresh token provided or already logged out' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.get('Cookie')?.split('=')[1];
    if (!refreshToken) {
      throw Errors.Unauthorized('You already logged out');
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw Errors.Unauthorized('Could not find authorization header');
    }

    const token = authHeader.split(' ')[1];
    const decoded = this.authService['jwtService'].decode(token) as any;

    if (decoded?.jti) {
      await this.authService.logout(decoded.jti);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return { success: 'You Logged out successfully' };
  }
}
