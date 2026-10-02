/**
 * Plain-language names and groups for the page sections, shown in the
 * "Add section" picker and in each section's header. Pure data (no imports) so
 * both the Payload config and admin client components can use it.
 */
export type BlockMeta = { label: string; group: string; hint: string }

export const blockMeta: Record<string, BlockMeta> = {
  heroHome: {
    label: 'Big photo header',
    group: '1 · Top of the page',
    hint: 'Full-screen photo with a large headline. Best as the first section of the home page.',
  },
  pageHero: {
    label: 'Page title header',
    group: '1 · Top of the page',
    hint: 'Large page title, with a photo beside it if you like. Use as the first section of every other page.',
  },

  servicesGrid: {
    label: 'Services',
    group: '2 · What you do',
    hint: 'Your services as tiles. Filled in automatically from Services.',
  },
  featuredProjects: {
    label: 'Projects',
    group: '2 · What you do',
    hint: 'Your latest or hand-picked finished projects.',
  },
  equipmentGrid: {
    label: 'Equipment',
    group: '2 · What you do',
    hint: 'Your machines. Filled in automatically from Equipment.',
  },
  serviceAreas: {
    label: 'Towns we serve',
    group: '2 · What you do',
    hint: 'The list of towns, from Towns we serve.',
  },

  split: {
    label: 'Text + photo',
    group: '3 · Tell your story',
    hint: 'A paragraph next to a photo.',
  },
  cards: {
    label: 'Feature cards',
    group: '3 · Tell your story',
    hint: 'Three or four short points side by side.',
  },
  steps: {
    label: 'Steps (how it works)',
    group: '3 · Tell your story',
    hint: 'A numbered process, e.g. call → site walk → estimate → work.',
  },
  stats: {
    label: 'Big numbers',
    group: '3 · Tell your story',
    hint: 'A few large figures with labels.',
  },
  checklist: { label: 'Checklist', group: '3 · Tell your story', hint: 'A list of ticked items.' },
  gallery: {
    label: 'Photo gallery',
    group: '3 · Tell your story',
    hint: 'A grid of photos that open full-screen.',
  },
  marquee: {
    label: 'Scrolling text strip',
    group: '3 · Tell your story',
    hint: 'A moving band of words (your service names).',
  },

  testimonials: {
    label: 'Reviews',
    group: '4 · Build trust',
    hint: 'Customer reviews, from Reviews.',
  },
  faq: {
    label: 'Questions & answers',
    group: '4 · Build trust',
    hint: 'Common questions, from FAQs.',
  },

  contactSection: {
    label: 'Contact form + info',
    group: '5 · Get the call',
    hint: 'The estimate form next to your phone, address and hours.',
  },
  ctaBand: {
    label: 'Call-to-action banner',
    group: '5 · Get the call',
    hint: 'A bold banner with your phone number and a button.',
  },

  content: {
    label: 'Rich text columns',
    group: '6 · Advanced',
    hint: 'Free-form text in one to three columns.',
  },
  mediaBlock: {
    label: 'Single image or video',
    group: '6 · Advanced',
    hint: 'One large image or video with a caption.',
  },
  formBlock: {
    label: 'Form only',
    group: '6 · Advanced',
    hint: 'A form without the contact card.',
  },
  archive: { label: 'News list', group: '6 · Advanced', hint: 'A list of news posts.' },
}

/** The text field that best names a section in the editor list. */
export const blockTitleOf = (data?: Record<string, unknown> | null): string => {
  if (!data) return ''
  const raw = data.heading ?? data.eyebrow ?? data.caption
  return typeof raw === 'string' ? raw.replace(/\*/g, '') : ''
}
