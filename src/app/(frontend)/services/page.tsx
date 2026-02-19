import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import { BackButton } from '@/components/BackButton'

import '../styles.css'

type ServiceDoc = {
  id: string
  title: string
  targetItems?: { item: string }[]
}

export default async function ServicesPage() {
  const payload = await getPayload({ config: await configPromise })
  const result = await payload.find({
    collection: 'services',
    sort: 'createdAt',
  })
  const services = (result.docs ?? []) as ServiceDoc[]

  return (
    <section className="traekkr-section traekkr-services">
      <nav className="traekkr-services-nav">
        <Link href="/" className="traekkr-services-link">
          home
        </Link>
        <h1 className="traekkr-services-title">Services</h1>
        <BackButton className="traekkr-services-link" />
      </nav>

      <div className="traekkr-services-list">
        {services.length === 0 ? (
          <p className="traekkr-services-empty">
            No services yet. Add them in the{' '}
            <Link href="/admin/collections/services">admin</Link>.
          </p>
        ) : (
          services.map((service) => (
            <article key={service.id} className="traekkr-service-block">
              <h2 className="traekkr-service-title">{service.title}</h2>
              <p className="traekkr-service-target-label">Target</p>
              <p className="traekkr-service-target-list">
                {service.targetItems?.map((t) => t.item).join(', ') ?? '—'}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
