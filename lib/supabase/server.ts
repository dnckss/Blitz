import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // For admin ops, replace with service role in a secure server env if needed.
  return createClient(url, key, { auth: { persistSession: false } })
}
