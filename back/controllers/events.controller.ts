import { Request, Response } from 'express';
import {
    createEventAttendance,
    createGoogleEvent,
    createPrismaEvent,
    deleteEventAttendance,
    deleteGoogleCalendarEvent,
    fetchAllEvents,
    fetchEvent,
    fetchUserGoogleEvent,
    hostEventImage,
    insertGoogleCalendarEvent,
    updateEvent,
} from '../services/events.service.js';
import { currentSession } from '../utilities/user-session.js';
import * as z from 'zod';
import { ZodError } from 'zod';
import { type CreateEventDTO, EventEntity, IUserSession } from '../utilities/types.js';
import { bufferFileType } from '../utilities/buffer-file-type.js';
import { formatStringToDate } from '../utilities/format-string-to-date.js';
import { generateUserGoogleCalendar } from '../utilities/generate-user-google-calendar.js';

const zEventInfo = z
    .object({
        name: z.string(),
        organiser: z.string(),
        description: z.string(),
        location: z.string(),
        start: z.coerce.date().min(new Date()),
        end: z.coerce.date(),
        imgUrl: z.string().optional(),
    })
    .refine((data) => data.start < data.end, {
        message: 'Start time must be before end time',
        path: ['end'],
    });

const zIsValidImageType = z.enum(['image/png', 'image/jpg']);

export async function getEvent(req: Request, res: Response) {
    const { eventId } = req.params;

    if (!eventId) {
        return res.status(401).json('Invalid event id');
    }

    try {
        const eventDetails = await fetchEvent(eventId);
        return res.status(200).json(eventDetails);
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json(e.issues);
        }
        return res.status(400).json(e);
    }
}

export async function getEvents(req: Request, res: Response) {
    const { fromDate, toDate } = req.query;
    const { userId } = req.params;
    const session: IUserSession | null = await currentSession(req);
    const formattedFromDate = formatStringToDate(fromDate);
    const formattedToDate = formatStringToDate(toDate);

    try {
        if (session?.user.id === userId) {
            const events = await fetchAllEvents({
                from: formattedFromDate,
                to: formattedToDate,
                userId: userId,
            });
            if (events) {
                return res.status(200).send(events);
            }
        } else {
            const events = await fetchAllEvents({ from: formattedFromDate, to: formattedToDate });
            if (events) {
                return res.status(200).send(events);
            }
        }
        return res.status(200).json({ message: 'No events to display' });
    } catch (e) {
        console.log(e);
    }
}

export async function createEvent(req: Request, res: Response) {
    const session: IUserSession = res.locals.session;
    const eventInfo: CreateEventDTO = zEventInfo.parse(req.body);

    try {
        const createdEvent = await createPrismaEvent(eventInfo, session.user.id);
        return res.status(200).json({ message: 'Event successfully created', event: createdEvent });
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json(e.issues);
        }
        return res.status(400).json(e);
    }
}

export async function updateEventImage(req: Request, res: Response) {
    const session: IUserSession = res.locals.session;
    const { eventId } = req.params;
    const imageData = req.body;

    if (eventId && imageData) {
        const eventOwner = (await fetchEvent(eventId))?.included[0]?.organiser.email;
        if (eventOwner !== session.user.email) {
            return res.status(400).json('You must be the owner of the event to edit it');
        }

        try {
            const fileType = bufferFileType(imageData);
            zIsValidImageType.parse(fileType);
            await hostEventImage(imageData, eventId);
            return res.status(200).json('Image uploaded successfully');
        } catch (e) {
            if (e instanceof ZodError) {
                return res.status(400).json(e.issues);
            }
            return res.status(400).json(e);
        }
    }
    return res.status(400).json('Event id or image missing');
}

export async function updateEventDetails(req: Request, res: Response) {
    const session: IUserSession = res.locals.session;
    const eventData: EventEntity = req.body;

    if (eventData.organiserId === session.user.id || session.user.role === 'admin') {
        await updateEvent(eventData, req.params.event_id!);
    } else {
        return res.status(401).json('Not authenticated');
    }
    return res.status(200).json('Event updated');
}

export async function cancelAttendance(req: Request, res: Response) {
    const { eventId } = req.params;
    const session: IUserSession = res.locals.session;

    if (eventId) {
        const userId = session.user.id;
        const userGoogleEvent = await fetchUserGoogleEvent(userId, eventId);

        try {
            const calendar = await generateUserGoogleCalendar(userId);

            if (calendar && userGoogleEvent) {
                await deleteGoogleCalendarEvent(calendar, userGoogleEvent);
            }

            await deleteEventAttendance(eventId, userId);

            return res.status(200).json({ message: 'Your attendance successfully updated' });
        } catch (e) {
            console.log(e);
        }
    } else {
        throw Error('You must provide an event id');
    }
}

export async function attendEvent(req: Request, res: Response) {
    const { eventId } = req.params;
    const session: IUserSession = res.locals.session;
    const userId = session.user.id;

    if (eventId) {
        try {
            let calendar = await generateUserGoogleCalendar(userId);

            const updatedEvent = (await fetchEvent(eventId))?.data;
            await createEventAttendance(eventId, userId);

            if (calendar && updatedEvent) {
                const googleCalendarEvent = await insertGoogleCalendarEvent(calendar, updatedEvent);
                if (!googleCalendarEvent) {
                    return res.status(401).json('Not authenticated');
                }
                await createGoogleEvent(googleCalendarEvent, userId, eventId);
            }

            return res.status(200).json({ message: 'Your attendance successfully updated' });
        } catch (e) {
            console.log(e);
        }
    } else {
        throw Error('You must provide an event id');
    }
}
