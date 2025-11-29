import { Dayjs } from 'dayjs';

export type CreateEventForm = {
    eventName: string;
    description: string;
    city: string;
    startTime: Dayjs | null;
    endTime: Dayjs | null;
};

export type Role = 'user' | 'staff' | 'admin';
