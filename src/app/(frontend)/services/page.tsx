import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { ServicesListWithModal } from '@/components/ServicesListWithModal'

import '../styles.css'

export const dynamic = 'force-dynamic'

type ServiceDoc = {
  id: string
  title: string
  sortOrder?: number | null
  description?: string | null
  targetItems?: { item: string }[] | null
  titleFontSizePx?: number | null
  descriptionFontSizePx?: number | null
}

export default async function ServicesPage() {
  const payload = await getPayload({ config: await configPromise })
  const result = await payload.find({
    collection: 'services',
    sort: 'sortOrder',
  })
  const services = (result.docs ?? []) as ServiceDoc[]

  return (
    <section className="traekkr-section traekkr-services">
      <ServicesListWithModal services={services} />
    </section>
  )
}
