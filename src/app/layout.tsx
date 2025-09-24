import type { Metadata } from 'next';
import './globals.css';
import { SupabaseProvider } from '@/components/supabase-provider';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';

export const metadata: Metadata = {
  title: 'Supabase + Mikro-ORM Starter',
  description: 'Next.js 15 starter template with Supabase and Mikro-ORM configured for PostgreSQL.'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <SupabaseProvider initialSession={session}>
          <main className="wrapper">{children}</main>
        </SupabaseProvider>
      </body>
    </html>
  );
}
