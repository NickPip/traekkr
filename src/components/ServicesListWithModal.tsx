'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

import { BackButton } from '@/components/BackButton'

const ORDER_MAIL_TO = 'projects@traekkr.dev'

export type ServiceItem = {
  id: string
  title: string
  description?: string | null
  targetItems?: { item: string }[] | null
}

export function ServicesListWithModal({
  services,
}: {
  services: ServiceItem[]
}) {
  const [openService, setOpenService] = useState<ServiceItem | null>(null)
  const [showForm, setShowForm] = useState(false)

  const closeModal = useCallback(() => {
    setOpenService(null)
    setShowForm(false)
  }, [])

  const openModal = useCallback((service: ServiceItem) => {
    setOpenService(service)
    setShowForm(false)
  }, [])

  useEffect(() => {
    if (!openService) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openService, closeModal])

  return (
    <>
      <nav className="traekkr-services-nav" aria-label="Services">
        <h1 className="traekkr-services-title">Services</h1>
        <div className="traekkr-services-actions">
          <Link href="/" className="traekkr-services-link">
            Home
          </Link>
          <BackButton className="traekkr-services-link" />
        </div>
      </nav>

      <div className="traekkr-services-list">
        {services.length === 0 ? (
          <div className="traekkr-services-empty" aria-live="polite" />
        ) : (
          services.map((service) => (
            <article
              key={service.id}
              className="traekkr-service-block traekkr-service-block-clickable"
              onClick={() => openModal(service)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openModal(service)
                }
              }}
              role="button"
              tabIndex={0}
            >
              <h2 className="traekkr-service-title">{service.title}</h2>
              <p className="traekkr-service-target-label">Target:</p>
              <p className="traekkr-service-target-list">
                {service.targetItems?.map((t) => t.item).join(', ') ?? '—'}
              </p>
            </article>
          ))
        )}
      </div>

      {openService && (
        <div
          className="traekkr-modal-overlay"
          onClick={closeModal}
          onKeyDown={(e) => e.key === 'Escape' && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
        >
          <div
            className="traekkr-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="traekkr-modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>

            {!showForm ? (
              <>
                <h2 id="service-modal-title" className="traekkr-modal-title">
                  {openService.title}
                </h2>
                <p className="traekkr-service-target-label">Description</p>
                <p className="traekkr-modal-description">
                  {openService.description?.trim() || '—'}
                </p>
                <button
                  type="button"
                  className="traekkr-modal-order-btn"
                  onClick={() => setShowForm(true)}
                >
                  Request project
                </button>
              </>
            ) : (
              <OrderForm
                serviceTitle={openService.title}
                onBack={() => setShowForm(false)}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

function OrderForm({
  serviceTitle,
  onBack,
}: {
  serviceTitle: string
  onBack: () => void
}) {
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const subject = encodeURIComponent(`Order: ${serviceTitle}`)
    const body = encodeURIComponent(
      [
        message || '(no message)',
        '',
        '---',
        `Service: ${serviceTitle}`,
        `Name: ${name || '(no name)'}`,
        `Email: ${email || '(no email)'}`,
      ].join('\n'),
    )

    window.location.href = `mailto:${ORDER_MAIL_TO}?subject=${subject}&body=${body}`
    setDone(true)
  }

  if (done) {
    return (
      <div className="traekkr-order-success">
        <p>Your email app should open with a draft to {ORDER_MAIL_TO}.</p>
        <p className="traekkr-order-success-note">
          Send the message from there to complete your request. We will follow up at the address
          you entered in the form.
        </p>
      </div>
    )
  }

  return (
    <>
      <h2 className="traekkr-modal-title">Order: {serviceTitle}</h2>
      <form className="traekkr-order-form" onSubmit={handleSubmit}>
        <label className="traekkr-order-label">
          Name *
          <input
            type="text"
            name="name"
            required
            className="traekkr-order-input"
            placeholder="Your name"
            autoComplete="name"
          />
        </label>
        <label className="traekkr-order-label">
          Email *
          <input
            type="email"
            name="email"
            required
            className="traekkr-order-input"
            placeholder="your@email.com"
            autoComplete="email"
          />
        </label>
        <label className="traekkr-order-label">
          Message
          <textarea
            name="message"
            className="traekkr-order-input traekkr-order-textarea"
            placeholder="Tell us about your needs..."
            rows={4}
          />
        </label>
        <div className="traekkr-order-actions">
          <button type="button" className="traekkr-modal-order-btn traekkr-order-btn-secondary" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="traekkr-modal-order-btn">
            Send order
          </button>
        </div>
      </form>
    </>
  )
}
