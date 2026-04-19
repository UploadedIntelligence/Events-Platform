import { canCreateEvent, getSession, type IUser } from '../../utilities/user-permissions.ts';

export async function LandingPageLoader(): Promise<{ user: IUser | undefined; hasPermission: boolean }> {
    const user = await getSession();
    const hasPermission = await canCreateEvent();
    return { user, hasPermission };
}
