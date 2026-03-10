import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'

export function createServerClient() {
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const supabaseServer = createServerClient()
