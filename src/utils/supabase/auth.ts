import { createClient } from './client'
import { User } from '@supabase/supabase-js'

export async function signUp(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) {
    console.error('Error signing up:', error)
    throw new Error(error.message)
  }
  
  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    console.error('Error signing in:', error)
    throw new Error(error.message)
  }
  
  return data
}

export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error)
    throw new Error(error.message)
  }
  
  return true
}

export async function getCurrentUser() {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  return session?.user || null
}
