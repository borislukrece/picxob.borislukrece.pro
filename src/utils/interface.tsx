export interface Message {
  token: string;
  type: string;
  message: string | Gallery[];
}

export interface Gallery {
  id: number | null;
  sub: number | null;
  name: string;
  prompt: string | null;
  token: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}
