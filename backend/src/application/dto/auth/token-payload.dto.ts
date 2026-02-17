/**
 * DTO para payload do token JWT
 */
export class TokenPayloadDto {
  userId: string;
  email: string;
  iat?: number; // Issued at
  exp?: number; // Expiration
}
