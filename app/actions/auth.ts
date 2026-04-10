'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dhe fjalëkalimi janë të detyrueshëm.' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Email ose fjalëkalim i pasaktë.' }
  }

  redirect('/')
}

export async function register(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()

  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const kontoTyp = (formData.get('kontoTyp') as string) === 'biznes' ? 'biznes' : 'privat'
  const firmaName = (formData.get('firmaName') as string)?.trim() || null

  if (!fullName || !email || !password || !confirmPassword) {
    return { error: 'Të gjitha fushat janë të detyrueshme.' }
  }

  if (kontoTyp === 'biznes' && !firmaName) {
    return { error: 'Emri i firmës është i detyrueshëm për llogaritë tregtare.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Fjalëkalimet nuk përputhen.' }
  }

  if (password.length < 6) {
    return { error: 'Fjalëkalimi duhet të ketë të paktën 6 karaktere.' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, konto_typ: kontoTyp, firma_name: firmaName },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Ky email është tashmë i regjistruar.' }
    }
    return { error: 'Gabim gjatë regjistrimit. Provoni përsëri.' }
  }

  if (data.user && !data.session) {
    // Email confirmation required
    redirect('/register?success=confirm')
  }

  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
