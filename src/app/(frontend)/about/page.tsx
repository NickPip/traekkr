import Link from 'next/link'
import React from 'react'

import { BackButton } from '@/components/BackButton'

import '../styles.css'

export default function AboutPage() {
  return (
    <section className="traekkr-section traekkr-about">
      <nav className="traekkr-services-nav">
        <Link href="/" className="traekkr-services-link">
          Home
        </Link>
        <h1 className="traekkr-services-title">About us</h1>
        <BackButton className="traekkr-services-link" />
      </nav>

      <div className="traekkr-about-list">
        <article className="traekkr-about-card">
          <h2 className="traekkr-about-heading">Who we are</h2>
          <div className="traekkr-about-body">
            <p>
              We are a team of cybersecurity professionals with deep experience
              in defense and critical infrastructure. Many of us have served in
              or worked closely with the <strong>Ministry of Defense</strong> and
              related institutions, giving us first-hand understanding of
              national security requirements and high-assurance environments.
            </p>
          </div>
        </article>

        <article className="traekkr-about-card">
          <h2 className="traekkr-about-heading">What we do</h2>
          <div className="traekkr-about-body">
            <p>
              We deliver security assessments, penetration testing, and
              advisory services tailored to organizations that need rigor and
              discretion. Our work spans government, defense, and private sector
              clients who require trusted partners with proven track records in
              sensitive contexts.
            </p>
          </div>
        </article>

        <article className="traekkr-about-card">
          <h2 className="traekkr-about-heading">Why us?</h2>
          <div className="traekkr-about-body">
            <p>
              Our background in defense and high-stakes environments means we
              combine technical excellence with the discipline and
              confidentiality your organization expects. We focus on outcomes
              that improve your security posture without unnecessary risk or
              exposure.
            </p>
          </div>
        </article>

        <div className="traekkr-about-cta">
          <p className="traekkr-about-cta-text">
            Prefer a <strong>face-to-face meeting</strong>? Send us a message
            via the contact form and we will get back to you to arrange it.
          </p>
          <Link href="/contact" className="traekkr-about-cta-btn">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}
