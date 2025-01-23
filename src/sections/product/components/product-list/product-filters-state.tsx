import type { Dispatch, SetStateAction } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
};

export function ProductFiltersState({
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
  }, [setSearchText, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Keyword:" isShow={!!searchText}>
        <Chip {...chipProps} label={searchText} onDelete={handleRemoveSearch} />
      </FiltersBlock>
    </FiltersResult>
  );
}
