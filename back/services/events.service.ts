import prisma from '../lib/prisma'

export async function createEventService(data: {
    eventName: string,
    description: string,
    city: string,
    startTime: string,
    endTime: string
}) {
    return prisma.event.create({
        data: {
            name: data.eventName,
            description: data.description,
            location: data.city,
            start: data.startTime,
            end: data.endTime,
        },
    });
}