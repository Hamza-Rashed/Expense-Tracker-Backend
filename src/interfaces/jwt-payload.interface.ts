export interface JwtPayload {
  userID: number; // user ID
  email: string;
  jti: string; // token ID for revocation
  role: string;
}