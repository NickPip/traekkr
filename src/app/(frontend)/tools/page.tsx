import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import { BackButton } from '@/components/BackButton'
import {
  formatPublishedDate,
  publishedDateFormatShort,
} from '@/lib/format-published-date'

import '../styles.css'

export const dynamic = 'force-dynamic'

type ToolDoc = {
  id: string
  title?: string | null
  slug?: string | null
  publishedDate?: string | null
  link?: string | null
}

function getToolLinkHostname(link: string | null | undefined): string | null {
  const trimmed = link?.trim()
  if (!trimmed) return null
  try {
    return new URL(trimmed).hostname
  } catch {
    return null
  }
}

export default async function ToolsListPage() {
  const payload = await getPayload({ config: await configPromise })
  const result = await payload.find({
    collection: 'tools',
    sort: '-publishedDate',
  })
  const tools = (result.docs ?? []) as ToolDoc[]

  return (
    <section className="traekkr-section traekkr-writeups">
      <nav className="traekkr-services-nav" aria-label="Tools">
        <h1 className="traekkr-services-title">Tools</h1>
        <div className="traekkr-services-actions">
          <Link href="/" className="traekkr-services-link">
            Home
          </Link>
          <BackButton className="traekkr-services-link" />
        </div>
      </nav>

      <div className="traekkr-writeups-list">
        {tools.length === 0 ? (
          <div className="traekkr-services-empty" aria-live="polite" />
        ) : (
          tools.map((item) => {
            const linkHostname = getToolLinkHostname(item.link)
            return (
              <Link
                key={item.id}
                href={`/tools/${item.slug ?? ''}`}
                className="traekkr-writeup-block"
              >
                <h2 className="traekkr-writeup-title">{item.title ?? ''}</h2>
                <div className="traekkr-writeup-meta">
                  <span className="traekkr-writeup-date">
                    {formatPublishedDate(
                      item.publishedDate,
                      publishedDateFormatShort,
                    )}
                  </span>
                  {linkHostname ? (
                    <span
                      className="traekkr-writeup-author"
                      title={item.link ?? undefined}
                    >
                      {linkHostname}
                    </span>
                  ) : null}
                </div>
              </Link>
            )
          })
        )}
      </div>
    </section>
  )
}
