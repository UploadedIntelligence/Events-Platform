import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { Request } from 'express';

export interface UserSession {
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
        impersonatedBy?: string | null | undefined;
    };
    user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image?: string | null | undefined;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        banned: boolean | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}

export async function currentSession(req: Request): Promise<UserSession | null> {
    return await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
}
