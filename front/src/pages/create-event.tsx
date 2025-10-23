import { TextField, Button, Alert, ClickAwayListener } from '@mui/material';
import axios from '../config/client.ts';
import { Controller, useForm } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState, useMemo } from 'react';
import { type FormValues } from '../utilities/types.ts';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import authClient from '../services/auth-client.ts';
import { Navigate } from 'react-router-dom';
import type { DateTimeValidationError } from '@mui/x-date-pickers';

export function CreateEvent() {
    const { data } = authClient.useSession();

    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [endTime, setEndTime] = useState<Dayjs | null>(null);
    const [startError, setStartError] = useState<DateTimeValidationError | null>(null);
    const [endError, setEndError] = useState<DateTimeValidationError | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [submissionValid, setSubmissionValid] = useState<boolean>(false);

    const errorMessageStart = useMemo(() => {
        switch (startError) {
            case 'disablePast': {
                return 'Event cannot be in the past';
            }
        }
    }, [startError]);

    const errorMessageEnd = useMemo(() => {
        switch (endError) {
            case 'disablePast': {
                return 'Event cannot be in the past';
            }
            case 'minDate':
            case 'minTime': {
                return 'End date/time cannot be before the start time';
            }
        }
    }, [endError]);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        control
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            eventName: '',
            description: '',
            city: '',
            startDateTime: null,
            endDateTime: null,
        },
    });

    async function createEvent(data: FormValues) {
        console.log('data here', data, startTime?.toISOString(), endTime);
        const response = await axios
            .post('/create-event', {
                ...data,
                startTime: startTime?.toISOString(),
                endTime: endTime?.toISOString(),
            })
            .then((res) => {
                setIsVisible(true);
                setSubmissionValid(true);
                console.log(res.data);
                reset();
                setEndTime(null);
                setStartTime(null);
            })
            .catch((e) => {
                setIsVisible(true);
                setSubmissionValid(false);
                console.log(e);
            });
        console.log(response);
    }

    return (
        <div>
            {data?.user?.role === 'staff' || data?.user?.role === 'admin' ? (
                <form className="create-event" onSubmit={handleSubmit(createEvent)} style={{ width: '75%' }}>
                    <TextField
                        label="Event Name"
                        error={!!errors.eventName}
                        helperText={errors.eventName?.message}
                        {...register('eventName', {
                            required: true,
                            pattern: {
                                value: /^.{1,30}$/,
                                message: 'max 30 characters',
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
                        error={!!errors.city}
                        helperText={errors.city?.message}
                        {...register('city', {
                            required: true,
                            pattern: {
                                value: /^.{1,10}$/,
                                message: 'max 30 characters',
                            },
                        })}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                        <Controller
                            control={control}
                            name="startDateTime"
                            render={({field: { ref }}) => {
                                return (
                                    <DateTimePicker
                                        inputRef={ref}
                                        disablePast
                                        onError={(newError) => setStartError(newError)}
                                        slotProps={{
                                            textField: {
                                                helperText: errorMessageStart,
                                            },
                                        }}
                                        label="Start Time"
                                        ampm={false}
                                        value={startTime}
                                        onChange={(newValue) => setStartTime(newValue)}
                                    />
                                );
                            }}
                        />

                        <DateTimePicker
                            disablePast
                            onError={(newError) => setEndError(newError)}
                            slotProps={{
                                textField: {
                                    helperText: errorMessageEnd,
                                },
                            }}
                            minDateTime={startTime ?? undefined}
                            label="End Time"
                            ampm={false}
                            value={endTime}
                            onChange={(newValue) => setEndTime(newValue)}
                        />
                    </LocalizationProvider>
                    <Button type="submit" variant="contained" disabled={!isValid || !!startError || !!endError}>
                        Submit Event
                    </Button>
                    {isVisible && (
                        <ClickAwayListener onClickAway={() => setIsVisible(false)}>
                            <Alert
                                variant="filled"
                                severity={submissionValid ? 'success' : 'error'}
                                sx={{ margin: '10px' }}
                            >
                                {submissionValid
                                    ? 'Event created successfully'
                                    : 'There was a problem with your request'}
                            </Alert>
                        </ClickAwayListener>
                    )}
                </form>
            ) : (
                <Navigate to="/" />
            )}
        </div>
    );
}
