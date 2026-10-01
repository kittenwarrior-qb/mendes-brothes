/**
 * Demo seed — wipes content (not users) and recreates the full Mẫu 1 demo.
 *
 *   pnpm seed
 *
 * Creates an admin on an empty database from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
 * (falls back to admin@example.com + a random password printed to the console).
 */
import type { CollectionSlug, Payload } from 'payload'

import config from '@payload-config'
import crypto from 'crypto'
import path from 'path'
import { getPayload } from 'payload'

import * as data from './data'

const ASSETS = path.resolve(process.cwd(), 'seed-assets')
const ctx = { disableRevalidate: true }

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Minimal Lexical document from plain paragraphs (supports "## Heading" lines). */
const rt = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((p) => {
      const heading = p.startsWith('## ')
      return {
        type: heading ? 'heading' : 'paragraph',
        ...(heading ? { tag: 'h2' } : { textFormat: 0, textStyle: '' }),
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          {
            type: 'text',
            text: heading ? p.slice(3) : p,
            format: 0,
            detail: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
      }
    }),
  },
})

const settings = (background: 'default' | 'alt' | 'tint' | 'dark' = 'default') => ({
  background,
  spacing: 'md' as const,
  hideOn: 'none' as const,
})

const link = (label: string, url: string, appearance: 'default' | 'outline' = 'default') => ({
  link: { type: 'custom' as const, url, label, appearance },
})

const pageRef = (id: number, label: string) => ({
  link: {
    type: 'reference' as const,
    reference: { relationTo: 'pages' as const, value: id },
    label,
  },
})
const urlRef = (url: string, label: string) => ({ link: { type: 'custom' as const, url, label } })

async function wipe(payload: Payload) {
  const collections: CollectionSlug[] = [
    'form-submissions',
    'forms',
    'search',
    'redirects',
    'pages',
    'posts',
    'categories',
    'projects',
    'testimonials',
    'services',
    'faqs',
    'equipment',
    'service-areas',
    'media',
  ]
  for (const collection of collections) {
    await payload.delete({ collection, where: {}, context: ctx, overrideAccess: true })
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, where: {} })
    }
  }
}

async function ensureAdmin(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: 'users' })
  if (totalDocs > 0) return
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url')
  await payload.create({
    collection: 'users',
    data: { email, password, name: 'Site admin', role: 'admin' },
  })
  payload.logger.info(`Created admin user ${email} / ${password}`)
}

