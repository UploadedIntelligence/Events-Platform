import authClient from '../services/auth-client.ts';

export interface IUser {
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
}

export function getSession(): IUser | undefined {
    return authClient.useSession()?.data?.user;
}
