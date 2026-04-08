import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import { BackButton } from '@/components/BackButton'
import { RenderLexical } from '@/components/RenderLexical'
import { fontSizePxToCss } from '@/lib/fontSizePx'
import type { About } from '@/payload-types'

import '../styles.css'

export const dynamic = 'force-dynamic'

type AboutSection = NonNullable<About['sections']>[number]

function getAboutSectionCardStyle(section: AboutSection): React.CSSProperties {
  const style: React.CSSProperties & Record<string, string> = {}
  const headingCss = fontSizePxToCss(section.headingFontSizePx)
  const contentCss = fontSizePxToCss(section.contentFontSizePx)

  if (headingCss) style['--traekkr-about-heading-size'] = headingCss

  if (contentCss) style['--traekkr-about-content-size'] = contentCss

  return style
}

function getAboutCtaBlockStyle(
  about: About | null | undefined,
): React.CSSProperties {
  const style: React.CSSProperties & Record<string, string> = {}
  const textCss = fontSizePxToCss(about?.ctaTextFontSizePx)
  const btnCss = fontSizePxToCss(about?.ctaButtonFontSizePx)
  if (textCss) style['--traekkr-about-cta-text-size'] = textCss
  if (btnCss) style['--traekkr-about-cta-btn-size'] = btnCss
  return style
}

function hasLexicalContent(
  value: unknown,
): value is { root: { children?: unknown[] } } {
  return (
    value != null &&
    typeof value === 'object' &&
    'root' in value &&
    typeof (value as { root?: unknown }).root === 'object' &&
    Array.isArray((value as { root: { children?: unknown[] } }).root?.children)
  )
}

const DEFAULT_SECTIONS = [
  {
    heading: 'Who we are',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'We are a team of cybersecurity professionals with deep experience in defense and critical infrastructure. Many of us have served in or worked closely with the ',
              },
              { type: 'text', text: 'Ministry of Defense', format: 1 },
              {
                type: 'text',
                text: ' and related institutions, giving us first-hand understanding of national security requirements and high-assurance environments.',
              },
            ],
          },
        ],
      },
    },
  },
  {
    heading: 'What we do',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'We deliver security assessments, penetration testing, and advisory services tailored to organizations that need rigor and discretion. Our work spans government, defense, and private sector clients who require trusted partners with proven track records in sensitive contexts.',
              },
            ],
          },
        ],
      },
    },
  },
  {
    heading: 'Why us?',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Our background in defense and high-stakes environments means we combine technical excellence with the discipline and confidentiality your organization expects. We focus on outcomes that improve your security posture without unnecessary risk or exposure.',
              },
            ],
          },
        ],
      },
    },
  },
] as unknown as AboutSection[]

const DEFAULT_CTA = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'text', text: 'Prefer a ' },
          { type: 'text', text: 'face-to-face meeting', format: 1 },
          {
            type: 'text',
            text: '? Send us a message via the contact form and we will get back to you to arrange it.',
          },
        ],
      },
    ],
  },
}

export default async function AboutPage() {
  const payload = await getPayload({ config: await configPromise })
  const about = await payload.findGlobal({
    slug: 'about',
  })

  const sections: AboutSection[] =
    (about?.sections?.length ?? 0) > 0
      ? (about.sections as AboutSection[])
      : DEFAULT_SECTIONS
  const hasAboutData = (about?.sections?.length ?? 0) > 0
  const ctaText =
    hasAboutData && about?.ctaText && hasLexicalContent(about.ctaText)
      ? about.ctaText
      : DEFAULT_CTA
  const ctaButtonText = about?.ctaButtonText ?? 'Contact us'
  const ctaButtonHref = about?.ctaButtonHref ?? '/contact'

  return (
    <section className="traekkr-section traekkr-about">
      <nav className="traekkr-services-nav" aria-label="About">
        <h1 className="traekkr-services-title">About us</h1>
        <div className="traekkr-services-actions">
          <Link href="/" className="traekkr-services-link">
            Home
          </Link>
          <BackButton className="traekkr-services-link" />
        </div>
      </nav>

      <div className="traekkr-about-list">
        {sections.map((section, index) => (
          <article
            key={index}
            className="traekkr-about-card"
            style={getAboutSectionCardStyle(section)}
          >
            <h2 className="traekkr-about-heading">{section.heading}</h2>
            <div className="traekkr-about-body">
              {hasLexicalContent(section.content) ? (
                <RenderLexical
                  content={
                    section.content as Parameters<
                      typeof RenderLexical
                    >[0]['content']
                  }
                />
              ) : (
                <p>{String(section.content ?? '')}</p>
              )}
            </div>
          </article>
        ))}

        <div className="traekkr-about-cta" style={getAboutCtaBlockStyle(about)}>
          {hasLexicalContent(ctaText) ? (
            <div className="traekkr-about-cta-text">
              <RenderLexical
                content={
                  ctaText as Parameters<typeof RenderLexical>[0]['content']
                }
              />
            </div>
          ) : (
            <p className="traekkr-about-cta-text">
              {typeof ctaText === 'string' ? ctaText : ''}
            </p>
          )}
          <Link href={ctaButtonHref} className="traekkr-about-cta-btn">
            {ctaButtonText}
          </Link>
        </div>
      </div>
    </section>
  )
}
