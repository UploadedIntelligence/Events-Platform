import { createAuthClient } from 'better-auth/react';
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';

export default createAuthClient({
    baseURL: 'http://localhost:7000',
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
