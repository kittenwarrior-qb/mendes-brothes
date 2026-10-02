/* English text of the handover report + user guide. Keep in step with content.vi.mjs. */

const site = (name, title, { full } = {}) => [
  { h3: title },
  { img: `site-${name}-desktop.jpg`, caption: `${title} — desktop` },
  ...(full
    ? [
        {
          img: `site-${name}-desktop-full.jpg`,
          caption: `${title} — the whole page on desktop (read left to right)`,
        },
      ]
    : []),
  { img: `site-${name}-mobile.jpg`, caption: `${title} — phone (read left to right)` },
]

export const doc = {
  fileName: 'Mendez-Brothes-Handover-and-User-Guide-EN',
  footer: 'Mendez Brothes — Handover & user guide',
  tocTitle: 'Contents',
  cover: {
    title: 'Handover Report & User Guide',
    subtitle: 'Mendez Brothes General Construction website',
    facts: [
      ['Handover date', 'October 2, 2026'],
      ['Website address', '[domain — to be filled in at handover]'],
      ['Admin panel', '[domain]/admin'],
      ['Admin login', 'Sent separately, not written in this document'],
      ['Document version', '1.0'],
    ],
  },
  body: [
    // ───────────────────────── 1
    { h1: '1. Handover summary' },
    {
      p: 'A company website with an admin panel, so you can update the content yourself without a developer. Changes made in the admin panel appear on the website as soon as you publish them.',
    },
    { h2: 'What has been delivered' },
    {
      table: [
        ['Item', 'Details'],
        [
          'Website',
          'Home, About, Services (10 services, one page each), Projects (with filters), Equipment & Technology, Contact, News, and a page for each town you serve. Works on computers and phones.',
        ],
        [
          'Project filters',
          'Filter by service, town, lot size, year and client type, plus a search box.',
        ],
        [
          'Estimate form',
          'Visitors fill in the form on the website; each request lands in **Quote requests**. The list can be exported to Excel (CSV).',
        ],
        [
          'Admin panel',
          'Add projects and news posts, edit every page, change photos, logo, colours and menu.',
        ],
        [
          'Colours',
          '13 ready-made palettes, plus a tool that builds a palette from one brand colour. Preview before it goes live.',
        ],
        ['User roles', '3 levels: Editor (staff), Manager (owner), Admin (technical).'],
        [
          'Backups',
          'Automatic every day, the last 7 are kept. Download or restore one at any time from the admin panel.',
        ],
        [
          'AI assistant',
          'A chat that answers questions about the admin panel. Add a free AI key to fix spelling, write descriptions and Google titles, describe photos and check a page before publishing.',
        ],
        [
          'Statistics',
          'Visitors, pages viewed, phone clicks, sources, redirects and 404s — right in the admin, no outside service, no cookies.',
        ],
      ],
      widths: [24, 76],
    },
    { h2: 'To do before going live' },
    {
      bullets: [
        '**Replace the sample photos with your own job photos.** The current photos are placeholders from Wikimedia Commons.',
        '**Replace the sample text.** Reviews and posts marked [DEMO] are examples.',
        '**Set up email.** It is not switched on yet, so there are no email alerts for new quote requests and "Forgot password" does not work. This needs the details of a company mailbox (SMTP).',
        '**Change the admin password** right after the first login (section 3.12).',
        '**Give each person their own login** instead of sharing one (section 3.11).',
      ],
    },

    // ───────────────────────── 2
    { h1: '2. The website' },
    {
      p: 'Screenshots of every page, on a computer and on a phone. Long pages are cut into columns; read them left to right.',
    },
    ...site('home', 'Home', { full: true }),
    ...site('about', 'About Us'),
    ...site('services', 'Services'),
    ...site('service-detail', 'One service'),
    ...site('projects', 'Projects — with filters', { full: true }),
    ...site('project-detail', 'One project', { full: true }),
    ...site('capabilities', 'Equipment & Technology'),
    ...site('contact', 'Contact'),
    ...site('news', 'News'),
    ...site('news-post', 'One news post'),
    ...site('area', 'Town page'),
    { h3: 'Menu on a phone' },
    {
      img: 'site-menu-mobile.jpg',
      caption: 'The menu opens full screen, with a call button',
      width: 250,
    },

    // ───────────────────────── 3
    { h1: '3. Using the admin panel' },
    {
      p: 'In the pictures below, each red number matches the step with the same number.',
    },
    {
      note: 'You cannot break anything: every change to a page or project is kept in a history and can be undone (section 3.14). Visitors only see a change after you press **Publish changes**.',
    },

    { h2: '3.1 Logging in' },
    { p: 'Open **[domain]/admin** in your browser.' },
    { img: 'adm-login.jpg', width: 430 },
    {
      steps: [
        'Type your **Email**.',
        'Type your **Password**.',
        'Press **Login**.',
        '**Forgot password?** emails you a reset link. It only works once company email has been set up; until then, ask a Manager to reset your password (section 3.12).',
      ],
    },

    { h2: '3.2 The home screen', newPage: true },
    { img: 'adm-home.jpg' },
    {
      steps: [
        'Everyday work: **Quote requests**, **Pages**, **Projects**, **News**, **Photos**, **Statistics**.',
        'About your company: **Services**, **Equipment**, **Reviews**.',
        '**Settings**, **Help** (short how-to guides inside the admin panel), **View website**, **Log out**.',
        'New quote requests. Click to open them.',
        'Shortcuts to the most common tasks.',
        'Your account: change your password or the language.',
      ],
    },

    { h2: '3.3 Adding a finished project', newPage: true },
    { p: 'Once published, a project shows up on the Projects page and in the filters by itself.' },
    { img: 'adm-projects-list.jpg' },
    {
      steps: [
        'Click **Projects** in the left menu.',
        'Click **Create New** to add a project.',
        'Search and filters, useful once the list gets long.',
        'Click the name of an existing project to edit it.',
      ],
    },
    { p: 'Fill in the **Overview** tab:' },
    { img: 'adm-project-form.jpg' },
    {
      steps: [
        '**Title**: the name of the project.',
        '**Summary**: one or two sentences, shown under the title.',
        '**Cover photo**: the main photo. Click the box, then **Create New** to upload a photo from your computer or **Choose from existing** to use one already uploaded. To change it, click the **X** and choose again.',
        '**Services**: pick one or more. The first one is shown on the project card.',
        '**Town / service area**: the town. If it is not in the list, click **+** to add it.',
        '**Lot / work area size**: the size and its unit (acres or sq ft).',
        '**Completed**: the month the job was finished.',
        'Press **Publish changes**. The project is on the website straight away.',
      ],
    },
    { p: 'Add more photos in the **Photos** tab:' },
    { img: 'adm-project-photos.jpg', width: 520 },
    {
      steps: [
        'Open the **Photos** tab.',
        'Each box is one photo in the gallery, with an optional **Caption**. Drag the ⠿ handle to change the order.',
      ],
    },
    {
      p: 'At the end of the list there is a button to add another photo, and below it a **Before / After** pair that visitors can compare with a slider.',
    },

    { h2: '3.4 Drafts, preview and publishing', newPage: true },
    { p: 'This toolbar is on every page, project and news post.' },
    { img: 'adm-publish-bar.jpg' },
    {
      steps: [
        '**Status**: "Published" means it is live; "Changed" or "Draft" means there are changes that are not live yet. Your changes are saved as a draft while you type.',
        'The eye icon: preview the result next to the form while you edit.',
        '**Publish changes**: put the changes on the website.',
        '**Versions**: the history of changes, used to go back to an older version (section 3.14).',
      ],
    },

    { h2: '3.5 Writing a news post' },
    { img: 'adm-posts-list.jpg' },
    { steps: ['Click **News**.', 'Click **Create New**.'] },
    { img: 'adm-post-form.jpg' },
    {
      steps: [
        '**Title**: the headline.',
        '**Hero Image**: the photo at the top of the post.',
        'Formatting bar: sub-headings, bold, italic, links, photos.',
        'The text of the post. Type it as you would in Word.',
        'Press **Publish changes**.',
      ],
    },

    { h2: '3.6 Editing a page', newPage: true },
    {
      p: 'Use this to change the text, photos or layout of Home, About, Equipment & Technology and Contact.',
    },
    { img: 'adm-pages-list.jpg' },
    { steps: ['Click **Pages**.', 'Click the page you want to edit, for example **Home**.'] },
    {
      p: 'A page is a list of **sections**, top to bottom, in the same order as on the website:',
    },
    { img: 'adm-page-sections.jpg' },
    {
      steps: [
        'Click a row to open that section and edit it.',
        'Drag the ⠿ handle to move a section up or down.',
        'The **⋯** button: **Duplicate** or **Remove** the section.',
        '**Add section**: add a new one.',
        'The eye icon: preview the page while you edit.',
        '**Publish changes**: make the changes live.',
      ],
    },
    { p: 'Inside a section (here, the large photo at the top of Home):' },
    { img: 'adm-page-section-open.jpg', width: 520 },
    {
      steps: [
        '**Heading**: the title. Put stars around words, for example *We build ground.*, to show them in a different colour.',
        '**Intro text**: the short introduction.',
        '**Main photo**: the photo of the section. Click the **X**, then choose another photo.',
        '**Look of this section**: background, spacing, hide on phones. You rarely need this.',
      ],
    },
    { p: 'When you press **Add section**, pick the kind of section by its picture:' },
    { img: 'adm-page-add-section.jpg', width: 520 },
    {
      p: 'To preview while you edit, click the eye icon. The website appears on the right and follows every change.',
    },
    { img: 'adm-page-preview.jpg' },
    {
      steps: [
        'Switch the preview on or off.',
        'The preview. You can choose phone, tablet or desktop size.',
      ],
    },

    { h2: '3.7 Photos: uploading and replacing', newPage: true },
    { img: 'adm-photos-list.jpg' },
    {
      steps: [
        'Click **Photos** to open the photo library.',
        '**Create New**: upload one photo.',
        '**Bulk Upload**: upload several photos at once.',
        'Click a file name to change its description or replace the file.',
      ],
    },
    {
      note: 'Photos straight from a phone are fine. They are resized and compressed automatically, so there is no need to shrink them first.',
    },
    { img: 'adm-photo-upload.jpg' },
    {
      steps: [
        'Drag a photo from your computer onto this box, or click **Select a file**.',
        '**Alt text**: a few words saying what the photo shows (it helps Google). If left empty, the file name is used.',
        'Press **Save**.',
      ],
    },

    { h2: '3.8 Logo and company details', newPage: true },
    {
      p: 'Open **Settings** at the bottom of the left menu. Everything you set up once and rarely change is here.',
    },
    { img: 'adm-settings.jpg' },
    {
      steps: [
        'Click **Settings**.',
        '**Company info & logo**: phone, address, opening hours, logo.',
        '**Colours & fonts**: colours and typefaces (section 3.9).',
        '**Users**: logins and roles (section 3.11).',
        '**Backups** (section 3.13).',
      ],
    },
    { p: 'To change the logo, open **Company info & logo**:' },
    { img: 'adm-logos.jpg' },
    {
      steps: [
        'Open the **Logos** tab.',
        'The logo for light backgrounds (top of every page). Click the **X**, then upload the new logo. A PNG with a transparent background works best.',
        'The logo for dark backgrounds (the white version), used over the home photo and in the footer.',
        '**Favicon**: the small icon in the browser tab. Use a square image.',
        'Press **Save**. The new logo is used across the whole website.',
      ],
    },
    { p: 'Phone number, email and address are in the **Company** tab:' },
    { img: 'adm-company.jpg' },
    {
      steps: [
        'Open the **Company** tab.',
        '**Phone**: shown in the header, the footer and on the Contact page.',
        '**Email**.',
        'Press **Save**.',
      ],
    },
    { p: 'To change the links in the website menu, open **Settings → Menu**.' },
    { img: 'adm-menu.jpg', width: 520 },
    {
      steps: [
        'Click a row to change its name or link; drag ⠿ to change the order.',
        '**Add Nav Item**: add a new link.',
        'Press **Save**.',
      ],
    },

    { h2: '3.9 Changing the colours', newPage: true },
    { p: 'Open **Settings → Colours & fonts**.' },
    { img: 'adm-theme.jpg' },
    {
      steps: [
        'Click a palette to choose it.',
        'The website appears on the right in the new colours. Visitors still see the old colours at this point.',
        'Switch the preview on or off.',
        'Happy with it? Press **Publish changes**. Until you do, the website does not change.',
      ],
    },
    { p: 'There are 13 ready-made palettes:' },
    { img: 'adm-theme-palettes.jpg', width: 460 },
    { p: 'To use your own brand colour, choose **Custom**:' },
    { img: 'adm-theme-custom.jpg' },
    {
      steps: [
        'Choose the **Custom** card.',
        '**Brand colour**: click the colour box and pick your colour. The other colours are worked out to match it and stay easy to read.',
        '**Greys & backgrounds**: warm, neutral or cool backgrounds.',
      ],
    },
    {
      note: 'Further down the same screen you can change the typefaces, the roundness of corners and the button style. All of it can be previewed before publishing.',
    },

    { h2: '3.10 Quote requests', newPage: true },
    {
      p: 'Each time a visitor sends the estimate form, a new request appears on the home screen and under **Quote requests**.',
    },
    { img: 'adm-leads-list.jpg' },
    {
      steps: [
        'Click **Quote requests**. The orange number is how many are still new.',
        'Click a name to see the details.',
        'Download the whole list as a spreadsheet that opens in Excel.',
      ],
    },
    { img: 'adm-lead-detail.jpg' },
    {
      steps: [
        '**Status**: update it as you follow up: New → Contacted → Quoted → Won / Lost.',
        '**Your notes**: private notes, never shown to the customer.',
        'Press **Save**.',
      ],
    },

    { h2: '3.11 Users and roles', newPage: true },
    {
      table: [
        ['Role', 'For', 'Can do'],
        [
          '**Editor**',
          'Staff',
          'Add projects and news, edit pages, upload photos, handle quote requests.',
        ],
        [
          '**Manager**',
          'The owner',
          'Everything an Editor can, plus company details, logo, colours, menu, users and backups.',
        ],
        [
          '**Admin**',
          'Technical contact',
          'Everything a Manager can, plus the technical settings.',
        ],
      ],
      widths: [18, 22, 60],
    },
    { p: 'To add a login, open **Settings → Users**.' },
    { img: 'adm-users-list.jpg' },
    {
      steps: [
        'Click **Create New**.',
        'Click an existing user to edit them or reset their password.',
      ],
    },
    { img: 'adm-user-create.jpg' },
    {
      steps: [
        '**Email**: what they log in with.',
        '**New Password**: their first password.',
        '**Confirm Password**: the same password again.',
        '**Name**.',
        '**Role**: choose from the table above. For staff, choose "Editor".',
        'Press **Save**, then give the person their email and password.',
      ],
    },
    {
      note: 'Only an Admin can give or take away the Admin role. When someone leaves the company, open their user, click the ⋮ button and choose **Delete**.',
    },

    { h2: '3.12 Changing and resetting passwords', newPage: true },
    { p: 'To change your own password:' },
    { img: 'adm-account.jpg' },
    {
      steps: [
        'Click the account icon in the top right corner.',
        'Click **Change Password**.',
        '**Language**: the language of the admin panel.',
      ],
    },
    { img: 'adm-password.jpg' },
    { steps: ['Type the new password.', 'Type it again.', 'Press **Save**.'] },
    {
      bullets: [
        '**Forgot your password:** ask a Manager to open **Settings → Users**, open your user, click **Change Password** and set a new one.',
        '**Locked out** after too many wrong attempts: a Manager opens that user and clicks **Force Unlock**.',
        'Use a long password (12 characters or more) that you do not use anywhere else.',
      ],
    },

    { h2: '3.13 Backups', newPage: true },
    { p: 'Open **Settings → Backups**. A backup holds all the content and photos of the website.' },
    { img: 'adm-backups.jpg' },
    {
      steps: [
        '**Back up now**: make a backup straight away. Do this before any large change.',
        '**Download**: save the backup to your computer.',
        '**Restore**: put the website back to how it was at that moment. A safety backup is made first, so a restore can itself be undone.',
        '**Upload a backup file**: bring a backup file in from your computer.',
      ],
    },
    {
      note: 'The website backs itself up every day and keeps the last 7. These sit on the same server as the website, so press **Download** about once a month to keep a copy on a company computer.',
    },

    { h2: '3.14 Undoing a mistake' },
    { p: 'Each time a page, project or post is published, the previous version is kept.' },
    { img: 'adm-versions.jpg' },
    {
      steps: [
        'Open the page you want to bring back and click the **Versions** tab.',
        'Click the version you want, then press **Restore this version**.',
      ],
    },

    { h2: '3.16 Visitor statistics', newPage: true },
    {
      p: 'The website counts its own visits; no Google Analytics or other service is needed. The four numbers for the last 7 days are on the Home screen; click them for the details.',
    },
    { img: 'adm-stats.jpg' },
    {
      steps: [
        'Click **Statistics** in the left menu.',
        'Choose the period: the last 7, 30 or 90 days.',
        'The four headline numbers: **Visitors**, **Pages viewed**, **Phone number clicked** and **Quote requests**, each compared with the period before.',
        'Visitors per day. Point at a day to see its numbers, or press “Show the numbers as a table”.',
        'The details: most viewed pages, where visitors came from (Google, Facebook, typed in…), what they clicked, phone or computer, redirects used and addresses that do not exist (404).',
      ],
    },
    {
      note: 'No cookies and nothing personal is stored, only daily totals. Robots and you yourself while logged in are not counted. If a 404 address keeps coming back, create a redirect for it.',
    },

    { h2: '3.15 The AI assistant', newPage: true },
    {
      p: 'The admin panel has a built-in assistant. Out of the box it answers “how do I…” questions. With a free AI key added, it answers any question and you also get AI buttons while you write.',
    },
    { h3: 'Asking the assistant' },
    { img: 'adm-ai-chat.jpg', width: 430 },
    {
      steps: [
        'Click the round logo button in the bottom right corner. It is on every screen.',
        'Type your question and press Enter.',
        'The assistant answers step by step, with a button that opens the right screen.',
      ],
    },
    {
      note: 'With an AI key connected, the assistant also gives advice: which colours or fonts to pick, how to prepare a logo, how to arrange a page, how to word an introduction.',
    },
    { h3: 'Quick commands: change the logo, phone number, colours… from the chat' },
    {
      p: 'Type **/** in the chat box to see the commands. Commands need no AI key and do exactly what you type — no guessing.',
    },
    { img: 'adm-ai-commands.jpg', width: 430 },
    {
      steps: [
        'Type **/** and the list of commands appears. Type a few letters to narrow it, then press Tab or click one.',
        'For a photo: drag it into the chat (or paste it, or press the paperclip), then type the command, for example **/logo**.',
      ],
    },
    { img: 'adm-ai-command-card.jpg', width: 430 },
    {
      steps: [
        'The photo and the command you sent.',
        'A preview card shows the old value → the new one.',
        'Nothing changes until you press **Apply**; press **Cancel** if you change your mind. After applying, **Undo** puts the old value back.',
      ],
    },
    {
      table: [
        ['Command', 'What it does', 'Example'],
        [
          '**/logo**, **/logo-dark**, **/badge**, **/favicon**',
          'Replace the logo for light backgrounds, for dark backgrounds, the round badge, the browser tab icon',
          '/logo + drop the logo file',
        ],
        ['**/photos**', 'Add photos to the Photos library', '/photos + drop several photos'],
        [
          '**/project** title',
          'Create a draft project from photos (the first one is the cover)',
          '/project Pool dig in Lewes',
        ],
        [
          '**/phone**, **/email**, **/hours**, **/tagline**',
          'Change the phone number, email, opening hours, tagline',
          '/phone 302-555-0100',
        ],
        [
          '**/address**',
          'Change the address (street, town, state zip)',
          '/address 12 Main St, Lewes, DE 19958',
        ],
        ['**/color** hex', 'Build a palette from your brand colour (draft)', '/color #1D5FA8'],
        ['**/palette** name', 'Switch to a ready-made palette (draft)', '/palette Studio'],
      ],
      widths: [30, 42, 28],
    },
    {
      note: 'Drop a photo without a command and the assistant asks what to do with it (logo, favicon, add to Photos, new project). You can also paste a photo link after the command, e.g. /logo https://…/logo.png. Logo, company info and colour commands are for Managers. Colours are saved as a draft: open Colours & fonts, preview, then press Publish.',
    },
    { h3: 'Connecting a free AI key (once, Managers only)' },
    { p: 'Open **Settings → AI assistant**:' },
    { img: 'adm-ai-setup.jpg' },
    {
      steps: [
        'Choose a service. **Google Gemini** is free with a Google account and needs no card.',
        'Click **Open Google to get a key**. Google AI Studio opens: sign in, press **Create API key** and copy the key.',
        'Paste the key here.',
        'Press **Test & save**. The key is tested first; if it works you see “Connected”.',
      ],
    },
    {
      note: 'The key is stored encrypted on the server and never shown again. The free plan allows a limited number of requests per minute; if the assistant says it is busy, wait a minute and try again. Text you ask the AI to work on is sent to the service you chose.',
    },
    { h3: 'The AI button on a text box' },
    { img: 'adm-ai-field.jpg' },
    {
      steps: [
        'Click into any text box and type.',
        'The **AI** button appears above the box. Click it and choose: fix spelling, make it clearer, make it shorter, or translate to English.',
      ],
    },
    { img: 'adm-ai-suggestion.jpg' },
    {
      p: '**3** is the suggestion; you can edit it. **4** — press **Use this** to put it in the box. Until you do, your own text stays as it was.',
    },
    { h3: 'The AI button next to Publish' },
    { img: 'adm-ai-doc-menu.jpg' },
    {
      steps: [
        'Click **AI** on the page, project, news post or service you have open.',
        'Choose: **Write the description** (a project write-up from the details you entered), **Write Google title & description** (what shows in search results), or **Check before publishing**.',
      ],
    },
    { p: 'The check lists each thing to look at and how to fix it:' },
    { img: 'adm-ai-check.jpg' },
    {
      bullets: [
        '**Photos:** new uploads get a description written by the AI. For an older photo, open it in **Photos** and press **Describe this photo**.',
        'The AI only suggests. The website changes only after you press **Use this** and then **Publish changes**.',
      ],
    },

    // ───────────────────────── 4
    { h1: '4. Common questions' },
    {
      table: [
        ['Situation', 'What to do'],
        [
          'I changed something but the website looks the same',
          'Check that you pressed **Publish changes** (or **Save**). If **Status** still says "Changed" or "Draft", the change is not live yet.',
        ],
        [
          'I want to hide a project or post for now',
          'Open it, click the **⋮** button at the right of the toolbar and choose **Unpublish**. Press **Publish changes** to show it again.',
        ],
        [
          'A photo is cropped in the wrong place',
          'Open the photo in **Photos**, click **Edit Image** and move the focal point onto the part that must stay visible.',
        ],
        [
          'No email arrives when someone asks for a quote',
          'Email has not been set up yet. Until it is, new requests are shown on the home screen of the admin panel.',
        ],
        [
          'Something was deleted or badly changed',
          'Use **Versions** for a single page (section 3.14), or **Restore** a backup for the whole website (section 3.13).',
        ],
        ['I need a quick reminder while working', 'Click **Help** in the left menu.'],
      ],
      widths: [38, 62],
    },
  ],
}
