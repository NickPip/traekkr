/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

import config from '@payload-config'
import { generatePageMetadata } from '@payloadcms/next/views'

import { AdminClient } from './AdminClient'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const AdminClientDynamic = dynamic(
  () => Promise.resolve(AdminClient),
  { ssr: false },
)

export default async function Page({ params, searchParams }: Args) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ])
  return (
    <AdminClientDynamic
      params={resolvedParams}
      searchParams={resolvedSearchParams}
    />
  )
}
