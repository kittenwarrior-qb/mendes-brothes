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

## 3. Phong cách đang dùng: "Studio"

Bản "Industrial Editorial" trước đó bị chê là rối và giống theme WordPress: chữ condensed in hoa
ở mọi nơi, tiêu đề hai màu lặp lại, thẻ icon, dải số nền đen, marquee, CTA gradient. Bản hiện tại
đi theo hướng **website của một studio kiến trúc**, áp vào ngành san lấp – thi công:

| Nguyên tắc | Cách làm |
|---|---|
| Nền giấy ấm, nhiều khoảng trắng | Nền `#F3F2EE`, chữ gần đen `#181818`, kẻ mảnh `#D8D7D2` thay cho thẻ có viền/bóng |
| Chữ lớn, nét vừa | Archivo weight 500, chữ thường (không in hoa), tracking âm; H1 tới ~105px |
| Màu nhấn dùng rất ít (~5–8%) | Cam `#FF5A1F` chỉ ở nút chính, số thứ tự, bộ lọc đang chọn, hover. Chữ "hai tông" dùng xám thay vì cam |
| Ảnh thật chiếm diện tích lớn | Hero full màn hình; thẻ công trình = ảnh + 2 dòng chữ bên dưới (không phủ chữ lên ảnh) |
| Đánh số như hồ sơ | Mỗi section có nhãn `01 / 02 …` ở lề trái (CSS counter, tự đánh số) |
| Ít chuyển động nhưng có chủ ý | Xem bảng dưới |

**4 tương tác "chữ ký"** (đều bằng CSS, không thêm JS):

1. Hero: ảnh phóng to và trôi chậm khi cuộn (`animation-timeline: scroll()`, trình duyệt cũ bỏ qua).
2. Danh sách dịch vụ: rê chuột vào dòng nào thì ảnh của dịch vụ đó hiện ra bên phải.
3. Thẻ công trình: ảnh zoom 1.03 và hiện nút "View project ↗".
4. Trang chi tiết công trình trình bày như **case study**: tiêu đề lớn → ảnh lớn → dải thông số
   (thị trấn, diện tích, thời gian) → các chương đánh số (The job / Before & after / Photos / …).

**Bố cục trang chủ:** Hero → câu tuyên bố lớn + 3 con số → công trình nổi bật (lưới lệch) →
danh sách dịch vụ → giới thiệu → quy trình 4 bước → đánh giá → câu chốt + số điện thoại.

**Điều chỉnh so với đề xuất gốc (cho đúng khách hàng này):**
- Khách là nhà thầu san lấp ở Delaware, không phải tổng thầu nhà máy: không có BIM, cẩu 600 tấn,
  timeline 2014–2026. Trang Năng lực giới thiệu máy thật họ có, mỗi máy một hàng.
- **Giữ trang Dịch vụ** (đề xuất gốc bảo bỏ): với nhà thầu địa phương, mỗi trang dịch vụ là thứ
  kéo khách từ Google ("land clearing Lewes DE"…).
- Số điện thoại vẫn nổi bật ở header và cuối trang: khách của ngành này gọi điện là chính.

Mọi thứ trên vẫn đổi được trong admin (bảng màu, font, bo góc, kiểu nút) vì giao diện chỉ dùng
biến CSS sinh từ Theme.

## 4. Nghiên cứu màu

Màu lấy mẫu từ logo: cam `#D96F25`, than chì `#3A3A3A`, đen `#0C0C0C`. Nguyên tắc: nền trung tính
chiếm phần lớn, mực tối cho chữ và footer, màu thương hiệu chỉ làm điểm nhấn.

### 13 bảng màu có sẵn

Khách chưa chốt màu nên các bảng cố ý **khác hẳn nhau** về tông, không còn 4 bảng cam na ná:

| Bảng | Nền | Nhấn | Cảm giác |
|---|---|---|---|
| **Studio Paper** (mặc định) | giấy ấm `#F3F2EE` | cam `#FF5A1F` | Studio kiến trúc, hiện đại |
| Classic Orange | trắng | cam logo `#D96F25` | Đúng màu bản demo đầu |
| Sunset Limestone | cát ấm | cam + nâu espresso | Ấm, mềm |
| Graphite & Ember | **tối** | cam sáng | Công nghiệp, ảnh nổi bật |
| Steel Blue | trắng | xanh dương `#1D5FA8` | Tin cậy, chuyên nghiệp |
| Forest Green | kem | xanh lá `#2E7D4F` | Cảnh quan, phát quang |
| Hi-Vis Amber | trắng + header đen | vàng máy `#E8A013` | Mạnh, tương phản cao |
| Midnight Blue | **tối, navy** | xanh trời `#4DA3FF` | Hiện đại, điềm tĩnh |
| Olive & Sand | cát | olive `#6F7D2B` | Mộc, ngoài trời |
| Deep Teal | xám lạnh | teal `#0F766E` | Khác biệt với đối thủ |
| Brick Red | trắng | đỏ gạch `#B8322A` | Tự tin, nổi bật |
| Carbon & Lime | **tối** | xanh chanh phản quang `#B6E034` | Bắt mắt nhất |
| Black & White | trắng | đen | Để ảnh tự mang màu |

### Tự sinh bảng màu từ 1 màu

Chọn thẻ **Custom** trong admin → nhập **một màu thương hiệu** + chọn tông xám (ấm / trung tính / lạnh) + sáng hay tối. Hệ thống tự tính 14 màu còn lại (nền, viền, chữ, dải tối…).

### Đảm bảo đọc được (WCAG AA — liên quan tuân thủ ADA ở Mỹ)

Mọi bảng màu, kể cả bảng tự sinh, đều được kiểm thử tự động: chữ và nút đạt tương phản tối thiểu 4.5:1. Admin chọn 1 trong 3 chế độ: làm đậm màu thương hiệu (chữ trắng trên nút), giữ màu tươi (chữ tối trên nút), hoặc tắt.
