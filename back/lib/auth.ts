import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './prisma';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
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
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            scope: ['https://www.googleapis.com/auth/calendar.events'],
            accessType: 'offline',
            prompt: 'consent',
        },
    },
    trustedOrigins: ['http://localhost:5173'],
});
