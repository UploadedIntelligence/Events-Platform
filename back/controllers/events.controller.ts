import { Request, Response } from 'express';
import {
    createEventService, createGoogleEventService, deleteGoogleEventService,
    fetchAttendingEventsService,
    fetchPastEventsService,
    fetchUpcomingEventsService,
    getUserGoogleEventService,
    handleGoogleCalendarActionService,
    updateEventService,
} from '../services/events.service';
import { google } from 'googleapis';
import { currentSession } from '../utilities/user-session';
import { UserSession } from '../utilities/user-session';
import { getUserAccountService, getUserGoogleClientService, IUserThirdPartyAccount } from '../services/users.service';

export async function createEvent(req: Request, res: Response) {
    const { eventName, description, city, startTime, endTime, imgUrl } = req.body;

    try {
        await createEventService({
            name: eventName,
            description: description,
            location: city,
            start: startTime,
            end: endTime,
            imgUrl: imgUrl,
        });
        return res.status(200).json('Event successfully created');
    } catch (e) {
        return res.status(400).json(e);
    }
}

export async function fetchEvents(req: Request, res: Response) {
    const today = new Date();
    const session: UserSession | null = await currentSession(req);

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
        } else {
            res.status(400).json({ message: 'Something went wrong, please try again later.' });
        }
        return res.status(200).send(events);
    } catch (e) {
        console.log(e);
    }
}

export async function attendOrCancelEvent(req: Request, res: Response) {
    const { event_id, is_attending } = req.body;
    const session: UserSession | null = await currentSession(req);

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

        const updated_event = await updateEventService(event_id, is_attending, session);
        const google_event = await getUserGoogleEventService(session, event_id);

        if (is_attending && googleAccount && google_event) {
            await handleGoogleCalendarActionService(calendar, google_event, 'delete')
            await deleteGoogleEventService(google_event, session, event_id);

        } else if (googleAccount) {
            const google_calendar_event = await handleGoogleCalendarActionService(
                calendar,
                google_event,
                'insert',
                updated_event,
            );
            await createGoogleEventService(google_calendar_event, session, event_id)
        }

        return res.status(200).json({ message: 'Your attendance successfully recorded' });
    } catch (e) {
        console.log(e);
    }
}
