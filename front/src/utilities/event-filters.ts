import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export interface EventFilters {
    fromDate?: string | null;
    toDate?: string | null;
    category?: string;
    search?: string;
}

export function EventFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const fromDate = searchParams.get('fromDate')
        ? dayjs(searchParams.get('fromDate'), 'YYYY-MM-DD-HH').format('YYYY-MM-DD-HH')
        : null;
    const toDate = searchParams.get('toDate')
        ? dayjs(searchParams.get('toDate'), 'YYYY-MM-DD-HH').format('YYYY-MM-DD-HH')
        : null;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const setFilters = useCallback((filters: EventFilters) => {
        setSearchParams((prev) => {
            if (filters.fromDate) {
                prev.set('from', filters.fromDate);
            }

            if (filters.toDate) {
                prev.set('to', filters.toDate);
            }

            if (filters.category) {
                prev.set('category', filters.category);
            }

            if (filters.search) {
                prev.set('search', filters.search);
            }
            return prev;
        });
    }, []);

    return {
        fromDate,
        toDate,
        category,
        search,
        setFilters,
    };
}
