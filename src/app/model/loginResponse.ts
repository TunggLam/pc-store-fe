export interface LoginResponse {
  accessToken?: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
  refreshToken?: string;
  tokenType?: string;
  sessionId?: string;
  scope?: string;
  roles?: string[];


}
