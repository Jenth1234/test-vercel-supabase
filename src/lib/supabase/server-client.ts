import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { env } from '@/lib/env';
import { publicEnv } from '@/lib/public-env';

const withDefaults = (options: CookieOptions = {}) => ({
  ...options,
  path: options.path ?? '/',
  sameSite: options.sameSite ?? 'lax'
});

type MutableCookies = {
  getAll(): { name: string; value: string }[];
  set(cookie: { name: string; value: string } & CookieOptions): void;
};

const getMutableCookies = async () => (await cookies()) as unknown as MutableCookies;

export async function createSupabaseServerClient() {
  return createServerClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    cookies: {
      getAll: async () => {
        const store = await getMutableCookies();
        return store.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll: async (cookieList) => {
        const store = await getMutableCookies();
        cookieList.forEach(({ name, value, options }) => {
          store.set({ name, value, ...withDefaults(options) });
        });
      }
    }
  });
}

export function createSupabaseServiceRoleClient() {
  return createServerClient(publicEnv.supabaseUrl, env.SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {
      getAll: async () => null
    }
  });
}
