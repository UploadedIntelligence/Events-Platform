import { TextField, Button, Alert, ClickAwayListener } from '@mui/material';
import axios from '../config/client.ts';
import { Controller, useForm } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';
import { type FormValues } from '../utilities/types.ts';
import 'dayjs/locale/en-gb';
import authClient from '../services/auth-client.ts';
import { Navigate } from 'react-router-dom';
import { disablePast, minDateTime } from '../utilities/validation.ts';


export function CreateEvent() {
    const { data } = authClient.useSession();

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [requestState, setRequestState] = useState<'Pending' | 'Error' | 'Success' | 'Idle'>('Idle');

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        control,
        watch,
        setError,
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            eventName: '',
            description: '',
            city: '',
            startTime: null,
            endTime: null,
        },
    });
    const startDateTime = watch('startTime');

    async function createEvent(event_data: FormValues) {
        setRequestState("Pending")
        try {
            await axios.post('/create-event', {
                ...event_data,
                startTime: event_data.startTime?.toISOString(),
                endTime: event_data.endTime?.toISOString(),
            });
            setRequestState("Success");
            reset();
        } catch (e) {
            setRequestState("Error");
            console.log(e);
        }
        setIsVisible(true);
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
                            name="startTime"
                            rules={{
                                validate: {
                                    disablePast: disablePast('Start time'),
                                },
                            }}
                            render={({ field }) => {
                                return (
                                    <DateTimePicker
                                        label="Start Time"
                                        ampm={false}
                                        disablePast
                                        onError={(error) => {
                                            if (error === 'invalidDate') {
                                                setError('startTime', {
                                                    type: error,
                                                    message: 'Invalid start time',
                                                });
                                            }
                                        }}
                                        {...field}
                                        slotProps={{
                                            textField: {
                                                helperText: errors.startTime?.message,
                                            },
                                        }}
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name="endTime"
                            rules={{
                                validate: {
                                    disablePast: disablePast('End time'),
                                    minDateTime: minDateTime()
                                }
                            }}
                            render={({ field }) => {
                                return (
                                    <DateTimePicker
                                        label="End Time"
                                        ampm={false}
                                        disablePast
                                        minDateTime={startDateTime ?? undefined}
                                        onError={(error) => {
                                            if (error === 'invalidDate') {
                                                setError('endTime', {
                                                    type: error,
                                                    message: 'Invalid end time',
                                                });
                                            }
                                        }}
                                        slotProps={{
                                            textField: {
                                                helperText: errors.endTime?.message,
                                            },
                                        }}
                                        {...field}
                                    />
                                );
                            }}
                        />
                    </LocalizationProvider>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!isValid || requestState !== 'Idle'}
                    >
                        Submit Event
                    </Button>
                    {isVisible && (
                        <ClickAwayListener
                            onClickAway={() => {
                                setIsVisible(false);
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
                </form>
            ) : (
                <Navigate to="/" />
            )}
        </div>
    );
}
