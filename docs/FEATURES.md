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

Thiết kế cho người **không rành công nghệ**: mở ra là biết bấm vào đâu, mọi tên gọi là tiếng Anh thường ngày (không có thuật ngữ kỹ thuật).

Chữ và nút trong admin to hơn mặc định (cỡ chữ gốc 15px), icon là nét vẽ đồng bộ (không dùng emoji).

**Menu bên trái** — ngắn, cố định, có icon; logo công ty nằm trên cùng
- **Home · Quote requests** (có số báo yêu cầu mới) **· Pages · Projects · News · Photos**
- **Your company:** Services · Equipment · Reviews
- Cuối menu: **Settings · Help · View website · Log out**
- Menu luôn mở trên laptop (mặc định Payload tự gập ở màn hình ≤ 1440px).

**Home** — theo việc cần làm
- Thẻ **"N new quote requests"** + 5 yêu cầu mới nhất (tên, số điện thoại bấm gọi được, dịch vụ, trạng thái).
- 6 ô **Everyday tasks**: Add a finished project · Edit a page · Upload photos · Add a review · Write a news post · Update services.
- Dòng trạng thái (Manager): lần backup gần nhất, email báo lead đang bật hay tắt.

**Settings** (`/admin/settings`) — mọi thứ ít khi đụng tới gom vào một màn hình các ô lớn
- *Your business* (Manager): Company info & logo · Colours & fonts · Menu · Footer.
- *More content* (mọi người): Towns we serve · FAQs · My account.
- *People & safety* (Manager): Users · Backups · Backup schedule.
- *Advanced* (chỉ Admin): News categories · List pages & filters · Forms · Redirects · Search index.

**Help** (`/admin/help`): hướng dẫn từng bước — thêm công trình, sửa chữ/ảnh, thêm/di chuyển section, trả lời yêu cầu báo giá, đổi số điện thoại/logo, đổi màu, sao lưu, hoàn tác.

**3 vai trò**
| Vai trò | Dành cho | Thấy gì |
|---|---|---|
| Editor | Nhân viên | Nội dung, quote requests, mục "More" (towns, FAQs, tài khoản) |
| Manager | Chủ doanh nghiệp | Thêm toàn bộ Settings + Backups |
| Admin | Lập trình viên | Tất cả, kể cả Advanced và CSS tuỳ biến |

Chỉ Admin mới cấp/thu hồi được quyền Admin. Tài khoản đầu tiên tạo ra luôn là Admin.

**Sửa trang (Pages)**
- Mỗi dòng là một *section* của trang, từ trên xuống; dòng hiển thị **tên dễ hiểu + tiêu đề đang dùng** (vd. "Big photo header — We move dirt…").
- **Add section** mở bảng chọn có **hình minh hoạ thật** của 21 loại section, xếp theo 6 nhóm (Top of the page → Advanced).
- Tuỳ chọn nền/khoảng cách/ẩn hiện gom vào mục thu gọn **"Look of this section"** để không rối mắt.
- Lưu nháp, hẹn giờ đăng, lịch sử phiên bản (hoàn tác), xem trước trực tiếp (biểu tượng con mắt).

**Quote requests (lead)**
- Danh sách có cột Name / Phone / Service wanted / Status / ngày gửi; tìm theo tên, số điện thoại, email, dịch vụ.
- Trạng thái New → Contacted → Quoted → Won/Lost và ghi chú nội bộ.
- **Download all as a spreadsheet (CSV)** — mở được bằng Excel.

**Nội dung khác:** Projects, Services, Equipment, Towns we serve, Reviews, FAQs, News. **Photos:** một thư viện phẳng có tìm kiếm (đã tắt phần thư mục); ảnh upload tự thu nhỏ và chuyển WebP; chọn điểm lấy nét.

**Cài đặt**
- **Company info & logo:** tên công ty, điện thoại, địa chỉ, giờ làm việc, mạng xã hội, 4 loại logo, favicon, thanh thông báo, dải CTA, mã theo dõi (Plausible / Google Analytics).
- **Colours & fonts:** chọn bảng màu bằng thẻ trực quan (13 bảng khác hẳn nhau + tự sinh từ 1 màu thương hiệu), tinh chỉnh từng màu, 9 font, bo góc, kiểu nút, kiểu thẻ, độ rộng, kiểu header/footer, chế độ tương phản, hiệu ứng cuộn. **Thử màu ở bản nháp + Live Preview, khách chỉ thấy khi bấm Publish.**
- **Menu** (có menu con), **Footer**, **Backups** (xem mục C), **Users**.
- Giao diện admin có tiếng Anh và tiếng Việt.

