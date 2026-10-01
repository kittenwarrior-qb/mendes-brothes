import type { Block } from 'payload'

import { equipmentCategories } from '@/collections/Equipment'
import { blockSettings, sectionHeaderFields } from '@/fields/common'

export const EquipmentGrid: Block = {
  slug: 'equipmentGrid',
  interfaceName: 'EquipmentGridBlock',
  labels: { singular: 'Equipment fleet', plural: 'Equipment fleets' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'categories',
      label: 'Only these categories',
      type: 'select',
      hasMany: true,
      options: equipmentCategories,
      admin: { description: 'Leave empty to show all equipment.' },
    },
    {
      name: 'showFilter',
      label: 'Show category filter buttons',
      type: 'checkbox',
      defaultValue: true,
    },
    blockSettings,
  ],
}
