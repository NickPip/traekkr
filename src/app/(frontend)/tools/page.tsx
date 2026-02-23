import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import { BackButton } from '@/components/BackButton'

import '../styles.css'

type ToolDoc = {
  id: string
  title: string
  slug: string
  publishedDate: string
  link: string
}

export default async function ToolsListPage() {
  const payload = await getPayload({ config: await configPromise })
  const result = await payload.find({
    collection: 'tools',
    sort: '-publishedDate',
  })
  const tools = (result.docs ?? []) as ToolDoc[]

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
    <section className="traekkr-section traekkr-tools">
      <nav className="traekkr-services-nav">
        <Link href="/" className="traekkr-services-link">
          Home
        </Link>
        <h1 className="traekkr-services-title">Tools</h1>
        <BackButton className="traekkr-services-link" />
      </nav>

      <div className="traekkr-tools-list">
        {tools.length === 0 ? (
          <p className="traekkr-services-empty">
            No tools yet. Add them in the{' '}
            <Link href="/admin/collections/tools">admin</Link>.
          </p>
        ) : (
          tools.map((item) => (
            <Link
              key={item.id}
              href={`/tools/${item.slug}`}
              className="traekkr-tool-block"
            >
              <h2 className="traekkr-tool-title">{item.title}</h2>
              <div className="traekkr-tool-meta">
                <span className="traekkr-tool-date">
                  {formatDate(item.publishedDate)}
                </span>
                <span className="traekkr-tool-link" title={item.link}>
                  {(() => {
                    try {
                      return new URL(item.link).hostname
                    } catch {
                      return 'Link'
                    }
                  })()}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  )
}
