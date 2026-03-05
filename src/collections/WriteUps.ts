import type { CollectionConfig } from 'payload'
import { lexicalEditor, BlocksFeature, CodeBlock } from '@payloadcms/richtext-lexical'

export const WriteUps: CollectionConfig = {
  slug: 'write-ups',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedDate'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Heading',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL path, e.g. "my-first-write-up" → /write-ups/my-first-write-up',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      label: 'Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      label: 'Author',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Description',
      admin: {
        description:
          'Full content shown when user opens the write-up. Use the block menu (e.g. type / or use +) to add code blocks.',
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [CodeBlock()],
          }),
        ],
      }),
    },
  ],
}
