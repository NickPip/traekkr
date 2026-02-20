'use client'

import React, { useState } from 'react'

export function ShareButtons({ url: path, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  const fullUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${path}` : path

  const shareUrl = encodeURIComponent(fullUrl)
  const shareTitle = encodeURIComponent(title)
  const twitterUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="traekkr-share">
      <span className="traekkr-share-label">Share</span>
      <div className="traekkr-share-buttons">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="traekkr-share-btn"
          aria-label="Share on X (Twitter)"
        >
          X
        </a>
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="traekkr-share-btn"
          aria-label="Share on LinkedIn"
        >
          in
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="traekkr-share-btn"
          aria-label="Copy link"
        >
          {copied ? 'Copied' : 'Link'}
        </button>
      </div>
    </div>
  )
}
