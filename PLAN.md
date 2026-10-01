# Mendez Brothes — Website CMS "WordPress-like" · Kế hoạch triển khai

> Ngày lập: 2026-10-01 · Trạng thái: **Phase 0–5 (bản RAW đầy đủ chức năng) ĐÃ XONG** — code ở `web/`, xem `web/README.md` và `web/DEPLOY.md`

## ✅ Tiến độ (cập nhật 2026-10-01)

**Quyết định đã chốt:** tên dùng đúng như logo **"Mendez Brothes"** · deploy **phương án B** (VPS + Docker Compose + Caddy, database nằm trong Docker, không dùng bên thứ ba) · giao diện "Industrial Editorial" thay Mẫu 1 · màu chưa chốt nên admin tự chỉnh được.

| Phase | Trạng thái | Ghi chú |
|---|---|---|
| 0 Khởi tạo | ✅ | Payload 3.90 + Next 16.3, Postgres 17, pnpm 10 |
| 1 Data model & Admin | ✅ | 11 collection, 5 global, phân quyền admin/editor, admin song ngữ EN/VI, dashboard lối tắt + đếm lead mới |
| 2 Theme system | ✅ | 3 preset (Classic Orange, Heavy Iron, Earth & Stone), bộ chọn màu, 9 font tự host, bo góc/nút/card/header/footer, **tự sửa tương phản WCAG AA** |
| 3 Blocks & trang | ✅ | 20 block kéo-thả; Home/About/Capabilities/Contact; Services, Areas (SEO địa phương), News, Search, 404 |
| 4 Projects & lọc | ✅ | Lọc theo dịch vụ / diện tích / thị trấn / năm / loại khách + tìm kiếm + sắp xếp + phân trang, state trên URL; trang chi tiết có gallery lightbox + before/after |
| 5 Form, SEO, QA, deploy | ✅ | Form báo giá + honeypot + rate-limit + mini-CRM; JSON-LD, sitemap, robots; 17 unit + 11 e2e test; Docker + Caddy đã chạy thử toàn stack |
| 6 Giao diện 2026 | ✅ | Thay toàn bộ bố cục Mẫu 1 bằng phong cách "Industrial Editorial" (xem `docs/DESIGN.md`) |
| 7 Demo mới | ❌ bỏ | Thay bằng 6 bảng màu + tự sinh bảng màu từ 1 màu thương hiệu |
| + Backup trong admin | ✅ | Tạo / tải về / khôi phục / upload / lịch tự động |

**Đo thực tế (bản production, giao diện mới):** Lighthouse desktop **100/100/100/100**; mobile (giả lập 4G chậm) Performance 85–91, Accessibility/Best Practices/SEO **100**, CLS 0. RAM khi chạy ~300 MB. 39 unit test + 12 test e2e pass.

**Khác so với plan ban đầu:** font tự host thay vì `next/font` (build không cần internet) · bỏ AdminBar của template (tiết kiệm ~60 KB JS cho mỗi khách) · ảnh lưu trên volume của VPS thay vì R2 · tạm chưa làm: song ngữ EN/ES cho website, form nhiều bước có upload ảnh, Turnstile, xuất CSV lead, ảnh OG tự sinh.

---
> Nguồn gốc: khách đã chọn **Mẫu 1** (`index.html` — 5 trang SPA: Home / About / Equipment / Projects / Contact, font Russo One + Montserrat, màu cam `#D96F25`).
> Mục tiêu: biến Mẫu 1 thành một website thật có **trang quản trị** để khách tự sửa gần như mọi thứ (logo, nội dung, ảnh, dự án, màu sắc, bố cục), deploy **nhẹ – nhanh – không lỗi**.

---

## 0. Dữ kiện đang có & còn thiếu

