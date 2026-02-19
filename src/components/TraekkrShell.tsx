'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MENU_ITEMS = [
  { id: 'Services', label: 'Services', letter: 'S', href: '/services' },
  { id: 'Write-Ups', label: 'Write-Ups', letter: 'W', href: '/write-ups' },
  { id: 'Tools', label: 'Tools', letter: 'T', href: '/tools' },
  { id: 'Contact', label: 'Contact', letter: 'C', href: '/contact' },
  { id: 'About', label: 'About', letter: 'A', href: '/about' },
] as const

function getActiveSectionFromPath(pathname: string): string {
  if (pathname === '/services') return 'Services'
  if (pathname === '/write-ups') return 'Write-Ups'
  if (pathname === '/tools') return 'Tools'
  if (pathname === '/contact') return 'Contact'
  if (pathname === '/about') return 'About'
  return ''
}

export function TraekkrShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const currentSection = getActiveSectionFromPath(pathname)

  return (
    <div className="traekkr">
      <div className="traekkr-bg" aria-hidden />
      <div className="traekkr-overlay" aria-hidden />

      <header className="traekkr-header">
        <Link href="/" className="traekkr-logo">
          Traekkr
        </Link>
      </header>

      {isHome && (
        <nav className="traekkr-nav" aria-label="Main">
          {MENU_ITEMS.map((item) => (
            <React.Fragment key={item.id}>
              <div
                className="traekkr-nav-letter"
                data-active={currentSection === item.id}
              >
                {item.letter}
              </div>
              <Link
                href={item.href}
                className="traekkr-nav-btn"
                data-active={currentSection === item.id}
              >
                {item.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      )}

      {children}
    </div>
  )
}
