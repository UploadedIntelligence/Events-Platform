import { canCreateEvent, getSession, type IUser } from '../../../utilities/user-permissions.ts';
import { redirect } from 'react-router-dom';

export async function CreateEventLoader(): Promise<IUser | Response> {
    const user = await getSession();
    const userCanCreateEvent = await canCreateEvent();

    if (!user || !userCanCreateEvent) {
        return redirect('/');
    }

    return user;
}
