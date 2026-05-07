import dayjs from 'dayjs';
import { type Query } from 'express-serve-static-core';

type QueryValue = string | Query | (string | Query)[] | undefined;

export function formatStringToDate(dateQuery: QueryValue): Date | undefined {
    if (typeof dateQuery === 'string' && dateQuery !== 'false') {
        const dayjsDate = dayjs(dateQuery);

        if (!dayjsDate.isValid()) {
            return;
        }

        return dayjsDate.toDate();
    }
}