### Đã có
| Tài sản | File | Ghi chú |
|---|---|---|
| Logo tròn (loader + đường + máy xúc) | `1790…d0b2530c….jpg` | Chỉ có JPG nền xám → **cần vector hoá ra SVG** (bản màu, bản trắng, bản icon-only) |
| Banner quảng cáo | `1790…c9e26327….jpg` | Có địa chỉ: *21063 Camp Arrowhead Rd, Lewes, DE 19958*, phone *+1 302-563-8888*, có YouTube / Instagram / Facebook |
| Danh sách 10 dịch vụ (EN/VI) | `1790…9137dac2….jpg` | Forestry Mulching, Land Clearing – Landscaping, Grading, Demolition, Excavation, Driveways / Parking Areas, Building Pads, Clean Ups, Pavers, Siding – Roofing |
| Ảnh AI | `images/` (15 ảnh) | `hero, dig, cab, roof, p1–p3, c4–c9, c11, c12` → dùng làm **seed data** |
| 4 mẫu demo HTML | `index.html` (Mẫu 1), `mau-a.html`, `mau-b.html`, `original.html` | Mẫu 1 là chuẩn tham chiếu về bố cục |

### ⚠️ Cần xác nhận với khách
- [x] **Tên**: dùng đúng như logo — **"Mendez Brothes"** (đã chốt 2026-10-01).
- [ ] Domain, email doanh nghiệp, giờ làm việc, license/insurance number (khách US hay hỏi "Licensed & Insured").
- [ ] Khu vực phục vụ (county/city ở Delaware: Sussex, Lewes, Rehoboth, Milford, Georgetown…?)
- [ ] Danh sách máy móc thật (hãng, model, số lượng), số liệu thật (năm kinh nghiệm, số dự án, acres đã clear…)
- [ ] Ảnh dự án thật, review khách hàng thật (Google Business Profile?), link social.
- [ ] Ngôn ngữ: chỉ English, hay **English + Español** (gợi ý — tệp khách/thợ Hispanic ở US rất lớn, là điểm cộng).

> Trong lúc chờ: toàn bộ dùng **dữ liệu giả lập có đánh dấu `[DEMO]`** trong CMS để dễ tìm & thay.

---

## 1. Techstack đề xuất

### 1.1 Quyết định: **Payload CMS 3 + Next.js (App Router)** — dùng starter chính chủ `website` template

| Lớp | Công nghệ | Lý do |
|---|---|---|
| Framework | **Next.js** (App Router, RSC, TypeScript strict) — theo version mà template Payload pin | SSG/ISR → trang public gần như static, rất nhanh |
| CMS / Admin | **Payload CMS 3.x** (chạy *bên trong* app Next.js, 1 codebase, 1 deploy) | Admin panel đẹp, cảm giác như WordPress: Pages + **Block builder kéo-thả**, Media library, Draft/Publish, Revisions, Scheduled publish, **Live Preview**, phân quyền user. Open-source MIT, không phí license |
| Database | **PostgreSQL** (Neon serverless) — *hoặc* SQLite nếu chạy 1 VPS | Payload hỗ trợ cả hai qua adapter, đổi được |
| Lưu ảnh | **Cloudflare R2** (S3-compatible, không phí egress) qua `@payloadcms/storage-s3` — hoặc Vercel Blob | Ảnh không nằm trong server → deploy nhẹ, scale dễ |
| Xử lý ảnh | `sharp` (Payload tạo sẵn các size + focal point) + `next/image` (AVIF/WebP, lazy, blur placeholder) | LCP tốt |
| Styling | **Tailwind CSS v4** + **CSS variables** (design tokens) + shadcn/ui (template đã có) | Tokens → đổi màu/font/bo góc từ admin không cần build lại |
| Animation | CSS + `motion` (chỉ ở phase polish, lazy-load) | Giữ JS bundle nhỏ |
| Form & Email | `@payloadcms/plugin-form-builder` + **Resend** (email) + **Cloudflare Turnstile** (chống spam) | Khách tự tạo/sửa form trong admin, lead lưu DB + gửi mail |
| SEO | `@payloadcms/plugin-seo`, `plugin-redirects`, `plugin-search`, sitemap/robots của Next, JSON-LD | Đã có trong template |
| Analytics | **Plausible** hoặc Umami (cookieless, nhẹ) — tuỳ chọn GA4 + consent | |
| Bản đồ | Google Maps embed (iframe lazy) hoặc Leaflet + OSM (miễn phí) | |
| Chất lượng | ESLint, Prettier, `tsc --noEmit`, **Vitest** (unit), **Playwright** (e2e), **Lighthouse CI**, GitHub Actions | Mục tiêu "không lỗi" |
| Monitoring | Sentry (free tier) — tuỳ chọn | |
| Package manager | **pnpm**, Node 20/22 LTS | |

