import type { Dispatch, SetStateAction } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

import {
  BRAND_FILTER_DEFAULT_OPTION,
  STOCK_STATUS_DEFAULT_OPTION,
  CATEGORY_FILTER_DEFAULT_OPTION,
} from '../../utils';

import type { TProductFilter } from '../../view/product-list-view';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  filter: TProductFilter;
  setFilter: Dispatch<SetStateAction<TProductFilter>>;
};

export function ProductFiltersState({
  onResetPage,
  totalResults,
  sx,
  searchText,
  setSearchText,
  filter,
  setFilter,
}: Props) {
  const handleRemoveSearch = useCallback(() => {
    onResetPage();
    setSearchText('');
  }, [onResetPage, setSearchText]);

  const handleRemoveFilter = useCallback(
    (name: string) => {
      onResetPage();
      setFilter({
        ...filter,
        [name]:
          name === 'stock_status'
            ? STOCK_STATUS_DEFAULT_OPTION
            : name === 'brand'
              ? BRAND_FILTER_DEFAULT_OPTION
              : name === 'category'
                ? CATEGORY_FILTER_DEFAULT_OPTION
                : { label: '', value: '' },
      });
    },
    [onResetPage, setFilter, filter]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    setSearchText('');
    setFilter({
      stock_status: STOCK_STATUS_DEFAULT_OPTION,
      brand: BRAND_FILTER_DEFAULT_OPTION,
      category: CATEGORY_FILTER_DEFAULT_OPTION,
    });
  }, [setSearchText, onResetPage, setFilter]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Keyword:" isShow={!!filter.stock_status.value}>
        <Chip
          {...chipProps}
          label={filter.stock_status.label}
          onDelete={() => handleRemoveFilter('stock_status')}
        />
      </FiltersBlock>
      <FiltersBlock label="Keyword:" isShow={!!filter.brand.value}>
        <Chip
          {...chipProps}
          label={filter.brand.label}
          onDelete={() => handleRemoveFilter('brand')}
        />
      </FiltersBlock>
      <FiltersBlock label="Keyword:" isShow={!!filter.category.value}>
        <Chip
          {...chipProps}
          label={filter.category.label}
          onDelete={() => handleRemoveFilter('category')}
        />
      </FiltersBlock>
      <FiltersBlock label="Keyword:" isShow={!!searchText}>
        <Chip {...chipProps} label={searchText} onDelete={handleRemoveSearch} />
      </FiltersBlock>
    </FiltersResult>
  );
}
