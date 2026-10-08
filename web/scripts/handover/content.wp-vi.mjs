/*
 * Vietnamese handover guide for the WordPress version of the site (theme "mendez").
 * Button and menu names stay in English, as on screen. Screenshots: wp-*.jpg (admin, made with
 * Docker + the theme) and site-*.jpg (the website; the WordPress theme looks the same as the design).
 */

export const doc = {
  fileName: 'Mendez-Brothes-WordPress-Ban-giao-va-Huong-dan-VI',
  footer: 'Mendez Brothes — WordPress: bàn giao & hướng dẫn',
  tocTitle: 'Mục lục',
  cover: {
    title: 'Bàn giao website WordPress & Hostinger',
    subtitle: 'Mendez Brothes General Construction — hướng dẫn từng bước',
    facts: [
      ['Ngày bàn giao', '08/10/2026'],
      ['Website', 'https://mendezbrother.com'],
      ['Trang quản trị', 'https://mendezbrother.com/wp-admin'],
      ['Hosting', 'Hostinger (bảng điều khiển hPanel)'],
      ['Phiên bản theme', 'Mendez Brothes 1.3.3 (file mendez.zip)'],
      ['Tài khoản', 'Gửi riêng, không ghi trong tài liệu này'],
      ['Phiên bản tài liệu', '1.0'],
    ],
  },
  body: [
    // ───────────────────────── 1
    { h1: '1. Tóm tắt bàn giao' },
    {
      p: 'Website chạy trên WordPress với một theme riêng tên **Mendez Brothes**. Mọi nội dung (công trình, tin tức, trang, ảnh, thông tin công ty, màu sắc, menu) sửa ngay trong trang quản trị, không cần lập trình. Thay đổi hiện lên website ngay sau khi bấm **Publish** hoặc **Update**.',
    },
    {
      p: 'Tài liệu chia làm bốn phần. Phần 3 là việc hằng ngày trong trang quản trị WordPress. Phần 4 là cách quản lý Hostinger: chia sẻ quyền, gia hạn, thanh toán. Phần 5 (ở cuối) là cách cập nhật theme khi có file **mendez.zip** mới.',
    },
    { h2: 'Những gì đã bàn giao' },
    {
      table: [
        ['Hạng mục', 'Nội dung'],
        [
          'Website',
          'Trang chủ, Giới thiệu, Dịch vụ (10 dịch vụ, mỗi dịch vụ một trang), Công trình (có bộ lọc), Năng lực máy móc, Liên hệ, Tin tức, trang theo từng thị trấn. Hiển thị tốt trên máy tính và điện thoại.',
        ],
        [
          'Bộ lọc công trình',
          'Lọc theo dịch vụ, diện tích, khu vực (bang, hạt, thị trấn), năm, loại khách hàng; có ô tìm kiếm.',
        ],
        [
          'Form báo giá',
          'Khách điền form, yêu cầu vào mục **Quote requests** và gửi email báo cho công ty. Xuất được ra file Excel (CSV).',
        ],
        [
          'Trang quản trị',
          'Đăng công trình, tin tức, sửa từng trang bằng các "section" kéo thả, đổi ảnh, logo, màu sắc, menu.',
        ],
        ['Phân quyền', '3 cấp: Editor (nhân viên), Manager (chủ doanh nghiệp), Administrator (kỹ thuật).'],
        [
          'Sao lưu',
          'Tự động mỗi tuần, giữ 4 bản gần nhất. Tải về hoặc khôi phục trong **Site settings → Backups**. Hostinger cũng có sao lưu riêng.',
        ],
        [
          'Thống kê',
          'Lượt khách, trang được xem, lượt bấm gọi, nguồn khách và lỗi 404, xem ngay trong admin, không cần dịch vụ ngoài và không dùng cookie.',
        ],
        [
          'Trợ lý AI (tuỳ chọn)',
          'Khung chat hướng dẫn trong admin. Dán khoá Google Gemini (miễn phí) để dùng thêm các nút ✨ viết mô tả, sửa chính tả.',
        ],
      ],
      widths: [26, 74],
    },
    { h2: 'Ai giữ cái gì' },
    {
      table: [
        ['Thứ cần giữ', 'Nằm ở đâu', 'Việc cần nhớ'],
        ['Website và hosting', 'Tài khoản Hostinger', 'Gia hạn hằng năm (phần 4.4).'],
        [
          'Tên miền mendezbrother.com',
          'GoDaddy (lúc lập tài liệu, nameserver của tên miền vẫn là ns47/ns48.domaincontrol.com của GoDaddy)',
          'Gia hạn tên miền ở GoDaddy. Không đổi nameserver nếu chưa hỏi người kỹ thuật (phần 4.7).',
        ],
        ['Tài khoản quản trị WordPress', 'mendezbrother.com/wp-admin', 'Mỗi người một tài khoản riêng (mục 3.16).'],
        ['File theme mendez.zip', 'Người kỹ thuật giữ; bản copy gửi kèm', 'Chỉ cần khi cập nhật theme (phần 5).'],
        ['Email nhận yêu cầu báo giá', 'Site settings → Estimate form', 'Phải là email công ty đọc hằng ngày (mục 3.13).'],
      ],
      widths: [26, 34, 40],
    },
    { h2: 'Việc cần làm trước khi chạy chính thức' },
    {
      bullets: [
        '**Thay ảnh mẫu bằng ảnh công trình thật** (mục 3.10 và 3.4).',
        '**Thay nội dung mẫu.** Các đánh giá và bài viết có chữ [DEMO] là ví dụ. Phần Reviews trên trang chủ đang được ẩn cho đến khi có đánh giá thật.',
        '**Điền email nhận báo giá** ở Site settings → Estimate form. Nếu để trống, hệ thống gửi về email công ty đang ghi ở tab Company (hiện là office@example.com, là địa chỉ mẫu).',
        '**Đổi số điện thoại, địa chỉ, giờ làm việc thật** ở Site settings → Company.',
        '**Đổi mật khẩu tài khoản quản trị** ngay lần đầu đăng nhập và tạo tài khoản riêng cho từng người (mục 3.16).',
        '**Bấm Back up now một lần** ở Site settings → Backups để có bản sao lưu đầu tiên (mục 3.17).',
        '**Kiểm tra email gửi đi.** Gửi thử một yêu cầu báo giá từ trang Contact. Nếu email không về hộp thư, cài plugin WP Mail SMTP và dùng hộp thư của Hostinger (mục 4.5).',
      ],
    },

    // ───────────────────────── 2
    { h1: '2. Giao diện website' },
    {
      p: 'Một số trang chính, để biết các phần bạn sẽ sửa nằm ở đâu trên website.',
    },
    { h3: 'Trang chủ' },
    { img: 'site-home-desktop.jpg', caption: 'Trang chủ — máy tính' },
    { img: 'site-home-mobile.jpg', caption: 'Trang chủ — điện thoại (đọc từ trái sang phải)' },
    { h3: 'Công trình (Projects) — có bộ lọc' },
    { img: 'site-projects-desktop.jpg', caption: 'Danh sách công trình' },
    { h3: 'Chi tiết một công trình' },
    { img: 'site-project-detail-desktop.jpg', caption: 'Trang một công trình' },
    { h3: 'Liên hệ (Contact)' },
    { img: 'site-contact-desktop.jpg', caption: 'Trang Contact với form báo giá' },
    { h3: 'Tin tức (News)' },
    { img: 'site-news-desktop.jpg', caption: 'Trang News' },

    // ───────────────────────── 3
    { h1: '3. Hướng dẫn sử dụng trang quản trị WordPress' },
    {
      p: 'Trong các hình dưới đây, số màu đỏ trên hình ứng với số của từng bước. Tên nút và tên mục giữ nguyên tiếng Anh như trên màn hình. Nếu muốn trang quản trị bằng tiếng Việt, xem mục 3.16.',
    },
    {
      note: 'Không sợ làm hỏng: trang, công trình và bài viết đều lưu lịch sử các lần sửa (mục 3.5), và có sao lưu cả website (mục 3.17). Khách truy cập chỉ thấy thay đổi sau khi bạn bấm **Publish** hoặc **Update**.',
    },

    { h2: '3.1 Đăng nhập' },
    { p: 'Mở **https://mendezbrother.com/wp-admin** trên trình duyệt.' },
    { img: 'wp-login.jpg', width: 430 },
    {
      steps: [
        'Nhập **Username or Email Address** (tên đăng nhập hoặc email).',
        'Nhập **Password**. Bấm biểu tượng con mắt để xem mật khẩu đang gõ.',
        'Bấm **Log In**.',
        '**Lost your password?** gửi link đặt lại mật khẩu về email của tài khoản. Cần chắc chắn email của tài khoản là email thật (mục 3.16).',
      ],
    },

    { h2: '3.2 Màn hình Home', newPage: true },
    { p: 'Sau khi đăng nhập, bấm **Home** ở góc trên của menu trái. Đây là màn hình dành riêng cho việc hằng ngày.' },
    { img: 'wp-home.jpg' },
    {
      steps: [
        'Menu trái: **Quote requests** (yêu cầu báo giá), **Pages** (các trang), **Projects** (công trình), **News** (tin tức), **Photos** (ảnh), **Services**, **Equipment**, **Reviews**, **Towns we serve**, **FAQs**, **Statistics**, **Site settings**, **Help**.',
        'Yêu cầu báo giá mới nhất. Bấm tên khách để xem và gọi lại.',
        '**Last 7 days**: khách vào web, lượt bấm gọi, số yêu cầu báo giá trong 7 ngày.',
        '**Everyday tasks**: lối tắt tới các việc hay làm nhất (thêm công trình, sửa trang, tải ảnh, viết tin, đổi màu, đổi số điện thoại và logo).',
      ],
    },
    {
      note: 'Các mục **Appearance**, **Plugins**, **Tools**, **Settings** và **Dashboard** của WordPress thuộc về phần kỹ thuật. Việc hằng ngày không cần vào đó, trừ **Appearance → Menus** (mục 3.14) và **Users** (mục 3.16).',
    },

    { h2: '3.3 Đăng một công trình mới', newPage: true },
    { p: 'Công trình sau khi đăng tự hiện ở trang Projects và trong bộ lọc.' },
    { img: 'wp-projects.jpg' },
    {
      steps: [
        'Bấm **Projects** ở menu trái.',
        'Bấm **Add project** để tạo công trình mới.',
        'Ô tìm kiếm, dùng khi danh sách đã dài.',
        'Bấm vào tên một công trình có sẵn để sửa.',
      ],
    },
    { img: 'wp-project-top.jpg' },
    {
      steps: [
        '**Cover photo** (cột phải): bấm **Choose main photo**, tải ảnh lên hoặc chọn từ thư viện. Ảnh này làm ảnh đại diện trong danh sách.',
        '**Title**: tên công trình, ví dụ "Wooded homesite clearing".',
        'Khung nội dung: viết mô tả chi tiết như trong Word. Có thể chèn thêm ảnh bằng **Add Media**.',
        'Bấm **Publish** (công trình mới) hoặc **Update** (công trình đang sửa). Công trình lên website ngay.',
      ],
    },

    { h2: '3.4 Điền thông tin chi tiết của công trình', newPage: true },
    { p: 'Kéo xuống dưới khung nội dung sẽ thấy ô **Project details**. Các thông tin này làm bộ lọc ở trang Projects hoạt động, nên điền đủ.' },
    { img: 'wp-project-details.jpg' },
    {
      steps: [
        '**Short scope of work**: mô tả ngắn 1–2 câu, hiện trên thẻ công trình và đầu trang công trình.',
        '**Services**: chọn một hoặc nhiều dịch vụ. Dịch vụ đầu tiên hiện làm nhãn trên thẻ. Công trình hiện trong bộ lọc của mọi dịch vụ đã chọn.',
        '**Town**: thị trấn. Nếu chưa có trong danh sách, thêm ở **Towns we serve** (mục 3.11).',
        '**Lot / work area size** và **Unit**: diện tích và đơn vị (acres hoặc sq ft). Website tự quy đổi về một đơn vị để lọc theo khoảng diện tích.',
        '**Completed (month)**: tháng hoàn thành. Dùng cho bộ lọc theo năm và sắp xếp.',
        '**Photos**: bấm **Add photos** để chọn nhiều ảnh cùng lúc; kéo để đổi thứ tự. Chú thích (Caption) của ảnh nhập trong thư viện ảnh (mục 3.10).',
        '**Before photo** / **After photo** (không bắt buộc): hai ảnh chụp cùng một chỗ, hiện thành thanh trượt trước / sau.',
        '**Review from this client**: gắn một đánh giá của khách (tạo ở **Reviews**, mục 3.11).',
      ],
    },
    {
      p: 'Ở dưới còn **Equipment used** (máy dùng cho công trình, chọn từ **Equipment**), **Other equipment / crews**, **Featured** (tích để công trình hiện ở các khu "Projects" đặt chế độ nổi bật, như trang chủ) và ô **Google & sharing** (tiêu đề, mô tả và ảnh khi chia sẻ; để trống là tự động).',
    },

    { h2: '3.5 Lưu nháp, xem thử, đăng và khôi phục bản cũ', newPage: true },
    { img: 'wp-publish-box.jpg', width: 340 },
    {
      steps: [
        '**Publish** / **Update**: đăng lên website. Với bài mới, cạnh đó còn có **Save Draft** để lưu nháp, chưa hiện trên website.',
        '**Preview Changes**: xem thử trang với các chỉnh sửa chưa lưu, trong một tab mới.',
        '**Status**: "Published" là đang hiển thị; "Draft" là nháp. Bấm **Edit** để đổi, hoặc đặt ngày đăng trong tương lai ở dòng **Publish**.',
      ],
    },
    {
      p: 'Pages, Projects và Services lưu **lịch sử các lần sửa**. Sau khi đã cập nhật ít nhất một lần, ở hộp Publish xuất hiện dòng **Revisions**. Bấm **Browse** để xem các bản cũ và bấm **Restore This Revision** để quay lại bản cũ, kể cả nội dung các section.',
    },

    { h2: '3.6 Viết bài tin tức', newPage: true },
    {
      p: 'Tin tức dùng trình soạn thảo kiểu "khối" (block) của WordPress. Lần đầu mở sẽ có cửa sổ "Welcome to the editor": bấm dấu **X** để đóng.',
    },
    { img: 'wp-posts.jpg' },
    {
      steps: [
        'Bấm **News** ở menu trái.',
        'Bấm **Add Post** để viết bài mới.',
        'Bấm vào tên bài có sẵn để sửa.',
      ],
    },
    { img: 'wp-post-new.jpg' },
    {
      steps: [
        'Tiêu đề bài viết.',
        'Bấm dấu **+** để chèn ảnh, tiêu đề phụ, danh sách… Hoặc gõ **/** ở dòng trống rồi chọn khối. Gõ nội dung trực tiếp như trong Word.',
        '**Set featured image** (thanh bên phải, thẻ **Post**): ảnh đầu bài, hiện ở danh sách tin.',
        '**Categories**: chọn chuyên mục (ví dụ Tips).',
        '**Publish** để đăng. Bấm **Save draft** nếu chưa muốn đăng.',
      ],
    },
    {
      note: 'Nếu thanh bên phải không hiện, bấm biểu tượng **Settings** (hình hai cột) ở góc trên bên phải của trình soạn thảo.',
    },

    { h2: '3.7 Sửa nội dung một trang', newPage: true },
    {
      p: 'Mỗi trang (Home, About Us, Equipment & Technology, Contact…) được ghép từ các **section** xếp từ trên xuống. Bạn sửa chữ, đổi ảnh, đổi thứ tự hoặc ẩn từng section mà không đụng tới phần còn lại.',
    },
    { img: 'wp-pages.jpg' },
    {
      steps: [
        'Bấm **Pages** ở menu trái.',
        'Bấm tên trang cần sửa, ví dụ **Home**.',
        '**Add Page** để tạo trang mới (trang mới tự có khung section như các trang khác).',
      ],
    },
    { img: 'wp-page-sections.jpg' },
    {
      steps: [
        'Bấm vào tên một section để mở ra sửa (mục 3.8).',
        'Nút **↑**: đưa section lên trên một bậc.',
        'Nút **↓**: đưa section xuống dưới một bậc. Có thể kéo thả section bằng tên của nó.',
        'Nút nhân đôi: tạo bản sao của section ngay bên dưới (tiện khi muốn làm khối tương tự).',
        'Nút **✕**: xoá section. Bấm nhầm thì dùng **Revisions** để lấy lại (mục 3.5).',
        '**Add section**: thêm section mới (mục 3.9).',
        '**Update**: lưu và đăng.',
      ],
    },
    {
      p: 'Dưới danh sách section có ô tích **Hide the call-to-action band above the footer on this page**: tích để ẩn dải kêu gọi hành động ở cuối trang này. Ô khung soạn thảo phía trên chỉ hiện chữ khi trang **không có** section nào.',
    },

    { h2: '3.8 Mở và sửa một section', newPage: true },
    { img: 'wp-section-open.jpg' },
    {
      steps: [
        'Bấm vào tiêu đề để mở hoặc đóng section.',
        'Các ô của section: chọn kiểu bố cục, sửa chữ, đổi ảnh, thêm nút, thêm mục. Khi có dấu ✨ cạnh ô, bấm vào để AI gợi ý chữ (cần khoá AI, mục 3.15).',
      ],
    },
    {
      bullets: [
        'Muốn một từ **đổi sang màu thương hiệu** trong tiêu đề, đặt từ đó giữa hai dấu sao, ví dụ: Site work *in Sussex County*.',
        'Mỗi section có một nhóm ô thu gọn tên **Look of this section**: **Background** (nền), **Spacing** (khoảng cách trên dưới), **Hide on** (ẩn trên điện thoại, trên máy tính hoặc ẩn hẳn) và **Anchor ID** để tạo link nhảy tới đúng section.',
        'Bấm **Preview Changes** để xem thử trước khi bấm **Update**.',
      ],
    },

    { h2: '3.9 Thêm một section mới', newPage: true },
    { img: 'wp-section-picker.jpg' },
    {
      steps: [
        'Gõ vào ô tìm kiếm để lọc loại section.',
        'Bấm vào hình của loại section muốn thêm. Mỗi loại có ảnh minh hoạ và một dòng giải thích.',
        'Bấm **✕** để đóng mà không thêm gì.',
      ],
    },
    {
      p: 'Có 21 loại section, chia nhóm: đầu trang, giới thiệu việc làm (dịch vụ, công trình, máy móc, thị trấn), kể chuyện (văn bản kèm ảnh, thẻ tính năng, các bước, con số, danh sách tích) và kêu gọi hành động (đánh giá, hỏi đáp, form báo giá…). Section mới nằm ở cuối trang; dùng **↑** để đưa lên đúng vị trí, rồi bấm **Update**.',
    },

    { h2: '3.10 Tải ảnh lên và quản lý thư viện ảnh', newPage: true },
    { img: 'wp-media-upload.jpg' },
    {
      steps: [
        'Kéo ảnh từ máy tính thả vào khung này.',
        'Hoặc bấm **Select Files** và chọn ảnh.',
      ],
    },
    { img: 'wp-media-library.jpg' },
    {
      steps: [
        'Bấm **Photos** ở menu trái để mở thư viện ảnh.',
        'Bấm **Add Media File** để thêm ảnh.',
        'Bấm vào một ảnh để xem và sửa thông tin của nó.',
      ],
    },
    { img: 'wp-media-detail.jpg' },
    {
      steps: [
        '**Alternative Text**: mô tả ngắn ảnh bằng chữ ("Mini excavator clearing a wooded lot"). Giúp Google hiểu ảnh và giúp người khiếm thị. Nên điền cho mọi ảnh công trình.',
        '**Image Caption**: chú thích, hiện khi khách mở ảnh to trong trang công trình.',
      ],
    },
    {
      bullets: [
        'Ảnh chụp bằng điện thoại thường rất nặng. Trước khi tải lên, nên thu nhỏ về chiều rộng khoảng **1600 px** (có thể dùng ứng dụng Ảnh có sẵn trên máy), website sẽ nhanh hơn nhiều.',
        'Theme tự tạo các cỡ ảnh nhỏ hơn và bản WebP nhẹ hơn, bạn không cần làm gì thêm.',
        'Xoá ảnh ở thư viện sẽ làm ảnh biến mất khỏi mọi trang đang dùng nó. Kiểm tra trước khi xoá.',
      ],
    },

    { h2: '3.11 Dịch vụ, máy móc, đánh giá, thị trấn, câu hỏi', newPage: true },
    { img: 'wp-services.jpg' },
    {
      steps: [
        '**Services**: mỗi dịch vụ có một trang riêng và một ô trên trang chủ.',
        '**Add service** để thêm dịch vụ mới.',
        'Bấm tên dịch vụ để sửa mô tả, ảnh, các ý nổi bật và câu hỏi thường gặp.',
      ],
    },
    {
      table: [
        ['Mục', 'Dùng để', 'Ghi chú'],
        ['Services', 'Dịch vụ công ty cung cấp', 'Hiện ở trang chủ, trang Services và cột chân trang.'],
        ['Equipment', 'Máy móc (ảnh, thông số)', 'Hiện ở trang Equipment & Technology; gắn vào từng công trình.'],
        [
          'Reviews',
          'Đánh giá của khách (tên, nơi ở, số sao, nội dung)',
          'Các đánh giá có chữ [DEMO] là mẫu, thay bằng đánh giá thật rồi bật lại section Reviews ở trang chủ (Hide on → Always visible).',
        ],
        ['Towns we serve', 'Các thị trấn phục vụ', 'Dùng cho bộ lọc khu vực (bang, hạt, thị trấn) và danh sách "Where we work".'],
        ['FAQs', 'Câu hỏi thường gặp', 'Gắn vào trang chủ hoặc từng dịch vụ.'],
      ],
      widths: [20, 36, 44],
    },

    { h2: '3.12 Yêu cầu báo giá', newPage: true },
    { p: 'Khi khách điền form ở trang Contact (hoặc các form trong trang), yêu cầu được lưu ở đây và có email báo về hộp thư đã đặt ở mục 3.13.' },
    { img: 'wp-leads.jpg' },
    {
      steps: [
        'Bấm **Quote requests** ở menu trái. Số trong vòng tròn là số yêu cầu mới.',
        'Bấm tên khách để mở.',
      ],
    },
    { img: 'wp-lead-detail.jpg' },
    {
      bullets: [
        '**Status**: đổi trạng thái (New → Contacted → Quoted → Won / Lost) để cả nhóm biết yêu cầu đang ở bước nào.',
        '**Internal notes**: ghi chú nội bộ, không hiện ra website.',
        '**Add a request taken by phone**: tự thêm yêu cầu khi khách gọi điện, để mọi yêu cầu nằm chung một chỗ.',
        'Ở trên danh sách có nút **Download all as a spreadsheet (CSV)** để tải toàn bộ yêu cầu thành file Excel.',
      ],
    },

    { h2: '3.13 Cài đặt chung của website (Site settings)', newPage: true },
    { p: 'Bấm **Site settings** ở menu trái. Mỗi thẻ (tab) là một nhóm cài đặt; bấm **Save settings** ở cuối sau khi sửa. Mục này chỉ Manager và Administrator thấy.' },
    { img: 'wp-settings-company.jpg' },
    {
      table: [
        ['Tab', 'Dùng để'],
        ['Company', 'Tên công ty, phone, email, địa chỉ, giờ làm việc, mạng xã hội. Số điện thoại, địa chỉ và giờ làm việc ở đây tự hiện ở đầu trang, chân trang và trang Contact.'],
        ['Logos', 'Logo cho nền sáng, nền tối, logo tròn (badge) và biểu tượng tab trình duyệt (favicon).'],
        ['Site-wide', 'Thanh thông báo trên cùng, dải kêu gọi hành động trên chân trang, thanh "Call now" cố định trên điện thoại, nút lên đầu trang.'],
        ['Colours & fonts', '13 bảng màu có sẵn hoặc tự tạo từ màu logo; chọn font, bo góc, kiểu nút. Có nút xem thử trên website trước khi lưu.'],
        ['Menu & footer', 'Nút điện thoại ở đầu trang và các cột chân trang.'],
        ['List pages', 'Tiêu đề và chữ giới thiệu của các trang danh sách (Projects, Services, News), số công trình mỗi trang, các bộ lọc hiển thị, các khoảng diện tích của bộ lọc.'],
        ['Estimate form', 'Email nhận yêu cầu báo giá, chữ trên nút, lời cảm ơn sau khi gửi, có hỏi diện tích / địa chỉ hay không.'],
        ['SEO & tracking', 'Hậu tố tiêu đề Google, ảnh chia sẻ mặc định, mã theo dõi (nếu dùng).'],
      ],
      widths: [22, 78],
    },
    { img: 'wp-settings-logos.jpg' },
    { img: 'wp-settings-form.jpg' },
    {
      note: '**Quan trọng:** ô **Send new requests to (email)** ở tab **Estimate form** là nơi nhận yêu cầu báo giá. Ô này để trống thì hệ thống dùng email ở tab Company. Có thể nhập nhiều email, ngăn cách bằng dấu phẩy. Sau khi đổi, gửi thử một yêu cầu từ trang Contact để chắc chắn email về đúng hộp thư.',
    },
    { img: 'wp-settings-colours.jpg' },

    { h2: '3.14 Menu của website', newPage: true },
    { p: 'Menu đầu trang và chân trang chỉnh trong **Appearance → Menus**.' },
    { img: 'wp-menus.jpg' },
    {
      steps: [
        'Chọn menu muốn sửa (**Main menu**, **Footer**) rồi bấm **Select**.',
        'Chọn trang, bài hoặc liên kết ở cột trái rồi bấm **Add to Menu**.',
        'Kéo thả các mục để đổi thứ tự. Kéo một mục hơi sang phải để biến nó thành mục con.',
        'Bấm **Save Menu** để lưu.',
        'Thẻ **Manage Locations**: chọn menu nào hiện ở vị trí nào (đầu trang, chân trang).',
      ],
    },
    {
      p: 'Menu chân trang có thể nhiều cột: đặt link con dưới một link, link cha làm tiêu đề cột (tối đa 3 cột).',
    },

    { h2: '3.15 Thống kê, Help và trợ lý AI', newPage: true },
    { img: 'wp-stats.jpg' },
    {
      bullets: [
        '**Statistics**: số khách, trang được xem nhiều, lượt bấm gọi / gửi email / yêu cầu báo giá, nguồn khách, loại thiết bị và các địa chỉ bị 404 (người dùng gõ sai hoặc link cũ). Không dùng cookie, không lưu địa chỉ IP; người đang đăng nhập và robot không được tính.',
        '**Help**: hướng dẫn nhanh ngay trong trang quản trị, có hình minh hoạ. Khung chat nổi **Help** (góc dưới bên phải mọi màn hình) trả lời câu hỏi về cách dùng.',
        '**Site settings → AI assistant** (chỉ Manager và Administrator): dán khoá API Google Gemini (miễn phí tại aistudio.google.com/apikey) để dùng các nút ✨ viết mô tả, gợi ý tiêu đề Google, mô tả ảnh và kiểm tra trang trước khi đăng. Không có khoá thì website vẫn chạy bình thường.',
      ],
    },
    { img: 'wp-help.jpg' },

    { h2: '3.16 Tài khoản, mật khẩu và phân quyền', newPage: true },
    { h3: 'Đổi mật khẩu của chính bạn' },
    { p: 'Bấm tên bạn ở góc phải trên cùng → **Edit Profile** (hoặc **Users → Profile**).' },
    { img: 'wp-profile-b.jpg' },
    {
      steps: [
        'Kéo xuống **Account Management**, bấm **Set New Password**. WordPress gợi ý sẵn một mật khẩu mạnh; có thể xoá và gõ mật khẩu của bạn (nên từ 14 ký tự trở lên, không dùng lại mật khẩu ở nơi khác).',
        'Bấm **Log Out Everywhere Else** nếu nghi ngờ có người khác đang dùng tài khoản.',
        'Bấm **Update Profile** ở cuối trang để lưu.',
      ],
    },
    { h3: 'Đổi tên hiển thị, email và ngôn ngữ' },
    { img: 'wp-profile-a.jpg' },
    {
      steps: [
        '**Language**: chọn "Tiếng Việt" để trang quản trị bằng tiếng Việt. Mỗi người tự chọn; khách xem website vẫn thấy tiếng Anh.',
        '**Display name publicly as**: tên hiện ra website (ví dụ ở bài viết). Sửa **Nickname** trước rồi chọn ở ô này.',
        '**Email**: email của tài khoản. WordPress gửi thư xác nhận tới địa chỉ mới; địa chỉ mới chỉ có hiệu lực sau khi bấm link trong thư. Đây cũng là nơi gửi link đặt lại mật khẩu.',
      ],
    },
    {
      note: '**Tên đăng nhập (username) không đổi được.** Muốn đổi, hãy tạo tài khoản mới với tên mong muốn (vai trò Administrator), đăng nhập bằng tài khoản mới, rồi xoá tài khoản cũ. Khi xoá chọn **Attribute all content to** tài khoản mới để không mất bài viết.',
    },
    { h3: 'Thêm người dùng mới' },
    { p: 'Vào **Users → Add User**. Người dùng mới nhận email có link tự đặt mật khẩu, nên bạn không cần biết mật khẩu của họ.' },
    { img: 'wp-user-new.jpg' },
    {
      steps: [
        '**Username**: tên đăng nhập (không dấu, không khoảng trắng).',
        '**Email**: email thật của người đó.',
        '**Role**: vai trò (xem bảng bên dưới).',
        'Bấm **Add User**. Để nguyên dấu tích **Send the new user an email about their account** thì họ nhận được email mời.',
      ],
    },
    {
      table: [
        ['Vai trò', 'Dành cho', 'Làm được'],
        [
          'Editor',
          'Nhân viên đăng bài',
          'Đăng và sửa công trình, tin tức, trang, ảnh, dịch vụ…; xem và xử lý Quote requests; xem Statistics. Không vào được Site settings và không quản lý người dùng.',
        ],
        [
          'Manager',
          'Chủ doanh nghiệp',
          'Mọi việc của Editor, cộng với Site settings, Backups, AI assistant, menu, tạo và quản lý người dùng. Không cài được theme hoặc plugin.',
        ],
        [
          'Administrator',
          'Người kỹ thuật',
          'Toàn quyền, gồm cài và cập nhật theme, plugin (phần 5). Chỉ Administrator mới tạo được Administrator khác.',
        ],
      ],
      widths: [18, 24, 58],
    },
    { img: 'wp-users.jpg' },
    {
      p: 'Danh sách ở **Users → All Users**: rê chuột vào một người để **Edit**, đổi vai trò hoặc **Delete**. Khi một nhân viên nghỉ việc, hãy xoá tài khoản của họ (chọn chuyển bài viết cho người khác) thay vì để mở.',
    },

    { h2: '3.17 Sao lưu và khôi phục', newPage: true },
    { img: 'wp-backups.jpg' },
    {
      bullets: [
        '**Back up now**: tạo một file .zip chứa toàn bộ website (trang, công trình, dịch vụ, tin, yêu cầu báo giá, cài đặt, người dùng và tất cả ảnh). Có thanh tiến độ, có thể rời trang.',
        '**Automatic backups**: mặc định mỗi tuần, khoảng 3 giờ sáng; có thể đổi sang mỗi ngày hoặc tắt, và chọn giữ bao nhiêu bản. Bản làm bằng tay giữ đến khi bạn xoá.',
        '**Tải về**: khoảng mỗi tháng, tải bản mới nhất về máy tính hoặc Google Drive. Nếu mất tài khoản hosting thì các bản chỉ nằm trên hosting cũng mất.',
        '**Restore**: đưa database và ảnh về ngày đã chọn. Trước khi khôi phục, hệ thống tự tạo bản "Before a restore" nên hoàn tác được. Website vẫn chạy trong lúc khôi phục.',
        'Chuyển sang hosting khác: cài WordPress và theme ở nơi mới, vào Backups, **Upload** file sao lưu rồi **Restore**. Địa chỉ website tự sửa theo.',
        'Theme và plugin không nằm trong file sao lưu (đã có file mendez.zip).',
      ],
    },
    {
      note: 'Hostinger cũng tự sao lưu hằng tuần (xem mục 4.5). Dùng cả hai thì an toàn hơn: bản của theme dễ dùng cho việc hằng ngày, bản của Hostinger là lớp bảo vệ thứ hai.',
    },

    // ───────────────────────── 4
    { h1: '4. Quản lý trên Hostinger' },
    {
      p: 'Website được lưu trên Hostinger. Phần này giải thích cách quản lý bằng **hPanel** (bảng điều khiển của Hostinger), gồm cơ chế **chia sẻ quyền Admin**, ai trả tiền và ai gia hạn. Địa chỉ quản lý website: **https://hpanel.hostinger.com/websites/mendezbrother.com**.',
    },
    {
      note: 'Phần này dựa trên tài liệu chính thức của Hostinger và trên màn hình hPanel khi lập tài liệu. Hostinger thỉnh thoảng đổi tên mục hoặc vị trí nút; nếu một nút khác tên đôi chút, hãy tìm nút có ý nghĩa gần nhất hoặc dùng ô **Tìm kiếm** của hPanel. Điều khoản thanh toán và quyền cụ thể do Hostinger quyết định, nên với việc liên quan tới tiền, hãy kiểm tra lại trong tài khoản của bạn.',
    },

    { h2: '4.1 Những gì nằm ở đâu' },
    {
      table: [
        ['Thứ', 'Nơi quản lý', 'Ghi chú'],
        ['Nội dung website (trang, công trình, ảnh…)', 'WordPress: mendezbrother.com/wp-admin', 'Việc hằng ngày, xem phần 3.'],
        ['File và database của website, sao lưu của hosting, SSL, bộ nhớ đệm (cache)', 'Hostinger hPanel', 'Phần 4 này.'],
        ['Gói hosting, gia hạn, hoá đơn, thẻ thanh toán', 'Hostinger hPanel → Billing', 'Mục 4.4.'],
        ['Tên miền mendezbrother.com và DNS', 'GoDaddy (theo nameserver hiện tại)', 'Mục 4.7.'],
        ['Email gửi đi từ website', 'WordPress + hộp thư Hostinger (nếu cài SMTP)', 'Mục 4.5.'],
      ],
      widths: [38, 34, 28],
    },

    { h2: '4.2 Cơ chế chia sẻ quyền (Account Sharing)', newPage: true },
    {
      p: 'Hostinger cho một tài khoản **mời** người khác vào quản lý mà không phải đưa mật khẩu. Có hai bên:',
    },
    {
      bullets: [
        '**Chủ tài khoản (owner)**: tài khoản đã mua hosting, giữ thẻ thanh toán và mật khẩu gốc. Chỉ chủ tài khoản mới đổi được email, mật khẩu, phương thức thanh toán và xoá tài khoản.',
        '**Người được chia sẻ**: nhận email mời, bấm link, rồi vào hPanel bằng **tài khoản Hostinger của chính họ** (có mật khẩu và xác thực 2 lớp riêng). Họ thấy tài khoản được mời trong mục **Accounts I have access to**. Khi họ đang xem, hPanel hiện một **dải màu tím** ở đầu trang với dòng "Quyền truy cập quản trị. Các thay đổi áp dụng cho tài khoản của họ, không phải của bạn" để nhắc rằng đó là tài khoản của người khác.',
      ],
    },
    { h3: 'Hai mức quyền' },
    {
      table: [
        ['Việc', 'Collaborator', 'Admin'],
        ['Quản lý file website, thư mục con (subdomain)', 'Có', 'Có'],
        ['Sửa DNS (nếu tên miền được chia sẻ)', 'Có', 'Có'],
        ['Mua hoặc gia hạn bằng phương thức thanh toán đã lưu của chủ tài khoản', 'Không', '**Có**'],
        ['Thêm hoặc sửa phương thức thanh toán', 'Không', 'Không'],
        ['Đổi email, mật khẩu, thông tin hồ sơ của chủ tài khoản', 'Không', 'Không'],
        ['Mời thêm người khác', 'Không', 'Không'],
        ['Chuyển, mở khoá, sửa thông tin liên hệ của tên miền', 'Không', 'Không'],
        ['Tạo gói hosting, VPS hoặc email mới', 'Không', 'Không'],
        ['Xoá tài khoản', 'Không', 'Không'],
      ],
      widths: [58, 21, 21],
    },
    {
      note: 'Hostinger không nói rõ trong bảng quyền việc **xem hoá đơn** và **xem thông tin thanh toán** dành cho người được chia sẻ. Sau khi chia sẻ, hãy thử đăng nhập bằng tài khoản được mời và vào mục Billing để biết chính xác người đó thấy gì.',
    },
    {
      p: 'Điểm cần hiểu rõ nhất: mức **Admin** được **mua bằng thẻ đã lưu của chủ tài khoản**. Nghĩa là nếu khách giữ quyền Admin trên tài khoản của người kỹ thuật, bấm "Renew" hay mua thêm gì thì tiền trừ vào **thẻ của chủ tài khoản**. Ngược lại, mức **Collaborator** không mua được gì. Vì vậy phải thống nhất ai là chủ tài khoản và thẻ của ai (mục 4.4) trước khi cấp quyền.',
    },
    { h3: 'Cách chủ tài khoản cấp quyền' },
    {
      steps: [
        'Đăng nhập hPanel bằng tài khoản chủ. Bấm biểu tượng tài khoản ở góc trên → **Account Sharing**.',
        'Bấm **Give Access**.',
        'Nhập email của người được mời. Chọn **website / dịch vụ** được chia sẻ (ở đây là mendezbrother.com) và chọn mức quyền **Admin** hoặc **Collaborator**.',
        'Bấm **Give Access** để gửi lời mời. Người được mời nhận email.',
      ],
    },
    { h3: 'Cách người được mời nhận quyền' },
    {
      steps: [
        'Mở email mời từ Hostinger và bấm link. Nếu chưa có tài khoản Hostinger, tạo một tài khoản bằng đúng email được mời (miễn phí).',
        'Đăng nhập hPanel. Trong mục tài khoản (biểu tượng ở góc trên) chọn **Accounts I have access to** rồi chọn tài khoản của chủ.',
        'Từ đó thao tác như mục 4.5. Muốn quay lại tài khoản của mình, bấm **Thoát** trên dải tím.',
      ],
    },
    { h3: 'Cách thu hồi quyền' },
    {
      steps: [
        'Chủ tài khoản vào **Account Sharing** → thẻ **Grant access**.',
        'Bấm dấu **⋮** cạnh email người đó → **Remove access**. Có hiệu lực ngay. Người được mời cũng tự rút ra được bất cứ lúc nào.',
      ],
    },
    {
      p: 'Lưu ý của Hostinger: cửa hàng thương mại điện tử (Ecommerce store) không chia sẻ được. Website WordPress này không thuộc loại đó.',
    },

    { h2: '4.3 Một số chức năng của hPanel và dùng để làm gì', newPage: true },
    { p: 'Menu trái của hPanel (khi đã chọn website mendezbrother.com) gồm các mục sau.' },
    {
      table: [
        ['Mục trong hPanel', 'Dùng để', 'Khách có cần không?'],
        ['Bảng điều khiển (Dashboard)', 'Tổng quan: nút **Quản trị WordPress**, trạng thái bảo vệ (phần mềm độc hại, LiteSpeed, SSL, CDN), "Sức khỏe trang web" (phiên bản WordPress, PHP, plugin cần cập nhật), sao lưu gần nhất.', 'Hay vào nhất.'],
        ['WordPress', 'Đăng nhập nhanh vào WordPress, cập nhật WordPress, plugin, theme; đổi mật khẩu quản trị; bật chế độ bảo trì.', 'Thỉnh thoảng.'],
        ['Gói hosting', 'Thông tin gói đang dùng, ngày hết hạn, dung lượng, nâng cấp gói.', 'Khi gia hạn hoặc nâng cấp.'],
        ['Hiệu suất', 'Tốc độ website, bộ nhớ đệm LiteSpeed (xoá cache), tài nguyên máy chủ.', 'Khi sửa mà web chưa đổi.'],
        ['Phân tích', 'Lượng truy cập ở phía hosting.', 'Ít cần (đã có Statistics trong WordPress).'],
        ['Bảo mật', 'Quét phần mềm độc hại, SSL (khoá bảo mật https).', 'Kiểm tra SSL còn bật.'],
        ['Tên miền', 'Xem và quản lý tên miền nằm ở Hostinger. Với mendezbrother.com, phần chính nằm ở GoDaddy (mục 4.7).', 'Ít.'],
        ['Tập tin (File manager)', 'Duyệt và tải file lên website, kể cả file .zip.', 'Chỉ khi cần (mục 5.5).'],
        ['Cơ sở dữ liệu', 'Quản lý database (phpMyAdmin).', 'Không nên tự làm.'],
        ['Nâng cao', 'Cấu hình PHP (giới hạn tải file), tác vụ định kỳ, truy cập SSH…', 'Chỉ người kỹ thuật.'],
        ['E-mail', 'Tạo hộp thư theo tên miền, ví dụ info@mendezbrother.com.', 'Nếu muốn email chuyên nghiệp.'],
        ['Sao lưu (dòng trên Bảng điều khiển)', 'Bản sao lưu tự động của Hostinger (hiện đặt hằng tuần), khôi phục.', 'Khi có sự cố.'],
        ['Trợ lý (Trợ lý AI, Quảng cáo Google, Tiếp thị qua email, VPS…)', 'Dịch vụ bán thêm hoặc tính năng phụ của Hostinger.', '**Không cần** cho website này.'],
      ],
      widths: [24, 52, 24],
    },

    { h2: '4.4 Ai trả tiền, ai gia hạn, thẻ của ai', newPage: true },
    {
      p: 'Đây là điều phải thống nhất bằng văn bản trước khi bàn giao, vì Hostinger tính tiền vào **phương thức thanh toán đã lưu trong tài khoản chủ**, và người được chia sẻ quyền Admin có thể bấm gia hạn bằng thẻ đó.',
    },
    { h3: 'Cách gia hạn hoạt động (theo tài liệu Hostinger)' },
    {
      bullets: [
        'Mỗi dịch vụ (gói hosting, tên miền) có công tắc **tự gia hạn (auto-renewal)** riêng. Khi bật, Hostinger trừ tiền vào phương thức thanh toán đã lưu **trước** ngày hết hạn: khoảng **14 ngày** với gói đóng theo năm, **1 ngày** với gói đóng theo tháng, **27 ngày** với tên miền.',
        'Nếu không bật tự gia hạn, hoặc thẻ không trừ được, dịch vụ sẽ hết hạn và website có thể ngừng hoạt động. Hostinger không nêu rõ thời gian ân hạn và khi nào dữ liệu bị xoá trong tài liệu hướng dẫn; hãy luôn gia hạn trước ngày hết hạn.',
        'Tiền gia hạn tên miền không được hoàn lại.',
        'Giá gia hạn thường **cao hơn** giá khuyến mãi lần đầu. Xem **giá gia hạn** ở Billing → Subscriptions trước khi quyết định.',
      ],
    },
    { h3: 'Ba cách phân chia trách nhiệm' },
    {
      table: [
        ['Cách', 'Ai là chủ tài khoản Hostinger và trả tiền', 'Khách làm được gì', 'Nên dùng khi'],
        [
          'A. Người kỹ thuật giữ tài khoản, khách xem và hỗ trợ',
          'Người kỹ thuật. Thẻ của người kỹ thuật bị trừ tiền. Hai bên tự thoả thuận khoản khách hoàn lại.',
          'Collaborator: quản lý file, DNS, xem trạng thái. **Không** mua được gì, nên không vô tình trừ thẻ.',
          'Người kỹ thuật tiếp tục lo hosting như một dịch vụ trọn gói có phí hằng năm.',
        ],
        [
          'B. Khách là chủ tài khoản, người kỹ thuật được mời vào',
          '**Khách.** Thẻ của khách bị trừ tiền; hoá đơn và email nhắc gia hạn gửi cho khách.',
          'Toàn quyền với tài khoản; người kỹ thuật vào bằng Admin hoặc Collaborator khi cần hỗ trợ.',
          'Website là tài sản của khách, khách tự trả tiền hosting. **Khuyến nghị** khi bàn giao hẳn.',
        ],
        [
          'C. Người kỹ thuật giữ tài khoản nhưng cấp Admin cho khách',
          'Người kỹ thuật (thẻ của người kỹ thuật).',
          'Admin: mua và gia hạn được, **nhưng bằng thẻ của người kỹ thuật**.',
          '**Không khuyến nghị**: dễ nhầm lẫn khi gia hạn, và phương thức thanh toán không do khách kiểm soát.',
        ],
      ],
      widths: [22, 28, 28, 22],
    },
    {
      p: 'Với website của một doanh nghiệp, cách **B** là rõ ràng nhất: người trả tiền, người nhận email nhắc gia hạn và người sở hữu website là một. Muốn chuyển website đang nằm ở tài khoản của người kỹ thuật sang tài khoản của khách, Hostinger có chức năng **chuyển website giữa các tài khoản** (trong tài liệu: "How to transfer a WordPress website between Hostinger accounts"). Điều kiện theo tài liệu: người nhận đã có tài khoản Hostinger **và gói hosting đang hoạt động**; gói gốc còn ít nhất 7 ngày; người gửi bắt đầu, người nhận chấp nhận trong vòng 7 ngày; chức năng này chuyển file và database nhưng **không chuyển tên miền và email**, và với một số gói là tính năng trả phí. Cách còn lại: khách mua gói riêng, người kỹ thuật chuyển website sang bằng bản sao lưu (mục 3.17: cài theme, Upload và Restore).',
    },
    { h3: 'Ghi lại thoả thuận (điền khi bàn giao)' },
    {
      table: [
        ['Mục', 'Thoả thuận'],
        ['Email của chủ tài khoản Hostinger', '[điền]'],
        ['Thẻ thanh toán dùng để gia hạn (4 số cuối, tên chủ thẻ)', '[điền]'],
        ['Ngày hết hạn gói hosting', '[xem ở Billing → Subscriptions rồi điền]'],
        ['Ngày hết hạn tên miền mendezbrother.com (tại GoDaddy)', '[xem ở GoDaddy rồi điền]'],
        ['Người nhận email nhắc gia hạn', '[điền]'],
        ['Người bấm gia hạn nếu tự gia hạn thất bại', '[điền]'],
        ['Tự gia hạn (auto-renewal)', '[bật / tắt]'],
        ['Mức quyền cấp cho khách / người kỹ thuật', '[Admin / Collaborator]'],
      ],
      widths: [50, 50],
    },
    { h3: 'Các việc thanh toán trong hPanel' },
    {
      p: 'Bấm biểu tượng tài khoản ở góc trên bên phải của hPanel → **Billing**. Thanh bên trái có ba mục:',
    },
    {
      bullets: [
        '**Subscriptions**: danh sách dịch vụ, ngày thanh toán tiếp theo, giá gia hạn, trạng thái và **công tắc tự gia hạn** cho từng dịch vụ.',
        '**Payment History**: các lần thanh toán đã xong. Bấm mũi tên cạnh một khoản để xem chi tiết và **tải hoá đơn PDF** (dùng cho kế toán).',
        '**Payment Methods**: thẻ và ví đã lưu. Tại đây thêm thẻ mới, xoá thẻ cũ hoặc đặt thẻ mặc định. **Chỉ chủ tài khoản** làm được.',
      ],
    },
    { h3: 'Gia hạn bằng tay' },
    {
      steps: [
        'Vào **Billing → Subscriptions**, tìm dòng gói hosting của mendezbrother.com.',
        'Nếu đã hết hạn hoặc đã huỷ, mở ngăn chi tiết của dịch vụ và bấm **Renew**; chọn kỳ hạn rồi thanh toán.',
        'Nếu chỉ còn dưới 1 ngày là hết hạn, phải gia hạn bằng tay cho kỳ này; sau đó bật lại tự gia hạn.',
        'Tải hoá đơn ở **Payment History** sau khi thanh toán xong.',
      ],
    },
    { h3: 'Đổi thẻ hoặc tắt tự gia hạn' },
    {
      bullets: [
        '**Đổi thẻ**: Billing → **Payment Methods** → thêm thẻ mới, đặt làm mặc định, rồi mới xoá thẻ cũ. Làm trước ngày gia hạn để tránh bị trừ nhầm vào thẻ cũ hoặc thẻ hết hạn.',
        '**Tắt tự gia hạn**: gạt công tắc ở **Subscriptions**. Website vẫn chạy đến ngày hết hạn; sau đó phải gia hạn bằng tay.',
        '**Tạm dừng dịch vụ (Cancel subscription)**: dịch vụ chạy đến hết hạn rồi dừng. Chỉ bấm khi chắc chắn không dùng nữa; nút **Resume subscription** có thể khôi phục việc gia hạn nếu chưa quá hạn.',
      ],
    },

    { h2: '4.5 Hướng dẫn: những việc khách làm được trong hPanel', newPage: true },
    { h3: 'Vào WordPress nhanh' },
    {
      steps: [
        'Mở **https://hpanel.hostinger.com/websites/mendezbrother.com** và đăng nhập (nếu được mời, chọn tài khoản của chủ ở **Accounts I have access to**).',
        'Ở **Bảng điều khiển**, bấm nút **Quản trị WordPress**. Trang quản trị WordPress mở trong tab mới. Bấm vào đây cũng tiện khi quên địa chỉ wp-admin.',
      ],
    },
    { h3: 'Xoá bộ nhớ đệm (cache) khi sửa mà website chưa đổi' },
    {
      p: 'Website dùng LiteSpeed Cache (đã cài sẵn trên Hostinger) nên đôi khi khách vẫn thấy bản cũ vài phút. Cách xoá:',
    },
    {
      steps: [
        'Trong WordPress admin, bấm mục **LiteSpeed Cache** trên thanh đen ở trên cùng (hoặc ở menu trái) → **Purge All**.',
        'Hoặc trong hPanel: **Hiệu suất** → tìm mục bộ nhớ đệm và bấm xoá toàn bộ cache.',
        'Mở lại website bằng cửa sổ ẩn danh để kiểm tra.',
      ],
    },
    { h3: 'Xem sức khỏe website và cập nhật' },
    {
      p: 'Ở **Bảng điều khiển**, ô **Sức khỏe trang web** cho biết phiên bản WordPress, PHP, theme đang dùng và số plugin cần cập nhật. Nếu ô này báo **Cần hành động**:',
    },
    {
      bullets: [
        '**Cập nhật plugin** (ví dụ LiteSpeed Cache): được, nhưng hãy bấm **Back up now** trong **Site settings → Backups** trước, rồi vào **Dashboard → Updates** hoặc **Plugins** để cập nhật. Sau đó mở thử vài trang của website.',
        '**Cập nhật WordPress**: nên làm khi có bản nhỏ (ví dụ 7.1.2 lên 7.1.3, chủ yếu vá lỗi bảo mật), cũng sau khi sao lưu.',
        '**Phiên bản PHP**: để người kỹ thuật quyết định. Đổi sang phiên bản quá mới hoặc quá cũ có thể làm website lỗi.',
        '**Theme Mendez Brothes**: không cập nhật qua nút Update của WordPress. Theme chỉ cập nhật bằng cách tải file mendez.zip mới (phần 5).',
      ],
    },
    { h3: 'Khôi phục khi website bị lỗi' },
    {
      steps: [
        'Nếu vào được WordPress: **Site settings → Backups** → chọn bản gần nhất → **Restore** (mục 3.17).',
        'Nếu không vào được WordPress: trong hPanel, ở **Bảng điều khiển** bấm dòng **Sao lưu** (Backups) và khôi phục bản sao lưu của Hostinger. Lưu ý: bản này đưa **cả website** về ngày đã chọn, mọi thứ sửa sau đó sẽ mất. Chỉ làm khi cần, và nên báo người kỹ thuật.',
      ],
    },
    { h3: 'Tạo hộp thư theo tên miền (không bắt buộc)' },
    {
      p: 'Ở mục **E-mail** hoặc nút **Thiết lập email miễn phí** trên Bảng điều khiển, tạo hộp thư dạng info@mendezbrother.com và dùng làm email nhận báo giá (mục 3.13). Muốn email chắc chắn tới nơi, cài plugin **WP Mail SMTP** trong WordPress rồi nhập thông tin hộp thư này làm máy chủ gửi thư; nếu không, thư tự động của website đôi khi rơi vào hộp thư rác.',
    },

    { h2: '4.6 Những việc không nên làm', newPage: true },
    {
      bullets: [
        '**Không** xoá website, đặt lại WordPress (reset) hoặc xoá cơ sở dữ liệu trong hPanel.',
        '**Không** xoá file trong thư mục wp-content khi không chắc. Ảnh của website nằm trong wp-content/uploads.',
        '**Không** đổi **nameserver** hoặc bản ghi DNS của mendezbrother.com khi chưa hỏi người kỹ thuật. Sai một chữ là website và email ngừng hoạt động.',
        '**Không** mua thêm Trợ lý AI, Quảng cáo Google, Tiếp thị qua email, VPS… mà hPanel gợi ý, nếu không thực sự cần.',
        '**Không** bấm **Remove and load again** trong Site settings → Demo content (sẽ xoá nội dung đã nhập, xem mục 5.6).',
        '**Không** gửi mật khẩu hPanel hay WordPress qua tin nhắn không bảo mật. Hãy dùng chức năng chia sẻ quyền (mục 4.2) và tài khoản riêng.',
        '**Không** dùng chung một tài khoản cho nhiều người. Mỗi người một tài khoản để biết ai sửa gì và dễ thu hồi khi cần.',
      ],
    },

    { h2: '4.7 Tên miền ở GoDaddy' },
    {
      p: 'Tại thời điểm lập tài liệu, tên miền mendezbrother.com dùng nameserver của GoDaddy (ns47 và ns48.domaincontrol.com) và có bản ghi A trỏ về máy chủ Hostinger. Nghĩa là **DNS và tên miền do GoDaddy quản lý**; Hostinger chỉ chứa website.',
    },
    {
      bullets: [
        '**Gia hạn tên miền ở GoDaddy**, không phải ở Hostinger. Đăng nhập GoDaddy → **Domains** → mendezbrother.com để xem ngày hết hạn và bật tự gia hạn. Ghi ngày hết hạn vào bảng ở mục 4.4.',
        'Chủ tài khoản GoDaddy phải là **doanh nghiệp** (hoặc người đại diện), vì đó là quyền sở hữu tên miền. Nếu tên miền đang đứng tên người khác, nên chuyển về cho doanh nghiệp.',
        'Nếu sau này muốn gom tên miền về Hostinger: Hostinger có hướng dẫn chuyển tên miền (domain transfer); nên thực hiện cùng người kỹ thuật vì có thể làm website mất kết nối nếu cấu hình sai.',
        'Nếu website vào không được dù hosting còn hạn: nghi ngờ trước tiên là **tên miền hết hạn** hoặc **SSL**. Kiểm tra cả hai.',
      ],
    },

    { h2: '4.8 Khi cần hỗ trợ' },
    {
      bullets: [
        'Lỗi liên quan tới theme hoặc nội dung: liên hệ người kỹ thuật đã làm website (gửi kèm ảnh chụp màn hình và địa chỉ trang bị lỗi).',
        'Lỗi liên quan tới hosting, thanh toán, SSL, email hosting: dùng chat hoặc trợ lý hỗ trợ ngay trong hPanel (biểu tượng **Trợ lý** ở góc trên) hoặc trang hỗ trợ của Hostinger.',
        'Nếu bị khoá khỏi WordPress (quên mật khẩu, email không nhận được thư): dùng **Lost your password?** (mục 3.1) hoặc, từ hPanel, mục **WordPress** để đặt lại mật khẩu quản trị.',
      ],
    },

    // ───────────────────────── 5
    { h1: '5. Cập nhật theme bằng file mendez.zip' },
    {
      p: 'Theme **Mendez Brothes** là toàn bộ giao diện và các chức năng riêng (section, bộ lọc công trình, form báo giá, sao lưu…). Nó nằm trong một file **mendez.zip**. Khi người kỹ thuật thêm tính năng hoặc sửa lỗi, họ gửi một file mendez.zip mới và bạn cập nhật theo các bước dưới đây. Nội dung website (trang, công trình, ảnh, cài đặt, người dùng) nằm trong database nên **không mất** khi thay theme; điều này đã được thử trên bản dựng thử.',
    },
    { h2: '5.1 Khi nào cần cập nhật' },
    {
      bullets: [
        'Người kỹ thuật gửi bản mới (có số phiên bản mới, ví dụ 1.3.3 → 1.4.0) kèm ghi chú những gì thay đổi.',
        'Không cần cập nhật khi chỉ sửa nội dung, ảnh, màu sắc, menu: các việc này làm hoàn toàn trong trang quản trị (phần 3).',
        'Xem phiên bản đang dùng: **Appearance → Themes** (bấm vào ảnh theme) hoặc ô **Sức khỏe trang web** trong hPanel ("Chủ đề hoạt động").',
      ],
    },
    { h2: '5.2 Chuẩn bị (2 phút, đừng bỏ qua)', newPage: true },
    {
      steps: [
        'Cần tài khoản có vai trò **Administrator** (Manager không cài được theme, mục 3.16).',
        'Vào **Site settings → Backups** → bấm **Back up now** và chờ đến khi xong. Nên tải file sao lưu về máy tính.',
        'Lưu file **mendez.zip** mới vào máy. **Không giải nén.** Tên file có thể khác (ví dụ mendez_5.zip); WordPress dùng thư mục bên trong, không dùng tên file.',
      ],
    },
    { h2: '5.3 Các bước cập nhật', newPage: true },
    { img: 'wp-theme-upload-form.jpg' },
    {
      steps: [
        'Vào **Appearance → Themes** → bấm **Add Theme** (hoặc **Add New Theme**) ở trên. Bấm nút **Upload Theme**.',
        'Bấm **Choose File** và chọn file mendez.zip trên máy tính.',
        'Bấm **Install Now** và chờ vài giây (file khoảng 12 MB).',
      ],
    },
    { img: 'wp-theme-replace.jpg' },
    {
      steps: [
        'Màn hình sẽ báo **"This theme is already installed"** và so sánh bản đang cài với bản vừa tải lên (xem cột **Version**). Kiểm tra bản vừa tải lên là bản mới hơn, rồi bấm **Replace installed with uploaded**.',
      ],
    },
    {
      p: 'Màn hình tiếp theo báo **Theme updated successfully**. Theme vẫn đang bật, không cần bấm Activate.',
    },
    {
      note: 'Nếu website đang là theme Mendez Brothes và bạn chỉ thấy nút **Activate**, hãy dừng lại và hỏi người kỹ thuật. Bấm Activate khi chưa đúng sẽ đổi giao diện.',
    },
    { h2: '5.4 Sau khi cập nhật (kiểm tra)' },
    {
      steps: [
        'Vào **Settings → Permalinks** và bấm **Save Changes** một lần (không cần đổi gì). Bước này làm mới các đường dẫn; thiếu bước này, các trang như /projects/ có thể báo 404.',
        'Xoá cache: **LiteSpeed Cache → Purge All** (mục 4.5).',
        'Mở website bằng cửa sổ ẩn danh. Kiểm tra: trang chủ, Projects (thử bộ lọc), một công trình, Contact (gửi thử form), một trang tin.',
        'Vào lại **Site settings** và **Pages** xem mọi thứ còn nguyên.',
        'Xem **Appearance → Themes**: phiên bản đã đổi sang số mới.',
      ],
    },
    { h2: '5.5 Lỗi thường gặp khi cập nhật', newPage: true },
    {
      table: [
        ['Hiện tượng', 'Nguyên nhân', 'Cách xử lý'],
        [
          'Báo "The link you followed has expired"',
          'File zip lớn hơn giới hạn tải lên của hosting.',
          'Vào hPanel → **Nâng cao** → **Cấu hình PHP**, tăng **upload_max_filesize** và **post_max_size** lên 64 MB. Hoặc dùng hPanel → **Tập tin** để tải mendez.zip lên thư mục wp-content/themes, giải nén ở đó rồi vào Appearance → Themes xem theme đã cập nhật chưa. Nếu không rõ, nhờ người kỹ thuật.',
        ],
        [
          'Trang /projects/, /services/ báo 404',
          'Đường dẫn chưa được làm mới.',
          'Settings → Permalinks → Save Changes; sau đó xoá cache.',
        ],
        [
          'Website vẫn như cũ sau khi cập nhật',
          'Cache còn giữ bản cũ.',
          'LiteSpeed Cache → Purge All; thử bằng cửa sổ ẩn danh; nhấn Ctrl+F5.',
        ],
        [
          'Màn hình trắng hoặc "critical error" sau cập nhật',
          'File zip hỏng hoặc không đúng.',
          'Đừng hoảng. Dùng **Replace installed with uploaded** để tải lại bản đúng, hoặc nhờ người kỹ thuật tải lại bản trước. Dữ liệu không bị mất. Cần thì khôi phục từ bản sao lưu (mục 3.17).',
        ],
        [
          'Quay lại bản cũ',
          'Bản mới có vấn đề.',
          'Tải lại file mendez.zip của bản cũ theo cùng các bước (5.3); WordPress chấp nhận thay bằng bản thấp hơn. Vì vậy hãy giữ lại các file zip cũ.',
        ],
      ],
      widths: [26, 26, 48],
    },
    { h2: '5.6 Cài lần đầu và nạp nội dung mẫu (Demo content)' },
    {
      p: 'Phần này chỉ dùng khi dựng một website mới trống (ví dụ chuyển sang hosting mới hoặc dựng bản thử). Website đang chạy **không** cần làm.',
    },
    {
      steps: [
        'Cài WordPress mới, rồi **Appearance → Themes → Add Theme → Upload Theme**, chọn mendez.zip, **Install Now**, rồi bấm **Activate**.',
        'Vào **Site settings → Demo content** và bấm **Load demo content**. Nạp chạy từng đợt ngắn với thanh tiến độ ("Copying photos 26 / 54"). **Giữ trang mở** đến khi xong (vài phút). Nếu bị dừng giữa chừng, bấm lại nút để chạy tiếp.',
        '**Settings → Permalinks → Save Changes** một lần và xoá cache.',
        'Làm tiếp các việc ở mục "Việc cần làm trước khi chạy chính thức" (phần 1).',
      ],
    },
    {
      note: '**Cảnh báo:** nút **Remove and load again** (và **Remove demo content**) xoá **mọi** thứ do bản demo tạo ra, kể cả những trang, công trình và ảnh mẫu mà bạn đã sửa, vì chúng vẫn được đánh dấu là demo. Khi website đã nhập nội dung thật, **đừng bấm hai nút này**. Nếu muốn dọn ảnh mẫu thừa, xoá từng ảnh trong thư viện Photos.',
    },
    { img: 'wp-demo.jpg' },
    { h2: '5.7 Cấu trúc file mendez.zip (dành cho người kỹ thuật)' },
    {
      p: 'Bên trong zip có một thư mục **mendez/** ở ngoài cùng, chứa style.css (có dòng Version), functions.php, các thư mục inc (chức năng), template-parts (giao diện từng section), assets (CSS, JS, ảnh minh hoạ) và demo (nội dung mẫu và ảnh). WordPress cần đúng thư mục này ở ngoài cùng; nếu nén sai (thêm một thư mục bọc ngoài), việc cài sẽ báo lỗi hoặc tạo theme sai. Yêu cầu tối thiểu: WordPress 6.4 trở lên, PHP 7.4 trở lên (khuyên dùng 8.1+).',
    },

    // ───────────────────────── 6
    { h1: '6. Câu hỏi thường gặp' },
    {
      table: [
        ['Câu hỏi', 'Trả lời'],
        ['Sửa chữ trên trang chủ ở đâu?', 'Pages → Home → mở section chứa chữ đó, sửa rồi bấm Update (mục 3.7 và 3.8).'],
        ['Đổi số điện thoại ở mọi nơi?', 'Site settings → Company → Phone → Save settings (mục 3.13). Số tự đổi ở đầu trang, chân trang và Contact.'],
        ['Công trình mới không hiện trong bộ lọc?', 'Mở công trình, kiểm tra đã chọn Services, Town, Lot size và Completed (mục 3.4), rồi Update. Xoá cache nếu cần (mục 4.5).'],
        ['Không nhận được email báo giá?', 'Kiểm tra Site settings → Estimate form (mục 3.13); xem hộp thư rác; cài WP Mail SMTP (mục 4.5). Yêu cầu vẫn nằm trong Quote requests dù email không về.'],
        ['Quên mật khẩu WordPress?', 'Lost your password? ở trang đăng nhập (mục 3.1); hoặc nhờ Manager đặt lại ở Users.'],
        ['Thêm người mới đăng bài?', 'Users → Add User, chọn Role Editor (mục 3.16).'],
        ['Muốn khách tự gia hạn hosting?', 'Cách B ở mục 4.4: khách là chủ tài khoản Hostinger và dùng thẻ của khách.'],
        ['Hosting hết hạn thì sao?', 'Website có thể ngừng hoạt động. Gia hạn trước ngày hết hạn (mục 4.4) và giữ một bản sao lưu đã tải về máy (mục 3.17).'],
        ['Cập nhật theme có mất nội dung không?', 'Không. Nội dung nằm trong database, không nằm trong theme (phần 5). Vẫn nên sao lưu trước.'],
        ['Ai có thể xoá website?', 'Chủ tài khoản Hostinger, và Administrator WordPress trong WordPress. Vì vậy chỉ cấp vai trò Administrator và quyền Admin Hostinger cho người thật sự cần.'],
      ],
      widths: [32, 68],
    },
  ],
}