### 1.2 Starter
```bash
pnpm dlx create-payload-app@latest mendez-web -t website --db postgres
```
Nguồn: `github.com/payloadcms/payload/tree/main/templates/website` (chính chủ, maintain liên tục).

**Template đã có sẵn** (≈40% việc): Pages với layout blocks (Hero, Content, Media, CTA, Archive, Form), Posts + Categories, Media + sizes, Header/Footer globals, Draft + Live Preview + Revisions, SEO plugin, Form builder, Redirects, Search, Users/Auth, on-demand revalidation, sitemap, dark mode toggle, seed script.

**Ta cần thêm**: Projects + bộ lọc, Services, Equipment, Testimonials, FAQ, Service Areas, Team; global **Site Settings** & **Theme**; ~15 block mới theo Mẫu 1; i18n; tối ưu deploy.

### 1.3 Các phương án đã cân nhắc (và lý do loại)
| Phương án | Ưu | Lý do không chọn |
|---|---|---|
| WordPress + theme/Elementor | Khách quen | Nặng, plugin rủi ro bảo mật, hosting PHP, khó đạt Lighthouse 95+, khó code theo Mẫu 1 sạch |
| Astro + Keystatic/Decap (git-based) | Static thuần, nhẹ nhất | Upload ảnh/project đi qua Git → khách không chuyên dễ kẹt; form/lead/roles phải tự ghép; block builder yếu |
| Strapi / Directus + Next riêng | Mạnh | **2 app, 2 deploy** → nặng hơn, tốn chi phí hơn |
| Sanity | Studio xịn | SaaS, quota & giá theo seat, data không tự chủ |
| Builder.io / Webflow | Kéo-thả trực quan | Phí tháng cao, lock-in, khó custom sâu |

→ **Payload** là cân bằng tốt nhất: 1 app, tự host, admin như WordPress, code sạch như custom site.

---

## 2. Kiến trúc nội dung (Data model)

### 2.1 Collections
| Collection | Trường chính | Dùng ở |
|---|---|---|
| **Pages** | title, slug, `layout` (blocks[]), hero, SEO, status | Home, About, Contact, Capabilities, Landing tuỳ ý — **khách tự tạo trang mới** |
| **Projects** | title, slug, cover, gallery[], **before/after** pair, services (rel → Services, many), **area value + unit** (sq ft / acres), `areaBucket` (auto-computed), **region** (rel → ServiceAreas), city, completedDate/year, duration, client type (Residential / Commercial / Municipal), equipment used (rel → Equipment), budget range (ẩn/hiện), summary, richText body, testimonial (rel), featured, SEO | Trang Projects + bộ lọc, chi tiết, block "Featured projects" |
| **Services** | title, slug, icon (upload SVG / chọn từ thư viện icon), short desc, body, hero image, process steps[], FAQs (rel), related projects (auto), order | 10 dịch vụ, trang chi tiết từng dịch vụ (SEO local) |
| **Equipment** | name, category (Excavator / Skid Steer / Dozer / Mulcher / Dump Truck…), brand, model, specs[] (key/value), photo, gallery, capabilities text, qty, featured | Trang Năng lực (Capabilities) |
| **Technologies** | title, icon, description, image (GPS grading, drone survey, laser level…) | Trang Năng lực |
| **ServiceAreas** | name, slug, county, state, map center, description, SEO | Bộ lọc khu vực + landing page local SEO "Excavation in Lewes, DE" |
| **Testimonials** | author, location, rating, quote, project (rel), source (Google/Facebook), avatar | Blocks |
| **FAQs** | question, answer, category, services (rel) | Blocks + JSON-LD FAQPage |
| **TeamMembers** | name, role, photo, bio, order | About |
| **Posts** (+ Categories) | có sẵn | Tin tức / Tips — tốt cho SEO |
| **Media** | có sẵn + alt bắt buộc, focal point, folder/tags | Thư viện ảnh |
| **Form Submissions** | (plugin) + status (New/Contacted/Won/Lost), note | **Mini CRM lead** |
| **Users** | roles: `admin`, `editor` | Phân quyền |

