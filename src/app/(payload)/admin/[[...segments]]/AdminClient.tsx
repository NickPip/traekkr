'use client'

import config from '@payload-config'
import { RootPage } from '@payloadcms/next/views'
import React from 'react'

import { importMap } from '../importMap'

type AdminClientProps = {
  params: { segments: string[] }
  searchParams: { [key: string]: string | string[] }
}

export function AdminClient({ params, searchParams }: AdminClientProps) {
  return RootPage({ config, params, searchParams, importMap })
}
