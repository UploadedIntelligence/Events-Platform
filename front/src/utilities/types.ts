import { Dayjs } from 'dayjs';

export type FormValues = {
    eventName: string;
    description: string;
    city: string;
    startDateTime: Dayjs | null;
    endDateTime: Dayjs | null;
};
