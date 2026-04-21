import { canCreateEvent, getSession, type IUser } from '../../utilities/user-permissions.ts';
import { redirect } from 'react-router-dom';
import { routePaths } from '../../routes.ts';

export async function UserLandingPageLoader(): Promise<
    { user: IUser | undefined; userCanCreateEvent: boolean } | Response
> {
    const user = await getSession();
    const userCanCreateEvent = await canCreateEvent();
    if (!user) {
        return redirect(routePaths.login.build());
    }
    return { user, userCanCreateEvent };
}
