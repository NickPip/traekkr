import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { ShareButtons } from '@/components/ShareButtons'

import '../../styles.css'

export const dynamic = 'force-dynamic'

type WriteUpDoc = {
  id: string
  title: string
  slug: string
  publishedDate: string
  author: string
  description: string
}

export default async function WriteUpPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: await configPromise })
  const result = await payload.find({
    collection: 'write-ups',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const doc = result.docs?.[0] as WriteUpDoc | undefined

  if (!doc) notFound()

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

  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/write-ups/${doc.slug}`
      : `https://example.com/write-ups/${doc.slug}`

  return (
    <div className="traekkr-popup-overlay">
      <article className="traekkr-popup">
        <Link
          href="/write-ups"
          className="traekkr-popup-close"
          aria-label="Close"
        >
          ×
        </Link>

        <header className="traekkr-popup-header">
          <h1 className="traekkr-popup-title">{doc.title}</h1>
          <div className="traekkr-popup-meta">
            <time dateTime={doc.publishedDate}>
              {formatDate(doc.publishedDate)}
            </time>
            <span className="traekkr-popup-author">{doc.author}</span>
          </div>
        </header>

        <div className="traekkr-popup-body">
          <p className="traekkr-popup-description">{doc.description}</p>
        </div>

        <footer className="traekkr-popup-footer">
          <ShareButtons
            url={`/write-ups/${doc.slug}`}
            title={doc.title}
          />
        </footer>
      </article>
    </div>
  )
}
