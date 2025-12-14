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
