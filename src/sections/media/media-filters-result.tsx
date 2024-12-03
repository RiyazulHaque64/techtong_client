import type { IImageFilters } from 'src/types/file';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<IImageFilters>;
};

export function MediaFiltersResult({ filters, onResetPage, totalResults, sx }: Props) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ searchTerm: '' });
  }, [filters, onResetPage]);

  const handleRemoveTypes = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.type.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ type: newValue });
    },
    [filters, onResetPage]
  );

  const handleRemoveDate = useCallback(() => {
    onResetPage();
    filters.setState({ fromDate: null, toDate: null });
  }, [filters, onResetPage]);

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Types:" isShow={!!filters.state.type.length}>
        {filters.state.type.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveTypes(item)}
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Date:" isShow={Boolean(filters.state.fromDate && filters.state.toDate)}>
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(filters.state.fromDate, filters.state.toDate)}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!filters.state.searchTerm}>
        <Chip {...chipProps} label={filters.state.searchTerm} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
