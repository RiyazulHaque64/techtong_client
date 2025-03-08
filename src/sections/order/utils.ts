import type { TFilterOption } from "src/types/common";

export const STOCK_STATUS_DEFAULT_OPTION: TFilterOption = { value: '', label: 'Stock status' };

export const ORDER_TAB_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'featured', label: 'Featured' },
];