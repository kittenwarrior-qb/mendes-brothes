# Mendez Brothes — Website + CMS

Payload CMS 3 + Next.js 16 (App Router), PostgreSQL. Một app duy nhất: website công khai + trang quản trị `/admin`.
Giao diện: phong cách "Industrial Editorial" (xem [../docs/DESIGN.md](../docs/DESIGN.md)). Chức năng: [../docs/FEATURES.md](../docs/FEATURES.md). Deploy: [DEPLOY.md](DEPLOY.md).

## Chạy local

```bash
docker compose -f docker-compose.dev.yml up -d      # Postgres dev ở 127.0.0.1:5440
cp .env.example .env                                 # giá trị mặc định chạy được ngay
pnpm install
SEED_ADMIN_EMAIL=admin@example.com SEED_ADMIN_PASSWORD='MatKhau123!' pnpm seed   # dữ liệu demo (XÓA nội dung cũ)
pnpm dev                                             # http://localhost:3000  ·  admin: /admin
```

Ở chế độ dev, Payload tự đồng bộ schema vào DB (push). **Không bao giờ trỏ `pnpm dev` / `pnpm seed` (không có `NODE_ENV=production`) vào database production**: Payload sẽ gắn cờ "dev push", và lần khởi động production sau sẽ dừng lại chờ xác nhận.

## Lệnh

| Lệnh | Việc |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm seed` | Nạp lại dữ liệu demo (xóa nội dung, giữ user) |
| `pnpm lint` · `pnpm typecheck` | ESLint · TypeScript |
| `pnpm test:int` | Unit test (theme, tương phản WCAG, bộ lọc…) |
| `pnpm test:e2e` | Playwright. Với site đã chạy: `E2E_BASE_URL=http://localhost:3000 SEED_ADMIN_EMAIL=… SEED_ADMIN_PASSWORD=… pnpm test:e2e` |
| `pnpm generate:types` | Sinh lại `src/payload-types.ts` sau khi sửa schema |
| `pnpm generate:importmap` | Sau khi thêm component admin |
| `pnpm payload migrate:create <tên>` | **Bắt buộc** sau mỗi lần sửa collection/global/field, rồi commit file trong `src/migrations/` |

## Cấu trúc

```
src/
├─ app/(frontend)/        # website: layout, [slug] (Pages), projects (+bộ lọc), services, areas, posts, search, sitemap
│  ├─ site.css            # toàn bộ CSS của site; màu/font/bo góc là biến CSS sinh từ global Theme
│  └─ next/revalidate     # POST + header x-revalidate-secret=$CRON_SECRET → làm mới mọi trang
├─ app/(payload)/         # admin + REST/GraphQL API
├─ collections/           # Pages, Projects, Services, Equipment, ServiceAreas, Testimonials, FAQs, Posts, Media, Users
├─ globals/               # SiteSettings, Theme, ListingPages, BackupSettings (+ Header/, Footer/)
├─ blocks/                # mỗi block = config.ts (admin) + Component.tsx (web); danh sách ở pageBlocks.ts
├─ theme/                 # presets.ts (6 bảng màu + sinh bảng màu từ 1 màu + tương phản), resolve.ts (→ biến CSS), fonts
├─ backup/                # tạo/khôi phục backup (.tar = pg_dump + media), API, lịch tự động
├─ icons/registry.ts      # thư viện icon SVG (dịch vụ / máy móc / công nghệ) cho admin chọn
├─ components/site/       # Section, Img, ProjectCard, Lightbox, BeforeAfter, JsonLd…
├─ seed/                  # dữ liệu demo (data.ts) + script (run.ts); ảnh ở /seed-assets
└─ migrations/            # migration Postgres (chạy tự động khi server production khởi động)
```

## Các quyết định chính

