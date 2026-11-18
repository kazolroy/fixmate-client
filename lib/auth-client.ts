'use client';

import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: 'string', required: false },
        phone: { type: 'string', required: false },
        area: { type: 'string', required: false },
        bio: { type: 'string', required: false },
      },
    }),
  ],
});
