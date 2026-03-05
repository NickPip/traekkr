import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { RenderLexical } from '@/components/RenderLexical'
import { ShareButtons } from '@/components/ShareButtons'

import type { WriteUp } from '@/payload-types'

import '../../styles.css'

export const dynamic = 'force-dynamic'

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
  const doc = result.docs?.[0] as WriteUp | undefined

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

  const hasLexicalDescription =
    doc.description &&
    typeof doc.description === 'object' &&
    'root' in doc.description &&
    doc.description.root?.children?.length

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
          {hasLexicalDescription ? (
            <RenderLexical content={doc.description as Parameters<typeof RenderLexical>[0]['content']} />
          ) : (
            <p className="traekkr-popup-description">
              {typeof doc.description === 'string' ? doc.description : ''}
            </p>
          )}
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
