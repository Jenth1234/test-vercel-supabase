'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

type SupabaseContextValue = {
  supabase: SupabaseClient;
  session: Session | null;
};

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

export function SupabaseProvider({
  children,
  initialSession
}: {
  children: React.ReactNode;
  initialSession: Session | null;
}) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [session, setSession] = useState<Session | null>(initialSession);

  useEffect(() => {
    const syncSession = async () => {
      const {
        data: { session: current }
      } = await supabase.auth.getSession();
      setSession(current);
    };

    syncSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return <SupabaseContext.Provider value={{ supabase, session }}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error('useSupabase must be used inside <SupabaseProvider>');
  }

  return context;
}
