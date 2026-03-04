import Link from 'next/link'
import React from 'react'

import { BackButton } from '@/components/BackButton'
import { ContactForm } from '@/components/ContactForm'

import '../styles.css'

export default function ContactPage() {
  return (
    <section className="traekkr-section traekkr-contact">
      <nav className="traekkr-services-nav" aria-label="Contact">
        <h1 className="traekkr-services-title">Contact</h1>
        <div className="traekkr-services-actions">
          <Link href="/" className="traekkr-services-link">
            Home
          </Link>
          <BackButton className="traekkr-services-link" />
        </div>
      </nav>
      <ContactForm />
    </section>
  )
}
