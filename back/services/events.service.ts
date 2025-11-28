import { PrismaPromise } from '../generated/prisma';
import prisma from '../lib/prisma';
import { UserSession } from '../utilities/user-session';
import type { calendar_v3 } from 'googleapis';

export interface EventInfo {
    name: string;
    description: string;
    location: string;
    start: Date;
    end: Date;
    imgUrl?: string | null;
}

export interface UserGoogleEvent {
    googleId: string;
    userId: string;
    eventId: string;
}

export interface GoogleCalendarEvent {
    data: {
        id?: string | null;
    } | void;
}

export function createEventService(data: EventInfo): PrismaPromise<EventInfo> {
    return prisma.event.create({
        data: {
            name: data.name,
            description: data.description,
            location: data.location,
            start: data.start,
            end: data.end,
        },
    });
}

export function fetchPastEventsService(today: Date): PrismaPromise<Array<EventInfo> | undefined> {
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
): PrismaPromise<Array<EventInfo> | undefined> {
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
): PrismaPromise<Array<EventInfo> | undefined> {
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

export function fetchUserHistoryService(today: Date, session: UserSession): PrismaPromise<Array<EventInfo>> {
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

export function updateEventService(
    event_id: string,
    is_attending: boolean,
    session: UserSession,
): PrismaPromise<EventInfo> {
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
): PrismaPromise<UserGoogleEvent | null> {
    return prisma.userGoogleEvent.findFirst({
        where: {
            userId: session.user.id,
            eventId: event_id,
        },
    });
}

export function insertGoogleCalendarEventService(
    calendar: calendar_v3.Calendar,
    event: EventInfo,
): Promise<GoogleCalendarEvent> {
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
    google_event: UserGoogleEvent | null,
): Promise<GoogleCalendarEvent> {
    return calendar?.events.delete({
        calendarId: 'primary',
        eventId: google_event!.googleId,
    });
}

export function deleteGoogleEventService(
    google_event: UserGoogleEvent,
    session: UserSession,
    event_id: string,
): PrismaPromise<UserGoogleEvent> {
    return prisma.userGoogleEvent.delete({
        where: {
            googleId: google_event!.googleId,
            userId: session.user.id,
            eventId: event_id,
        },
    });
}

export function createGoogleEventService(
    google_calendar_event: GoogleCalendarEvent,
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
