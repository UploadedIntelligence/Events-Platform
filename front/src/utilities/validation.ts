import dayjs, { isDayjs, type Dayjs } from 'dayjs';
import { type Message } from 'react-hook-form';

export function disablePast(fieldLabel: string): (time: Dayjs | null) => Message | undefined {
    return (fieldValue: Dayjs | null) =>
        fieldValue && fieldValue.isBefore(dayjs()) ? `${fieldLabel} cannot be in the past` : undefined;
}

export function minDateTime<TFormValue>(
    fieldLabel: string,
    dependentFieldLabel: string,
    fieldName: keyof TFormValue,
): (value: Dayjs | null, formValues: TFormValue) => Message | undefined {
    return (fieldValue: Dayjs | null, formValues: TFormValue) => {
        return  isDayjs(formValues[fieldName]) && fieldValue?.isBefore(formValues[fieldName])
            ? `${fieldLabel} cannot be before ${dependentFieldLabel}`
            : undefined;
    };
}

export function maxDateTime<TFormValue>(
    fieldLabel: string,
    dependentFieldLabel: string,
    fieldName: keyof TFormValue
): (value: Dayjs | null, formValues: TFormValue) => Message | undefined {
    return (fieldValue: Dayjs | null, formValues: TFormValue) => {
        return isDayjs(formValues[fieldName]) && fieldValue?.isAfter(formValues[fieldName])
            ? `${fieldLabel} cannot be after ${dependentFieldLabel}`
            : undefined
    }
}