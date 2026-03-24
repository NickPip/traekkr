import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['sortOrder', 'title'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        if (data.sortOrder !== undefined && data.sortOrder !== null) return data
        const last = await req.payload.find({
          collection: 'services',
          depth: 0,
          limit: 1,
          sort: '-sortOrder',
        })
        const max = last.docs[0]?.sortOrder
        data.sortOrder = typeof max === 'number' ? max + 1 : 0
        return data
      },
    ],
  },
  fields: [
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Order',
      admin: {
        description: 'Lower numbers appear first on the site. Edit these to reorder.',
      },
    },
    {
      name: 'title',
      type: 'text',
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
          label: 'Item',
        },
      ],
      admin: {
        description:
          'List of target areas (e.g. "software source code", "build system"). Shown as comma-separated under "Target".',
      },
    },
  ],
}
