/* Vietnamese text of the handover report + user guide. Button names stay in English, as on screen. */

const site = (name, title, { full } = {}) => [
  { h3: title },
  { img: `site-${name}-desktop.jpg`, caption: `${title} — máy tính` },
  ...(full
    ? [
        {
          img: `site-${name}-desktop-full.jpg`,
          caption: `${title} — toàn trang trên máy tính (đọc từ trái sang phải)`,
        },
      ]
    : []),
  { img: `site-${name}-mobile.jpg`, caption: `${title} — điện thoại (đọc từ trái sang phải)` },
]

export const doc = {
  fileName: 'Mendez-Brothes-Ban-giao-va-Huong-dan-su-dung-VI',
  footer: 'Mendez Brothes — Bàn giao & hướng dẫn sử dụng',
  tocTitle: 'Mục lục',
  cover: {
    title: 'Báo cáo bàn giao & Hướng dẫn sử dụng',
    subtitle: 'Website Mendez Brothes General Construction',
    facts: [
      ['Ngày bàn giao', '02/10/2026'],
      ['Địa chỉ website', '[điền tên miền khi bàn giao]'],
      ['Trang quản trị', '[tên miền]/admin'],
      ['Tài khoản quản trị', 'Gửi riêng, không ghi trong tài liệu này'],
      ['Phiên bản tài liệu', '1.0'],
    ],
  },
  body: [
    // ───────────────────────── 1
    { h1: '1. Tóm tắt bàn giao' },
    {
      p: 'Website giới thiệu công ty, có trang quản trị để tự cập nhật nội dung mà không cần lập trình viên. Mọi thay đổi trong trang quản trị hiện lên website ngay sau khi bấm đăng.',
    },
    { h2: 'Những gì đã bàn giao' },
    {
      table: [
        ['Hạng mục', 'Nội dung'],
        [
          'Website',
          'Trang chủ, Giới thiệu, Dịch vụ (10 dịch vụ, mỗi dịch vụ một trang), Công trình (có bộ lọc), Năng lực máy móc, Liên hệ, Tin tức, trang theo từng khu vực. Hiển thị tốt trên máy tính và điện thoại.',
        ],
        [
          'Bộ lọc công trình',
          'Lọc theo dịch vụ, thị trấn, diện tích lô đất, năm, loại khách hàng; có ô tìm kiếm.',
        ],
        [
          'Form báo giá',
          'Khách điền form trên website, yêu cầu vào mục **Quote requests**. Xuất được ra file Excel (CSV).',
        ],
        [
          'Trang quản trị',
          'Đăng công trình, bài viết, sửa nội dung từng trang, đổi ảnh, logo, màu sắc, menu.',
        ],
        [
          'Màu sắc',
          '13 bảng màu có sẵn và chức năng tự tạo bảng màu từ một màu thương hiệu. Xem thử trước khi áp dụng.',
        ],
        ['Phân quyền', '3 cấp: Editor (nhân viên), Manager (chủ doanh nghiệp), Admin (kỹ thuật).'],
        [
          'Sao lưu',
          'Tự động mỗi ngày, giữ 7 bản gần nhất. Tải về hoặc khôi phục bất kỳ lúc nào trong trang quản trị.',
        ],
        [
          'Trợ lý AI',
          'Khung chat trả lời câu hỏi về trang quản trị. Gắn thêm khoá AI miễn phí để sửa chính tả, viết mô tả, viết tiêu đề Google, mô tả ảnh và kiểm tra trang trước khi đăng.',
        ],
        [
          'Thống kê',
          'Lượt khách, trang được xem, lượt bấm gọi, nguồn khách, redirect và lỗi 404 — xem ngay trong admin, không cần dịch vụ ngoài, không cookie.',
        ],
      ],
      widths: [26, 74],
    },
    { h2: 'Việc cần làm trước khi chạy chính thức' },
    {
      bullets: [
        '**Thay ảnh mẫu bằng ảnh công trình thật.** Ảnh hiện tại là ảnh minh hoạ lấy từ Wikimedia Commons, chỉ dùng tạm.',
        '**Thay nội dung mẫu.** Các đánh giá và bài viết có chữ [DEMO] là nội dung ví dụ.',
        '**Cấu hình email.** Hiện chưa bật, nên chưa có email báo khi có yêu cầu báo giá mới và chưa dùng được "Forgot password". Cần thông tin hộp thư gửi (SMTP) của công ty.',
        '**Đổi mật khẩu tài khoản quản trị** ngay sau lần đăng nhập đầu tiên (mục 3.12).',
        '**Tạo tài khoản riêng cho từng người** thay vì dùng chung một tài khoản (mục 3.11).',
      ],
    },

    // ───────────────────────── 2
    { h1: '2. Giao diện website' },
    {
      p: 'Ảnh chụp các trang hiện có, trên máy tính và điện thoại. Với trang dài, ảnh được cắt thành nhiều cột, đọc từ trái sang phải.',
    },
    ...site('home', 'Trang chủ', { full: true }),
    ...site('about', 'Giới thiệu (About Us)'),
    ...site('services', 'Danh sách dịch vụ (Services)'),
    ...site('service-detail', 'Chi tiết một dịch vụ'),
    ...site('projects', 'Công trình (Projects) — có bộ lọc', { full: true }),
    ...site('project-detail', 'Chi tiết một công trình', { full: true }),
    ...site('capabilities', 'Năng lực máy móc (Equipment & Technology)'),
    ...site('contact', 'Liên hệ (Contact)'),
    ...site('news', 'Tin tức (News)'),
    ...site('news-post', 'Một bài viết'),
    ...site('area', 'Trang theo khu vực'),
    { h3: 'Menu trên điện thoại' },
    { img: 'site-menu-mobile.jpg', caption: 'Menu mở toàn màn hình, có nút gọi điện', width: 250 },

    // ───────────────────────── 3
    { h1: '3. Hướng dẫn sử dụng trang quản trị' },
    {
      p: 'Trong các hình dưới đây, số màu đỏ trên hình ứng với số của từng bước. Tên nút và tên mục giữ nguyên tiếng Anh như trên màn hình.',
    },
    {
      note: 'Không sợ làm hỏng: mọi thay đổi ở trang và công trình đều lưu lại lịch sử và khôi phục được (mục 3.14). Khách truy cập chỉ thấy thay đổi sau khi bạn bấm **Publish changes**.',
    },

    { h2: '3.1 Đăng nhập' },
    { p: 'Mở địa chỉ **[tên miền]/admin** trên trình duyệt.' },
    { img: 'adm-login.jpg', width: 430 },
    {
      steps: [
        'Nhập **Email**.',
        'Nhập **Password**.',
        'Bấm **Login**.',
        '**Forgot password?** gửi email đặt lại mật khẩu. Chỉ dùng được sau khi công ty đã cấu hình email; trước đó, nhờ Manager đặt lại mật khẩu (mục 3.12).',
      ],
    },

    { h2: '3.2 Màn hình chính', newPage: true },
    { img: 'adm-home.jpg' },
    {
      steps: [
        'Việc hằng ngày: **Quote requests** (yêu cầu báo giá), **Pages** (các trang), **Projects** (công trình), **News** (tin tức), **Photos** (ảnh), **Statistics** (thống kê lượt truy cập).',
        'Thông tin công ty: **Services** (dịch vụ), **Equipment** (máy móc), **Reviews** (đánh giá của khách).',
        '**Settings** (cài đặt), **Help** (hướng dẫn nhanh ngay trong trang quản trị), **View website** (mở website), **Log out** (đăng xuất).',
        'Yêu cầu báo giá mới. Bấm vào để xem.',
        'Lối tắt tới các việc hay làm nhất.',
        'Tài khoản của bạn: đổi mật khẩu, đổi ngôn ngữ.',
      ],
    },

    { h2: '3.3 Đăng một công trình mới', newPage: true },
    { p: 'Công trình sau khi đăng tự hiện ở trang Projects và trong bộ lọc.' },
    { img: 'adm-projects-list.jpg' },
    {
      steps: [
        'Bấm **Projects** ở menu trái.',
        'Bấm **Create New** để tạo công trình mới.',
        'Ô tìm kiếm và bộ lọc, dùng khi danh sách đã dài.',
        'Bấm vào tên một công trình có sẵn để sửa.',
      ],
    },
    { p: 'Điền thông tin ở tab **Overview**:' },
    { img: 'adm-project-form.jpg' },
    {
      steps: [
        '**Title**: tên công trình.',
        '**Summary**: mô tả ngắn 1–2 câu, hiện dưới tên công trình.',
        '**Cover photo**: ảnh đại diện. Bấm vào ô này, chọn **Create New** để tải ảnh từ máy lên hoặc **Choose from existing** để dùng ảnh đã có. Muốn đổi ảnh: bấm dấu **X** rồi chọn lại.',
        '**Services**: chọn một hoặc nhiều dịch vụ. Dịch vụ đầu tiên hiện trên thẻ công trình.',
        '**Town / service area**: thị trấn. Nếu chưa có trong danh sách, bấm dấu **+** để thêm.',
        '**Lot / work area size**: diện tích và đơn vị (acres hoặc sq ft).',
        '**Completed**: tháng hoàn thành.',
        'Bấm **Publish changes**. Công trình lên website ngay.',
      ],
    },
    { p: 'Thêm nhiều ảnh cho công trình ở tab **Photos**:' },
    { img: 'adm-project-photos.jpg', width: 520 },
    {
      steps: [
        'Mở tab **Photos**.',
        'Mỗi khung là một ảnh trong bộ sưu tập, kèm chú thích (**Caption**) nếu muốn. Kéo biểu tượng ⠿ để đổi thứ tự.',
      ],
    },
    {
      p: 'Cuối danh sách có nút thêm ảnh mới, và bên dưới là cặp ảnh **Before / After** (trước và sau khi thi công) để khách kéo thanh trượt so sánh.',
    },

    { h2: '3.4 Lưu nháp, xem thử và đăng', newPage: true },
    { p: 'Thanh công cụ này có ở mọi trang, công trình và bài viết.' },
    { img: 'adm-publish-bar.jpg' },
    {
      steps: [
        '**Status**: "Published" là đang hiển thị trên website; "Changed" hoặc "Draft" là có thay đổi chưa đăng. Thay đổi được tự lưu nháp trong lúc bạn gõ.',
        'Biểu tượng con mắt: xem thử ngay bên cạnh trong lúc sửa.',
        '**Publish changes**: đăng lên website.',
        '**Versions**: lịch sử các lần sửa, dùng để khôi phục bản cũ (mục 3.14).',
      ],
    },

    { h2: '3.5 Viết bài tin tức' },
    { img: 'adm-posts-list.jpg' },
    { steps: ['Bấm **News**.', 'Bấm **Create New**.'] },
    { img: 'adm-post-form.jpg' },
    {
      steps: [
        '**Title**: tiêu đề bài viết.',
        '**Hero Image**: ảnh đầu bài.',
        'Thanh định dạng: tiêu đề phụ, chữ đậm, chữ nghiêng, liên kết, chèn ảnh.',
        'Nội dung bài viết. Gõ trực tiếp như trong Word.',
        'Bấm **Publish changes** để đăng.',
      ],
    },

    { h2: '3.6 Sửa nội dung một trang', newPage: true },
    { p: 'Dùng để đổi chữ, ảnh hoặc bố cục của Trang chủ, Giới thiệu, Năng lực, Liên hệ.' },
    { img: 'adm-pages-list.jpg' },
    { steps: ['Bấm **Pages**.', 'Bấm vào tên trang cần sửa, ví dụ **Home**.'] },
    {
      p: 'Mỗi trang gồm nhiều **section** (khối nội dung) xếp từ trên xuống, đúng thứ tự trên website:',
    },
    { img: 'adm-page-sections.jpg' },
    {
      steps: [
        'Bấm vào một dòng để mở section đó ra và sửa.',
        'Kéo biểu tượng ⠿ để đưa section lên hoặc xuống.',
        'Nút **⋯**: nhân bản (**Duplicate**) hoặc xoá (**Remove**) section.',
        '**Add section**: thêm section mới.',
        'Biểu tượng con mắt: xem thử trang trong lúc sửa.',
        '**Publish changes**: đăng thay đổi.',
      ],
    },
    { p: 'Bên trong một section (ví dụ phần ảnh lớn đầu Trang chủ):' },
    { img: 'adm-page-section-open.jpg', width: 520 },
    {
      steps: [
        '**Heading**: tiêu đề. Bọc chữ trong dấu sao, ví dụ *We build ground.*, để chữ đó đổi màu.',
        '**Intro text**: đoạn giới thiệu ngắn.',
        '**Main photo**: ảnh của section. Bấm dấu **X** rồi chọn ảnh khác để thay.',
        '**Look of this section**: tuỳ chọn nền, khoảng cách, ẩn trên điện thoại. Thường không cần đụng tới.',
      ],
    },
    { p: 'Khi bấm **Add section**, chọn loại section theo hình minh hoạ:' },
    { img: 'adm-page-add-section.jpg', width: 520 },
    {
      p: 'Xem thử trong lúc sửa: bấm biểu tượng con mắt, website hiện bên phải và cập nhật theo từng thay đổi.',
    },
    { img: 'adm-page-preview.jpg' },
    {
      steps: [
        'Bật hoặc tắt xem thử.',
        'Bản xem thử. Có thể chọn kích thước điện thoại, máy tính bảng hoặc máy tính.',
      ],
    },

    { h2: '3.7 Ảnh: tải lên và thay ảnh', newPage: true },
    { img: 'adm-photos-list.jpg' },
    {
      steps: [
        'Bấm **Photos** để mở thư viện ảnh.',
        '**Create New**: tải một ảnh lên.',
        '**Bulk Upload**: tải nhiều ảnh cùng lúc.',
        'Bấm vào tên ảnh để đổi mô tả hoặc thay file ảnh.',
      ],
    },
    {
      note: 'Ảnh chụp từ điện thoại tải lên thẳng được. Hệ thống tự thu nhỏ và nén ảnh nên không cần chỉnh kích thước trước.',
    },
    { img: 'adm-photo-upload.jpg' },
    {
      steps: [
        'Kéo ảnh từ máy tính thả vào đây, hoặc bấm **Select a file**.',
        '**Alt text**: mô tả ngắn nội dung ảnh (giúp Google hiểu ảnh). Để trống thì hệ thống lấy theo tên file.',
        'Bấm **Save**.',
      ],
    },

    { h2: '3.8 Đổi logo và thông tin công ty', newPage: true },
    { p: 'Vào **Settings** ở cuối menu trái. Mọi cài đặt ít khi thay đổi nằm ở đây.' },
    { img: 'adm-settings.jpg' },
    {
      steps: [
        'Bấm **Settings**.',
        '**Company info & logo**: số điện thoại, địa chỉ, giờ làm việc, logo.',
        '**Colours & fonts**: màu sắc và kiểu chữ (mục 3.9).',
        '**Users**: tài khoản và phân quyền (mục 3.11).',
        '**Backups**: sao lưu (mục 3.13).',
      ],
    },
    { p: 'Đổi logo trong **Company info & logo**:' },
    { img: 'adm-logos.jpg' },
    {
      steps: [
        'Mở tab **Logos**.',
        'Logo dùng trên nền sáng (hiện ở đầu trang). Bấm **X** rồi tải logo mới lên. Nên dùng file PNG nền trong suốt.',
        'Logo dùng trên nền tối (bản chữ trắng), hiện trên ảnh đầu trang và ở chân trang.',
        '**Favicon**: biểu tượng nhỏ trên tab trình duyệt, ảnh vuông.',
        'Bấm **Save**. Logo mới áp dụng cho toàn bộ website.',
      ],
    },
    { p: 'Đổi số điện thoại, email, địa chỉ ở tab **Company**:' },
    { img: 'adm-company.jpg' },
    {
      steps: [
        'Mở tab **Company**.',
        '**Phone**: số điện thoại, hiện ở đầu trang, chân trang và trang Liên hệ.',
        '**Email**.',
        'Bấm **Save**.',
      ],
    },
    { p: 'Đổi các mục trên thanh menu của website: **Settings → Menu**.' },
    { img: 'adm-menu.jpg', width: 520 },
    {
      steps: [
        'Bấm vào một dòng để đổi tên hoặc đường dẫn; kéo ⠿ để đổi thứ tự.',
        '**Add Nav Item**: thêm mục mới.',
        'Bấm **Save**.',
      ],
    },

    { h2: '3.9 Đổi màu sắc (theme)', newPage: true },
    { p: 'Vào **Settings → Colours & fonts**.' },
    { img: 'adm-theme.jpg' },
    {
      steps: [
        'Bấm vào một bảng màu để chọn.',
        'Website hiện ngay bên phải với màu vừa chọn. Lúc này khách truy cập vẫn thấy màu cũ.',
        'Bật hoặc tắt phần xem thử.',
        'Ưng ý thì bấm **Publish changes**. Chưa bấm thì website không đổi.',
      ],
    },
    { p: 'Có 13 bảng màu có sẵn:' },
    { img: 'adm-theme-palettes.jpg', width: 460 },
    { p: 'Muốn dùng đúng màu thương hiệu riêng, chọn **Custom**:' },
    { img: 'adm-theme-custom.jpg' },
    {
      steps: [
        'Chọn thẻ **Custom**.',
        '**Brand colour**: bấm vào ô màu để chọn màu thương hiệu. Các màu còn lại được tự tính cho hài hoà và dễ đọc.',
        '**Greys & backgrounds**: tông nền ấm, trung tính hoặc lạnh.',
      ],
    },
    {
      note: 'Kéo xuống dưới cùng trang này còn phần chọn kiểu chữ, độ bo góc và kiểu nút. Tất cả đều xem thử được trước khi đăng.',
    },

    { h2: '3.10 Yêu cầu báo giá (Quote requests)', newPage: true },
    {
      p: 'Mỗi lần khách gửi form trên website, một yêu cầu mới hiện ở màn hình chính và ở mục **Quote requests**.',
    },
    { img: 'adm-leads-list.jpg' },
    {
      steps: [
        'Bấm **Quote requests**. Số màu cam là số yêu cầu chưa xử lý.',
        'Bấm vào tên khách để xem chi tiết.',
        'Tải toàn bộ danh sách về dạng bảng tính, mở bằng Excel.',
      ],
    },
    { img: 'adm-lead-detail.jpg' },
    {
      steps: [
        '**Status**: đổi trạng thái sau khi liên hệ khách: New → Contacted → Quoted → Won / Lost.',
        '**Your notes**: ghi chú nội bộ, khách không thấy.',
        'Bấm **Save**.',
      ],
    },

    { h2: '3.11 Tài khoản và phân quyền', newPage: true },
    {
      table: [
        ['Vai trò', 'Dành cho', 'Được làm gì'],
        [
          '**Editor**',
          'Nhân viên',
          'Đăng công trình, bài viết, sửa trang, tải ảnh, xử lý yêu cầu báo giá.',
        ],
        [
          '**Manager**',
          'Chủ doanh nghiệp',
          'Mọi việc của Editor, thêm: thông tin công ty, logo, màu sắc, menu, tài khoản, sao lưu.',
        ],
        [
          '**Admin**',
          'Người phụ trách kỹ thuật',
          'Mọi việc của Manager, thêm các cài đặt kỹ thuật.',
        ],
      ],
      widths: [18, 24, 58],
    },
    { p: 'Tạo tài khoản mới: **Settings → Users**.' },
    { img: 'adm-users-list.jpg' },
    {
      steps: [
        'Bấm **Create New**.',
        'Bấm vào một tài khoản có sẵn để sửa hoặc đặt lại mật khẩu cho người đó.',
      ],
    },
    { img: 'adm-user-create.jpg' },
    {
      steps: [
        '**Email**: dùng để đăng nhập.',
        '**New Password**: mật khẩu ban đầu.',
        '**Confirm Password**: nhập lại mật khẩu.',
        '**Name**: tên người dùng.',
        '**Role**: chọn vai trò theo bảng trên. Nhân viên thì chọn "Editor".',
        'Bấm **Save**, rồi gửi email và mật khẩu cho người đó.',
      ],
    },
    {
      note: 'Chỉ Admin mới cấp hoặc gỡ được quyền Admin. Khi một người nghỉ việc, mở tài khoản của họ, bấm nút ⋮ rồi chọn **Delete**.',
    },

    { h2: '3.12 Đổi và đặt lại mật khẩu', newPage: true },
    { p: 'Tự đổi mật khẩu của mình:' },
    { img: 'adm-account.jpg' },
    {
      steps: [
        'Bấm biểu tượng tài khoản ở góc trên bên phải.',
        'Bấm **Change Password**.',
        '**Language**: đổi ngôn ngữ trang quản trị, có tiếng Việt.',
      ],
    },
    { img: 'adm-password.jpg' },
    { steps: ['Nhập mật khẩu mới.', 'Nhập lại mật khẩu mới.', 'Bấm **Save**.'] },
    {
      bullets: [
        '**Quên mật khẩu:** nhờ Manager vào **Settings → Users**, mở tài khoản của bạn, bấm **Change Password** và đặt mật khẩu mới.',
        '**Tài khoản bị khoá** do nhập sai nhiều lần: Manager mở tài khoản đó và bấm **Force Unlock**.',
        'Nên dùng mật khẩu dài từ 12 ký tự, không dùng lại mật khẩu của nơi khác.',
      ],
    },

    { h2: '3.13 Sao lưu', newPage: true },
    { p: 'Vào **Settings → Backups**. Một bản sao lưu chứa toàn bộ nội dung và ảnh của website.' },
    { img: 'adm-backups.jpg' },
    {
      steps: [
        '**Back up now**: tạo bản sao lưu ngay. Nên làm trước mỗi lần sửa lớn.',
        '**Download**: tải bản sao lưu về máy tính.',
        '**Restore**: đưa website về đúng thời điểm của bản đó. Hệ thống tự tạo một bản an toàn trước khi khôi phục, nên vẫn quay lại được.',
        '**Upload a backup file**: đưa một file sao lưu từ máy tính lên.',
      ],
    },
    {
      note: 'Website tự sao lưu mỗi ngày và giữ 7 bản gần nhất. Các bản này nằm trên cùng máy chủ với website, nên mỗi tháng nên bấm **Download** một lần để giữ một bản ở máy tính của công ty.',
    },

    { h2: '3.14 Hoàn tác khi sửa nhầm' },
    { p: 'Mỗi lần đăng một trang, công trình hoặc bài viết, hệ thống giữ lại bản trước đó.' },
    { img: 'adm-versions.jpg' },
    {
      steps: [
        'Mở trang cần khôi phục, bấm tab **Versions**.',
        'Bấm vào bản muốn quay lại, rồi bấm **Restore this version**.',
      ],
    },

    { h2: '3.16 Thống kê lượt truy cập', newPage: true },
    {
      p: 'Website tự đếm lượt truy cập, không cần Google Analytics hay dịch vụ nào khác. Bốn con số của 7 ngày gần nhất hiện ngay trên màn hình chính; bấm vào để xem chi tiết.',
    },
    { img: 'adm-stats.jpg' },
    {
      steps: [
        'Bấm **Statistics** ở menu trái.',
        'Chọn khoảng thời gian: 7, 30 hoặc 90 ngày gần nhất.',
        'Bốn con số chính: **Visitors** (khách truy cập), **Pages viewed** (số trang đã xem), **Phone number clicked** (lượt bấm gọi), **Quote requests** (yêu cầu báo giá), kèm mức tăng giảm so với kỳ trước.',
        'Biểu đồ khách theo ngày. Rê chuột vào một ngày để xem số; bấm “Show the numbers as a table” để xem dạng bảng.',
        'Chi tiết: trang được xem nhiều nhất, khách đến từ đâu (Google, Facebook, gõ trực tiếp…), khách đã bấm gì, dùng điện thoại hay máy tính, các redirect được dùng và các địa chỉ không tồn tại (404).',
      ],
    },
    {
      note: 'Không dùng cookie và không lưu thông tin cá nhân, chỉ lưu tổng số theo ngày. Robot và chính bạn khi đang đăng nhập admin không được tính. Nếu một địa chỉ 404 xuất hiện nhiều lần, nên tạo redirect cho nó.',
    },

    { h2: '3.15 Trợ lý AI', newPage: true },
    {
      p: 'Trang quản trị có sẵn một trợ lý. Chưa cần cài gì, trợ lý đã trả lời được các câu hỏi “làm việc này thế nào”. Khi gắn thêm một khoá AI (miễn phí), trợ lý trả lời được mọi câu hỏi và có thêm các nút AI ngay trong lúc soạn nội dung.',
    },
    { h3: 'Hỏi trợ lý' },
    { img: 'adm-ai-chat.jpg', width: 430 },
    {
      steps: [
        'Bấm nút tròn có logo ở góc dưới bên phải, có ở mọi màn hình.',
        'Gõ câu hỏi, bằng tiếng Việt hay tiếng Anh đều được, rồi bấm Enter.',
        'Trợ lý trả lời từng bước, kèm nút mở thẳng tới màn hình cần làm.',
      ],
    },
    {
      note: 'Khi đã gắn khoá AI, trợ lý còn tư vấn được: nên chọn màu nào, phông chữ nào, logo cần chuẩn bị ra sao, trang nên sắp xếp thế nào, viết câu giới thiệu sao cho hay.',
    },
    { h3: 'Hỏi một đoạn chữ sửa ở đâu, hoặc cách sửa bất kỳ section nào' },
    {
      steps: [
        'Sao chép một đoạn chữ bất kỳ trên website (tiêu đề, một câu, một danh sách) rồi dán vào trợ lý. Trợ lý trả lời đoạn đó nằm ở trang nào, section nào, hoặc thuộc danh sách nào (Towns we serve, Services, FAQs, Reviews…), kèm nút mở thẳng màn hình đó.',
        'Hỏi cách sửa, xoá, ẩn, dời hoặc thêm một section, gọi theo tiêu đề hoặc loại của nó (ví dụ “xóa section service area”). Câu trả lời nêu đúng trang và đúng hàng.',
        'Tính năng này không cần khoá AI. Khi có khoá, AI dùng cùng kết quả tra cứu nên cũng chỉ đúng màn hình.',
      ],
    },
    { h3: 'Lệnh nhanh: đổi logo, số điện thoại, màu… ngay trong khung chat' },
    {
      p: 'Gõ dấu **/** trong ô chat để hiện danh sách lệnh. Lệnh không cần khoá AI và làm đúng điều bạn gõ, không đoán.',
    },
    { img: 'adm-ai-commands.jpg', width: 430 },
    {
      steps: [
        'Gõ **/** — danh sách lệnh hiện ra. Gõ thêm vài chữ để lọc, bấm Tab hoặc bấm chuột để chọn.',
        'Với ảnh: kéo ảnh thả vào khung chat (hoặc dán, hoặc bấm biểu tượng kẹp giấy), rồi gõ lệnh, ví dụ **/logo**.',
      ],
    },
    { img: 'adm-ai-command-card.jpg', width: 430 },
    {
      steps: [
        'Ảnh và lệnh bạn vừa gửi.',
        'Thẻ xem trước cho thấy cái cũ → cái mới.',
        'Bấm **Apply** mới thay đổi; bấm **Cancel** nếu không muốn. Sau khi áp dụng có nút **Undo** để trả lại như cũ.',
      ],
    },
    {
      table: [
        ['Lệnh', 'Làm gì', 'Ví dụ'],
        [
          '**/logo**, **/logo-dark**, **/badge**, **/favicon**',
          'Thay logo nền sáng, logo nền tối, logo tròn, biểu tượng tab trình duyệt',
          '/logo + thả file logo',
        ],
        ['**/photos**', 'Đưa ảnh vào thư viện Photos', '/photos + thả nhiều ảnh'],
        [
          '**/project** tên',
          'Tạo công trình nháp từ ảnh (ảnh đầu là ảnh bìa)',
          '/project Đào hồ bơi ở Lewes',
        ],
        [
          '**/phone**, **/email**, **/hours**, **/tagline**',
          'Đổi số điện thoại, email, giờ làm việc, câu khẩu hiệu',
          '/phone 302-555-0100',
        ],
        [
          '**/address**',
          'Đổi địa chỉ (đường, thành phố, bang mã bưu chính)',
          '/address 12 Main St, Lewes, DE 19958',
        ],
        ['**/color** mã màu', 'Tạo bảng màu từ màu thương hiệu (lưu nháp)', '/color #1D5FA8'],
        ['**/palette** tên', 'Chọn bảng màu có sẵn (lưu nháp)', '/palette Studio'],
      ],
      widths: [30, 42, 28],
    },
    {
      note: 'Thả ảnh mà không gõ lệnh, trợ lý sẽ hỏi muốn dùng ảnh làm gì (logo, favicon, thêm vào Photos, tạo công trình). Có thể dán đường link ảnh sau lệnh, ví dụ /logo https://…/logo.png. Lệnh đổi logo, thông tin công ty và màu chỉ dành cho Manager. Màu được lưu nháp: mở Colours & fonts xem trước rồi bấm Publish.',
    },
    { h3: 'Gắn khoá AI miễn phí (làm một lần, chỉ Manager)' },
    { p: 'Vào **Settings → AI assistant**:' },
    { img: 'adm-ai-setup.jpg' },
    {
      steps: [
        'Chọn dịch vụ. **Google Gemini** miễn phí, chỉ cần tài khoản Google, không cần thẻ.',
        'Bấm **Open Google to get a key**. Trang Google AI Studio mở ra: đăng nhập, bấm **Create API key**, rồi sao chép khoá.',
        'Dán khoá vào ô này.',
        'Bấm **Test & save**. Hệ thống thử khoá trước; khoá đúng thì hiện “Connected”.',
      ],
    },
    {
      note: 'Khoá được lưu mã hoá trên máy chủ và không hiển thị lại. Gói miễn phí có giới hạn số lượt mỗi phút; nếu thấy báo bận, chờ một phút rồi thử lại. Nội dung nhờ AI xử lý sẽ được gửi tới dịch vụ đã chọn.',
    },
    { h3: 'Nút AI cạnh ô chữ' },
    { img: 'adm-ai-field.jpg' },
    {
      steps: [
        'Bấm vào một ô chữ bất kỳ và gõ nội dung.',
        'Nút **AI** hiện phía trên ô. Bấm vào và chọn: sửa chính tả, viết rõ hơn, rút gọn, hoặc dịch sang tiếng Anh.',
      ],
    },
    { img: 'adm-ai-suggestion.jpg' },
    {
      p: '**3** là bản AI đề xuất, sửa thêm được. **4** — bấm **Use this** để thay vào ô. Chưa bấm thì nội dung cũ vẫn giữ nguyên.',
    },
    { h3: 'Nút AI cạnh nút Publish' },
    { img: 'adm-ai-doc-menu.jpg' },
    {
      steps: [
        'Bấm **AI** ở trang, công trình, bài viết hoặc dịch vụ đang mở.',
        'Chọn việc cần làm: **Write the description** (viết mô tả công trình từ các thông tin đã điền), **Write Google title & description** (tiêu đề và mô tả hiện trên Google), **Check before publishing** (kiểm tra trước khi đăng).',
      ],
    },
    { p: 'Kết quả kiểm tra liệt kê từng chỗ cần xem lại và cách sửa:' },
    { img: 'adm-ai-check.jpg' },
    {
      bullets: [
        '**Ảnh:** ảnh mới tải lên được AI tự viết mô tả. Với ảnh cũ, mở ảnh trong **Photos** và bấm **Describe this photo**.',
        'AI chỉ đề xuất. Website chỉ thay đổi sau khi bạn bấm **Use this** rồi **Publish changes**.',
      ],
    },

    // ───────────────────────── 4
    { h1: '4. Câu hỏi thường gặp' },
    {
      table: [
        ['Tình huống', 'Cách xử lý'],
        [
          'Sửa xong nhưng website chưa đổi',
          'Kiểm tra đã bấm **Publish changes** (hoặc **Save**) chưa. Nếu **Status** còn là "Changed" hay "Draft" thì thay đổi chưa được đăng.',
        ],
        [
          'Muốn ẩn tạm một công trình hoặc bài viết',
          'Mở ra, bấm nút **⋮** ở góc phải thanh công cụ, chọn **Unpublish**. Muốn hiện lại thì bấm **Publish changes**.',
        ],
        [
          'Ảnh bị cắt mất phần quan trọng',
          'Mở ảnh trong **Photos**, bấm **Edit Image** và đặt lại điểm lấy nét (focal point) vào phần cần giữ.',
        ],
        [
          'Không nhận được email khi có yêu cầu báo giá',
          'Email chưa được cấu hình. Trong lúc chờ, xem yêu cầu mới ngay ở màn hình chính của trang quản trị.',
        ],
        [
          'Lỡ xoá hoặc sửa hỏng nhiều thứ',
          'Dùng **Versions** cho một trang (mục 3.14), hoặc **Restore** một bản sao lưu cho toàn bộ website (mục 3.13).',
        ],
        ['Cần hướng dẫn nhanh ngay trong lúc làm', 'Bấm **Help** ở menu trái.'],
      ],
      widths: [38, 62],
    },
  ],
}
