import { Dayjs } from 'dayjs';

export type CreateEventForm = {
    image?: File;
    name: string;
    description: string;
    location: string;
    start: Dayjs | null;
    end: Dayjs | null;
};

export type Role = 'user' | 'staff' | 'admin';
