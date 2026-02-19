import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Service title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Detailed description',
      admin: {
        description: 'Shown in the popup when user clicks the service.',
      },
    },
    {
      name: 'targetItems',
      type: 'array',
      label: 'Target',
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
          label: 'Item',
        },
      ],
      admin: {
        description: 'List of target areas (e.g. "software source code", "build system"). Shown as comma-separated under "Target".',
      },
    },
  ],
}
