import prisma from '../lib/prisma';
import { UserSession } from '../utilities/user-session';
import { google } from 'googleapis';
import { Prisma } from '@prisma/client/extension';
import PrismaPromise = Prisma.PrismaPromise;
import { IRoleRequest, IUserThirdPartyAccount, type Role, type AdminResponse } from '../utilities/types';

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

export function userHasRoleRequestService(session: UserSession): PrismaPromise<IRoleRequest | null> {
    return prisma.roleRequest.findFirst({
        where: {
            userEmail: session!.user.email,
        },
    });
}

export function userCreateRoleRequestService(session: UserSession, role: Role): PrismaPromise<IRoleRequest> {
    return prisma.roleRequest.create({
        data: {
            userEmail: session.user.email,
            role: role,
        },
    });
}

export function adminShowRoleRequestsService(): PrismaPromise<Array<IRoleRequest>> {
    return prisma.roleRequest.findMany({
        orderBy: [
            {
                createdAt: 'desc',
            },
        ],
    });
}

export function updateUserRoleRequestService(
    applicant_email: string,
    response: AdminResponse,
): PrismaPromise<IRoleRequest> {
    return prisma.roleRequest.update({
        where: {
            userEmail: applicant_email,
        },
        data: {
            status: response,
        },
    });
}

export function updateUserRoleService(
    applicant_email: string,
    role: Role,
    response: AdminResponse,
): PrismaPromise<UserSession['user']> {
    return prisma.user.update({
        where: {
            email: applicant_email,
        },
        data: {
            role: response === 'approved' ? role : 'user',
        },
    });
}

export function deleteUserService(session: UserSession): PrismaPromise<UserSession['user']> {
    return prisma.user.delete({
        where: {
            email: session.user.email,
        },
    });
}
