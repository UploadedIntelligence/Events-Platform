import authClient from './auth-client.ts';
import dayjs from 'dayjs';

export async function googleSignIn() {
    const today = dayjs().format('YYYY-MM-DD-HH');
    const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: import.meta.env.VITE_FRONT_END_URL + `?fromDate=${today}`,
        errorCallbackURL: import.meta.env.VITE_FRONT_END_URL,
        // can be added via authClient.linkSocial to ask user for calendar permission
        // rather than having it automatically when signed in via Google account
        scopes: [import.meta.env.VITE_GOOGLE_ALLOW_CALENDAR_ACCESS_SCOPE!],
    });
    if (error) {
        console.log('signIn Error:', error);
    }
}
