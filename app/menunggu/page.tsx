// app/menunggu/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getApplications } from '@/lib/storage'
import MenungguClient from './MenungguClient'

export const dynamic = 'force-dynamic'

export default async function MenungguPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  // Kalau Clerk session sudah punya role MEMBER/ADMIN, langsung redirect
  // Ini handle kasus: admin sudah ACC, user refresh halaman ini
  const clerkUser = await currentUser()
  const clerkRole = clerkUser?.publicMetadata?.role as string | undefined
  if (clerkRole === 'MEMBER') redirect('/member')
  if (clerkRole === 'ADMIN') redirect('/admin')

  // Cek apakah sudah isi form pendaftaran
  const application = getApplications().find(a => (a as any).userId === userId) ?? null
  const status = application?.status ?? null

  return <MenungguClient status={status} hasApplied={!!application} />
}
