'use client'

import { useRouter } from 'next/navigation'

export function BackButton({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      className={className}
      onClick={() => router.back()}
    >
      back
    </button>
  )
}