### 2.2 Globals (singleton — "Customizer")
| Global | Nội dung |
|---|---|
| **Site Settings** | Tên công ty, tagline, **logo (light / dark / icon)**, favicon, OG image mặc định, phone, email, address, giờ làm việc, social links, license #, map embed, sticky call bar on/off, announcement bar (text + link + bật/tắt), scripts (analytics ID) |
| **Theme** | **Preset** (chọn 1 trong các theme demo) + override: primary / primary-hover / accent / background / surface / text / muted, dark mode (off / auto / toggle), font heading & body (danh sách Google Fonts định sẵn, tự host qua `next/font`), border radius (sharp / soft / round), button style, container width, header style (solid / transparent-over-hero / centered logo), footer style (2 kiểu), card style (flat / shadow / bordered), animation level (none / subtle / rich) |
| **Header** | menu nhiều cấp (link tới Page/Service/URL), nút CTA (text + link), hiển thị phone |
| **Footer** | cột link, mô tả, social, newsletter on/off, copyright |
| **Projects Settings** | khoảng diện tích cho bộ lọc (bucket), số item/trang, sort mặc định, bật/tắt từng bộ lọc |

### 2.3 Cơ chế "custom màu sắc & bố cục"
1. **Màu/font/bo góc**: Global `Theme` → render thành `<style>:root{--color-primary:…}</style>` trong `layout.tsx` (server, không JS client). Tailwind map vào biến (`bg-primary` = `var(--color-primary)`). Đổi trong admin → revalidate → web cập nhật ngay, **không build lại**. Có **validate contrast** (cảnh báo nếu chữ/nền < 4.5:1).
2. **Bố cục**: mỗi Page là danh sách **blocks** kéo-thả (thêm/xoá/sắp xếp/ẩn). Mỗi block có tuỳ chọn chung: *variant* (2–3 kiểu layout), background (none / tint / dark / image), spacing (S/M/L), căn trái/giữa, anchor id, ẩn trên mobile/desktop.
3. **Theme presets** = cũng là cách làm **bộ demo mới** (xem Phase 7): 1 click đổi cả bộ nhận diện.
4. **Live Preview**: sửa bên trái, thấy trang thật bên phải (có sẵn trong template).

### 2.4 Thư viện Blocks (dựng lại từ Mẫu 1)
| Block | Variants |
|---|---|
| Hero | full-bleed image · split image/text · video background · slider (≤3) — có badge, 2 CTA, trust chips |
| Stats / Counters | 3–4 số, nền tối/cam |
| Services Grid | cards icon · list 2 cột (như banner) · tabs |
| Featured Projects | grid · carousel · masonry (chọn tay hoặc tự lấy `featured`) |
| Before / After | slider kéo |
| Process / How a job works | steps ngang · timeline dọc |
| Why Choose Us / Features | icon cards |
| Equipment Showcase | grid theo category |
| Technology | alternating image/text |
| Testimonials | grid · carousel, kèm rating tổng |
| FAQ | accordion (+ JSON-LD) |
| CTA Banner | cam gradient · ảnh nền |
| Quote Form | gắn form từ Form Builder, inline hoặc 2 cột với info liên hệ |
| Contact Info + Map | |
| Service Areas | chips · map |
| Logo strip / Certifications | |
| Gallery | grid + lightbox |
| Team | |
| Rich Text / Media / Video / Spacer / Marquee | |

---

## 3. Danh sách tính năng

### 3.1 Bắt buộc (theo yêu cầu khách) — **MVP**
- [ ] **Trang chủ** — dựng bằng blocks, giống Mẫu 1
- [ ] **About Us** — câu chuyện, giá trị, team, số liệu, chứng nhận
- [ ] **Liên hệ** — form báo giá, info, map, giờ làm việc
- [ ] **Projects (Công trình đã hoàn thiện)** — listing + **bộ lọc**: dịch vụ/sản phẩm, diện tích (range), khu vực, năm, loại khách hàng; tìm kiếm theo từ khoá; sort (mới nhất / diện tích); phân trang; **filter đồng bộ lên URL** (share link được, SEO được); đếm kết quả; nút xoá lọc; mobile dùng drawer
- [ ] **Chi tiết Project** — gallery + lightbox, before/after, thông số, dịch vụ đã làm, máy sử dụng, testimonial, project liên quan, CTA
- [ ] **Năng lực (Capabilities)** — máy móc (lọc theo category), công nghệ, quy trình, an toàn
- [ ] **Admin**: upload ảnh, viết bài, thêm project/máy/dịch vụ, đổi **logo**, sửa **header/footer/menu**, sửa **trang chủ** và mọi trang, đổi **màu sắc / font / bố cục**