async function run() {
  const payload = await getPayload({ config })
  payload.logger.info('Seeding demo content…')
  await wipe(payload)
  await ensureAdmin(payload)

  // ---------- media ----------
  // demo photos from Wikimedia Commons — see seed-assets/CREDITS.md
  const files: Record<string, string> = {
    hero: 'Excavators on a job site at sunset',
    fleet: 'Excavator on a hill in low sun',
    p1: 'Excavator clearing stumps on a wooded lot',
    p2: 'Excavator on a mound of fill dirt',
    p3: 'Finished home with a gravel driveway and stone edging',
    dig: 'Excavator bucket dropping soil',
    cab: 'Excavator cab on a job site',
    roof: 'Roof battens and tiles going on',
    c4: 'Forestry mulcher grinding brush in the woods',
    c5: 'Dump truck tipping stone',
    c6: 'Excavator taking down a house',
    c7: 'Dozer spreading material on a graded lot',
    c8: 'Track loader loading storm debris into a trailer',
    c9: 'Excavator loading a dump truck',
    c11: 'Rollers and dump trucks building a stone surface',
    c12: 'Gravel yard and access road beside a barn',
  }
  const media: Record<string, number> = {}
  for (const [key, alt] of Object.entries(files)) {
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      filePath: path.join(ASSETS, `${key}.jpg`),
      context: ctx,
    })
    media[key] = doc.id
  }
  const logos: Record<string, string> = {
    word: 'Mendez Brothes General Construction',
    wordw: 'Mendez Brothes General Construction (white)',
    badge: 'Mendez Brothes badge',
    mark: 'Mendez Brothes mark',
  }
  for (const [key, alt] of Object.entries(logos)) {
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      filePath: path.join(ASSETS, `logo-${key}.webp`),
      context: ctx,
    })
    media[`logo-${key}`] = doc.id
  }

  // ---------- taxonomy ----------
  const areaIds: Record<string, number> = {}
  for (const [i, name] of data.towns.entries()) {
    const doc = await payload.create({
      collection: 'service-areas',
      data: {
        name,
        slug: slugify(name),
        county: i === 5 ? 'Kent / Sussex County' : 'Sussex County',
        state: 'DE',
        order: i,
        hasPage: true,
      },
      context: ctx,
    })
    areaIds[name] = doc.id
  }

  const faqIds: number[] = []
  for (const [i, f] of data.faqs.entries()) {
    const doc = await payload.create({
      collection: 'faqs',
      data: { question: f.q, answer: f.a, order: i },
      context: ctx,
    })
    faqIds.push(doc.id)
  }

  const serviceIds: Record<string, number> = {}
  for (const [i, s] of data.services.entries()) {
    const doc = await payload.create({
      collection: 'services',
      data: {
        title: s.title,
        slug: slugify(s.title),
        icon: s.icon,
        shortDescription: s.d,
        image: media[s.image],
        order: i,
        showInFooter: i < 6,
        body: rt(
          `${s.d} We own and run our own machines, so the crew that gives you the estimate is the crew on your site.`,
          '## How it works',
          'We walk the property with you, check access, soil and drainage, and send a written price broken down by task. When the work is done we clean up and walk the finished site with you.',
        ),
        highlights: [
          { text: 'Free on-site estimate' },
          { text: 'Written, itemized price' },
          { text: 'Clean-up and final walkthrough' },
        ],
        faqs: faqIds.slice(0, 3),
      },
      context: ctx,
    })
    serviceIds[s.title] = doc.id
  }

  const equipmentIds: Record<string, number> = {}
  for (const [i, e] of data.equipment.entries()) {
    const doc = await payload.create({
      collection: 'equipment',
      data: {
        name: e.name,
        category: e.category,
        icon: e.icon,
        spec: e.spec,
        description: e.d,
        order: i,
      },
      context: ctx,
    })
    equipmentIds[e.name] = doc.id
  }

  const testimonialIds: number[] = []
  for (const [i, t] of data.testimonials.entries()) {
    const doc = await payload.create({
      collection: 'testimonials',
      data: { ...t, source: 'google', date: `202${5 - i}-0${i + 3}-10T12:00:00.000Z` },
      context: ctx,
    })
    testimonialIds.push(doc.id)
  }

  // ---------- projects ----------
  for (const [i, p] of data.projects.entries()) {
    await payload.create({
      collection: 'projects',
      draft: false,
      data: {
        _status: 'published',
        title: p.title,
        slug: slugify(p.title),
        summary: p.scope,
        cover: media[p.img],
        services: p.services.map((s) => serviceIds[s]),
        area: areaIds[p.town],
        clientType: p.type ?? 'residential',
        lotSize: p.acres < 0.25 ? Math.round(p.acres * 43560) : p.acres,
        lotUnit: p.acres < 0.25 ? 'sqft' : 'acres',
        completedAt: `${p.year}-${String(p.month).padStart(2, '0')}-15T12:00:00.000Z`,
        duration: p.duration,
        featured: Boolean(p.featured),
        equipment: p.equipment.map((e) => equipmentIds[e]).filter(Boolean),
        extraEquipment: p.extra,
        gallery: (p.gallery ?? []).map((g) => ({ image: media[g] })),
        beforeAfter: i === 0 ? { before: media.c4, after: media.p1 } : undefined,
        testimonial: i < testimonialIds.length ? testimonialIds[i] : undefined,
        body: rt(
          p.scope,
          '## Scope of work',
          `Services: ${p.services.join(', ')}. Completed in ${p.duration}. [DEMO] Replace with the real project write-up and photos.`,
        ),
      },
      context: ctx,
    })
  }

  // ---------- form ----------
  const serviceOptions = [
    ...data.services.map((s) => ({ label: s.title, value: slugify(s.title) })),
    { label: 'Something else', value: 'other' },
  ]
  const form = await payload.create({
    collection: 'forms',
    data: {
      title: 'Free estimate',
      submitButtonLabel: 'Request estimate',
      confirmationType: 'message',
      confirmationMessage: rt(
        'Thanks! We got your request and will call you within one business day.',
      ),
      fields: [
        { blockType: 'text', name: 'name', label: 'Your name', required: true, width: 50 },
        { blockType: 'text', name: 'phone', label: 'Phone', required: true, width: 50 },
        {
          blockType: 'email',
          name: 'email',
          label: 'Email (optional)',
          required: false,
          width: 50,
        },
        {
          blockType: 'select',
          name: 'service',
          label: 'Service needed',
          required: true,
          width: 50,
          options: serviceOptions,
        },
        { blockType: 'text', name: 'address', label: 'Property address or town', width: 50 },
        {
          blockType: 'select',
          name: 'lot_size',
          label: 'Approximate lot size',
          width: 50,
          options: [
            { label: 'Not sure', value: 'not-sure' },
            { label: 'Under ½ acre', value: 'under-half' },
            { label: '½ to 2 acres', value: 'half-to-2' },
            { label: '2 to 5 acres', value: '2-to-5' },
            { label: 'Over 5 acres', value: 'over-5' },
          ],
        },
        { blockType: 'textarea', name: 'message', label: 'Project details', width: 100 },
      ],
      emails: [
        {
          emailTo: data.company.email,
          subject: 'New estimate request from {{name}}',
          message: rt(
            'Name: {{name}}',
            'Phone: {{phone}}',
            'Email: {{email}}',
            'Service: {{service}}',
            'Property: {{address}}',
            'Lot size: {{lot_size}}',
            'Details: {{message}}',
          ),
        },
      ],
    },
    context: ctx,
  })

  // ---------- pages ----------
  const createPage = (
    title: string,
    slug: string,
    layout: unknown[],
    extra: Record<string, unknown> = {},
  ) =>
    payload.create({
      collection: 'pages',
      draft: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { title, slug, _status: 'published', layout, ...extra } as any,
      context: ctx,
    })

  const home = await createPage('Home', 'home', [
    {
      blockType: 'heroHome',
      variant: 'fullImage',
      showLogo: false,
      eyebrow: 'Lewes, Delaware · General construction',
      heading: 'We move dirt. *We build ground.*',
      lede: 'Forestry mulching, land clearing, grading, building pads, driveways and roofing — one local crew for the whole job in Sussex County.',
      links: [
        link('Get a free estimate', '/contact'),
        link('See our projects', '/projects', 'outline'),
      ],
      trust: [],
      image: media.hero,
      showBadge: false,
      showCallCard: false,
      callCardText: 'Call or text for a site visit',
      settings: settings(),
    },
    {
      blockType: 'stats',
      eyebrow: 'Mendez Brothes General Construction',
      heading:
        'We do the groundwork everything else stands on. *Clearing, digging, grading and building the base — with our own crew and our own machines.*',
      items: [
        { value: '10', label: 'Services under one crew' },
        { value: '12', label: 'Towns we work in' },
        { value: '6', label: 'Days a week on site' },
      ],
      settings: settings(),
    },
    {
      blockType: 'featuredProjects',
      eyebrow: 'Recent work',
      heading: 'Finished *projects*',
      lede: 'Real jobs from around Sussex County.',
      headerLink: { label: 'All projects', url: '/projects' },
      source: 'latest',
      limit: 3,
      layout: 'feature',
      settings: settings(),
    },
    {
      blockType: 'servicesGrid',
      eyebrow: 'What we do',
      heading: 'From raw land to *finished site*',
      lede: 'Hire us for one service or the whole job.',
      headerLink: { label: 'All services', url: '/services' },
      variant: 'list',
      source: 'all',
      linkTo: 'service',
      settings: settings(),
    },
    {
      blockType: 'split',
      eyebrow: 'Who we are',
      heading: 'The people who quote the job *do the job*',
      lede: 'Mendez Brothes is run by the Mendez brothers. We own and run our own machines, so the crew that gives you the estimate is the crew on your site.',
      links: [link('About us', '/about', 'outline')],
      image: media.cab,
      imagePosition: 'left',
      stamp: { title: 'One crew', text: 'from land clearing to the final walkthrough' },
      settings: settings(),
    },
    {
      blockType: 'steps',
      eyebrow: 'How it works',
      heading: 'Four steps, *no surprises*',
      lede: 'From the first call to the final walkthrough.',
      steps: [
        {
          title: 'Call or send the form',
          text: 'Tell us where the property is and what you need done.',
        },
        {
          title: 'Site walk',
          text: 'We visit the lot and check access, soil, drainage and utilities.',
        },
        { title: 'Written estimate', text: 'A clear price and schedule, broken down by task.' },
        {
          title: 'Work & walkthrough',
          text: 'We do the job, clean up, and walk the finished site with you.',
        },
      ],
      settings: settings(),
    },
    {
      blockType: 'testimonials',
      eyebrow: 'Reviews',
      heading: 'What clients *say*',
      source: 'latest',
      limit: 3,
      showRating: true,
      settings: settings(),
    },
  ])

  const about = await createPage('About Us', 'about', [
    {
      blockType: 'pageHero',
      variant: 'split',
      showBreadcrumbs: true,
      eyebrow: 'About us',
      heading: 'Built on *groundwork*',
      lede: 'A local site-work and general construction company based on Camp Arrowhead Road in Lewes, Delaware.',
      image: media.p3,
      settings: settings(),
    },
    {
      blockType: 'split',
      eyebrow: 'Who we are',
      heading: 'A local crew that *owns its machines*',
      lede: 'Mendez Brothes General Construction is run by the Mendez brothers. We grew by doing the groundwork of construction well: clearing, digging, grading and building the base everything else sits on.',
      body: rt(
        'We own and run our own machines, so the people who give you the estimate are the same people on site. If something changes, you hear it from us the same day.',
        'We work for homeowners building on a new lot, custom builders who need pads and driveways on schedule, and businesses expanding parking or cleaning up property.',
      ),
      links: [
        link('Get a free estimate', '/contact'),
        link('See our projects', '/projects', 'outline'),
      ],
      image: media.p2,
      imagePosition: 'right',
      stamp: { title: 'One crew', text: 'from land clearing to the final walkthrough' },
      settings: settings(),
    },
    {
      blockType: 'cards',
      eyebrow: 'Our values',
      heading: 'What we *stand for*',
      variant: 'value',
      columns: '3',
      items: [
        {
          title: 'Straight answers',
          text: 'Written estimates, clear scope, and a call if anything changes.',
        },
        { title: 'Clean job sites', text: 'Every property left graded, raked and free of debris.' },
        {
          title: 'Built to last',
          text: 'Proper base, compaction and drainage so the work holds up.',
        },
      ],
      settings: settings(),
    },
    {
      blockType: 'serviceAreas',
      eyebrow: 'Where we work',
      heading: 'Service *area*',
      lede: "All of Sussex County and nearby parts of Kent County. Not sure you're in range? Call and ask.",
      linkToPages: true,
      settings: settings(),
    },
  ])

  const capabilities = await createPage('Equipment & Technology', 'capabilities', [
    {
      blockType: 'pageHero',
      variant: 'split',
      showBreadcrumbs: true,
      eyebrow: 'Capabilities',
      heading: 'Equipment & *technology*',
      lede: "We own the machines we run. Here's what shows up on your site and what each one does.",
      image: media.fleet,
      settings: settings(),
    },
    {
      blockType: 'equipmentGrid',
      eyebrow: 'The fleet',
      heading: 'Machines for *every lot*',
      lede: 'Sized from tight backyard access to multi-acre clearing.',
      showFilter: true,
      settings: settings(),
    },
    {
      blockType: 'cards',
      eyebrow: 'Technology',
      heading: 'Grades right, *first time*',
      lede: 'Tools that get grades right faster and cut rework.',
      variant: 'row',
      columns: '2',
      items: [
        {
          title: 'GPS machine control',
          icon: 'techGps',
          text: 'The design grade lives in the machine, so operators cut and fill to plan without stakes.',
        },
        {
          title: 'Drone site surveys',
          icon: 'techDrone',
          text: 'Aerial photos and elevation maps before and after, so you see how much material moved.',
        },
        {
          title: 'Laser grading',
          icon: 'techLaser',
          text: 'Rotating lasers keep driveways, patios and paver bases flat and pitched for drainage.',
        },
        {
          title: 'Digital estimates & photo logs',
          icon: 'techDoc',
          text: 'Itemized estimates by email and dated progress photos to share with your builder or lender.',
        },
      ],
      settings: settings(),
    },
    {
      blockType: 'checklist',
      eyebrow: 'Our standard',
      heading: 'Every job, *every time*',
      items: data.checks.map((text) => ({ text })),
      settings: settings(),
    },
  ])

  const contact = await createPage(
    'Contact',
    'contact',
    [
      {
        blockType: 'pageHero',
        variant: 'split',
        showBreadcrumbs: true,
        eyebrow: 'Contact',
        heading: 'Get a free *estimate*',
        lede: "Call for the fastest answer, or send the details and we'll call you back to set up a site visit.",
        image: media.p1,
        settings: settings(),
      },
      {
        blockType: 'contactSection',
        form: form.id,
        showInfoCard: true,
        showMap: true,
        footnote: 'We reply within one business day.',
        settings: settings(),
      },
      {
        blockType: 'faq',
        eyebrow: 'FAQ',
        heading: 'Common *questions*',
        settings: settings(),
      },
    ],
    { hideCtaBand: true },
  )

  // ---------- news ----------
  const cat = await payload.create({
    collection: 'categories',
    data: { title: 'Tips', slug: 'tips' },
    context: ctx,
  })
  const posts = [
    {
      title: 'Forestry mulching vs. traditional land clearing [DEMO]',
      image: 'c4',
      text: [
        'Mulching grinds brush and small trees in place. There is no burning and no hauling, and the mulch layer protects the soil from erosion.',
        '## When traditional clearing makes sense',
        'If you are building right away, stumps under the house footprint still need to come out. We often combine both methods on one lot.',
      ],
    },
    {
      title: 'How to prepare your lot for a building pad [DEMO]',
      image: 'p2',
      text: [
        'A good pad starts with stripping topsoil, then placing structural fill in compacted lifts to the elevation on your plans.',
        '## What we need from you',
        'Your site plan, the finished floor elevation from your builder, and clear access for the trucks.',
      ],
    },
  ]
  for (const [i, p] of posts.entries()) {
    await payload.create({
      collection: 'posts',
      draft: false,
      data: {
        _status: 'published',
        title: p.title,
        slug: slugify(p.title.replace('[DEMO]', '')),
        heroImage: media[p.image],
        content: rt(...p.text),
        categories: [cat.id],
        publishedAt: new Date(Date.now() - (i + 1) * 12 * 864e5).toISOString(),
        meta: { description: p.text[0], image: media[p.image] },
      },
      context: ctx,
    })
  }

  // ---------- globals ----------
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      ...data.company,
      address: { ...data.company.address, mapUrl: '' },
      licenseNumber: '',
      socials: [
        { platform: 'youtube', url: 'https://youtube.com/' },
        { platform: 'instagram', url: 'https://instagram.com/' },
        { platform: 'facebook', url: 'https://facebook.com/' },
      ],
      logo: media['logo-word'],
      logoOnDark: media['logo-wordw'],
      logoMark: media['logo-badge'],
      favicon: media['logo-badge'],
      logoHeight: 44,
      announcement: { enabled: false, text: '', linkLabel: '', linkUrl: '' },
      ctaBand: {
        enabled: true,
        heading: 'Have a lot that *needs work?*',
        showPhone: true,
        buttonLabel: 'Request a free estimate',
        buttonUrl: '/contact',
      },
      mobileCallBar: true,
      backToTop: true,
      titleSuffix: ' | Mendez Brothes',
      defaultOgImage: media.hero,
      businessType: 'GeneralContractor',
    },
    context: ctx,
  })

  await payload.updateGlobal({
    slug: 'theme',
    data: {
      _status: 'published',
      preset: 'studio',
      stickyHeader: true,
      animations: true,
      colors: {},
    },
    context: ctx,
  })

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        pageRef(home.id, 'Home'),
        pageRef(about.id, 'About Us'),
        {
          ...urlRef('/services', 'Services'),
          children: data.services
            .slice(0, 10)
            .map((s) => urlRef(`/services/${slugify(s.title)}`, s.title)),
        },
        urlRef('/projects', 'Projects'),
        pageRef(capabilities.id, 'Equipment & Technology'),
        pageRef(contact.id, 'Contact'),
      ],
      showPhone: true,
      ctaLabel: 'Free estimate',
      ctaUrl: '/contact',
    },
    context: ctx,
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        {
          title: 'Company',
          navItems: [
            pageRef(about.id, 'About Us'),
            urlRef('/projects', 'Projects'),
            pageRef(capabilities.id, 'Equipment & Technology'),
            urlRef('/posts', 'News & tips'),
            pageRef(contact.id, 'Contact'),
          ],
        },
      ],
      showServices: true,
      servicesTitle: 'Services',
      showContact: true,
      bottomText: 'Lewes, Delaware',
    },
    context: ctx,
  })

  await payload.updateGlobal({
    slug: 'listing-pages',
    data: {
      projects: {
        eyebrow: 'Our work',
        heading: 'Finished *projects*',
        lede: 'Find work similar to yours. Filter by service, lot size or town.',
        image: media.dig,
        perPage: 12,
        filters: ['q', 'service', 'area', 'size', 'year', 'type', 'sort'],
        sizeBuckets: [
          { label: 'Under ½ acre', min: 0, max: 0.5 },
          { label: '½ to 2 acres', min: 0.5, max: 2 },
          { label: '2 to 5 acres', min: 2, max: 5 },
          { label: 'Over 5 acres', min: 5 },
        ],
        detailCtaLabel: 'Get an estimate for a similar job',
      },
      services: {
        eyebrow: 'Services',
        heading: 'Our *services*',
        lede: 'Hire us for one service or the whole job, from raw land to finished site.',
        image: media.hero,
      },
      posts: {
        eyebrow: 'Journal',
        heading: 'News & *tips*',
        lede: 'Project updates and practical advice for property owners.',
        image: media.c7,
      },
    },
    context: ctx,
  })

  // Refresh the running site's caches (docker compose seed service sets REVALIDATE_URL).
  if (process.env.REVALIDATE_URL) {
    const res = await fetch(process.env.REVALIDATE_URL, {
      method: 'POST',
      headers: { 'x-revalidate-secret': process.env.CRON_SECRET || '' },
    }).catch(() => null)
    payload.logger.info(
      `Cache refresh: ${res?.status ?? 'site not reachable (start it, it refreshes on boot)'}`,
    )
  }

  payload.logger.info('Seed complete ✔')
  process.exit(0)
}

// `payload run` exits once the module has evaluated, so the work must be awaited at top level.
try {
  await run()
} catch (err) {
  console.error(err)
  process.exit(1)
}
