import { Request, Response } from 'express';
import {
    createEventService,
    createGoogleEventService,
    deleteGoogleCalendarEventService,
    deleteGoogleEventService,
    fetchAttendingEventsService,
    fetchPastEventsService,
    fetchUpcomingEventsService,
    fetchUserHistoryService,
    getUserGoogleEventService,
    insertGoogleCalendarEventService,
    updateEventAttendanceService,
    updateEventService,
} from '../services/events.service';
import { google } from 'googleapis';
import { currentSession } from '../utilities/user-session';
import { getUserAccountService, getUserGoogleClientService } from '../services/users.service';
import { ZodError } from 'zod';
import { EventInfoDO, IUserThirdPartyAccount, IUserSession } from '../utilities/types';
import * as z from 'zod';

const zEventInfo = z.object({
    name: z.string(),
    description: z.string(),
    location: z.string(),
    start: z.string().transform((value) => new Date(value)),
    end: z.string().transform((value) => new Date(value)),
    imgUrl: z.string().optional(),
});

const zIsDateValid = z.date().min(new Date());

const zAuthorizedEventCreatorRoles = z.enum(['admin', 'staff'])

export async function createEvent(req: Request, res: Response) {
    const session: IUserSession | null = await currentSession(req);

    if (!session || !zAuthorizedEventCreatorRoles.safeParse(session.user.role).success) {
        return res.status(401).json('Not authenticated');
    }

    const eventInfo: EventInfoDO = zEventInfo.parse(req.body);

    try {
        zIsDateValid.parse(eventInfo.start);
        await createEventService(eventInfo);
        return res.status(200).json('Event successfully created');
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json(e.issues);
        }
        return res.status(400).json(e);
    }
}

// export async function updateEvent(req: Request, res: Response) {
//     const session: UserSession | null = await currentSession(req);
//
//     if (!session || session.user.role === 'user') {
//         return res.status(401).json('Not authenticated');
//     }
//
//     await updateEventService(req.body, req.params.event_id!);
//     return res.status(200).json('Response')
// }

export async function fetchEvents(req: Request, res: Response) {
    const today = new Date();
    const session: IUserSession | null = await currentSession(req);

    if (!session) {
        return res.status(401).json('Not authenticated');
    }

    try {
        let events;
        if (req.path === '/past-events') {
            events = await fetchPastEventsService(today);
        } else if (req.path === '/upcoming-events') {
            events = await fetchUpcomingEventsService(today, session);
        } else if (req.path === '/attending') {
            events = await fetchAttendingEventsService(today, session);
        } else if (req.path === '/user-history') {
            events = await fetchUserHistoryService(today, session);
        } else {
            return res.status(400).json({ message: 'Something went wrong, please try again later.' });
        }
        return res.status(200).send(events);
    } catch (e) {
        console.log(e);
    }
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

        const updated_event = await updateEventAttendanceService(event_id, is_attending, session);
        const google_event = await getUserGoogleEventService(session, event_id);

        if (is_attending && googleAccount && google_event && calendar) {
            await deleteGoogleCalendarEventService(calendar, google_event);
            await deleteGoogleEventService(google_event, session, event_id);
        } else if (googleAccount && calendar) {
            const google_calendar_event = await insertGoogleCalendarEventService(calendar, updated_event);
            if (!google_calendar_event) {
                return res.status(401).json('Not authenticated');
            }
            await createGoogleEventService(google_calendar_event, session, event_id);
        }

        return res.status(200).json({ message: 'Your attendance successfully updated' });
    } catch (e) {
        console.log(e);
    }
}
