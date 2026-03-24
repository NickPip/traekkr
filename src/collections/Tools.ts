import type { CollectionConfig } from 'payload'

export const Tools: CollectionConfig = {
  slug: 'tools',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'link', 'publishedDate'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL path, e.g. "my-tool" → /tools/my-tool',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link',
      admin: {
        description: 'URL to the tool (e.g. https://example.com/tool). Opens when user clicks "Open tool".',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Full content shown when user opens the tool page.',
      },
    },
  ],
}
