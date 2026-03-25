'use client'

import React, { useState } from 'react'

const EMAIL_GENERAL = 'contact@traekkr.dev'
const EMAIL_PROJECTS = 'projects@traekkr.dev'

const PROJECT_TYPE_OPTIONS = [
  { value: '', label: 'Select project type…' },
  { value: 'vulnerability-research', label: 'Vulnerability Research' },
  { value: 'secure-code-audit', label: 'Secure Code Audit' },
  { value: 'penetration-test', label: 'Penetration Test' },
  { value: 'red-teaming', label: 'Red Teaming' },
  { value: 'sdlc-security-integration', label: 'SDLC Security Integration' },
  {
    value: 'threat-modeling-architecture',
    label: 'Threat Modeling & Architecture Analysis',
  },
] as const

interface InquiryKindMap {
  general: string
  project: string
}

const INQUIRY_LABELS: InquiryKindMap = {
  general: 'General communication',
  project: 'Project request',
}

export function ContactForm() {
  const [inquiryKind, setInquiryKind] = useState<'general' | 'project'>('general')
  const [projectType, setProjectType] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleInquiryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as 'general' | 'project'
    setInquiryKind(next)
    if (next === 'general') setProjectType('')
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const to = inquiryKind === 'project' ? EMAIL_PROJECTS : EMAIL_GENERAL
    const projectLabel =
      inquiryKind === 'project'
        ? PROJECT_TYPE_OPTIONS.find((o) => o.value === projectType)?.label ?? projectType
        : ''

    if (inquiryKind === 'project' && !projectType) return

    const subjectParts =
      inquiryKind === 'project'
        ? [`Project request${projectLabel && projectLabel !== 'Select project type…' ? `: ${projectLabel}` : ''}`, name ? `from ${name}` : '']
        : [`Contact`, name ? `from ${name}` : '']

    const subject = encodeURIComponent(subjectParts.filter(Boolean).join(' '))
    const bodyLines = [
      message,
      '',
      '---',
      `Inquiry: ${INQUIRY_LABELS[inquiryKind]}`,
      ...(inquiryKind === 'project' && projectLabel
        ? [`Project type: ${projectLabel}`]
        : []),
      `Name: ${name || '(no name)'}`,
      `Email: ${email || '(no email)'}`,
    ]

    const body = encodeURIComponent(bodyLines.join('\n'))
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
  }

  return (
    <div className="traekkr-contact-card">
      <header className="traekkr-contact-header">
        <p className="traekkr-contact-heading">Email us</p>
        <div className="traekkr-contact-email-boxes" role="list">
          <div className="traekkr-contact-email-box" role="listitem">
            <p className="traekkr-contact-box-label">General communication</p>
            <a
              href={`mailto:${EMAIL_GENERAL}`}
              className="traekkr-contact-email"
              aria-label={`Email ${EMAIL_GENERAL} for general communication`}
            >
              {EMAIL_GENERAL}
            </a>
          </div>
          <div className="traekkr-contact-email-box" role="listitem">
            <p className="traekkr-contact-box-label">Project requests</p>
            <a
              href={`mailto:${EMAIL_PROJECTS}`}
              className="traekkr-contact-email"
              aria-label={`Email ${EMAIL_PROJECTS} for project requests`}
            >
              {EMAIL_PROJECTS}
            </a>
          </div>
        </div>
      </header>

      <form className="traekkr-contact-form" onSubmit={handleSubmit}>
        <label className="traekkr-contact-label">
          <span className="traekkr-contact-label-text">Inquiry type</span>
          <select
            name="inquiryKind"
            className="traekkr-contact-input traekkr-contact-select"
            value={inquiryKind}
            onChange={handleInquiryChange}
            aria-label="Inquiry type"
          >
            <option value="general">General communication</option>
            <option value="project">Project request</option>
          </select>
        </label>

        {inquiryKind === 'project' ? (
          <label className="traekkr-contact-label">
            <span className="traekkr-contact-label-text">Project type</span>
            <select
              name="projectType"
              className="traekkr-contact-input traekkr-contact-select"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              required
              aria-label="Project type"
            >
              {PROJECT_TYPE_OPTIONS.map((opt) =>
                opt.value === '' ? (
                  <option key={opt.value} value="" disabled>
                    {opt.label}
                  </option>
                ) : (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ),
              )}
            </select>
          </label>
        ) : null}

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
          <span className="traekkr-contact-label-text">Text</span>
          <textarea
            name="message"
            className="traekkr-contact-input traekkr-contact-textarea"
            placeholder="Your message"
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
