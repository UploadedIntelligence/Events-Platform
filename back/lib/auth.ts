import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import prisma from './prisma';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    baseURL: process.env.SERVER_URL!,
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
            scope: [process.env.GOOGLE_SCOPE!],
            accessType: 'offline',
            prompt: 'consent',
        },
    },
    trustedOrigins: [process.env.FRONT_END_URL!],
});
