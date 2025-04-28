export interface Message {
  token: string;
  type: "user" | "bot" | "__error";
  message: string | Gallery[];
}

export interface Gallery {
  id: number | null;
  sub: number | null;
  uri: string;
  prompt: string | null;
  token: string;
  createdAt: string;
  updatedAt: string;
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
