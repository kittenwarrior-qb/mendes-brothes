/*
 * The annotated admin screenshots from the user guide (docs/handover), served from
 * /help/<id>.webp so the chat assistant can show them. Red numbers on a picture match
 * the numbered steps of the guide. Regenerate with scripts/handover/copy-help-images.mjs.
 */
export const helpImages = {
  'adm-login': 'The login screen',
  'adm-home': 'The home screen and the left menu',
  'adm-projects-list': 'The list of projects, with “Create New”',
  'adm-project-form':
    'Filling in a project: title, summary, cover photo, services, town, size, date, Publish',
  'adm-project-photos': 'The Photos tab of a project (gallery)',
  'adm-publish-bar': 'Status, preview (eye icon), “Publish changes” and Versions',
  'adm-posts-list': 'The list of news posts, with “Create New”',
  'adm-post-form': 'Writing a news post',
  'adm-pages-list': 'The list of pages',
  'adm-page-sections': 'The sections of a page: open, drag to move, ⋯ menu, “Add section”',
  'adm-page-section-open': 'Inside a section: heading, intro text, photo, look of the section',
  'adm-page-add-section': 'Choosing a new section by its picture',
  'adm-page-preview': 'Live preview while editing a page',
  'adm-versions': 'Versions: going back to an earlier version',
  'adm-photos-list': 'The photo library: Create New, Bulk Upload',
  'adm-photo-upload': 'Uploading a photo and its alt text',
  'adm-settings': 'The Settings screen',
  'adm-company': 'Company info: phone, email, address',
  'adm-logos': 'The Logos tab: light logo, white logo, favicon',
  'adm-menu': 'Editing the website menu',
  'adm-theme': 'Colours & fonts: picking a palette with live preview',
  'adm-theme-palettes': 'All the ready-made colour palettes',
  'adm-theme-custom': 'A custom palette from one brand colour',
  'adm-leads-list': 'The list of quote requests and the spreadsheet download',
  'adm-lead-detail': 'One quote request: status and notes',
  'adm-users-list': 'The list of users',
  'adm-user-create': 'Adding a user: email, password, name, role',
  'adm-account': 'My account: Change Password, language',
  'adm-password': 'Typing a new password',
  'adm-backups': 'Backups: back up now, download, restore, upload',
  'adm-stats': 'Statistics: visitors, pages, clicks, sources',
  'adm-ai-setup': 'Connecting a free AI key',
  'adm-ai-chat': 'Asking the assistant',
  'adm-ai-field': 'The AI button above a text box',
  'adm-ai-suggestion': 'An AI suggestion with “Use this”',
  'adm-ai-doc-menu': 'The AI menu next to Publish',
  'adm-ai-check': 'The result of “Check before publishing”',
  'adm-help': 'The Help screen',
} as const

export type HelpImageId = keyof typeof helpImages

export const isHelpImage = (id: string): id is HelpImageId => id in helpImages

export const helpImageUrl = (id: HelpImageId) => `/help/${id}.webp`

/** For the AI: the pictures it may show, one per line. */
export const helpImagesAsText = () =>
  (Object.keys(helpImages) as HelpImageId[]).map((id) => `- ${id}: ${helpImages[id]}`).join('\n')
