import { canCreateEvent, getSession, type IUser } from '../../utilities/user-permissions.ts';

export async function UserLandingPageLoader(): Promise<{ user: IUser | undefined; userCanCreateEvent: boolean }> {
    const user = await getSession();
    const userCanCreateEvent = await canCreateEvent();
    if (!user) {
        throw new Error('unauthenticated');
    }
    return { user, userCanCreateEvent };
}
