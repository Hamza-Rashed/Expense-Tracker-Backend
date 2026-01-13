import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as aragon2 from 'argon2';
import { Errors } from 'src/errors/errors.factory';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Validate user credentials and handle login attempts tracking and account locking logic and checking user roles for role-based access control (RBAC).
  async validateUser(
    email: string,
    password: string,
  ) {

    // Fetch user by email
    const userInfo = await this.databaseService.user.findUnique({
      where: { email },
    });

    // Make sure the user exist
    if (!userInfo) {
      throw Errors.UserNotFound(email);
    }

    // Make sure the user is active
    if (userInfo.status === "inactive") {
      throw Errors.UserNotActive(email);
    }

    // Verify password
    const passwordValid = await aragon2.verify(userInfo.password, password);
    if (!passwordValid) {
      throw Errors.InvalidCredentials('Invalid password');
    }

    // Return user info excluding sensitive data
    return {
      userId: userInfo.id,
      email: userInfo.email,
      role: userInfo.role,
    };
  }

  async login(user: any) {
    const jti = uuidv4();

    // Create a new refresh token
    const refreshToken = uuidv4();
    const refreshTokenExpiry = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    );

    // Hash the refresh token before storing
    const hashedRefreshToken = await aragon2.hash(refreshToken, {
      type: aragon2.argon2id,
    });

    // Store the refresh token in the database
    await this.databaseService.refreshToken.create({
      data: {
        jti,
        tokenHash: hashedRefreshToken,
        user: { connect: { id: user.userId } },
        expiresAt: refreshTokenExpiry,
      },
    });

    // Generate JWT token
    const payload: JwtPayload = { userID: user.userId, email: user.email, jti, role: user.role };
    const accessToken = this.generateAccessToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        userID: user.userId,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Helper Methods
  // Refresh tokens and issue new access tokens
  async refreshTokens(oldRefreshToken: string) {
    // Find the refresh token in the database
    const activeTokens = await this.databaseService.refreshToken.findMany({
      where: { revokedAt: null, expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    // Verify the provided refresh token against stored hashes
    let matchedToken: any = null;
    for (const tokenRecord of activeTokens) {
      const isMatch = await aragon2.verify(
        tokenRecord.tokenHash,
        oldRefreshToken,
      );
      if (isMatch) {
        matchedToken = tokenRecord;
        break;
      }
    }

    if (!matchedToken) {
      throw Errors.InvalidToken();
    }

    // Revoke the old refresh token
    await this.databaseService.refreshToken.update({
      where: { id: matchedToken.id },
      data: { revokedAt: new Date() },
    });

    // Check if user is not active
    const userInfo = await this.databaseService.user.findUnique({
      where: { id: matchedToken.userId },
    });

    if (userInfo && userInfo.status === "inactive") {
      throw Errors.UserNotActive(userInfo.email);
    }

    // Generate new tokens
    return this.login(
      { userId: matchedToken.user.id, email: matchedToken.user.email }
    );
  }

  async logout(jti: string) {    
    // Revoke the refresh token
    await this.databaseService.refreshToken.updateMany({
      where: { jti },
      data: { revokedAt: new Date() },
    });

    return { message: 'Logged out successfully' };
  }

  private generateAccessToken(payload: JwtPayload): string {
  return this.jwtService.sign(payload, {
    expiresIn: (this.configService.get<string>('ACCESS_TOKEN_EXPIRY') ?? '15m') as any,
    algorithm: 'RS256',
  });
}
}
