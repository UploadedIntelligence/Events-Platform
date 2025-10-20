import { createAuthClient } from 'better-auth/react';
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';

export default createAuthClient({
    baseURL: 'https://events-platform-2-f7qv.onrender.com',
    plugins: [
        inferAdditionalFields({
            user: {
                role: {
                    type: 'string',
                },
                staffApplication: {
                    type: 'boolean',
                    defaultValue: false,
                },
            },
        }),
        adminClient(),
    ],
});
