import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import { BackButton } from '@/components/BackButton'
import { RenderLexical } from '@/components/RenderLexical'
import { ShareButtons } from '@/components/ShareButtons'
import {
  formatPublishedDate,
  publishedDateFormatLong,
  publishedDateFormatShort,
} from '@/lib/format-published-date'

import '../styles.css'

export const dynamic = 'force-dynamic'

interface WriteUpDoc {
  id: string
  title?: string | null
  slug?: string | null
  publishedDate?: string | null
  author?: string | null
  description?: unknown
}

interface WriteUpsListPageProps {
  searchParams?: Promise<{ slug?: string }>
}

export default async function WriteUpsListPage(props: WriteUpsListPageProps) {
  const searchParams = await props.searchParams
  const activeSlug = searchParams?.slug

  const payload = await getPayload({ config: await configPromise })
  const result = await payload.find({
    collection: 'write-ups',
    sort: '-publishedDate',
  })
  const writeUps = (result.docs ?? []) as WriteUpDoc[]

  const activeDoc = activeSlug
    ? writeUps.find((item) => item.slug === activeSlug)
    : undefined

  const activeDateLabel = activeDoc
    ? formatPublishedDate(activeDoc.publishedDate, publishedDateFormatLong)
    : ''

  const hasLexicalDescription =
    activeDoc &&
    activeDoc.description &&
    typeof activeDoc.description === 'object' &&
    'root' in activeDoc.description &&
    // @ts-expect-error – runtime check for lexical tree
    activeDoc.description.root?.children?.length

  return (
    <section className="traekkr-section traekkr-writeups">
      <nav className="traekkr-services-nav" aria-label="Write-Ups">
        <h1 className="traekkr-services-title">Write-Ups</h1>
        <div className="traekkr-services-actions">
          <Link href="/" className="traekkr-services-link">
            Home
          </Link>
          <BackButton className="traekkr-services-link" />
        </div>
      </nav>

      <div className="traekkr-writeups-list">
        {writeUps.map((item) => (
          <Link
            key={item.id}
            href={{ pathname: '/write-ups', query: { slug: item.slug } }}
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
              <span className="traekkr-writeup-author">{item.author ?? ''}</span>
            </div>
          </Link>
        ))}
      </div>

      {activeDoc && (
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
              <h1 className="traekkr-popup-title">{activeDoc.title ?? ''}</h1>
              <div className="traekkr-popup-meta">
                {activeDateLabel ? (
                  <time dateTime={activeDoc.publishedDate ?? ''}>
                    {activeDateLabel}
                  </time>
                ) : null}
                <span className="traekkr-popup-author">
                  {activeDoc.author ?? ''}
                </span>
              </div>
            </header>

            <div className="traekkr-popup-body">
              {hasLexicalDescription ? (
                <RenderLexical
                  // @ts-expect-error – lexical JSON shape
                  content={activeDoc.description}
                />
              ) : (
                <p className="traekkr-popup-description">
                  {typeof activeDoc.description === 'string'
                    ? activeDoc.description
                    : ''}
                </p>
              )}
            </div>

            <footer className="traekkr-popup-footer">
              <ShareButtons
                url={`/write-ups/${activeDoc.slug ?? ''}`}
                title={activeDoc.title ?? ''}
              />
            </footer>
          </article>
        </div>
      )}
    </section>
  )
}

