import { z } from 'zod';

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});

if (!parsed.success) {
  console.error('❌ Missing public env variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid NEXT_PUBLIC_* environment variables.');
}

export const publicEnv = {
  supabaseUrl: parsed.data.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY
};
