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

export async function getSession(): Promise<IUser | undefined> {
    return (await authClient.getSession()).data?.user;
}

export async function canCreateEvent(): Promise<boolean> {
    const user: IUser | undefined = await getSession();
    if (!user) {
        return false;
    }
    return user.role === 'admin' || user.role === 'staff';
}
