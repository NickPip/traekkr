import Link from 'next/link'
import React from 'react'

import { BackButton } from '@/components/BackButton'
import { ContactForm } from '@/components/ContactForm'

import '../styles.css'

export default function ContactPage() {
  return (
    <section className="traekkr-section traekkr-contact">
      <nav className="traekkr-services-nav">
        <Link href="/" className="traekkr-services-link">
          home
        </Link>
        <h1 className="traekkr-services-title">Contact</h1>
        <BackButton className="traekkr-services-link" />
      </nav>
      <ContactForm />
    </section>
  )
}
