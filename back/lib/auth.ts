import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import prisma from './prisma';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    baseURL: 'https://events-platform-2-f7qv.onrender.com',
    advanced: {
        defaultCookieAttributes: {
            sameSite: 'None', // this enables cross-site cookies
            secure: true, // required for SameSite=None
        },
    },
    user: {
        additionalFields: {
            role: {
                type: 'string',
                defaultValue: 'user',
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [admin()],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            scope: ['https://www.googleapis.com/auth/calendar.events'],
            accessType: 'offline',
            prompt: 'consent',
        },
    },
    trustedOrigins: ['https://clinquant-medovik-161e95.netlify.app'],
});
