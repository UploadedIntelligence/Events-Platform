import { TextField, Button } from '@mui/material';
import axios from '../config/client.ts';
import { useForm } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';
import { type FormValues } from '../utilities/types.ts';
import { Dayjs } from 'dayjs';
import authClient from '../services/auth-client.ts';
import { Navigate } from 'react-router-dom';

export function CreateEventPage() {
    const { data } = authClient.useSession();

    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [endTime, setEndTime] = useState<Dayjs | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            eventName: '',
            description: '',
            city: '',
        },
    });

    function createEvent(data: FormValues) {
        console.log('data here', data, startTime?.toISOString(), endTime);
        axios.post('/create-event', {
            ...data,
            startTime: startTime?.toISOString(),
            endTime: endTime?.toISOString(),
        });
    }

    return (
        <div>
            {data ? (
                <form className="create-event" onSubmit={handleSubmit(createEvent)} style={{ width: '75%' }}>
                    <TextField
                        label="Event Name"
                        error={!!errors.eventName}
                        helperText={errors.eventName?.message}
                        {...register('eventName', {
                            required: true,
                            pattern: {
                                value: /^.{1,10}$/,
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
                        label="City"
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Start Time"
                            ampm={false}
                            value={startTime}
                            onChange={(newValue) => setStartTime(newValue)}
                        />
                        <DateTimePicker
                            label="End Time"
                            ampm={false}
                            value={endTime}
                            onChange={(newValue) => setEndTime(newValue)}
                        />
                    </LocalizationProvider>
                    <Button type="submit" variant="contained" disabled={!isValid}>
                        Submit Event
                    </Button>
                </form>
            ) : (
                <Navigate to="/" />
            )}
        </div>
    );
}