**Thống kê** (menu Statistics, và 4 con số 7 ngày gần nhất trên Home)
- Khách truy cập, số trang đã xem, lượt bấm số điện thoại, yêu cầu báo giá — so với kỳ trước; biểu đồ khách theo ngày (7 / 30 / 90 ngày), có bảng số.
- Trang xem nhiều nhất, nguồn khách (Google, Facebook, gõ trực tiếp…), các cú bấm quan trọng (gọi điện, email, nút báo giá, bản đồ, mạng xã hội, link ra ngoài), điện thoại hay máy tính, redirect được dùng, địa chỉ 404.
- Tự đếm trong website: không cookie, không dịch vụ ngoài, không lưu IP (chỉ lưu tổng theo ngày; nhận diện khách bằng mã băm đổi mỗi ngày, xoá sau 2 ngày). Bỏ qua bot và chính người đang đăng nhập admin. Giữ 13 tháng.
- Redirect giờ trả mã vĩnh viễn (308).

**Trợ lý AI** (tuỳ chọn, khách tự nhập key ở Settings → AI assistant)
- **Khung chat** (nút tròn có logo, góc dưới phải, ở mọi màn hình): chưa có key thì trả lời theo bộ hướng dẫn có sẵn (hiểu cả câu hỏi tiếng Việt); có key thì AI trả lời mọi câu hỏi về admin và tư vấn màu, font, logo, bố cục, câu chữ. AI biết bảng màu đang dùng, danh sách bảng màu, các loại section và vai trò của người hỏi.
- **Nút AI cạnh mọi ô chữ** (kể cả đoạn bôi đen trong ô soạn thảo): sửa chính tả, viết rõ hơn, rút gọn, dịch sang tiếng Anh. Xem bản đề xuất trước, bấm “Use this” mới thay.
- **Nút AI cạnh Publish** (Pages, Projects, News, Services): viết mô tả công trình từ thông tin đã điền, viết tiêu đề + mô tả Google, kiểm tra trước khi đăng (chính tả, câu khó hiểu, thiếu SEO, ảnh thiếu mô tả).
- **Ảnh:** ảnh mới tải lên được AI tự viết alt text; ảnh cũ có nút “Describe this photo”.
- **Lệnh nhanh trong khung chat** (không cần key): gõ `/` để hiện menu lệnh; kéo thả / dán / chọn ảnh vào khung chat. `/logo`, `/logo-dark`, `/badge`, `/favicon`, `/photos`, `/project <tên>` (công trình nháp từ ảnh), `/phone`, `/email`, `/hours`, `/address`, `/tagline`, `/color #hex`, `/palette <tên>`. Mỗi lệnh hiện thẻ xem trước (cũ → mới), chỉ thay đổi khi bấm **Apply**, có **Undo**. Màu lưu nháp (xem trước rồi Publish). Lệnh đổi logo / thông tin / màu chỉ cho Manager — máy chủ kiểm tra lại quyền và giá trị. Link ảnh được máy chủ tải về an toàn: chỉ http/https, chặn địa chỉ nội bộ (kiểm tra cả lúc kết nối, sau redirect), chỉ nhận ảnh thật (không SVG), tối đa 10 MB.
- **Nhà cung cấp:** Google Gemini (miễn phí, đề xuất), Groq (miễn phí, không đọc được ảnh), OpenAI, Claude. Model được chọn tự động từ danh sách của nhà cung cấp, nên không lỗi thời khi họ đổi tên model.
- **An toàn:** key được thử trước khi lưu, lưu mã hoá bằng `PAYLOAD_SECRET`, không đọc lại được qua API; chỉ Manager đổi được. Chưa có key thì các nút AI tự ẩn. Giới hạn 20 lượt AI/phút/người.

## C. Sao lưu (Backups)

Vào **Admin → Backups**:
- **Back up now:** tạo ngay một file `.tar` chứa toàn bộ database + toàn bộ ảnh.
- **Download:** tải file về máy.
- **Restore:** khôi phục từ một bản bất kỳ (phải gõ `RESTORE` để xác nhận). Hệ thống **tự tạo một bản an toàn trước khi khôi phục**, nên luôn hoàn tác được.
- **Upload a backup file:** đưa file backup từ máy lên (ví dụ khi chuyển sang máy chủ mới).
- **Tự động:** mặc định mỗi ngày một bản, giữ 7 bản gần nhất (đổi trong *Backup schedule*). Bản tạo tay không bị tự xoá.
- Manager và Admin dùng được.

Lưu ý: file backup nằm trên cùng máy chủ với website. Nên định kỳ **tải về máy** một bản để phòng khi máy chủ hỏng.

## D. Vận hành

- Toàn bộ chạy trong Docker trên một VPS: website + PostgreSQL + Caddy (HTTPS tự động). **Không dùng dịch vụ bên thứ ba nào.**
- RAM khi chạy khoảng 300 MB.
- Lighthouse: desktop 100/100/100/100; mobile (giả lập 4G chậm) Performance 85–91, ba mục còn lại 100.
- Kiểm thử tự động: 39 unit test + 12 test e2e.
