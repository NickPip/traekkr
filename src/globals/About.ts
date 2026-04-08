import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About Us',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sections',
      type: 'array',
      label: 'Sections',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
          admin: {
            description: 'e.g. "Who we are", "What we do", "Why us?"',
          },
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Content',
        },
        {
          name: 'headingFontSizePx',
          type: 'number',
          label: 'Heading font size (px)',
          min: 8,
          max: 120,
          admin: {
            placeholder: '19',
            description:
              'Optional. Exact size in pixels for this card’s heading. Empty = theme default (~19px with the default root font size).',
            step: 1,
          },
        },
        {
          name: 'contentFontSizePx',
          type: 'number',
          label: 'Content font size (px)',
          min: 8,
          max: 120,
          admin: {
            placeholder: '16',
            description:
              'Optional. Exact size in pixels for this card’s body text. Empty = theme default (~16px with the default root font size).',
            step: 1,
          },
        },
      ],
      admin: {
        description: 'Each section appears as a card on the About page.',
      },
    },
    {
      name: 'ctaText',
      type: 'richText',
      label: 'CTA text',
      admin: {
        description: 'Text above the contact button (e.g. "Prefer a face-to-face meeting? Send us a message...").',
      },
    },
    {
      name: 'ctaButtonText',
      type: 'text',
      label: 'CTA button text',
      defaultValue: 'Contact us',
    },
    {
      name: 'ctaButtonHref',
      type: 'text',
      label: 'CTA button link',
      defaultValue: '/contact',
      admin: {
        description: 'URL for the contact button (e.g. /contact).',
      },
    },
    {
      name: 'ctaTextFontSizePx',
      type: 'number',
      label: 'CTA text font size (px)',
      min: 8,
      max: 120,
      admin: {
        placeholder: '16',
        description:
          'Optional. Pixel size for the text above the button. Empty = theme default (~16px).',
        step: 1,
      },
    },
    {
      name: 'ctaButtonFontSizePx',
      type: 'number',
      label: 'CTA button label font size (px)',
      min: 8,
      max: 120,
      admin: {
        placeholder: '15',
        description:
          'Optional. Pixel size for the button label. Empty = theme default (~15px).',
        step: 1,
      },
    },
  ],
}
