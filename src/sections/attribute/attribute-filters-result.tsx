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
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
};

export function AttributeFiltersResult({
  selectedCategories,
  setSelectedCategories,
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

  const handleRemoveCategories = useCallback(
    (inputValue: string) => {
      onResetPage();
      setSelectedCategories((prev) => prev.filter((item) => item !== inputValue));
    },
    [setSelectedCategories, onResetPage]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    setSearchText('');
    setSelectedCategories([]);
  }, [setSearchText, setSelectedCategories, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock
        label={selectedCategories.length > 1 ? 'Categories:' : 'Category:'}
        isShow={!!selectedCategories.length}
      >
        {selectedCategories.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveCategories(item)}
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!searchText}>
        <Chip {...chipProps} label={searchText} onDelete={handleRemoveSearch} />
      </FiltersBlock>
    </FiltersResult>
  );
}
