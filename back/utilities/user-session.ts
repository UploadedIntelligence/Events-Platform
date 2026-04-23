import { auth } from '../lib/auth.js';
import { fromNodeHeaders } from 'better-auth/node';
import { Request } from 'express';
import { IUserSession } from './types.js';

export async function currentSession(req: Request): Promise<IUserSession | null> {
    return await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
}
