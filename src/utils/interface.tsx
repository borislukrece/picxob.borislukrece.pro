export interface Message {
  token: string;
  type: string;
  message: string | Gallery[];
}

export interface Gallery {
  id: number;
  user_id: number | null;
  name: string;
  prompt: null;
  token: string;
  created_at: string;
  updated_at: string;
}
