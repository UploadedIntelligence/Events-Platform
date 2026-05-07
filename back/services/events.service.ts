import prisma from '../lib/prisma.js';
import {
    type AttendanceInfo,
    type CreateEventDTO,
    EventEntity,
    GoogleCalendarEventDO,
    type OrganiserDTO,
    UserGoogleEventDO,
} from '../utilities/types.js';
import type { calendar_v3 } from 'googleapis';
import axios from 'axios';
import FormData from 'form-data';
import { pickKeys } from '../utilities/pick-keys.js';

export async function fetchEvent(eventId: string): Promise<{
    data: EventEntity;
    included: Array<{ organiser: OrganiserDTO; attendances: Array<AttendanceInfo> }>;
} | null> {
    const event = await prisma.event.findFirstOrThrow({
        where: {
            id: eventId,
        },
        include: {
            organiser: true,
            attendances: true,
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
    const attendances = event.attendances;

    return { data: returning, included: [{ organiser, attendances }] };
}

export function fetchAllEvents(filters: {
    from: Date | undefined;
    to: Date | undefined;
    userId?: string | undefined;
}): Promise<Array<EventEntity>> {
    //lodash to simplify(merge)
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
                attendances: {
                    some: {
                        userId: filters.userId,
                    },
                },
            }),
        },
        include: {
            attendances: true,
        },
        orderBy: {
            start: filters.from ? 'asc' : 'desc',
        },
    });
}

export function createPrismaEvent(data: CreateEventDTO, userId: string): Promise<EventEntity> {
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

export async function hostEventImage(imageData: Buffer | undefined, eventId: string) {
    if (imageData) {
        try {
            const formData = new FormData();
            formData.append('image', imageData, {
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

export function createEventAttendance(eventId: string, userId: string): Promise<AttendanceInfo> {
    return prisma.eventAttendance.create({
        data: {
            userId: userId,
            eventId: eventId,
        },
    });
}

export function deleteEventAttendance(eventId: string, userId: string): Promise<AttendanceInfo> {
    return prisma.eventAttendance.delete({
        where: {
            userId_eventId: {
                eventId: eventId,
                userId: userId,
            },
        },
    });
}

export function fetchUserGoogleEvent(userId: string, eventId: string): Promise<UserGoogleEventDO | null> {
    return prisma.userGoogleEvent.findFirst({
        where: {
            userId: userId,
            eventId: eventId,
        },
    });
}

export function insertGoogleCalendarEvent(
    calendar: calendar_v3.Calendar,
    event: EventEntity,
): Promise<GoogleCalendarEventDO> {
    return calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
            summary: event.name,
            description: event.description,
            start: { dateTime: event.start.toISOString() },
            end: { dateTime: event.end.toISOString() },
        },
    });
}

export function createGoogleEvent(googleCalendarEvent: GoogleCalendarEventDO, userId: string, eventId: string) {
    return prisma.userGoogleEvent.create({
        data: {
            googleId: googleCalendarEvent.data!.id!,
            userId: userId,
            eventId: eventId,
        },
    });
}

export async function deleteGoogleCalendarEvent(
    calendar: calendar_v3.Calendar,
    googleEvent: UserGoogleEventDO,
): Promise<void> {
    await calendar?.events.delete({
        calendarId: 'primary',
        eventId: googleEvent.googleId,
    });
    await prisma.userGoogleEvent.delete({
        where: googleEvent,
    });
}
