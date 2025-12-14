export interface EventInfoDO {
    name: string;
    description: string;
    location: string;
    start: Date;
    end: Date;
    imgUrl?: string | null | undefined;
}

export interface UserGoogleEventDO {
    googleId: string;
    userId: string;
    eventId: string;
}

export interface GoogleCalendarEventDO {
    data: {
        id?: string | null;
    } | void;
}

export type Role = 'user' | 'staff' | 'admin';

export type AdminResponse = 'approved' | 'rejected';

export interface IRoleRequest {
    id: string;
    userEmail: string;
    role: Role;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    rejectedAt?: Date | null;
}

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

export interface IUserSession {
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