import type { Dispatch, SetStateAction } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import { startCase } from 'lodash';
import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  parentCategory: string;
  setParentCategory: Dispatch<SetStateAction<string>>;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
};

export function CategoryFiltersResult({
  parentCategory,
  setParentCategory,
  searchText,
  setSearchText,
  onResetPage,
  totalResults,
  sx,
}: Props) {
  const handleRemoveSearch = useCallback(() => {
    onResetPage();
    setSearchText('');
  }, [onResetPage, setSearchText]);

  const handleReset = useCallback(() => {
    onResetPage();
    setSearchText('');
    setParentCategory('');
  }, [setSearchText, setParentCategory, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Parent Category:" isShow={!!parentCategory.length}>
        <Chip
          {...chipProps}
          label={startCase(parentCategory)}
          onDelete={() => setParentCategory('')}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!searchText}>
        <Chip {...chipProps} label={searchText} onDelete={handleRemoveSearch} />
      </FiltersBlock>
    </FiltersResult>
  );
}
