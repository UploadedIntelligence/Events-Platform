import { NextFunction, Request, Response } from 'express';
import { IUserSession } from '../utilities/types.js';
import { currentSession } from '../utilities/user-session.js';
import * as z from 'zod';

const zAuthorizedEventCreatorRoles = z.literal(['admin', 'staff']);
const zAdminPermissions = z.literal('admin');

export async function authenticateSession(req: Request, res: Response, next: NextFunction) {
    const session: IUserSession | null = await currentSession(req);

    if (!session || session.user.role === 'user') {
        return res.status(401).json('Not authenticated');
    }

    res.locals.session = session;
    next();
}

export async function userStaffPermissions(req: Request, res: Response, next: NextFunction) {
    const session: IUserSession | null = await currentSession(req);

    if (!session || !zAuthorizedEventCreatorRoles.safeParse(session.user.role).success) {
        return res.status(401).json('Not authenticated');
    }

    res.locals.session = session;
    next();
}

export async function userAdminPermissions(req: Request, res: Response, next: NextFunction) {
    const session: IUserSession | null = await currentSession(req);

    if (!session || !zAdminPermissions.safeParse(session.user.role).success) {
        return res.status(401).json('Not authenticated');
    }

    res.locals.session = session;
    next();
}