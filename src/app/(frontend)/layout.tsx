import React from 'react'

import { TraekkrShell } from '@/components/TraekkrShell'

import './theme.css'
import './styles.css'

export const metadata = {
  description: 'Traekkr – Security consulting.',
  title: 'Traekkr',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>
          <TraekkrShell>{children}</TraekkrShell>
        </main>
      </body>
    </html>
  )
}
