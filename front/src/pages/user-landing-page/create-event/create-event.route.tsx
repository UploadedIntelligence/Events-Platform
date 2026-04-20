import { Alert, ClickAwayListener } from '@mui/material';
import axios from '../../../config/client.ts';
import { Controller, useForm } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';
import { type CreateEventForm } from '../../../utilities/types.ts';
import 'dayjs/locale/en-gb';
import { type IUser } from '../../../utilities/user-permissions.ts';
import { useLoaderData, useNavigation } from 'react-router-dom';
import { disablePast, isValidDateTime, minDateTime } from '../../../utilities/validation.ts';
import { EpUserDataInput } from '../../../components/user-data-input/user-data-input.tsx';
import { EpCredentialsPageContent } from '../../../components/credentials-page-content/credentials-page-content.tsx';
import { EpButton } from '../../../components/button/button.tsx';
import { EpUserCredentialsForm } from '../../../components/user-credentials-form/user-credentials-form.tsx';
import { EpImageUpload } from '../../../components/image-upload/image-upload.tsx';
import dayjs from 'dayjs';
import { Spinner } from '../../../components/spinner/spinner.tsx';

// passing a sequence of invalid dates causes the error message to flicker

export function CreateEvent() {
    const user: IUser = useLoaderData();
    const navigation = useNavigation();
    const [requestState, setRequestState] = useState<'Pending' | 'Error' | 'Success' | 'Idle'>('Idle');

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        control,
        reset,
        watch,
        setError,
        trigger,
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            image: undefined,
            name: 'test',
            description: 'test',
            location: 'test',
            start: dayjs().add(7, 'day'),
            end: dayjs().add(10, 'day'),
        },
    });

    const name = watch('name');
    const description = watch('description');
    const location = watch('location');
    const startDateTime = watch('start');
    const endDateTime = watch('end');

    async function createEvent(eventData: CreateEventForm) {
        setRequestState('Pending');
        const { image, ...remainingData } = eventData;

        const createdEvent = await axios.post('/events', {
            ...remainingData,
            organiser: user.id,
            start: eventData.start?.toISOString(),
            end: eventData.end?.toISOString(),
        });
        if (!image) return;

        await fetch(`${import.meta.env.VITE_SERVER_URL}/events/${createdEvent.data.event.id}/image`, {
            method: 'PUT',
            credentials: 'include',
            body: image[0],
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        });

        if (createdEvent.status !== 200) {
            setRequestState('Error');
        } else {
            setRequestState('Success');
            reset();
        }
    }

    if (navigation.state === 'loading') {
        return <Spinner/>
    }

    return (
        <EpCredentialsPageContent variant="wide">
            <EpUserCredentialsForm onSubmit={handleSubmit(createEvent)}>
                <EpImageUpload
                    {...register('image', {
                        required: false,
                    })}
                />
                <EpUserDataInput
                    label="Event name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    {...register('name', {
                        required: true,
                        pattern: {
                            value: /^.{1,80}$/,
                            message: 'Character limit exceeded',
                        },
                    })}
                />
                <span style={{ display: 'flex', justifyContent: 'end', fontSize: '0.7em' }}>{name.length}/80</span>
                <EpUserDataInput
                    label="Description"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    {...register('description', {
                        required: true,
                        pattern: {
                            value: /^.{1,2000}$/,
                            message: 'Character limit exceeded',
                        },
                    })}
                    multiline={true}
                    rows={8}
                />
                <span style={{ display: 'flex', justifyContent: 'end', fontSize: '0.7em' }}>
                    {description.length}/2000
                </span>
                <EpUserDataInput
                    label="Location"
                    error={!!errors.location}
                    helperText={errors.location?.message}
                    {...register('location', {
                        required: true,
                        pattern: {
                            value: /^.{1,80}$/,
                            message: 'Character limit exceeded',
                        },
                    })}
                />
                <span style={{ display: 'flex', justifyContent: 'end', fontSize: '0.7em' }}>{location.length}/80</span>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                    <Controller
                        control={control}
                        name="start"
                        rules={{
                            required: true,
                            validate: {
                                disablePast: disablePast('Start time'),
                                isValidDate: isValidDateTime(),
                            },
                        }}
                        render={({ field: { onChange, ...rest } }) => {
                            return (
                                <DateTimePicker
                                    {...rest}
                                    label="Start Time"
                                    ampm={false}
                                    disablePast
                                    maxDateTime={endDateTime ?? undefined}
                                    onChange={(newValue) => {
                                        onChange(newValue ?? null);
                                        if (endDateTime) trigger('end');
                                    }}
                                    onError={(error) => {
                                        if (error === 'invalidDate') {
                                            setError('start', {
                                                type: error,
                                                message: 'Invalid start time',
                                            });
                                        }
                                    }}
                                    slotProps={{
                                        textField: {
                                            error: !!errors.start,
                                            helperText: errors.start?.message,
                                            sx: {
                                                '& .MuiPickersInputBase-root': {
                                                    color: 'var(--Ep-primaryText-color)',
                                                    background: 'var(--Ep-dataInput-background)',
                                                },
                                                '& .MuiFormLabel-root, .MuiSvgIcon-root': {
                                                    color: 'var(--Ep-primaryText-color)',
                                                },
                                            },
                                        },
                                    }}
                                />
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name="end"
                        rules={{
                            required: true,
                            validate: {
                                disablePast: disablePast('End time'),
                                isValidDate: isValidDateTime(),
                                minDateTime: minDateTime<CreateEventForm>('End time', 'start time', 'start'),
                            },
                        }}
                        render={({ field: { onChange, ...rest } }) => {
                            return (
                                <DateTimePicker
                                    {...rest}
                                    label="End Time"
                                    ampm={false}
                                    disablePast
                                    minDateTime={startDateTime ?? undefined}
                                    onChange={(newValue) => {
                                        onChange(newValue ?? null);
                                        if (startDateTime) trigger('start');
                                    }}
                                    onError={(error) => {
                                        if (error === 'invalidDate') {
                                            setError('end', {
                                                type: error,
                                                message: 'Invalid end time',
                                            });
                                        }
                                    }}
                                    slotProps={{
                                        textField: {
                                            error: !!errors.end,
                                            helperText: errors.end?.message,
                                            sx: {
                                                '& .MuiPickersInputBase-root': {
                                                    color: 'var(--Ep-primaryText-color)',
                                                    background: 'var(--Ep-dataInput-background)',
                                                },
                                                '& .MuiFormLabel-root, .MuiSvgIcon-root': {
                                                    color: 'var(--Ep-primaryText-color)',
                                                },
                                            },
                                        },
                                    }}
                                />
                            );
                        }}
                    />
                </LocalizationProvider>
                <EpButton disabled={!isValid || requestState !== 'Idle'}>Submit Event</EpButton>
                {!(requestState === 'Idle' || requestState === 'Pending') && (
                    <ClickAwayListener
                        onClickAway={() => {
                            setRequestState('Idle');
                        }}
                    >
                        <Alert
                            variant="filled"
                            severity={requestState === 'Success' ? 'success' : 'error'}
                            sx={{ margin: '10px' }}
                        >
                            {requestState === 'Success'
                                ? 'Event created successfully'
                                : 'There was a problem with your request'}
                        </Alert>
                    </ClickAwayListener>
                )}
            </EpUserCredentialsForm>
        </EpCredentialsPageContent>
    );
}
