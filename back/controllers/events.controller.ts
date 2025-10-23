import { Request, Response } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth';
import { google } from 'googleapis';
import prisma from '../lib/prisma';

export async function createEvent(req: Request, res: Response) {
    const { eventName, description, city, startTime, endTime } = req.body;

    try {
        await prisma.event.create({
            data: {
                name: eventName,
                description: description,
                location: city,
                start: startTime,
                end: endTime,
            },
        });
        return res.status(200).json('Event successfully created');
    } catch (e) {
        return res.status(400).json(e);
    }
}

export async function fetchEvents(req: Request, res: Response) {
    const today = new Date();
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    try {
        const events = await prisma.event.findMany({
            where: {
                ...(req.path === '/past-events' && { start: { lt: today } }),
                ...(req.path === '/upcoming-events' && {
                    start: { gt: today },
                    attendees: { none: { id: session!.user.id } },
                }),
                ...(req.path === '/attending' && { attendees: { some: { id: session!.user.id } } }),
            },
            orderBy: {
                start: 'asc',
            },
        });
        return res.status(200).send(events);
    } catch (e) {
        console.log(e);
    }
}

export async function attendOrCancelEvent(req: Request, res: Response) {
    const { event_id, is_attending } = req.body;
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
        return res.status(401).json('Not authenticated');
    }

    try {
        let calendar;
        const googleAccount = await prisma.account.findFirst({
            where: {
                userId: session!.user.id,
                providerId: 'google',
            },
        });

        if (googleAccount?.accessToken) {
            const client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                'http://localhost:7000/api/auth/callback/google',
            );

            client.setCredentials({
                access_token: googleAccount.accessToken,
                refresh_token: googleAccount.refreshToken,
            });

            calendar = google.calendar({ version: 'v3', auth: client });
        }

        const updated_event = await prisma.event.update({
            where: {
                id: event_id,
            },
            data: {
                attendees: {
                    ...(is_attending && {
                        disconnect: {
                            id: session!.user.id,
                        },
                    }),
                    ...(!is_attending && {
                        connect: {
                            id: session!.user.id,
                        },
                    }),
                },
            },
        });

        await calendar?.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: updated_event.name,
                description: updated_event.description,
                start: { dateTime: updated_event.start.toISOString() },
                end: { dateTime: updated_event.end.toISOString() },
            },
        });

        return res.status(200).json({message: 'Your attendance successfully recorded'});
    } catch (e) {
        console.log(e);
    }
}
