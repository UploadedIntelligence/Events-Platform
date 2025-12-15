import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { Request } from 'express';
import { IUserSession } from "./types";

export async function currentSession(req: Request): Promise<IUserSession | null> {
    return await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
}
