import { IUserThirdPartyAccount } from './types.js';
import { fetchUserAccount, getUserGoogleClientService } from '../services/users.service.js';
import { calendar_v3, google } from 'googleapis';

export async function generateUserGoogleCalendar(userId: string): Promise<calendar_v3.Calendar | undefined> {
    const googleAccount: IUserThirdPartyAccount | null = await fetchUserAccount(userId, 'google');

    if (googleAccount?.accessToken) {
        const client = getUserGoogleClientService(googleAccount);

        return google.calendar({ version: 'v3', auth: client });
    }
}
