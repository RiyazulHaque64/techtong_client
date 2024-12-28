export interface ICategory {
  id: string;
  title: string;
  slug: string;
  icon: string;
  description: string;
  created_at: string;
  updated_at: string;
  parent_id?: string;
  parent?: {
    id: string;
    title: string;
    slug: string;
    icon: string;
    description: string;
  };
  _count: {
    products: number;
  };
}

export type TShortCategory = {
  icon: string;
  id: string;
  slug: string;
  title: string;
};
