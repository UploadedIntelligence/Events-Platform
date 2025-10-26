import { Dayjs } from 'dayjs';

export type FormValues = {
    eventName: string;
    description: string;
    city: string;
    startTime: Dayjs | null;
    endTime: Dayjs | null;
};
