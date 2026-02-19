'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MENU_ITEMS = [
  { id: 'Services', label: 'Services', letter: 'S', href: '/services' },
  { id: 'Write-Ups', label: 'Write-Ups', letter: 'W', href: '/write-ups' },
  { id: 'Tools', label: 'Tools', letter: 'T', href: '/tools' },
  { id: 'Contact', label: 'Contact', letter: 'C', href: '/contact' },
  { id: 'About', label: 'About', letter: 'A', href: '/about' },
] as const

const SECTION_CONTENT: Record<string, string> = {
  Services:
    'Professional web development, design, and consulting services tailored to your needs.',
  'Write-Ups':
    'In-depth articles, case studies, and documentation about our projects and insights.',
  Tools: "Custom tools and utilities we've built to streamline workflows and solve problems.",
  Contact:
    'Get in touch with us to discuss your project or learn more about what we do.',
  About:
    'Learn about our team, our mission, and what drives us to create exceptional work.',
}

function getActiveSectionFromPath(pathname: string): string {
  if (pathname === '/services') return 'Services'
  if (pathname === '/write-ups') return 'Write-Ups'
  if (pathname === '/tools') return 'Tools'
  if (pathname === '/contact') return 'Contact'
  if (pathname === '/about') return 'About'
  return 'Services'
}

export function TraekkrShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const pathSection = getActiveSectionFromPath(pathname)
  const [activeSection, setActiveSection] = useState(pathSection)

  const currentSection = isHome ? activeSection : pathSection

  return (
    <div className="traekkr">
      <div className="traekkr-bg" aria-hidden />
      <div className="traekkr-overlay" aria-hidden />

      {/* Brand */}
      <header className="traekkr-header">
        <Link href="/" className="traekkr-logo">
          Traekkr
        </Link>
      </header>

      {/* Navigation: one row per item so letter + label share same height */}
      <nav className="traekkr-nav" aria-label="Main">
        {MENU_ITEMS.map((item) => (
          <React.Fragment key={item.id}>
            <div
              className="traekkr-nav-letter"
              data-active={currentSection === item.id}
            >
              {item.letter}
            </div>
            {isHome ? (
              <button
                type="button"
                onClick={() => setActiveSection(item.id)}
                className="traekkr-nav-btn"
                data-active={currentSection === item.id}
              >
                {item.label}
              </button>
            ) : (
              <Link
                href={item.href}
                className="traekkr-nav-btn"
                data-active={currentSection === item.id}
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Content: card on home, page content elsewhere */}
      {isHome ? (
        <div className="traekkr-content-card">
          <h2 className="traekkr-content-title">{currentSection}</h2>
          <p className="traekkr-content-text">
            {SECTION_CONTENT[currentSection] ?? SECTION_CONTENT.Services}
          </p>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
