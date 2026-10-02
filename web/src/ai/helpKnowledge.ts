/*
 * How-to answers about the admin, in plain language. One source for three places:
 * the Help screen, the chat assistant's built-in answers (no AI key needed), and the
 * background knowledge given to the AI when a key is connected.
 */

import type { HelpImageId } from './helpImages'

export type HelpTopic = {
  id: string
  q: string
  /** words (any language the staff may type in) that point to this topic */
  keywords: string[]
  steps: string[]
  link?: { label: string; href: string }
  managerOnly?: boolean
  /** screenshots from the guide, shown with the answer */
  images?: HelpImageId[]
}

export const helpTopics: HelpTopic[] = [
  {
    id: 'project',
    images: ['adm-projects-list', 'adm-project-form', 'adm-project-photos'],
    q: 'Add a finished project',
    keywords: [
      'project',
      'projects',
      'job',
      'portfolio',
      'finished',
      'add project',
      'công trình',
      'dự án',
      'đăng công trình',
      'proyecto',
    ],
    steps: [
      'Open Projects and press “Create New”.',
      'Type a title and a short summary, and choose the cover photo (drag a photo in from your computer).',
      'Pick the services, the town, the lot size and the month it was finished.',
      'Optional: open the Photos tab to add more photos or a before/after pair.',
      'Press “Publish changes” (top right). It is on the website straight away.',
    ],
    link: { label: 'Create a project', href: '/admin/collections/projects/create' },
  },
  {
    id: 'page',
    images: ['adm-pages-list', 'adm-page-sections', 'adm-page-section-open'],
    q: 'Change text or a photo on a page',
    keywords: [
      'page',
      'pages',
      'text',
      'edit',
      'home',
      'homepage',
      'about',
      'contact',
      'change text',
      'heading',
      'trang',
      'sửa trang',
      'trang chủ',
      'nội dung',
      'chữ',
      'página',
    ],
    steps: [
      'Open Pages and click the page (Home, About…).',
      'Each row is one section of the page, from top to bottom. Click a row to open it.',
      'Change the text, or click the X on a photo and choose another one.',
      'Tip: wrap words in *stars* to show them in the highlight colour.',
      'Click the eye icon (top right) to see the page while you edit, then press “Publish changes”.',
    ],
    link: { label: 'Open Pages', href: '/admin/collections/pages' },
  },
  {
    id: 'section',
    images: ['adm-page-sections', 'adm-page-add-section'],
    q: 'Add, move or remove a section',
    keywords: [
      'section',
      'sections',
      'block',
      'layout',
      'move',
      'reorder',
      'order',
      'remove section',
      'add section',
      'bố cục',
      'bố trí',
      'khối',
      'thêm section',
      'sắp xếp',
      'diseño',
    ],
    steps: [
      'Open the page. At the bottom of the list press “Add section” and pick one by its picture.',
      'Drag the handle on the left of a row to move it up or down.',
      'Use the ⋯ menu on a row to duplicate or remove it.',
      'Open “Look of this section” inside a section to change its background or spacing.',
    ],
    link: { label: 'Open Pages', href: '/admin/collections/pages' },
  },
  {
    id: 'news',
    images: ['adm-posts-list', 'adm-post-form'],
    q: 'Write a news post',
    keywords: [
      'news',
      'post',
      'posts',
      'blog',
      'article',
      'write',
      'bài viết',
      'tin tức',
      'đăng bài',
      'noticia',
    ],
    steps: [
      'Open News and press “Create New”.',
      'Type the title, choose the photo for the top of the post, and write the text like in Word.',
      'Press “Publish changes”.',
    ],
    link: { label: 'Write a post', href: '/admin/collections/posts/create' },
  },
  {
    id: 'photos',
    images: ['adm-photos-list', 'adm-photo-upload'],
    q: 'Upload or replace photos',
    keywords: [
      'photo',
      'photos',
      'image',
      'images',
      'picture',
      'upload',
      'gallery',
      'alt',
      'ảnh',
      'hình',
      'hình ảnh',
      'tải ảnh',
      'foto',
    ],
    steps: [
      'Open Photos and press “Create New” for one photo, or “Bulk Upload” for several.',
      'Photos straight from a phone are fine: they are resized automatically.',
      'To change a photo that is already on a page, open that page or project, click the X on the photo and pick another.',
      'If a photo is cropped badly, open it in Photos, press “Edit Image” and move the focal point.',
    ],
    link: { label: 'Open Photos', href: '/admin/collections/media' },
  },
  {
    id: 'leads',
    images: ['adm-leads-list', 'adm-lead-detail'],
    q: 'Answer a quote request',
    keywords: [
      'quote',
      'request',
      'requests',
      'lead',
      'leads',
      'estimate',
      'customer',
      'form',
      'csv',
      'excel',
      'export',
      'báo giá',
      'yêu cầu',
      'khách',
      'khách hàng',
      'cotización',
    ],
    steps: [
      'Open Quote requests. New ones are also on the Home screen.',
      'Click a name to see the phone number, the service and the message.',
      'After you call them, change Status to Contacted, Quoted, Won or Lost and add a note.',
      'Use “Download all as a spreadsheet” to open the list in Excel.',
    ],
    link: { label: 'Open Quote requests', href: '/admin/collections/form-submissions' },
  },
  {
    id: 'company',
    images: ['adm-company', 'adm-logos'],
    q: 'Change the phone number, address, hours or logo',
    keywords: [
      'phone',
      'address',
      'hours',
      'logo',
      'favicon',
      'company',
      'email address',
      'social',
      'facebook',
      'số điện thoại',
      'địa chỉ',
      'giờ',
      'logo',
      'công ty',
      'teléfono',
    ],
    steps: [
      'Open Settings → Company info & logo.',
      'Phone, email, address and hours are in the Company tab.',
      'The logo is in the Logos tab: one for light backgrounds, one (white) for dark backgrounds, and a square favicon. A PNG with a transparent background works best.',
      'Press Save. The whole website updates: header, footer and contact page.',
    ],
    link: { label: 'Open Company info & logo', href: '/admin/globals/site-settings' },
    managerOnly: true,
  },
  {
    id: 'colours',
    images: ['adm-theme', 'adm-theme-palettes', 'adm-theme-custom'],
    q: 'Change the colours or fonts',
    keywords: [
      'colour',
      'colours',
      'color',
      'colors',
      'theme',
      'palette',
      'font',
      'fonts',
      'brand',
      'dark',
      'design',
      'style',
      'màu',
      'màu sắc',
      'mã màu',
      'giao diện',
      'phông',
      'font chữ',
      'tema',
    ],
    steps: [
      'Open Settings → Colours & fonts.',
      'Click a palette card. The website appears on the right in the new colours.',
      'For your own brand colour choose “Custom” and pick one colour; the rest is worked out for you.',
      'Further down you can change the fonts, corner roundness and button style.',
      'Press “Publish changes”. Visitors see nothing until you do.',
    ],
    link: { label: 'Open Colours & fonts', href: '/admin/globals/theme' },
    managerOnly: true,
  },
  {
    id: 'menu',
    images: ['adm-menu'],
    q: 'Change the website menu or footer',
    keywords: [
      'menu',
      'navigation',
      'nav',
      'links',
      'footer',
      'header',
      'thanh menu',
      'chân trang',
      'menú',
    ],
    steps: [
      'Open Settings → Menu for the links at the top of the website.',
      'Click a row to change its name or link; drag the handle to change the order; “Add Nav Item” adds one.',
      'The links at the bottom are under Settings → Footer.',
      'Press Save.',
    ],
    link: { label: 'Open Menu', href: '/admin/globals/header' },
    managerOnly: true,
  },
  {
    id: 'users',
    images: ['adm-users-list', 'adm-user-create'],
    q: 'Add a user or change what they may do',
    keywords: [
      'user',
      'users',
      'account',
      'role',
      'roles',
      'permission',
      'staff',
      'editor',
      'manager',
      'admin',
      'login',
      'người dùng',
      'tài khoản',
      'phân quyền',
      'quyền',
      'nhân viên',
      'usuario',
    ],
    steps: [
      'Open Settings → Users and press “Create New”.',
      'Type their email, a first password and their name.',
      'Choose the role: Editor for staff (content and quote requests), Manager for the owner (also settings, users, backups).',
      'Press Save, then give them the email and password.',
    ],
    link: { label: 'Open Users', href: '/admin/collections/users' },
    managerOnly: true,
  },
  {
    id: 'password',
    images: ['adm-account', 'adm-password'],
    q: 'Change or reset a password',
    keywords: [
      'password',
      'forgot',
      'reset',
      'locked',
      'unlock',
      'log in',
      'mật khẩu',
      'quên',
      'đổi mật khẩu',
      'khoá',
      'contraseña',
    ],
    steps: [
      'Your own password: click the account icon (top right), press “Change Password”, type the new one twice and Save.',
      'Someone forgot theirs: a manager opens Settings → Users, opens that person and presses “Change Password”.',
      'Locked after too many wrong tries: a manager opens that user and presses “Force Unlock”.',
    ],
    link: { label: 'Open my account', href: '/admin/account' },
  },
  {
    id: 'backup',
    images: ['adm-backups'],
    q: 'Back up or restore the website',
    keywords: [
      'backup',
      'backups',
      'restore',
      'download',
      'copy',
      'lost',
      'sao lưu',
      'khôi phục',
      'tải về',
      'copia',
    ],
    steps: [
      'Open Settings → Backups and press “Back up now”.',
      'Press Download to keep a copy on your computer.',
      'A backup is also made automatically every day.',
      'To go back to an older state press Restore — the current state is saved first, so it can be undone.',
    ],
    link: { label: 'Open Backups', href: '/admin/backups' },
    managerOnly: true,
  },
  {
    id: 'stats',
    images: ['adm-stats'],
    q: 'See how many people visit the website',
    keywords: [
      'statistics',
      'stats',
      'analytics',
      'visitors',
      'visits',
      'views',
      'traffic',
      'clicks',
      'how many people',
      'thống kê',
      'lượt xem',
      'lượt truy cập',
      'lượt click',
      'khách truy cập',
      'visitas',
    ],
    steps: [
      'Open Statistics in the left menu.',
      'Choose the last 7, 30 or 90 days (top right).',
      'The four numbers at the top are visitors, pages viewed, phone-number clicks and quote requests, each compared with the period before.',
      'Below are the most viewed pages, where visitors came from, what they clicked, and addresses people tried that do not exist.',
      'Your own visits while you are logged in are not counted.',
    ],
    link: { label: 'Open Statistics', href: '/admin/statistics' },
  },
  {
    id: 'publish',
    images: ['adm-publish-bar', 'adm-page-preview'],
    q: 'Publish, preview or hide something',
    keywords: [
      'publish',
      'draft',
      'preview',
      'unpublish',
      'hide',
      'live',
      'not showing',
      'status',
      'đăng',
      'xuất bản',
      'nháp',
      'xem thử',
      'ẩn',
      'publicar',
    ],
    steps: [
      'Changes are saved as a draft while you type. Visitors see them only after you press “Publish changes”.',
      'The eye icon (top right) shows a preview next to the form.',
      'To hide a page, project or post, open it, press the ⋮ button and choose “Unpublish”.',
      'If the website did not change, check that Status says “Published”.',
    ],
  },
  {
    id: 'undo',
    images: ['adm-versions'],
    q: 'Undo a mistake',
    keywords: [
      'undo',
      'mistake',
      'version',
      'versions',
      'history',
      'revert',
      'wrong',
      'deleted',
      'hoàn tác',
      'sửa nhầm',
      'phiên bản',
      'lịch sử',
      'xoá nhầm',
      'deshacer',
    ],
    steps: [
      'Open the page or project, then the Versions tab (top right).',
      'Pick an earlier version and press “Restore this version”.',
      'For bigger accidents a manager can restore a backup under Settings → Backups.',
    ],
  },
  {
    id: 'ai',
    images: ['adm-ai-setup', 'adm-ai-field', 'adm-ai-suggestion', 'adm-ai-doc-menu'],
    q: 'Get help from the AI assistant',
    keywords: [
      'ai',
      'assistant',
      'spelling',
      'grammar',
      'translate',
      'seo',
      'google',
      'key',
      'gemini',
      'chính tả',
      'dịch',
      'trợ lý',
      'token',
    ],
    steps: [
      'A manager connects it once under Settings → AI assistant (a free Google key takes two minutes).',
      'Click into any text box and press the small “AI” button above it to fix spelling, make the text clearer or shorter, or translate it to English.',
      'On a page, project, news post or service, press “AI” next to the Publish button to write the Google title and description, write a project description, or check the page for mistakes.',
      'The AI only suggests. Read the suggestion, press “Use this” if you like it, then publish as usual.',
    ],
    link: { label: 'Open AI assistant', href: '/admin/ai' },
  },
]

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * The built-in answer: the topic whose keywords best match the question, or null when
 * nothing fits. Longer (more specific) keywords count for more.
 */
export const matchTopic = (question: string): HelpTopic | null => {
  const text = ` ${normalise(question)} `
  let best: { topic: HelpTopic; score: number } | null = null
  for (const topic of helpTopics) {
    let score = 0
    for (const keyword of topic.keywords) {
      const k = normalise(keyword)
      if (k && text.includes(` ${k} `)) score += k.includes(' ') ? 3 : k.length > 4 ? 2 : 1
    }
    if (score > 0 && (!best || score > best.score)) best = { topic, score }
  }
  return best?.topic ?? null
}

/** The whole guide as text, for the AI's background knowledge. */
export const helpAsText = () =>
  helpTopics
    .map(
      (t) =>
        `### ${t.q}${t.managerOnly ? ' (managers only)' : ''}\n${t.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}${t.link ? `\nScreen: ${t.link.href}` : ''}`,
    )
    .join('\n\n')
