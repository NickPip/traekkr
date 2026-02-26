import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { ServicesListWithModal } from '@/components/ServicesListWithModal'

import '../styles.css'

export const dynamic = 'force-dynamic'

type ServiceDoc = {
  id: string
  title: string
  description?: string | null
  targetItems?: { item: string }[] | null
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
      <ServicesListWithModal services={services} />
    </section>
  )
}
