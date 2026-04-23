import {Prisma} from '@prisma/client';
import prisma from '../lib/prisma';
import {
    type AttendeeInfo,
    type CreateEventDTO,
    EventEntity,
    GoogleCalendarEventDO,
    IUserSession,
    type OrganiserDTO,
    UserGoogleEventDO,
} from '../utilities/types';
import type {calendar_v3} from 'googleapis';
import axios from 'axios';
import FormData from 'form-data';
import { pickKeys } from '../utilities/pickKeys';
import PrismaPromise = Prisma.PrismaPromise;

export async function fetchEvent(
    eventId: string,
): Promise<{ data: EventEntity; included: Array<{ organiser: OrganiserDTO; attendees: Array<AttendeeInfo> }> } | null> {
    const event = await prisma.event.findFirstOrThrow({
        where: {
            id: eventId,
        },
        include: {
            organiser: true,
            attendees: true,
        },
    });

    const returning = pickKeys(event, [
        'id',
        'organiserId',
        'name',
        'imgUrl',
        'location',
        'description',
        'start',
        'end',
    ]);
    const organiser = pickKeys(event.organiser, ['name', 'email', 'image']);
    const attendees = event.attendees;

    return { data: returning, included: [{ organiser, attendees }] };
}

export function fetchAllEvents(filters: {
    from: Date | undefined;
    to: Date | undefined;
    userId?: string | undefined;
}): PrismaPromise<Array<EventEntity>> {
    console.log(filters.userId);
    return prisma.event.findMany({
        where: {
            ...(filters.from || filters.to
                ? {
                      start: {
                          ...(filters.from
                              ? {
                                    gt: filters.from,
                                }
                              : {}),
                          ...(filters.to
                              ? {
                                    lt: filters.to,
                                }
                              : {}),
                      },
                  }
                : {}),
            ...(filters.userId && {
                attendees: {
                    some: {
                        id: filters.userId,
                    },
                },
            }),
        },
        include: {
            attendees: true,
        },
        orderBy: {
            start: filters.from ? 'asc' : 'desc',
        },
    });
}

// export function fetchAttendingEvents(today: Date, userId: string): PrismaPromise<Array<EventEntity> | undefined> {
//     return prisma.event.findMany({
//         where: {
//             start: {
//                 gt: today,
//             },
//             attendees: { some: { id: userId } },
//         },
//         orderBy: {
//             start: 'asc',
//         },
//     });
// }

// export function fetchUserHistory(today: Date, userId: string): PrismaPromise<Array<EventEntity>> {
//     return prisma.event.findMany({
//         where: {
//             start: {
//                 lt: today,
//             },
//             attendees: { some: { id: userId } },
//         },
//         orderBy: {
//             start: 'asc',
//         },
//     });
// }

export function createPrismaEvent(data: CreateEventDTO, userId: string): PrismaPromise<EventEntity> {
    return prisma.event.create({
        data: {
            name: data.name,
            organiserId: userId,
            description: data.description,
            location: data.location,
            start: data.start,
            end: data.end,
            imgUrl: data.imgUrl ?? null,
        },
    });
}

export async function hostEventImage(data: Buffer | undefined, eventId: string) {
    if (data) {
        try {
            const formData = new FormData();
            formData.append('image', data, {
                filename: 'some file',
                contentType: 'image/png',
            });
            const uploadedImageUrl = await axios
                .post('https://api.imgbb.com/1/upload', formData, {
                    params: {
                        key: process.env.IMGBB_API_KEY,
                    },
                })
                .then((res) => res.data.data.url);

            return prisma.event.update({
                where: {
                    id: eventId,
                },
                data: {
                    imgUrl: uploadedImageUrl,
                },
            });
        } catch (e: any) {
            console.log(e.response.data);
        }
    }
}

export function updateEvent(data: EventEntity, eventId: string) {
    return prisma.event.update({
        where: {
            id: eventId,
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

export function updateEventAttendance(
    eventId: string,
    is_attending: boolean,
    session: IUserSession,
): PrismaPromise<EventEntity> {
    if (is_attending) {
        return prisma.event.update({
            where: {
                id: eventId,
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
            id: eventId,
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

export function getUserGoogleEvent(session: IUserSession, eventId: string): PrismaPromise<UserGoogleEventDO | null> {
    return prisma.userGoogleEvent.findFirst({
        where: {
            userId: session.user.id,
            eventId: eventId,
        },
    });
}

export function insertGoogleCalendarEvent(
    calendar: calendar_v3.Calendar,
    event: EventEntity,
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

export function deleteGoogleCalendarEvent(
    calendar: calendar_v3.Calendar,
    google_event: UserGoogleEventDO | null,
): Promise<GoogleCalendarEventDO> {
    return calendar?.events.delete({
        calendarId: 'primary',
        eventId: google_event!.googleId,
    });
}

export function createGoogleEvent(
    google_calendar_event: GoogleCalendarEventDO,
    session: IUserSession,
    eventId: string,
) {
    return prisma.userGoogleEvent.create({
        data: {
            googleId: google_calendar_event.data!.id!,
            userId: session.user.id,
            eventId: eventId,
        },
    });
}

export function deleteGoogleEvent(
    google_event: UserGoogleEventDO,
    session: IUserSession,
    eventId: string,
): PrismaPromise<UserGoogleEventDO> {
    return prisma.userGoogleEvent.delete({
        where: {
            googleId: google_event!.googleId,
            userId: session.user.id,
            eventId: eventId,
        },
    });
}