### 3.2 "Web công ty chuyên nghiệp 2026" — điểm cộng
**Chuyển đổi (lead)**
- [ ] Form báo giá nhiều bước (dịch vụ → diện tích → địa chỉ → ảnh hiện trạng upload → liên hệ), lưu DB + email cho chủ + auto-reply cho khách
- [ ] Sticky **click-to-call** trên mobile, nút "Get a free estimate" cố định ở header
- [ ] Mini CRM: trạng thái lead, ghi chú, export CSV
- [ ] Chống spam: Turnstile + honeypot + rate limit

**SEO & local SEO** (quan trọng nhất với nhà thầu US)
- [ ] Trang riêng cho từng **Service** và **Service Area** (+ tổ hợp "Service in Area" nếu cần)
- [ ] JSON-LD: `LocalBusiness/GeneralContractor`, `Service`, `FAQPage`, `BreadcrumbList`, `Review`
- [ ] Meta/OG tự động, **OG image động** (`next/og`) theo tiêu đề + ảnh project
- [ ] Sitemap, robots, canonical, redirects 301 quản lý trong admin
- [ ] Breadcrumbs

**Nội dung**
- [ ] Blog / News / Tips
- [ ] Testimonials + rating tổng
- [ ] Đa ngôn ngữ **EN / ES** (Payload localization + Next i18n routing) — có thể bật ở phase sau
- [ ] Tìm kiếm toàn site

**Trải nghiệm**
- [ ] Dark mode (tuỳ chọn trong Theme)
- [ ] Animation reveal tinh tế, tôn trọng `prefers-reduced-motion`
- [ ] Trang 404 / 500 có thương hiệu
- [ ] Cookie/consent banner (chỉ khi bật GA4)
- [ ] PWA cơ bản (manifest, icon) — tuỳ chọn

**Quản trị**
- [ ] Draft / Publish / Schedule / Revisions / Live Preview
- [ ] Roles: Admin (tất cả) · Editor (nội dung, không đụng Theme/Users)
- [ ] Dashboard admin: lead mới, project gần đây, shortcut
- [ ] Admin branding (logo Mendez trong admin), ngôn ngữ admin EN (+ VI nếu team mình cần)

### 3.3 Chỉ tiêu kỹ thuật (Definition of Done)
| Chỉ tiêu | Mục tiêu |
|---|---|
| Lighthouse (mobile) | Performance ≥ 95 · A11y ≥ 95 · Best Practices 100 · SEO 100 |
| Core Web Vitals | LCP < 2.0s · CLS < 0.05 · INP < 200ms |
| JS client trang public | < 120 KB gzip (trang không có lọc) |
| Accessibility | WCAG 2.2 AA, điều hướng bàn phím, alt bắt buộc |
| Lỗi | 0 lỗi `tsc`, 0 lỗi ESLint, 0 console error, e2e pass |
| Ảnh | AVIF/WebP, đúng size, lazy dưới fold, hero `priority` |

---

## 4. Deploy (nhẹ & tối ưu)

### Phương án A — Khuyến nghị cho demo & production nhỏ
**Vercel** (app) + **Neon Postgres** (DB) + **Cloudflare R2** (ảnh) + **Resend** (mail)
- Gần như $0 khi demo. Production thương mại: Vercel Pro ~$20/tháng (gói Hobby không cho dùng thương mại).
- Trang public render static/ISR → serve từ CDN, admin chạy serverless.

### Phương án B — Rẻ & tự chủ nhất
**1 VPS** (Hetzner/DigitalOcean 2 vCPU · 4 GB, ~$5–8/tháng) + Docker Compose (Next `output: standalone` + Postgres) + **Caddy** (HTTPS tự động) + R2 cho ảnh + backup DB hằng ngày lên R2.

→ Chốt ở Phase 5 tuỳ ngân sách khách. Code viết **trung lập** (adapter DB/storage qua env) để chuyển qua lại không sửa code.

