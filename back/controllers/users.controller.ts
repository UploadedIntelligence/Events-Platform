import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth';

export async function roleRequest(req: Request, res: Response) {
    const { role } = req.body;
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user.id) {
        return res.status(401).json('Not authenticated');
    }

    const has_application = await prisma.roleRequest.findFirst({
        where: {
            userEmail: session!.user.email,
        },
    });

    if (has_application) {
        return res.status(400).json('You cannot send more than 1 applications');
    } else if (session!.user.role === 'user') {
        await prisma.roleRequest.create({
            data: {
                userEmail: session!.user.email,
                role: role,
            },
        });

        return res.status(200).json('Application successfully sent');
    } else {
        return res.status(401).json('You already have these permissions');
    }
}

export async function fetchApplications(req: Request, res: Response) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (session?.user.role !== 'admin') {
        return res.status(401).json('Forbidden');
    }

    try {
        const applications = await prisma.roleRequest.findMany({
            orderBy: [
                {
                    createdAt: 'desc',
                },
            ],
        });
        console.log(applications);
        return res.status(200).json(applications);
    } catch (e) {
        return console.log(e);
    }
}

export async function applicationResponse(req: Request, res: Response) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    const { applicant_email, role, response } = req.body;

    if (session?.user.role !== 'admin') {
        return res.status(401).json('Forbidden');
    }

    try {
        await prisma.roleRequest.update({
            where: {
                userEmail: applicant_email,
            },
            data: {
                status: response,
            },
        });

        if (response === 'approved') {
            await prisma.user.update({
                where: {
                    email: applicant_email,
                },
                data: {
                    role: role,
                },
            });
        }

        res.status(200).json('Application status successfully updated');
    } catch (e) {
        return res.status(401).json('Forbidden');
    }
}
