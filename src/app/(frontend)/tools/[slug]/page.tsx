import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import {
  formatPublishedDate,
  publishedDateFormatLong,
} from '@/lib/format-published-date'

import '../../styles.css'

export const dynamic = 'force-dynamic'

type ToolDoc = {
  id: string
  title?: string | null
  slug?: string | null
  publishedDate?: string | null
  link?: string | null
  description?: string | null
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: await configPromise })
  const result = await payload.find({
    collection: 'tools',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const doc = result.docs?.[0] as ToolDoc | undefined

  if (!doc) {
    const { notFound } = await import('next/navigation')
    notFound()
  }

  // doc is defined here (notFound() throws)
  const pageDoc = doc as ToolDoc

  const metaDateLabel = formatPublishedDate(
    pageDoc.publishedDate,
    publishedDateFormatLong,
  )

  let linkHostname = pageDoc.link ?? ''
  try {
    if (pageDoc.link) linkHostname = new URL(pageDoc.link).hostname
  } catch {
    // leave as-is if invalid URL
  }

  return (
    <div className="traekkr-popup-overlay">
      <article className="traekkr-popup">
        <Link
          href="/tools"
          className="traekkr-popup-close"
          aria-label="Close"
        >
          ×
        </Link>

        <header className="traekkr-popup-header">
          <h1 className="traekkr-popup-title">{pageDoc.title ?? ''}</h1>
          <div className="traekkr-popup-meta">
            {metaDateLabel ? (
              <time dateTime={pageDoc.publishedDate ?? ''}>
                {metaDateLabel}
              </time>
            ) : null}
          </div>
        </header>

        <div className="traekkr-popup-body">
          <p className="traekkr-popup-description">{pageDoc.description ?? ''}</p>
          {pageDoc.link ? (
            <a
              href={pageDoc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="traekkr-popup-link"
            >
              Open tool → {linkHostname}
            </a>
          ) : null}
        </div>
      </article>
    </div>
  )
}