- **Cache**: mọi trang được render tĩnh/ISR. Hễ có thay đổi nội dung (collection hay global nào), hook `revalidateSite` làm mới **toàn bộ site**. Site nhỏ nên cách này đơn giản và không bao giờ hiển thị dữ liệu cũ.
- **Theme**: global `Theme` = bảng màu (có sẵn hoặc tự sinh từ 1 màu) + ghi đè. `resolve.ts` sinh `:root{--c-…}` và render ở server, không cần JS. Theme có bản nháp: Live Preview hiển thị bản nháp, khách chỉ thấy bản đã Publish. Chế độ tương phản đảm bảo chữ/nút đạt WCAG AA.
- **Backup**: cần `pg_dump`/`pg_restore` trong PATH (image Docker đã có; máy dev cài PostgreSQL client). Thư mục: `BACKUP_DIR` (mặc định `./backups`).
- **Migration**: `migrate:create` sẽ hỏi tương tác nếu một bảng vừa thêm vừa xoá cột. Khi đó tách làm hai bước: thêm trước, xoá sau.
- **Font**: tự host trong `public/fonts` (không gọi Google Fonts). Trang chỉ preload đúng 2 font theme đang dùng.
- **Form**: Form Builder plugin + honeypot (`company_website`) + giới hạn 5 lần / 10 phút / IP. Lead nằm ở mục *Quote requests*, có trạng thái New → Won/Lost; xuất CSV qua `GET /api/leads-export`.
- **Ảnh**: upload tự resize (tối đa 2400px) và chuyển sang WebP. `next/image` phục vụ đúng kích thước cho từng màn hình.
- **Phân quyền** (`src/access/roles.ts`): `editor` (nội dung + quote requests) / `manager` (thêm Settings, Users, Backups) / `admin` (thêm nhóm Advanced, CSS tuỳ biến).
- **Admin UX**: menu tự viết `components/admin/nav/` (thêm/bớt mục ở `Nav.tsx`), dashboard `Dashboard.tsx`, màn hình cài đặt `SettingsView.tsx` (`/admin/settings`), icon ở `icons.tsx` (lucide), cỡ chữ và style ở `app/(payload)/custom.scss`, trang hướng dẫn `HelpView.tsx` (`/admin/help`), tên + nhóm + ảnh minh hoạ của block ở `blocks/blockMeta.ts` và `public/admin-blocks/<slug>.jpg` (600×400). Thêm block mới thì thêm một dòng trong `blockMeta` và một ảnh.
- **Ảnh demo**: `seed-assets/*.jpg` lấy từ Wikimedia Commons, tác giả và giấy phép ghi ở `seed-assets/CREDITS.md`. Thay bằng ảnh công trình thật của khách trước khi chạy chính thức.
- **Thư mục ảnh**: giao diện thư mục đã ẩn (CSS trong `custom.scss`), nhưng `folders: true` ở `collections/Media.ts` và các bảng `payload_folders*` vẫn còn. Muốn gỡ hẳn: bỏ `folders` trong config rồi tạo migration (thao tác xoá bảng).
- **Tài liệu bàn giao** (`docs/handover/*.docx`, tiếng Việt + tiếng Anh): tạo lại bằng `node scripts/handover/shots-site.mjs`, `ADMIN_EMAIL=… ADMIN_PASSWORD=… node scripts/handover/shots-admin.mjs`, rồi `node scripts/handover/build-docx.mjs vi` (hoặc `en`). Nội dung chữ nằm ở `scripts/handover/content.<lang>.mjs`.
- **Trợ lý AI** (`src/ai/`, giao diện ở `components/admin/ai/`): `providers.ts` gọi Gemini / Groq / OpenAI (fetch) và Claude (SDK `@anthropic-ai/sdk`); `tasks.ts` chứa prompt của từng việc; `helpKnowledge.ts` là bộ hướng dẫn dùng chung cho trang Help, câu trả lời có sẵn của khung chat và kiến thức nền cho AI — thêm chủ đề mới ở đây. Key lưu trong global ẩn `ai-settings` (mã hoá). Thử không cần key thật: `node tests/helpers/ai-stub.mjs`, chạy site với `AI_BASE_URL=http://127.0.0.1:8787`, rồi `AI_STUB=1 pnpm test:e2e ai` (key của stub: `test-key-good-1234`).
- **Thống kê** (`src/analytics/`): script `components/site/Track.tsx` gửi `POST /api/track`; số liệu cộng dồn theo ngày trong bảng `analytics_daily` (SQL thuần, ON CONFLICT). Múi giờ ngày: `ANALYTICS_TZ` (mặc định America/New_York). Màn hình: `components/admin/stats/`.
- **Ảnh trong khung chat**: 38 ảnh hướng dẫn ở `public/help/*.webp`, danh sách và chú thích ở `src/ai/helpImages.ts`, gắn vào chủ đề qua `images` trong `helpKnowledge.ts`. AI chèn ảnh bằng dòng `[image: id]`. Sau khi chụp lại ảnh hướng dẫn: `npx tsx scripts/handover/copy-help-images.mjs`.
