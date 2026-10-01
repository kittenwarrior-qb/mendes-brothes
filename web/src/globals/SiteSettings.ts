import type { GlobalConfig } from 'payload'

import { hiddenUnlessManager, managerOnly } from '../access/roles'
import { revalidateGlobal } from '../hooks/revalidateSite'

export const socialPlatforms = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'X / Twitter', value: 'x' },
  { label: 'Google Business', value: 'google' },
  { label: 'Yelp', value: 'yelp' },
]

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Company info & logo',
  access: {
    read: () => true,
    update: managerOnly,
  },
  admin: {
    group: 'Settings',
    hidden: hiddenUnlessManager,
    hideAPIURL: true,
    description:
      'Company details, logos and site-wide options. Changes appear on the live site right after saving.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'companyName', type: 'text', required: true, admin: { width: '50%' } },
                {
                  name: 'shortName',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Used in page titles, e.g. "Mendez Brothers".',
                  },
                },
              ],
            },
            { name: 'tagline', type: 'text' },
            {
              name: 'description',
              label: 'Short description',
              type: 'textarea',
              admin: {
                description: 'Shown in the footer and used as the default SEO description.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  admin: { width: '33%', placeholder: '+1 302-563-8888' },
                },
                {
                  name: 'smsPhone',
                  label: 'Text / SMS number',
                  type: 'text',
                  admin: { width: '33%', description: 'Leave empty to use the main phone.' },
                },
                { name: 'email', type: 'email', admin: { width: '33%' } },
              ],
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'street', type: 'text' },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', admin: { width: '40%' } },
                    { name: 'state', type: 'text', admin: { width: '30%' } },
                    { name: 'zip', type: 'text', admin: { width: '30%' } },
                  ],
                },
                {
                  name: 'mapUrl',
                  label: 'Google Maps link',
                  type: 'text',
                  admin: { description: 'Optional. Built from the address if left empty.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'hours',
                  type: 'text',
                  admin: { width: '50%', placeholder: 'Monday to Saturday, 7:00 am to 6:00 pm' },
                },
                {
                  name: 'serviceAreaText',
                  label: 'Service area (one line)',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'licenseNumber',
              label: 'License / insurance line',
              type: 'text',
              admin: { description: 'Optional, e.g. "Licensed & insured · DE Lic. #12345".' },
            },
            {
              name: 'socials',
              label: 'Social links',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      options: socialPlatforms,
                      required: true,
                      admin: { width: '30%' },
                    },
                    { name: 'url', type: 'text', required: true, admin: { width: '70%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Logos',
          fields: [
            {
              name: 'logo',
              label: 'Logo (for light backgrounds)',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Wordmark used in the header. Transparent PNG, WebP or SVG.' },
            },
            {
              name: 'logoOnDark',
              label: 'Logo (for dark / coloured backgrounds)',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'logoMark',
              label: 'Badge / round logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Round emblem used as a badge on the home hero and as the app icon.',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Square image, at least 256×256.' },
            },
            {
              name: 'logoHeight',
              label: 'Header logo height (px)',
              type: 'number',
              defaultValue: 44,
              min: 24,
              max: 96,
            },
          ],
        },
        {
          label: 'Site-wide',
          fields: [
            {
              name: 'announcement',
              label: 'Announcement bar',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox' },
                {
                  type: 'row',
                  fields: [
                    { name: 'text', type: 'text', admin: { width: '60%' } },
                    { name: 'linkLabel', type: 'text', admin: { width: '20%' } },
                    { name: 'linkUrl', type: 'text', admin: { width: '20%' } },
                  ],
                },
              ],
            },
            {
              name: 'ctaBand',
              label: 'Call-to-action band (above the footer)',
              type: 'group',
              admin: { description: 'Shown on every page except where a page turns it off.' },
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: true },
                { name: 'heading', type: 'text', defaultValue: 'Have a lot that needs work?' },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'showPhone',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'buttonLabel',
                      type: 'text',
                      defaultValue: 'Request a free estimate',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'buttonUrl',
                      type: 'text',
                      defaultValue: '/contact',
                      admin: { width: '33%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'mobileCallBar',
              label: 'Sticky "Call now" bar on phones',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'backToTop',
              label: 'Back-to-top button',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          label: 'SEO & tracking',
          fields: [
            {
              name: 'titleSuffix',
              type: 'text',
              admin: { description: 'Added after every page title, e.g. " | Mendez Brothers".' },
            },
            {
              name: 'defaultOgImage',
              label: 'Default social share image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: '1200×630 recommended.' },
            },
            {
              name: 'businessType',
              label: 'Business type (schema.org)',
              type: 'select',
              defaultValue: 'GeneralContractor',
              options: [
                { label: 'General contractor', value: 'GeneralContractor' },
                { label: 'Home & construction business', value: 'HomeAndConstructionBusiness' },
                { label: 'Roofing contractor', value: 'RoofingContractor' },
                { label: 'Local business', value: 'LocalBusiness' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'plausibleDomain',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Plausible analytics domain (cookie-free). Optional.',
                  },
                },
                {
                  name: 'gaId',
                  label: 'Google Analytics ID',
                  type: 'text',
                  admin: { width: '50%', placeholder: 'G-XXXXXXX' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
}
