'use client'

import React, { useState } from 'react'

const CONTACT_EMAIL = 'contact@traekkr.dev'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const subject = encodeURIComponent(`Contact from ${name || 'Traekkr site'}`)
    const body = encodeURIComponent(
      `${message}\n\n---\nFrom: ${name || '(no name)'}\nEmail: ${email || '(no email)'}`,
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <div className="traekkr-contact-card">
      <header className="traekkr-contact-header">
        <p className="traekkr-contact-heading">Email us</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="traekkr-contact-email"
          aria-label={`Email ${CONTACT_EMAIL}`}
        >
          {CONTACT_EMAIL}
        </a>
        <p className="traekkr-contact-heading">Get in touch</p>
      </header>

      <form className="traekkr-contact-form" onSubmit={handleSubmit}>
        <label className="traekkr-contact-label">
          <span className="traekkr-contact-label-text">Name</span>
          <input
            type="text"
            name="name"
            className="traekkr-contact-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </label>
        <label className="traekkr-contact-label">
          <span className="traekkr-contact-label-text">Email</span>
          <input
            type="email"
            name="email"
            className="traekkr-contact-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="traekkr-contact-label">
          <span className="traekkr-contact-label-text">Message</span>
          <textarea
            name="message"
            className="traekkr-contact-input traekkr-contact-textarea"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            required
          />
        </label>
        <button type="submit" className="traekkr-contact-submit">
          Send
        </button>
      </form>
    </div>
  )
}
