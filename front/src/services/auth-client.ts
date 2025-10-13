import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export default createAuthClient({
    baseURL: 'http://localhost:7000',
    plugins: [
        inferAdditionalFields({
            user: {
                role: {
                    type: 'string',
                },
            },
        }),
    ],
});
