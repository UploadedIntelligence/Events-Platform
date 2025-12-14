import { PrismaPromise } from '../generated/prisma';
import prisma from '../lib/prisma';
import { UserSession } from '../utilities/user-session';
import type { calendar_v3 } from 'googleapis';
import { EventInfoDO, UserGoogleEventDO, GoogleCalendarEventDO } from '../utilities/types';

export function createEventService(data: EventInfoDO): PrismaPromise<EventInfoDO> {
    return prisma.event.create({
        data: {
            name: data.name,
            description: data.description,
            location: data.location,
            start: data.start,
            end: data.end,
            imgUrl: data.imgUrl ?? null,
        },
    });
}

export function fetchPastEventsService(today: Date): PrismaPromise<Array<EventInfoDO> | undefined> {
    return prisma.event.findMany({
        where: {
            start: {
                lt: today,
            },
        },
        orderBy: {
            start: 'asc',
        },
    });
}

export function fetchUpcomingEventsService(
    today: Date,
    session: UserSession,
): PrismaPromise<Array<EventInfoDO> | undefined> {
    return prisma.event.findMany({
        where: {
            start: {
                gt: today,
            },
            attendees: { none: { id: session.user.id } },
        },
        orderBy: {
            start: 'asc',
        },
    });
}

export function fetchAttendingEventsService(
    today: Date,
    session: UserSession,
): PrismaPromise<Array<EventInfoDO> | undefined> {
    return prisma.event.findMany({
        where: {
            start: {
                gt: today,
            },
            attendees: { some: { id: session.user.id } },
        },
        orderBy: {
            start: 'asc',
        },
    });
}

export function fetchUserHistoryService(today: Date, session: UserSession): PrismaPromise<Array<EventInfoDO>> {
    return prisma.event.findMany({
        where: {
            start: {
                lt: today,
            },
            attendees: { some: { id: session.user.id } },
        },
        orderBy: {
            start: 'asc',
        },
    });
}

export function updateEventService(data: EventInfoDO, event_id: string) {
    return prisma.event.update({
        where: {
            id: event_id,
        },
        data: {
            name: data.name,
            description: data.description,
            location: data.location,
            start: data.start,
            end: data.end,
            imgUrl: data.imgUrl ?? null,
        },
    });
}

export function updateEventAttendanceService(
    event_id: string,
    is_attending: boolean,
    session: UserSession,
): PrismaPromise<EventInfoDO> {
    if (is_attending) {
        return prisma.event.update({
            where: {
                id: event_id,
            },
            data: {
                attendees: {
                    disconnect: {
                        id: session.user.id,
                    },
                },
            },
        });
    }
    return prisma.event.update({
        where: {
            id: event_id,
        },
        data: {
            attendees: {
                connect: {
                    id: session.user.id,
                },
            },
        },
    });
}

export function getUserGoogleEventService(
    session: UserSession,
    event_id: string,
): PrismaPromise<UserGoogleEventDO | null> {
    return prisma.userGoogleEvent.findFirst({
        where: {
            userId: session.user.id,
            eventId: event_id,
        },
    });
}

export function insertGoogleCalendarEventService(
    calendar: calendar_v3.Calendar,
    event: EventInfoDO,
): Promise<GoogleCalendarEventDO> {
    return calendar?.events.insert({
        calendarId: 'primary',
        requestBody: {
            summary: event.name,
            description: event.description,
            start: { dateTime: event.start.toISOString() },
            end: { dateTime: event.end.toISOString() },
        },
    });
}

export function deleteGoogleCalendarEventService(
    calendar: calendar_v3.Calendar,
    google_event: UserGoogleEventDO | null,
): Promise<GoogleCalendarEventDO> {
    return calendar?.events.delete({
        calendarId: 'primary',
        eventId: google_event!.googleId,
    });
}

export function deleteGoogleEventService(
    google_event: UserGoogleEventDO,
    session: UserSession,
    event_id: string,
): PrismaPromise<UserGoogleEventDO> {
    return prisma.userGoogleEvent.delete({
        where: {
            googleId: google_event!.googleId,
            userId: session.user.id,
            eventId: event_id,
        },
    });
}

export function createGoogleEventService(
    google_calendar_event: GoogleCalendarEventDO,
    session: UserSession,
    event_id: string,
) {
    return prisma.userGoogleEvent.create({
        data: {
            googleId: google_calendar_event.data!.id!,
            userId: session.user.id,
            eventId: event_id,
        },
    });
}
