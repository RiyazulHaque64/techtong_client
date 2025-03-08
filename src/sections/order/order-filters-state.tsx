import type { SxProps, Theme } from '@mui/material/styles';
import type { Dispatch, SetStateAction } from 'react';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

import { STOCK_STATUS_DEFAULT_OPTION } from './utils';

import type { TOrderFilter } from './view';

// ----------------------------------------------------------------------

type Props = {
    totalResults: number;
    sx?: SxProps<Theme>;
    onResetPage: () => void;
    searchText: string;
    setSearchText: Dispatch<SetStateAction<string>>;
    filter: TOrderFilter;
    setFilter: Dispatch<SetStateAction<TOrderFilter>>;
};

export function OrderFiltersState({
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
                        :
                        { label: '', value: '' },
            });
        },
        [onResetPage, setFilter, filter]
    );

    const handleReset = useCallback(() => {
        onResetPage();
        setSearchText('');
        setFilter({
            stock_status: STOCK_STATUS_DEFAULT_OPTION
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
            <FiltersBlock label="Keyword:" isShow={!!searchText}>
                <Chip {...chipProps} label={searchText} onDelete={handleRemoveSearch} />
            </FiltersBlock>
        </FiltersResult>
    );
}
