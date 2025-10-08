import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export async function createEvent(req: Request, res: Response) {
    const { eventName, description, city, startTime, endTime } = req.body;

    try {
        const event = await prisma.event.create({
            data: {
                name: eventName,
                description: description,
                location: city,
                start: startTime,
                end: endTime,
            },
        });
        console.log(event);
    } catch (e) {
        console.log(e);
    }
}

export async function fetchFutureEvents(req: Request, res: Response) {
    const today = new Date();
    try {
        const events = await prisma.event.findMany({
            where: {
                start: {
                    gt: today,
                },
            },
            orderBy: {
                start: 'asc',
            },
        });
        res.status(200).send(events);
    } catch (e) {
        console.log(e);
    }
}

export async function fetchPastEvents(req: Request, res: Response) {
    const today = new Date();
    try {
        const events = await prisma.event.findMany({
            where: {
                start: {
                    lt: today,
                },
            },
            orderBy: {
                start: 'asc',
            },
        });
        res.status(200).send(events);
    } catch (e) {
        console.log(e);
    }
}
