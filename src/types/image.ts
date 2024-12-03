export interface IImage {
  id: string;
  user_id?: string;
  name: string;
  alt_text: string;
  type: string;
  size: number;
  width: number;
  height: number;
  path: string;
  bucket_id: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
  };
}
