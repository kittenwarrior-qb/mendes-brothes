import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { en } from '@payloadcms/translations/languages/en'
import { vi } from '@payloadcms/translations/languages/vi'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Equipment } from './collections/Equipment'
import { FAQs } from './collections/FAQs'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { ServiceAreas } from './collections/ServiceAreas'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { ListingPages } from './globals/ListingPages'
import { SiteSettings } from './globals/SiteSettings'
import { Theme } from './globals/Theme'
import { migrations } from './migrations'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const smtpConfigured = Boolean(process.env.SMTP_HOST)

export default buildConfig({
  admin: {
    components: {
      graphics: {
        Logo: '@/components/admin/Graphics#AdminLogo',
        Icon: '@/components/admin/Graphics#AdminIcon',
      },
      beforeDashboard: ['@/components/admin/Dashboard#DashboardIntro'],
    },
    meta: {
      titleSuffix: ' · Website admin',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  i18n: {
    supportedLanguages: { en, vi },
    fallbackLanguage: 'en',
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Pending migrations run once when the production server boots. They are skipped during
    // `next build` (parallel workers would race); the Docker build migrates explicitly first.
    prodMigrations: process.env.NEXT_PHASE === 'phase-production-build' ? undefined : migrations,
  }),
  email: smtpConfigured
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'no-reply@example.com',
        defaultFromName: process.env.SMTP_FROM_NAME || 'Website',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
  collections: [
    Pages,
    Projects,
    Services,
    Equipment,
    ServiceAreas,
    Testimonials,
    FAQs,
    Posts,
    Categories,
    Media,
    Users,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [SiteSettings, Theme, Header, Footer, ListingPages],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  upload: {
    limits: { fileSize: 25_000_000 },
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
