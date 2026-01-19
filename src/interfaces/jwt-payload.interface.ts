export interface JwtPayload {
  userID: number; // user ID
  fullName: string;
  email: string;
  jti: string; // token ID for revocation
  role: string;
}