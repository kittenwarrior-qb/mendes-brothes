import type { Field, GlobalConfig, SelectField } from 'payload'

import { adminOnly } from '../access/roles'
import { revalidateGlobal } from '../hooks/revalidateSite'
import {
  colorFieldLabels,
  fontOptions,
  HEX_RE,
  presetOptions,
  type ThemeColors,
} from '../theme/presets'

const INHERIT = { label: '— Use preset —', value: 'preset' }

const inheritSelect = (
  name: string,
  label: string,
  options: { label: string; value: string }[],
  width = '50%',
): SelectField => ({
  name,
  label,
  type: 'select',
  defaultValue: 'preset',
  options: [INHERIT, ...options],
  admin: { width },
})

const colorFields: Field[] = (Object.keys(colorFieldLabels) as (keyof ThemeColors)[]).map(
  (key) => ({
    name: key,
    label: colorFieldLabels[key].label,
    type: 'text',
    admin: {
      width: '33%',
      description: colorFieldLabels[key].description || undefined,
      placeholder: 'Preset',
      components: { Field: '@/components/admin/ColorField#ColorField' },
    },
    validate: (value: string | null | undefined) =>
      !value || HEX_RE.test(value) ? true : 'Use a hex colour like #D96F25',
  }),
)

export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Theme & layout',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Settings',
    description:
      'Pick a preset, then override any colour, font or shape. Leave a field on "Use preset" / empty to inherit.',
  },
  fields: [
    {
      name: 'preset',
      type: 'select',
      defaultValue: 'classic',
      required: true,
      options: presetOptions,
      admin: {
        description: 'Each preset is a complete look. Switching keeps your overrides below.',
      },
    },
    {
      type: 'collapsible',
      label: 'Colours',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'colors',
          type: 'group',
          label: false,
          fields: [{ type: 'row', fields: colorFields }],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Typography',
      fields: [
        {
          type: 'row',
          fields: [
            inheritSelect('fontDisplay', 'Heading font', [...fontOptions]),
            inheritSelect('fontBody', 'Body font', [...fontOptions]),
          ],
        },
        {
          type: 'row',
          fields: [
            inheritSelect('headingCase', 'Heading style', [
              { label: 'UPPERCASE', value: 'uppercase' },
              { label: 'Normal case', value: 'none' },
            ]),
            {
              name: 'baseFontSize',
              label: 'Body text size (px)',
              type: 'number',
              min: 14,
              max: 20,
              admin: { width: '50%', placeholder: '16.5' },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Shapes & layout',
      fields: [
        {
          type: 'row',
          fields: [
            inheritSelect(
              'radius',
              'Corner radius',
              [
                { label: 'Sharp', value: 'sharp' },
                { label: 'Soft', value: 'soft' },
                { label: 'Rounded', value: 'rounded' },
              ],
              '33%',
            ),
            inheritSelect(
              'buttonShape',
              'Buttons',
              [
                { label: 'Square', value: 'square' },
                { label: 'Rounded', value: 'rounded' },
                { label: 'Pill', value: 'pill' },
              ],
              '33%',
            ),
            inheritSelect(
              'cardStyle',
              'Cards',
              [
                { label: 'Bordered', value: 'bordered' },
                { label: 'Shadow', value: 'shadow' },
                { label: 'Flat', value: 'flat' },
              ],
              '33%',
            ),
          ],
        },
        {
          type: 'row',
          fields: [
            inheritSelect(
              'container',
              'Content width',
              [
                { label: 'Narrow (1120px)', value: 'narrow' },
                { label: 'Default (1240px)', value: 'default' },
                { label: 'Wide (1400px)', value: 'wide' },
              ],
              '33%',
            ),
            inheritSelect(
              'headerStyle',
              'Header',
              [
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
                { label: 'Brand colour', value: 'brand' },
              ],
              '33%',
            ),
            inheritSelect(
              'footerStyle',
              'Footer',
              [
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ],
              '33%',
            ),
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'stickyHeader', type: 'checkbox', defaultValue: true, admin: { width: '33%' } },
            {
              name: 'accessibleContrast',
              label: 'Auto-fix colour contrast (WCAG AA)',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                width: '33%',
                description:
                  'Slightly deepens brand colours where needed so text stays readable. Recommended for US ADA compliance.',
              },
            },
            {
              name: 'animations',
              label: 'Scroll animations',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '33%' },
            },
          ],
        },
      ],
    },
    {
      name: 'customCss',
      label: 'Custom CSS (advanced)',
      type: 'code',
      admin: {
        language: 'css',
        description: 'Optional. Added at the end of the site stylesheet. For developers.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
}