### Kỹ thuật tối ưu
- `revalidateTag` khi publish (template có hook sẵn) → không cần rebuild
- Fonts tự host qua `next/font`, chỉ subset Latin
- Không load JS bộ lọc ở trang khác; bộ lọc ưu tiên **server-side (searchParams)** + một client component nhỏ
- Bản đồ iframe lazy (click-to-load)
- Bật `images.remotePatterns` cho R2 domain, cache header dài cho ảnh

---

## 5. Cấu trúc thư mục (dự kiến)
```
mendez-web/
├─ src/
│  ├─ app/
│  │  ├─ (frontend)/            # site public
│  │  │  ├─ [slug]/page.tsx      # Pages động
│  │  │  ├─ projects/            # listing + [slug]
│  │  │  ├─ services/[slug]/
│  │  │  ├─ areas/[slug]/
│  │  │  ├─ capabilities/
│  │  │  └─ blog/
│  │  └─ (payload)/admin/        # admin panel
│  ├─ collections/               # Projects, Services, Equipment, ...
│  ├─ globals/                   # SiteSettings, Theme, Header, Footer, ProjectsSettings
│  ├─ blocks/                    # mỗi block: config.ts + Component.tsx
│  ├─ theme/                     # presets.ts, tokens → CSS vars, contrast check
│  ├─ components/                # UI chung (Button, Card, Filters, Lightbox, BeforeAfter…)
│  ├─ endpoints/seed/            # seed từ images/ + data DEMO
│  ├─ hooks/                     # revalidate, computeAreaBucket, ...
│  └─ payload.config.ts
├─ tests/ (e2e, unit)
├─ docker/ (cho phương án B)
└─ .github/workflows/ci.yml
```

---

## 6. Lộ trình & đầu việc

> Ước lượng cho 1 dev (có hỗ trợ AI). **Phase 0–5 = bản RAW đầy đủ chức năng**, Phase 6–7 = làm đẹp cao cấp + demo mới.

### Phase 0 — Khởi tạo (0.5 ngày)
- [ ] Tạo repo git, `create-payload-app -t website`, pnpm, Node LTS
- [ ] Neon DB + R2 bucket + `.env.example` đầy đủ
- [ ] Chạy được local, đăng nhập admin, đọc qua code template
- [ ] Dọn template: bỏ phần demo không dùng, đổi tên brand
- [ ] CI: lint + typecheck + build trên mỗi push

### Phase 1 — Data model & Admin (2 ngày)
- [ ] Collections: Projects, Services, Equipment, Technologies, ServiceAreas, Testimonials, FAQs, TeamMembers
- [ ] Mở rộng Media (alt bắt buộc, folder), Form Submissions (status, note)
- [ ] Globals: SiteSettings, Theme, Header, Footer, ProjectsSettings
- [ ] Hook `areaBucket` (quy đổi acres ↔ sq ft, gán bucket), slug auto, revalidate on change
- [ ] Access control: roles admin/editor
- [ ] Admin: nhóm menu (Content / Projects / Company / Settings), logo admin, cột list view hữu ích
- [ ] **Seed script**: 10 services thật, 12–15 projects DEMO dùng `images/`, 8 máy, 4 khu vực, 6 testimonials, 8 FAQ, trang Home/About/Contact/Capabilities dựng sẵn bằng blocks

### Phase 2 — Theme system (1 ngày)
- [ ] Token schema (màu, font, radius, spacing, shadow) + preset "Mẫu 1 / Classic Orange"
- [ ] Render CSS variables server-side; Tailwind v4 map vào tokens
- [ ] Font picker (6–8 cặp font định sẵn qua `next/font`)
- [ ] Header/footer/card/button variants theo Theme
- [ ] Contrast validator trong admin

### Phase 3 — Blocks & trang public RAW (3 ngày)
- [ ] Layout chung: Header (sticky, mobile menu), Footer, announcement bar, sticky call bar, breadcrumbs
- [ ] ~18 blocks ở mục 2.4 (bản raw, đúng cấu trúc & responsive, chưa polish)
- [ ] Trang: Home, About, Contact, Capabilities (Pages + blocks)
- [ ] Services: listing + chi tiết · Service Areas: chi tiết
- [ ] Blog: listing + chi tiết (template sẵn, chỉnh lại)
- [ ] 404 / 500

