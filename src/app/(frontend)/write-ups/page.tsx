import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import { BackButton } from '@/components/BackButton'

import '../styles.css'

type WriteUpDoc = {
  id: string
  title: string
  slug: string
  publishedDate: string
  author: string
}

export default async function WriteUpsListPage() {
  const payload = await getPayload({ config: await configPromise })
  const result = await payload.find({
    collection: 'write-ups',
    sort: '-publishedDate',
  })
  const writeUps = (result.docs ?? []) as WriteUpDoc[]

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <section className="traekkr-section traekkr-writeups">
      <nav className="traekkr-services-nav">
        <Link href="/" className="traekkr-services-link">
          Home
        </Link>
        <h1 className="traekkr-services-title">Write-Ups</h1>
        <BackButton className="traekkr-services-link" />
      </nav>

      <div className="traekkr-writeups-list">
        {writeUps.length === 0 ? (
          <p className="traekkr-services-empty">
            No write-ups yet. Add them in the{' '}
            <Link href="/admin/collections/write-ups">admin</Link>.
          </p>
        ) : (
          writeUps.map((item) => (
            <Link
              key={item.id}
              href={`/write-ups/${item.slug}`}
              className="traekkr-writeup-block"
            >
              <h2 className="traekkr-writeup-title">{item.title}</h2>
              <div className="traekkr-writeup-meta">
                <span className="traekkr-writeup-date">
                  {formatDate(item.publishedDate)}
                </span>
                <span className="traekkr-writeup-author">{item.author}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  )
}
