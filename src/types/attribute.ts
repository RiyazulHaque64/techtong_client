export interface IAttribute {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  value: string[];
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    title: string;
  };
}

export type IAttributeTableFilters = {
  searchTerm: string;
};
