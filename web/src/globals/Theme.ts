import type { Field, GlobalConfig, SelectField } from 'payload'

import { adminOnlyField, hiddenUnlessManager, isAdminUser, managerOnly } from '../access/roles'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import { revalidateGlobal } from '../hooks/revalidateSite'
import {
  AUTO_PALETTE,
  colorFieldLabels,
  fontOptions,
  HEX_RE,
  presetOptions,
  type ThemeColors,
} from '../theme/presets'

const INHERIT = { label: '— From palette —', value: 'preset' }

const hexValidate = (value: string | null | undefined) =>
  !value || HEX_RE.test(value) ? true : 'Use a hex colour like #D96F25'

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
      placeholder: 'From palette',
      components: { Field: '@/components/admin/ColorField#ColorField' },
    },
    validate: hexValidate,
  }),
)

export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Colours & fonts',
  access: {
    read: () => true,
    update: managerOnly,
  },
  admin: {
    group: 'Settings',
    hidden: hiddenUnlessManager,
    hideAPIURL: true,
    description:
      '1) Pick a palette (or build one from your brand colour). 2) Open Live Preview to see it on the real site. 3) Publish. Nothing changes for visitors until you publish.',
    livePreview: {
      url: ({ req }) => generatePreviewPath({ slug: 'home', collection: 'pages', req }),
    },
  },
  versions: {
    // drafts let admins try colours in Live Preview without touching the live site
    drafts: { autosave: { interval: 300 } },
    max: 25,
  },
  fields: [
    {
      name: 'preset',
      label: 'Colour palette',
      type: 'select',
      defaultValue: 'studio',
      required: true,
      options: presetOptions,
      admin: {
        components: { Field: '@/components/admin/PalettePicker#PalettePicker' },
      },
    },
    {
      type: 'row',
      admin: { condition: (data) => data?.preset === AUTO_PALETTE },
      fields: [
        {
          name: 'brandColor',
          label: 'Brand colour',
          type: 'text',
          defaultValue: '#D96F25',
          validate: hexValidate,
          admin: {
            width: '34%',
            description: 'The one colour everything else is built from (your logo colour).',
            components: { Field: '@/components/admin/ColorField#ColorField' },
          },
        },
        {
          name: 'neutralTone',
          label: 'Greys & backgrounds',
          type: 'select',
          defaultValue: 'warm',
          options: [
            { label: 'Warm (paper, stone)', value: 'warm' },
            { label: 'Neutral (pure grey)', value: 'neutral' },
            { label: 'Cool (slate blue)', value: 'cool' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'autoMode',
          label: 'Mode',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ],
          admin: { width: '33%' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Fine-tune individual colours (optional)',
      admin: {
        initCollapsed: true,
        description:
          'Empty = taken from the palette above. The small swatch shows the colour currently in use.',
      },
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
                { label: 'Default (1280px)', value: 'default' },
                { label: 'Wide (1440px)', value: 'wide' },
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
              name: 'contrastMode',
              label: 'Readability (WCAG AA / ADA)',
              type: 'select',
              defaultValue: 'deepen',
              options: [
                { label: 'Deepen brand colour — white text on buttons', value: 'deepen' },
                { label: 'Keep brand colour vivid — dark text on buttons', value: 'vivid' },
                { label: 'Off — exact colours (may fail accessibility checks)', value: 'off' },
              ],
              admin: {
                width: '67%',
                description:
                  'Text must contrast 4.5:1 with its background. Both automatic modes guarantee that; they differ only in how buttons look.',
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
      access: { create: adminOnlyField, update: adminOnlyField },
      admin: {
        condition: (_data, _sibling, { user }) => isAdminUser(user),
        language: 'css',
        description: 'Optional. Added at the end of the site stylesheet. For developers.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
}
