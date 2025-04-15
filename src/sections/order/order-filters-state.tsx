import type { SxProps, Theme } from '@mui/material/styles';
import type { Dispatch, SetStateAction } from 'react';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { fDate } from 'src/utils/format-time';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

import { PAYMENT_STATUS_DEFAULT_OPTION, STOCK_STATUS_DEFAULT_OPTION } from './utils';

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
            ...filter,
            payment_status: PAYMENT_STATUS_DEFAULT_OPTION,
            from_date: undefined,
            to_date: undefined
        });
    }, [setSearchText, onResetPage, setFilter, filter]);

    return (
        <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
            <FiltersBlock label="Keyword:" isShow={!!filter.payment_status.value}>
                <Chip
                    {...chipProps}
                    label={filter.payment_status.label}
                    onDelete={() => handleRemoveFilter('stock_status')}
                />
            </FiltersBlock>
            <FiltersBlock
                label="From:"
                isShow={!!filter.from_date}
            >
                <Chip
                    {...chipProps}
                    label={fDate(filter.from_date)}
                    onDelete={() => setFilter({ ...filter, from_date: undefined })}
                />
            </FiltersBlock>

            <FiltersBlock
                label="To:"
                isShow={!!filter.to_date}
            >
                <Chip
                    {...chipProps}
                    label={fDate(filter.to_date)}
                    onDelete={() => setFilter({ ...filter, to_date: undefined })}
                />
            </FiltersBlock>
            <FiltersBlock label="Keyword:" isShow={!!searchText}>
                <Chip {...chipProps} label={searchText} onDelete={handleRemoveSearch} />
            </FiltersBlock>
        </FiltersResult>
    );
}
