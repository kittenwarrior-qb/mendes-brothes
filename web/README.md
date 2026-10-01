# Mendez Brothes — Website + CMS

Payload CMS 3 + Next.js 16 (App Router), PostgreSQL. Một app duy nhất: website công khai + trang quản trị `/admin`.
Giao diện bám theo **Mẫu 1** (`../index.html`). Deploy: xem [DEPLOY.md](DEPLOY.md).

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
│  ├─ site.css            # CSS của Mẫu 1, toàn bộ màu/font/bo góc là biến CSS từ global Theme
│  └─ next/revalidate     # POST + header x-revalidate-secret=$CRON_SECRET → làm mới mọi trang
├─ app/(payload)/         # admin + REST/GraphQL API
├─ collections/           # Pages, Projects, Services, Equipment, ServiceAreas, Testimonials, FAQs, Posts, Media, Users
├─ globals/               # SiteSettings, Theme, ListingPages (+ Header/, Footer/)
├─ blocks/                # mỗi block = config.ts (admin) + Component.tsx (web); danh sách ở pageBlocks.ts
├─ theme/                 # presets.ts (3 preset + công cụ tương phản), resolve.ts (→ biến CSS), fonts
├─ icons/registry.ts      # thư viện icon SVG (dịch vụ / máy móc / công nghệ) cho admin chọn
├─ components/site/       # Section, Img, ProjectCard, Lightbox, BeforeAfter, JsonLd…
├─ seed/                  # dữ liệu demo (data.ts) + script (run.ts); ảnh ở /seed-assets
└─ migrations/            # migration Postgres (chạy tự động khi server production khởi động)
```

## Các quyết định chính

- **Cache**: mọi trang được render tĩnh/ISR. Hễ có thay đổi nội dung (collection hay global nào), hook `revalidateSite` làm mới **toàn bộ site**. Site nhỏ nên cách này đơn giản và không bao giờ hiển thị dữ liệu cũ.
- **Theme**: global `Theme` = preset + ghi đè. `resolve.ts` sinh `:root{--c-…}` và render ở server, không cần JS. Bật "Auto-fix contrast" thì màu chữ/nút tự đạt WCAG AA.
- **Font**: tự host trong `public/fonts` (không gọi Google Fonts). Trang chỉ preload đúng 2 font theme đang dùng.
- **Form**: Form Builder plugin + honeypot (`company_website`) + giới hạn 5 lần / 10 phút / IP. Lead nằm ở mục *Leads*, có trạng thái New → Won/Lost.
- **Ảnh**: upload tự resize (tối đa 2400px) và chuyển sang WebP. `next/image` phục vụ đúng kích thước cho từng màn hình.
- **Phân quyền**: `admin` (mọi thứ) / `editor` (nội dung, không đụng Theme, Site settings, Users).
