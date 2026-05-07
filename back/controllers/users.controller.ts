import { Request, Response } from 'express';
import { currentSession } from '../utilities/user-session.js';
import {
    adminShowRoleRequestsService,
    deleteUserService,
    updateUserRoleRequestService,
    updateUserRoleService,
    userCreateRoleRequestService,
    userHasRoleRequestService,
} from '../services/users.service.js';
import * as z from 'zod';
import { type Role } from '../utilities/types.js';

const zRole = z.enum(['user', 'staff', 'admin']);

export async function roleRequest(req: Request, res: Response) {
    const { role } = req.body;
    const userRole: Role = zRole.parse(role);
    const session = await currentSession(req);

    if (!session) {
        return res.status(401).json('Not authenticated');
    }

    const hasApplication = await userHasRoleRequestService(session);

    if (hasApplication) {
        return res.status(400).json('You cannot send more than 1 application');
    } else if (session.user.role === 'user') {
        await userCreateRoleRequestService(session, userRole);

        return res.status(200).json('Application successfully sent');
    } else {
        return res.status(401).json('You already have these permissions');
    }
}

export async function fetchApplications(req: Request, res: Response) {
    const session = await currentSession(req);

    if (session?.user.role !== 'admin') {
        return res.status(401).json('Forbidden');
    }

    try {
        const applications = await adminShowRoleRequestsService();
        return res.status(200).json(applications);
    } catch (e) {
        return console.log(e);
    }
}

export async function applicationResponse(req: Request, res: Response) {
    const session = await currentSession(req);
    const { applicantEmail, role, response } = req.body;

    if (session?.user.role !== 'admin') {
        return res.status(401).json('Forbidden');
    }

    try {
        await updateUserRoleRequestService(applicantEmail, response);
        await updateUserRoleService(applicantEmail, role, response);
        return res.status(200).json('Application status successfully updated');
    } catch (e) {
        return res.status(401).json('Forbidden');
    }
}

export async function deleteAccount(req: Request, res: Response) {
    const session = await currentSession(req);

    if (!session) {
        return res.status(401).json('Not authenticated');
    }
    try {
        await deleteUserService(session);
        return res.status(200).json('User successfully deleted');
    } catch (e) {
        return res.status(401).json('Something went wrong');
    }
}
