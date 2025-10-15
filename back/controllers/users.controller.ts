import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth';

export async function staffApplication(req: Request, res: Response) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user.id) {
        return res.status(401).json('Not authenticated');
    }

    const has_application = await prisma.staffApplication.findFirst({
        where: {
            userEmail: session!.user.email,
        },
    });

    if (has_application) {
        return res.status(400).json('Application pending');
    } else if (session!.user.role === 'user') {
        await prisma.staffApplication.create({
            data: {
                userEmail: session!.user.email,
            },
        });

        return res.status(200).json('Application successfully sent');
    } else {
        return res.status(401).json('You already have these permissions');
    }
}

export async function fetchApplications(req: Request, res: Response) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    });

    if (session?.user.role !== 'admin') {
        return res.status(401).json('Forbidden')
    }

    try {
        const applications = await prisma.staffApplication.findMany();
        console.log(applications)
        return res.status(200).json(applications)
    } catch (e) {
        return console.log(e)
    }
}