### Phase 4 — Projects & bộ lọc (1.5 ngày)
- [ ] Listing server-side với `searchParams` → Payload `where` query
- [ ] Bộ lọc: service (multi), area bucket, region, year, client type, keyword; sort; pagination
- [ ] UI lọc: sidebar desktop / drawer mobile, chip filter đang chọn, count, reset, empty state
- [ ] Chi tiết project: gallery + lightbox, before/after, spec box, related
- [ ] Equipment filter theo category trên Capabilities

### Phase 5 — Form, SEO, chất lượng, deploy (2 ngày)
- [ ] Form báo giá multi-step + upload ảnh + Turnstile + Resend (mail chủ + auto-reply)
- [ ] JSON-LD, OG image động, sitemap (gồm projects/services/areas), redirects
- [ ] Analytics (Plausible/Umami)
- [ ] Playwright: điều hướng, lọc project, gửi form, admin login & sửa Theme
- [ ] Lighthouse CI đạt chỉ tiêu mục 3.3; audit a11y (axe)
- [ ] Deploy Phương án A (staging) → domain demo → **bàn giao bản RAW cho khách xem**
- [ ] Hướng dẫn sử dụng admin (doc ngắn + video quay màn hình 5 phút)

### Phase 6 — Polish giao diện cao cấp (2–3 ngày)
- [ ] Hệ typography & spacing scale chặt chẽ, grid 12 cột
- [ ] Micro-interactions: hover card, reveal on scroll, counter animate, marquee, cursor-aware hero (nhẹ)
- [ ] Ảnh: art direction, overlay gradient, aspect ratio nhất quán
- [ ] Icon set riêng cho 10 dịch vụ (SVG, đồng bộ nét — banner hiện có icon tròn viền)
- [ ] Logo vector hoá SVG (màu / trắng / icon)
- [ ] Rà mobile từng block, tối ưu lại performance sau khi thêm animation

### Phase 7 — Bộ demo mới (chất lượng hơn 4 bản cũ) (2 ngày)
Vì có Theme system, **mỗi demo = 1 preset + 1 bộ layout Home** — khách bấm đổi là xem được, và **cái nào được chọn cũng là sản phẩm thật** chứ không phải HTML tĩnh.
| Demo | Hướng thiết kế |
|---|---|
| **Classic Orange** | Mẫu 1 nâng cấp — trung thành nhận diện banner (cam + than chì, Russo One) |
| **Heavy Iron** | Dark industrial: nền gần đen, cam neon nhấn, ảnh máy full-bleed, typography condensed cỡ lớn, video hero |
| **Earth & Stone** | Premium/editorial: nền kem, xanh rêu + nâu đất, serif hiện đại, nhiều khoảng trắng — nhắm khách landscaping/pavers cao cấp |
| **Sunset Bold** (tuỳ chọn) | Gradient hoàng hôn từ banner, bố cục bất đối xứng, card nổi, chuyển động mạnh |
- [ ] Trang `/demo` (chỉ admin hoặc có token) để chuyển preset nhanh khi thuyết trình
- [ ] Ảnh chụp màn hình & 1 trang so sánh để gửi khách

**Tổng ước lượng: ~14–16 ngày làm việc** (RAW đầy đủ ≈ 10 ngày).

---

## 7. Rủi ro & cách xử lý
| Rủi ro | Giảm thiểu |
|---|---|
| Khách cho quá nhiều quyền "custom" → tự phá giao diện | Chỉ cho chọn trong **giới hạn có kiểm soát** (preset, variants, palette có check contrast), không cho CSS tự do; có Revisions để quay lại |
| Thiếu dữ liệu thật | Seed DEMO có đánh dấu; checklist mục 0 gửi khách sớm |
| Template Payload cập nhật version lớn | Pin version, nâng cấp có kiểm soát qua CI |
| Serverless cold start ở admin | Chấp nhận được (chỉ admin); public là static. Nếu khó chịu → Phương án B |
| Ảnh khách upload quá nặng | Giới hạn dung lượng upload, sharp resize về max 2560px, nén |
| Spam form | Turnstile + honeypot + rate limit |

---

## 8. Bước tiếp theo
1. Anh duyệt techstack (Payload + Next) và phương án deploy sơ bộ (A hay B).
2. Gửi khách checklist mục 0 (đặc biệt **tên "Brothers"** và EN/ES).
3. Bắt đầu Phase 0 → 1.
