import { getSession, type IUser } from '../../../utilities/user-permissions.ts';
import { redirect } from 'react-router-dom';

export async function UserProfileLoader(): Promise<IUser | Response> {
    const user = await getSession();

    if (!user) {
        return redirect('/');
    }

    return user;
}
