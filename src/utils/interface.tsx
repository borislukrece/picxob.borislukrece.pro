export interface Message {
  token: string;
  type: string;
  message: string | string[];
}

export interface Gallery {
  token: string;
  name: string;
  date: string;
}
