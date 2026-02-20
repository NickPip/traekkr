'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

import { BackButton } from '@/components/BackButton'

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
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const closeModal = useCallback(() => {
    setOpenService(null)
    setShowForm(false)
    setSubmitStatus('idle')
  }, [])

  const openModal = useCallback((service: ServiceItem) => {
    setOpenService(service)
    setShowForm(false)
    setSubmitStatus('idle')
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
              <p className="traekkr-service-target-label">Target</p>
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
                <p className="traekkr-service-target-label">Target</p>
                <p className="traekkr-service-target-list">
                  {openService.targetItems?.map((t) => t.item).join(', ') ?? '—'}
                </p>
                <button
                  type="button"
                  className="traekkr-modal-order-btn"
                  onClick={() => setShowForm(true)}
                >
                  Order service
                </button>
              </>
            ) : (
              <OrderForm
                serviceTitle={openService.title}
                onSuccess={() => setSubmitStatus('done')}
                onError={() => setSubmitStatus('error')}
                onSending={() => setSubmitStatus('sending')}
                submitStatus={submitStatus}
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
  onSuccess,
  onError,
  onSending,
  submitStatus,
  onBack,
}: {
  serviceTitle: string
  onSuccess: () => void
  onError: () => void
  onSending: () => void
  submitStatus: string
  onBack: () => void
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    onSending()
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
          serviceTitle,
        }),
      })
      if (res.ok) onSuccess()
      else onError()
    } catch {
      onError()
    }
  }

  if (submitStatus === 'done') {
    return (
      <div className="traekkr-order-success">
        <p>Thank you. Your order has been sent.</p>
        <p className="traekkr-order-success-note">
          We will contact you at the email you provided.
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
            disabled={submitStatus === 'sending'}
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
            disabled={submitStatus === 'sending'}
          />
        </label>
        <label className="traekkr-order-label">
          Message
          <textarea
            name="message"
            className="traekkr-order-input traekkr-order-textarea"
            placeholder="Tell us about your needs..."
            rows={4}
            disabled={submitStatus === 'sending'}
          />
        </label>
        {submitStatus === 'error' && (
          <p className="traekkr-order-error">Something went wrong. Please try again.</p>
        )}
        <div className="traekkr-order-actions">
          <button
            type="button"
            className="traekkr-modal-order-btn traekkr-order-btn-secondary"
            onClick={onBack}
            disabled={submitStatus === 'sending'}
          >
            Back
          </button>
          <button
            type="submit"
            className="traekkr-modal-order-btn"
            disabled={submitStatus === 'sending'}
          >
            {submitStatus === 'sending' ? 'Sending…' : 'Send order'}
          </button>
        </div>
      </form>
    </>
  )
}
