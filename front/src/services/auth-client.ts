import { createAuthClient } from 'better-auth/react';
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';

export default createAuthClient({
    baseURL: import.meta.env.VITE_SERVER_URL,
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
