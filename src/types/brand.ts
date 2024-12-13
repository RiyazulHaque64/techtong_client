export interface IBrand {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  created_at: string;
  updated_at: string;
  _count: {
    products: number;
  };
}

export type IBrandTableFilters = {
  searchTerm: string;
};
