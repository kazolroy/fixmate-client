import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';
import { db } from './mongo';

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  ...(process.env.EXTRA_TRUSTED_ORIGINS || '').split(','),
  'http://localhost:3000',
]
  .map((o) => (o || '').trim().replace(/\/$/, ''))
  .filter(Boolean);

const googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },
  ...(googleEnabled
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          },
        },
      }
    : {}),
  user: {
    additionalFields: {
      role: { type: 'string', required: false, defaultValue: 'customer', input: true },
      phone: { type: 'string', required: false, defaultValue: '', input: true },
      area: { type: 'string', required: false, defaultValue: '', input: true },
      bio: { type: 'string', required: false, defaultValue: '', input: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // SERVER-SIDE role rule: anything except exactly 'technician' becomes 'customer'.
        // Nobody can sign up as admin (the admin is created by the seed script).
        before: async (user) => ({
          data: { ...user, role: (user as { role?: string }).role === 'technician' ? 'technician' : 'customer' },
        }),
      },
      update: {
        // A user can never change their own role through BetterAuth's update-user endpoint.
        // Role changes only happen through the admin-protected Express API.
        before: async (data) => {
          const rest = { ...(data as Record<string, unknown>) };
          delete rest.role;
          return { data: rest };
        },
      },
    },
  },
  plugins: [nextCookies()],
});
