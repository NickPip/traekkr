import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import { RenderLexical } from '@/components/RenderLexical'
import { ShareButtons } from '@/components/ShareButtons'
import {
  formatPublishedDate,
  publishedDateFormatLong,
} from '@/lib/format-published-date'

import type { WriteUp } from '@/payload-types'

import '../../styles.css'

export const dynamic = 'force-dynamic'

interface WriteUpPageProps {
  params: Promise<{ slug: string }>
}

export default async function WriteUpPage(props: WriteUpPageProps) {
  const { params } = props
  const { slug } = await params

  const payload = await getPayload({ config: await configPromise })
  const result = await payload.find({
    collection: 'write-ups',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const doc = result.docs?.[0] as WriteUp | undefined

  if (!doc) notFound()

  const footerDateLabel = formatPublishedDate(
    doc.publishedDate,
    publishedDateFormatLong,
  )

  const hasLexicalDescription =
    doc.description &&
    typeof doc.description === 'object' &&
    'root' in doc.description &&
    doc.description.root?.children?.length

  return (
    <section className="traekkr-section traekkr-writeup-standalone">
      <article className="traekkr-writeup-article">
        <header className="traekkr-writeup-header">
          <h1 className="traekkr-writeup-title">{doc.title ?? ''}</h1>
        </header>

        <div className="traekkr-writeup-body">
          {hasLexicalDescription ? (
            <RenderLexical
              content={
                doc.description as Parameters<
                  typeof RenderLexical
                >[0]['content']
              }
            />
          ) : (
            <p className="traekkr-writeup-description">
              {typeof doc.description === 'string' ? doc.description : ''}
            </p>
          )}
        </div>

        <footer className="traekkr-writeup-footer">
          <div className="traekkr-writeup-footer-inner">
            <ShareButtons
              url={`/write-ups/${doc.slug ?? ''}`}
              title={doc.title ?? ''}
            />
            <div className="traekkr-writeup-meta traekkr-writeup-meta-footer">
              {footerDateLabel ? (
                <time dateTime={doc.publishedDate ?? ''}>
                  {footerDateLabel}
                </time>
              ) : null}
              <span className="traekkr-writeup-author">{doc.author ?? ''}</span>
            </div>
          </div>
        </footer>
      </article>
    </section>
  )
}

