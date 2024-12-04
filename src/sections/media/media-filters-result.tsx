import type { Dispatch, SetStateAction } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';
import type { TQueryParam } from 'src/redux/interfaces/common';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { fDate } from 'src/utils/format-time';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  types: string[];
  setTypes: Dispatch<SetStateAction<string[]>>;
  queryParams: TQueryParam[];
  setQueryparams: Dispatch<SetStateAction<TQueryParam[]>>;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
};

export function MediaFiltersResult({
  types,
  setTypes,
  queryParams,
  setQueryparams,
  searchText,
  onResetPage,
  totalResults,
  setSearchText,
  sx,
}: Props) {
  const handleRemoveSearch = useCallback(() => {
    onResetPage();
    setSearchText('');
  }, [onResetPage, setSearchText]);

  const handleRemoveTypes = useCallback(
    (inputValue: string) => {
      onResetPage();
      setTypes((prev) => prev.filter((item) => item !== inputValue));
    },
    [setTypes, onResetPage]
  );

  const handleRemoveFromDate = useCallback(() => {
    onResetPage();
    setQueryparams((prev) => prev.filter((param) => param.name !== 'fromDate'));
  }, [setQueryparams, onResetPage]);

  const handleRemoveToDate = useCallback(() => {
    onResetPage();
    setQueryparams((prev) => prev.filter((param) => param.name !== 'toDate'));
  }, [setQueryparams, onResetPage]);

  const handleReset = useCallback(() => {
    onResetPage();
    setSearchText('');
    setTypes([]);
    setQueryparams((prev) =>
      prev.filter((param) => param.name !== 'fromDate' && param.name !== 'toDate')
    );
  }, [setSearchText, setTypes, setQueryparams, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Types:" isShow={!!types.length}>
        {types.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveTypes(item)}
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock
        label="From:"
        isShow={!!queryParams.find((param) => param.name === 'fromDate')?.value}
      >
        <Chip
          {...chipProps}
          label={fDate(queryParams.find((param) => param.name === 'fromDate')?.value)}
          onDelete={handleRemoveFromDate}
        />
      </FiltersBlock>

      <FiltersBlock
        label="To:"
        isShow={!!queryParams.find((param) => param.name === 'toDate')?.value}
      >
        <Chip
          {...chipProps}
          label={fDate(queryParams.find((param) => param.name === 'toDate')?.value)}
          onDelete={handleRemoveToDate}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!searchText}>
        <Chip {...chipProps} label={searchText} onDelete={handleRemoveSearch} />
      </FiltersBlock>
    </FiltersResult>
  );
}
