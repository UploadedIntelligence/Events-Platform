import dayjs, { Dayjs } from 'dayjs';
import { type Message } from 'react-hook-form';
import type {FormValues} from "./types.ts";

export function disablePast(fieldName: string): (time: Dayjs | null) => Message | undefined {
    return (fieldValue: Dayjs | null) =>
        fieldValue && fieldValue.isBefore(dayjs()) ? `${fieldName} cannot be in the past` : undefined;
}

export function minDateTime(formKey: keyof FormValues): (value: Dayjs | null, formValues: FormValues) => Message | undefined {
    return (fieldValue: Dayjs | null, formValues: FormValues) => {
        return fieldValue?.isBefore(formValues[formKey]) ? `End time cannot be before start time` : undefined
    }
}
