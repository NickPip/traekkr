import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import '../../styles.css'

export const dynamic = 'force-dynamic'

type ToolDoc = {
  id: string
  title: string
  slug: string
  publishedDate: string
  link: string
  description: string
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

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  let linkHostname = pageDoc.link
  try {
    linkHostname = new URL(pageDoc.link).hostname
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
          <h1 className="traekkr-popup-title">{pageDoc.title}</h1>
          <div className="traekkr-popup-meta">
            <time dateTime={pageDoc.publishedDate}>
              {formatDate(pageDoc.publishedDate)}
            </time>
          </div>
        </header>

        <div className="traekkr-popup-body">
          <p className="traekkr-popup-description">{pageDoc.description}</p>
          <a
            href={pageDoc.link}
            target="_blank"
            rel="noopener noreferrer"
            className="traekkr-popup-link"
          >
            Open tool → {linkHostname}
          </a>
        </div>
      </article>
    </div>
  )
}
