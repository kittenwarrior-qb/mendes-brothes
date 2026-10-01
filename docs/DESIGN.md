# Hướng thiết kế & bảng màu — Mendez Brothes

> Cập nhật 2026-10-01. Bố cục hiện tại thay thế hoàn toàn "Mẫu 1".

## 1. Nguồn tham khảo

- Video **"Steal These Web Design Trends 2026"** — Self-Made Web Designer (9 xu hướng).
- Video **"Top 2026 Web Design Trends"** — Codex Community (14 xu hướng: lưới module, variable fonts, gradient, brutalism, minimalism, 3D, gamification, Gen-Z, anti-design…).
- Bài tổng hợp xu hướng 2026 cho ngành xây dựng/nhà thầu: [Hook Agency](https://hookagency.com/blog/contractor-website-design-trends-2026/), [OpenAsset](https://openasset.com/resources/construction-website-examples/), [Design Hero](https://www.design-hero.com/business-tips/construction-website-design-trends/), [Line25](https://line25.com/articles/web-design-trends-2026/), [TheeDigital](https://www.theedigital.com/blog/web-design-trends).

## 2. Lọc xu hướng

Tiêu chí: hợp với nhà thầu xây dựng ở Mỹ (tạo tin tưởng, khiến khách gọi điện), và không làm web chậm.

| Xu hướng | Dùng | Lý do |
|---|---|---|
| Chữ tiêu đề khổng lồ, đậm, font condensed | ✅ | Chất "công nghiệp", không tốn tài nguyên |
| Lưới module / bento | ✅ | Trình bày 10 dịch vụ, số liệu, dự án gọn |
| Ảnh thật tràn màn hình, nền tối điện ảnh | ✅ | Ảnh máy móc là tài sản mạnh nhất của khách |
| Nền trung tính ấm ("giấy", "đá vôi") thay cho trắng tinh | ✅ | Sang hơn, dịu mắt |
| Brutalism nhẹ: đường kẻ mảnh, đánh số 01/02, nhãn chữ in | ✅ | Gợi "bản vẽ thi công" |
| Gradient | ✅ nhẹ | Quầng sáng "hoàng hôn" màu cam lấy từ banner của khách |
| Minimalism, mỗi màn hình một lời kêu gọi | ✅ | Tăng tỷ lệ gọi điện / gửi form |
| Chuyển động theo cuộn, micro-interaction | ✅ chỉ CSS | Mượt, không cần thư viện JS |
| 3D, gamification, anti-design, Gen-Z, vẽ tay | ❌ | Nặng hoặc lệch đối tượng khách hàng |

## 3. Phong cách đã làm: "Industrial Editorial"

- **Header** trong suốt nằm trên ảnh hero, đổi thành thanh kính mờ khi cuộn; menu mobile toàn màn hình với chữ lớn.
- **Hero** ảnh tràn màn hình, tiêu đề cực lớn (Barlow Condensed), dải 4 thông tin tin cậy ở mép dưới, thẻ gọi điện dạng kính.
- **Dải chữ chạy** tên dịch vụ (CSS thuần).
- **Bento dịch vụ** đánh số 01–10, hai ô ảnh lớn; rê chuột ô đổi sang nền tối.
- **Số liệu** cỡ khổng lồ trên nền tối.
- **Thẻ dự án dạng poster**: ảnh phủ kín thẻ, thông tin nằm trên lớp gradient; dự án đầu tiên hiển thị lớn.
- **Quy trình** 4 bước với số viền rỗng.
- **CTA** nền tối với quầng sáng màu thương hiệu.
- **Footer** tối, wordmark khổng lồ dạng viền.
- Chữ: tiêu đề **Barlow Condensed 700** in hoa, nội dung **Inter**. Đổi được trong admin (9 font).

## 4. Nghiên cứu màu

Màu lấy mẫu từ logo: cam `#D96F25`, than chì `#3A3A3A`, đen `#0C0C0C`, xám sáng `#F0F0F0`. Ảnh thực tế thiên nâu đất ấm.

Nguyên tắc **60 / 30 / 10**: 60% nền trung tính, 30% màu mực tối (chữ, dải tối, footer), 10% màu thương hiệu làm điểm nhấn (nút, nhãn, số).

### 6 bảng màu có sẵn (ảnh trong `docs/palettes/`)

| Bảng | Nền | Mực / dải tối | Nhấn | Hợp khi |
|---|---|---|---|---|
| **Sunset Limestone** (đề xuất) | `#FAF7F2` | `#26211C` / `#1F1A16` | `#D96F25` | Muốn sang, ấm, đúng màu logo |
| Classic Orange | `#FFFFFF` | `#383838` / `#1E2023` | `#D96F25` | Giữ đúng màu bản demo đầu |
| Graphite & Ember | `#141312` | `#F5F0E8` / `#0C0B0A` | `#F07A22` | Muốn mạnh, công nghiệp, ảnh nổi bật |
| Steel & Orange | `#FFFFFF` | `#14273A` / `#10202F` | `#D96F25` | Muốn cảm giác doanh nghiệp, tin cậy (xanh navy + cam là cặp bổ túc) |
| Forest & Clay | `#FAFAF6` | `#1E2B22` / `#18261E` | `#C8641F` | Nhấn mạnh mảng cảnh quan, phát quang |
| Hi-Vis Amber | `#FFFFFF` | `#171717` / `#151515` | `#E8A013` | Màu vàng máy công trình, tương phản cao |

### Tự sinh bảng màu từ 1 màu

Chọn thẻ **Custom** trong admin → nhập **một màu thương hiệu** + chọn tông xám (ấm / trung tính / lạnh) + sáng hay tối. Hệ thống tự tính 14 màu còn lại (nền, viền, chữ, dải tối…).

### Đảm bảo đọc được (WCAG AA — liên quan tuân thủ ADA ở Mỹ)

Mọi bảng màu, kể cả bảng tự sinh, đều được kiểm thử tự động: chữ và nút đạt tương phản tối thiểu 4.5:1. Admin chọn 1 trong 3 chế độ: làm đậm màu thương hiệu (chữ trắng trên nút), giữ màu tươi (chữ tối trên nút), hoặc tắt.
