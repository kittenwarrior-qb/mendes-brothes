import type { Field, GroupField, SelectField, TextField, TextareaField } from 'payload'

import { iconOptions, type IconKind } from '@/icons/registry'

export const HIGHLIGHT_HINT =
  'Wrap words in *asterisks* to show them in the brand colour, e.g. "Who *we are*".'

export const headingField = (overrides: Partial<TextField> = {}): TextField =>
  ({
    name: 'heading',
    type: 'text',
    admin: { description: HIGHLIGHT_HINT },
    ...overrides,
  }) as TextField

export const ledeField = (overrides: Partial<TextareaField> = {}): TextareaField =>
  ({
    name: 'lede',
    label: 'Intro text',
    type: 'textarea',
    ...overrides,
  }) as TextareaField

export const iconField = (kinds: IconKind[] = ['line'], overrides: Partial<SelectField> = {}) =>
  ({
    name: 'icon',
    type: 'select',
    options: iconOptions(kinds),
    ...overrides,
  }) as SelectField

/**
 * Shared presentation options added to every layout block, so editors can
 * restyle a section without touching code.
 */
export const blockSettings: GroupField = {
  name: 'settings',
  label: 'Section settings',
  type: 'group',
  admin: {
    description: 'Background, spacing and visibility of this section.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'background',
          type: 'select',
          defaultValue: 'default',
          admin: { width: '33%' },
          options: [
            { label: 'Default (page background)', value: 'default' },
            { label: 'Light grey', value: 'alt' },
            { label: 'Brand tint', value: 'tint' },
            { label: 'Dark', value: 'dark' },
          ],
        },
        {
          name: 'spacing',
          type: 'select',
          defaultValue: 'md',
          admin: { width: '33%' },
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
        {
          name: 'hideOn',
          label: 'Hide on',
          type: 'select',
          defaultValue: 'none',
          admin: { width: '33%' },
          options: [
            { label: 'Always visible', value: 'none' },
            { label: 'Hide on mobile', value: 'mobile' },
            { label: 'Hide on desktop', value: 'desktop' },
            { label: 'Hidden everywhere', value: 'all' },
          ],
        },
      ],
    },
    {
      name: 'anchor',
      label: 'Anchor ID',
      type: 'text',
      admin: {
        description:
          'Optional. Lets menus link straight to this section, e.g. "services" → /#services.',
      },
      validate: (value: string | null | undefined) =>
        !value || /^[a-z0-9-]+$/.test(value)
          ? true
          : 'Use lowercase letters, numbers and dashes only.',
    },
  ],
}

/** Section heading + intro + optional header button used by most blocks. */
export const sectionHeaderFields = (opts: { button?: boolean } = {}): Field[] => {
  const fields: Field[] = [headingField(), ledeField()]
  if (opts.button) {
    fields.push({
      name: 'headerLink',
      label: 'Header button',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', admin: { width: '50%' } },
            {
              name: 'url',
              type: 'text',
              admin: { width: '50%', description: 'e.g. /projects or /contact' },
            },
          ],
        },
      ],
    })
  }
  return fields
}
