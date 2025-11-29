import { Request, Response } from 'express';
import { currentSession } from '../utilities/user-session';
import {
    adminShowRoleRequestsService,
    deleteUserService,
    updateUserRoleRequestService,
    updateUserRoleService,
    userCreateRoleRequestService,
    userHasRoleRequestService,
} from '../services/users.service';

export async function roleRequest(req: Request, res: Response) {
    const { role } = req.body;
    const session = await currentSession(req);

    if (!session) {
        return res.status(401).json('Not authenticated');
    }

    const has_application = await userHasRoleRequestService(session);

    if (has_application) {
        return res.status(400).json('You cannot send more than 1 application');
    } else if (session.user.role === 'user') {
        await userCreateRoleRequestService(session, role);

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
    const { applicant_email, role, response } = req.body;

    if (session?.user.role !== 'admin') {
        return res.status(401).json('Forbidden');
    }

    try {
        await updateUserRoleRequestService(applicant_email, response);
        await updateUserRoleService(applicant_email, role, response);
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
