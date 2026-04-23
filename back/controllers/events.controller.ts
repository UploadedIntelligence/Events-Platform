import { Request, Response } from 'express';
import {
    createGoogleEvent,
    createPrismaEvent,
    deleteGoogleCalendarEvent,
    deleteGoogleEvent,
    fetchAllEvents,
    fetchEvent,
    getUserGoogleEvent,
    hostEventImage,
    insertGoogleCalendarEvent,
    updateEvent,
    updateEventAttendance,
} from '../services/events.service.ts';
import { google } from 'googleapis';
import { currentSession } from '../utilities/user-session.ts';
import { getUserAccountService, getUserGoogleClientService } from '../services/users.service.ts';
import * as z from 'zod';
import { ZodError } from 'zod';
import { type CreateEventDTO, IUserSession, IUserThirdPartyAccount } from '../utilities/types.ts';
import { bufferFileType } from '../utilities/buffer-file-type.ts';
import dayjs from 'dayjs';

const zEventInfo = z.object({
    name: z.string(),
    organiser: z.string(),
    description: z.string(),
    location: z.string(),
    start: z.string().transform((value) => new Date(value)),
    end: z.string().transform((value) => new Date(value)),
    imgUrl: z.string().optional(),
});

const zIsDateValid = z.date().min(new Date());
const zIsValidImageType = z.enum(['image/png', 'image/jpg']);

const zAuthorizedEventCreatorRoles = z.enum(['admin', 'staff']);

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

export async function fetchEvents(req: Request, res: Response) {
    const { fromDate, toDate } = req.query;
    const { userId } = req.params;
    const session: IUserSession | null = await currentSession(req);
    let formattedFrom, formattedTo;

    if (fromDate !== 'false' && typeof fromDate === 'string') {
        formattedFrom = dayjs(fromDate);
        if (!formattedFrom.isValid()) {
            return res.status(400).json({ message: 'Invalid date format.' });
        }
    }

    if (toDate !== 'false' && typeof toDate === 'string') {
        formattedTo = dayjs(toDate);
        if (!formattedTo.isValid()) {
            return res.status(400).json({ message: 'Invalid date format.' });
        }
    }

    try {
        if (session?.user.id === userId) {
            const events = await fetchAllEvents({
                from: formattedFrom?.toDate(),
                to: formattedTo?.toDate(),
                userId: userId,
            });
            if (events) {
                return res.status(200).send(events);
            }
        } else {
            const events = await fetchAllEvents({ from: formattedFrom?.toDate(), to: formattedTo?.toDate() });
            if (events) {
                return res.status(200).send(events);
            }
        }
        return res.status(400).json({ message: 'Something went wrong, please try again later.' });
    } catch (e) {
        console.log(e);
    }
}

// export async function fetchUserEvents(req: Request, res: Response) {
//     const today = new Date();
//     const session: IUserSession | null = await currentSession(req);
//     const { eventType } = req.params;
//
//     console.log(eventType);
//
//     if (!session) {
//         return res.status(401).json('Not authenticated');
//     }
//
//     let events;
//     try {
//         if (eventType === 'attending') {
//             events = await fetchAttendingEvents(today, session.user.id);
//         } else if (eventType === 'history') {
//             events = await fetchUserHistory(today, session.user.id);
//         }
//         return res.status(200).send(events);
//     } catch (e) {
//         console.log(e);
//     }
// }

export async function createEvent(req: Request, res: Response) {
    const session: IUserSession | null = await currentSession(req);

    if (!session || !zAuthorizedEventCreatorRoles.safeParse(session.user.role).success) {
        return res.status(401).json('Not authenticated');
    }

    const eventInfo: CreateEventDTO = zEventInfo.parse(req.body);

    try {
        zIsDateValid.parse(eventInfo.start);
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
    const session: IUserSession | null = await currentSession(req);

    if (!session || session.user.role === 'user') {
        return res.status(401).json('Not authenticated');
    }

    if (req.body && req.params.event_id) {
        try {
            const fileType = bufferFileType(req.body);
            zIsValidImageType.parse(fileType);
            await hostEventImage(req.body, req.params.event_id);
            return res.status(200).json('Image uploaded successfully');
        } catch (e) {
            if (e instanceof ZodError) {
                return res.status(400).json(e.issues);
            }
            return res.status(400).json(e);
        }
    }
}

export async function updateEventDetails(req: Request, res: Response) {
    const session: IUserSession | null = await currentSession(req);

    if (!session || session.user.role === 'user') {
        return res.status(401).json('Not authenticated');
    }

    await updateEvent(req.body, req.params.event_id!);
    return res.status(200).json('Response');
}

export async function attendOrCancelEvent(req: Request, res: Response) {
    const { event_id, is_attending } = req.body;
    const session: IUserSession | null = await currentSession(req);

    if (!session) {
        return res.status(401).json('Not authenticated');
    }

    try {
        let calendar;
        const googleAccount: IUserThirdPartyAccount | null = await getUserAccountService(session, 'google');

        if (googleAccount?.accessToken) {
            const client = getUserGoogleClientService(googleAccount);
            calendar = google.calendar({ version: 'v3', auth: client });
        }

        const updated_event = await updateEventAttendance(event_id, is_attending, session);
        const google_event = await getUserGoogleEvent(session, event_id);

        if (is_attending && googleAccount && google_event && calendar) {
            await deleteGoogleCalendarEvent(calendar, google_event);
            await deleteGoogleEvent(google_event, session, event_id);
        } else if (googleAccount && calendar) {
            const google_calendar_event = await insertGoogleCalendarEvent(calendar, updated_event);
            if (!google_calendar_event) {
                return res.status(401).json('Not authenticated');
            }
            await createGoogleEvent(google_calendar_event, session, event_id);
        }

        return res.status(200).json({ message: 'Your attendance successfully updated' });
    } catch (e) {
        console.log(e);
    }
}
