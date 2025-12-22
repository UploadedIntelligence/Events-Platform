import { TextField, Button, Alert, ClickAwayListener } from '@mui/material';
import axios from '../../../config/client.ts';
import { Controller, useForm } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';
import { type CreateEventForm } from '../../../utilities/types.ts';
import 'dayjs/locale/en-gb';
import { getSession } from '../../../utilities/user-permissions.ts';
import { Navigate } from 'react-router-dom';
import { disablePast, isValidDateTime, minDateTime } from '../../../utilities/validation.ts';
import { StyledPaper } from '../../../mui-styled-components';

// passing a sequence of invalid dates causes the error message to flicker

export function CreateEvent() {
    const user = getSession();
    const [isVisible, setIsVisible] = useState<boolean>(false);
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
            name: '',
            description: '',
            location: '',
            start: null,
            end: null,
        },
    });
    const startDateTime = watch('start');
    const endDateTime = watch('end');

    async function createEvent(event_data: CreateEventForm) {
        setRequestState('Pending');
        try {
            await axios.post('/create-event', {
                ...event_data,
                start: event_data.start?.toISOString(),
                end: event_data.end?.toISOString(),
            });
            setRequestState('Success');
            reset();
        } catch (e) {
            setRequestState('Error');
            console.log(e);
        }
        setIsVisible(true);
    }

    return (
        <StyledPaper>
            {user?.role === 'staff' || user?.role === 'admin' ? (
                <form className="Create-event" onSubmit={handleSubmit(createEvent)} style={{ width: '75%' }}>
                    <TextField
                        label="Event Name"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        {...register('name', {
                            required: true,
                            pattern: {
                                value: /^.{1,40}$/,
                                message: 'max 40 characters',
                            },
                        })}
                    />
                    <TextField
                        label="Description"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        {...register('description', {
                            required: true,
                            pattern: {
                                value: /^.{1,1000}$/,
                                message: 'max 1000 characters',
                            },
                        })}
                        multiline
                        rows={5}
                    />
                    <TextField
                        label="Location"
                        error={!!errors.location}
                        helperText={errors.location?.message}
                        {...register('location', {
                            required: true,
                            pattern: {
                                value: /^.{1,40}$/,
                                message: 'max 40 characters',
                            },
                        })}
                    />
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
                                            },
                                        }}
                                    />
                                );
                            }}
                        />
                    </LocalizationProvider>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!isValid || requestState !== 'Idle'}
                        color="success"
                    >
                        Submit Event
                    </Button>
                    {isVisible && (
                        <ClickAwayListener
                            onClickAway={() => {
                                setRequestState('Idle');
                                setIsVisible(false);
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
                </form>
            ) : (
                <Navigate to="/" />
            )}
        </StyledPaper>
    );
}
