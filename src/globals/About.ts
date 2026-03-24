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
  ],
}
