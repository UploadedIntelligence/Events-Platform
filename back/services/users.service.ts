import prisma from '../lib/prisma';
import { UserSession } from '../utilities/user-session';
import { google } from 'googleapis';

export interface IUserThirdPartyAccount {
    id: string;
    accountId: string;
    providerId: string;
    userId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    idToken?: string | null;
    accessTokenExpiresAt?: Date | null;
    refreshTokenExpiresAt?: Date | null;
    scope?: string | null;
    password?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function getUserAccountService(
    session: UserSession,
    provider: string,
): Promise<IUserThirdPartyAccount | null> {
    return prisma.account.findFirst({
        where: {
            userId: session.user.id,
            providerId: provider,
        },
    });
}

export function getUserGoogleClientService(userAccount: IUserThirdPartyAccount) {
    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI,
    );
    client.setCredentials({
        access_token: userAccount.accessToken ?? null,
        refresh_token: userAccount.refreshToken ?? null,
    });
    return client;
}
