# Chức năng website Mendez Brothes

> Cập nhật 2026-10-01.

## A. Website công khai

| Trang | Đường dẫn | Nội dung |
|---|---|---|
| Trang chủ | `/` | Hero, dải chữ dịch vụ, bento 10 dịch vụ, số liệu, dự án mới, giới thiệu, quy trình, đánh giá, CTA |
| Giới thiệu | `/about` | Câu chuyện, giá trị, khu vực phục vụ |
| Năng lực | `/capabilities` | Đội máy (lọc theo loại), công nghệ, cam kết |
| Liên hệ | `/contact` | Thẻ thông tin, form báo giá, bản đồ (bấm mới tải), FAQ |
| Công trình | `/projects` | Lưới dự án + **bộ lọc**: từ khoá, dịch vụ, thị trấn, diện tích, năm, loại khách; sắp xếp; phân trang; trạng thái lọc nằm trên URL (gửi link được) |
| Chi tiết công trình | `/projects/<slug>` | Ảnh bìa, **trước/sau**, bài viết, thư viện ảnh (phóng to, vuốt), đánh giá, thông số, máy đã dùng, dự án tương tự |
| Dịch vụ | `/services`, `/services/<slug>` | 10 dịch vụ, mỗi dịch vụ một trang: mô tả, hạng mục, dự án liên quan, FAQ |
| Khu vực | `/areas/<slug>` | Trang riêng cho từng thị trấn (SEO địa phương) |
| Tin tức | `/posts`, `/posts/<slug>` | Bài viết, phân trang |
| Tìm kiếm | `/search` | Tìm trong dự án, dịch vụ, tin tức, trang |
| Khác | | Trang 404, sitemap.xml, robots.txt |

**Luôn có trên mọi trang:** header dính (số điện thoại + nút báo giá), thanh "Call now" cố định trên điện thoại, nút lên đầu trang, thanh thông báo (bật/tắt), dải CTA trước footer.

**Form báo giá:** tự chọn sẵn dịch vụ khi đi từ trang dịch vụ/dự án; kiểm tra lỗi ngay khi nhập; chống spam (bẫy bot + giới hạn 5 lần/10 phút/IP); gửi email thông báo (khi cấu hình SMTP).

**SEO:** tiêu đề/mô tả/ảnh chia sẻ cho từng trang, dữ liệu có cấu trúc (doanh nghiệp địa phương, dịch vụ, FAQ, breadcrumb, bài viết), sitemap tự động, chuyển hướng 301 quản lý trong admin.

## B. Trang quản trị (`/admin`)

**Nội dung**
- **Pages:** dựng trang bằng 21 loại block kéo-thả; mỗi block chỉnh nền, khoảng cách, ẩn/hiện theo thiết bị. Lưu nháp, hẹn giờ đăng, lịch sử phiên bản, xem trước trực tiếp.
- **Projects, Services, Equipment, Service areas, Testimonials, FAQs, News posts.**
- **Media:** thư viện ảnh có thư mục; ảnh upload tự thu nhỏ và chuyển WebP; chọn điểm lấy nét.
- **Leads:** mọi yêu cầu báo giá, có trạng thái New → Contacted → Quoted → Won/Lost và ghi chú. **Forms:** tự tạo/sửa form.

**Cài đặt**
- **Site settings:** tên công ty, điện thoại, địa chỉ, giờ làm việc, mạng xã hội, 4 loại logo, favicon, thanh thông báo, dải CTA, mã theo dõi (Plausible / Google Analytics).
- **Theme & layout:** chọn bảng màu bằng thẻ trực quan (6 bảng + tự sinh từ 1 màu thương hiệu), tinh chỉnh từng màu, 9 font, bo góc, kiểu nút, kiểu thẻ, độ rộng, kiểu header/footer, chế độ tương phản, hiệu ứng cuộn, CSS tuỳ biến. **Thử màu ở bản nháp + Live Preview, khách chỉ thấy khi bấm Publish.**
- **Header & menu** (có menu con), **Footer**, **Listing pages** (tiêu đề và tuỳ chọn bộ lọc của trang Công trình/Dịch vụ/Tin tức).
- **Backups:** xem mục C.
- **Users:** 2 vai trò — Admin (mọi thứ) và Editor (chỉ nội dung). **Redirects.**
- Giao diện admin có tiếng Anh và tiếng Việt.

## C. Sao lưu (Backups)

Vào **Admin → Backups**:
- **Back up now:** tạo ngay một file `.tar` chứa toàn bộ database + toàn bộ ảnh.
- **Download:** tải file về máy.
- **Restore:** khôi phục từ một bản bất kỳ (phải gõ `RESTORE` để xác nhận). Hệ thống **tự tạo một bản an toàn trước khi khôi phục**, nên luôn hoàn tác được.
- **Upload a backup file:** đưa file backup từ máy lên (ví dụ khi chuyển sang máy chủ mới).
- **Tự động:** mặc định mỗi ngày một bản, giữ 7 bản gần nhất (đổi trong *Backup schedule*). Bản tạo tay không bị tự xoá.
- Chỉ Admin dùng được.

Lưu ý: file backup nằm trên cùng máy chủ với website. Nên định kỳ **tải về máy** một bản để phòng khi máy chủ hỏng.

## D. Vận hành

- Toàn bộ chạy trong Docker trên một VPS: website + PostgreSQL + Caddy (HTTPS tự động). **Không dùng dịch vụ bên thứ ba nào.**
- RAM khi chạy khoảng 300 MB.
- Lighthouse: desktop 100/100/100/100; mobile (giả lập 4G chậm) Performance 85–91, ba mục còn lại 100.
- Kiểm thử tự động: 39 unit test + 12 test e2e.
