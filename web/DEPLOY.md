# Deploy lên VPS (Docker + Caddy)

Stack: **PostgreSQL + website (Node) + Caddy** (HTTPS tự động bằng Let's Encrypt). Database chạy ngay trong Docker, không cần thuê dịch vụ ngoài. Đo thực tế: RAM ~300 MB khi chạy.

## 1. Yêu cầu máy chủ

- VPS Linux (Ubuntu 22.04/24.04), có quyền root/SSH. Không dùng được shared hosting / cPanel.
- Khuyến nghị **2 vCPU · 2–4 GB RAM · 20 GB disk**. Bước *build* cần ~2 GB RAM. Nếu VPS chỉ có 1–2 GB, tạo swap trước:
  ```bash
  sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  ```
- Domain: tạo bản ghi **A** cho `domain.com` và `www.domain.com` trỏ về IP VPS. Mở cổng **80** và **443**.

## 2. Cài Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # đăng xuất / đăng nhập lại
```

## 3. Lấy code & cấu hình

```bash
sudo mkdir -p /opt/mendez && sudo chown $USER /opt/mendez && cd /opt/mendez
git clone <repo> . && cd web          # hoặc scp/rsync thư mục web/ lên
cp .env.example .env
nano .env
```

Các biến **bắt buộc** trong `.env`:

| Biến | Giá trị |
|---|---|
| `NEXT_PUBLIC_SERVER_URL` | `https://domain.com` (không có `/` ở cuối) |
| `SITE_DOMAIN` | `domain.com` |
| `POSTGRES_PASSWORD` | chuỗi ngẫu nhiên |
| `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `CRON_SECRET` | mỗi biến một chuỗi `openssl rand -hex 32` |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | tài khoản admin đầu tiên (chỉ dùng khi seed) |
| `SMTP_*` | (tuỳ chọn) để gửi email khi có lead mới. Có thể dùng SMTP của hosting, Gmail Workspace, Resend, Brevo… |

> Dòng `DATABASE_URL` trong `.env` chỉ dùng cho dev. Trong Docker, compose tự ghép `DATABASE_URL` từ các biến `POSTGRES_*`.

## 4. Deploy lần đầu

```bash
chmod +x deploy/*.sh
./deploy/deploy.sh --seed     # build + nạp dữ liệu demo + chạy
```

Hoặc `./deploy/deploy.sh` (không có `--seed`) để bắt đầu với site trống. Khi đó vào `https://domain.com/admin` để tạo tài khoản admin đầu tiên (tài khoản đầu tiên tự là Admin).

## 5. Cập nhật phiên bản mới

```bash
cd /opt/mendez/web && git pull
./deploy/deploy.sh
```

Script làm theo thứ tự: build image → khởi động lại app → **migration tự chạy khi app khởi động** → app tự làm mới cache. Dữ liệu (database, ảnh) nằm trong Docker volume nên không mất khi cập nhật.

## 6. Sao lưu

**Cách chính: ngay trong admin** → *Backups* (xem `docs/FEATURES.md` mục C). Tạo, tải về, khôi phục, upload; tự động mỗi ngày, giữ 7 bản. File nằm trong Docker volume `mendez_backups`.

Nên tải một bản về máy định kỳ, vì backup nằm cùng máy chủ với website.

**Tuỳ chọn thêm — backup ở cấp máy chủ** (chạy bằng cron, lưu ra thư mục `deploy/backups/` để đồng bộ đi nơi khác bằng rclone…):

```bash
crontab -e
# thêm dòng:
0 3 * * * /opt/mendez/web/deploy/backup.sh >> /var/log/mendez-backup.log 2>&1
```

**Chuyển sang máy chủ mới:** deploy bản trống trên máy mới → đăng nhập admin → *Backups* → *Upload a backup file* → *Restore*.

## 7. Lệnh hữu ích

```bash
docker compose ps                     # trạng thái
docker compose logs -f app            # log website
docker compose logs -f caddy          # log HTTPS / truy cập
docker compose restart app            # khởi động lại website
docker compose exec db psql -U mendez # vào database
```

## 8. Lưu ý quan trọng

- **Không chạy `pnpm dev` hay `pnpm seed` từ máy local trỏ vào database production.** Chế độ dev của Payload sẽ "push" schema, và lần khởi động sau app sẽ đứng chờ xác nhận. Nếu lỡ làm: `docker compose exec db psql -U mendez -c "DELETE FROM payload_migrations WHERE batch = -1;"` rồi `docker compose restart app`.
- Mỗi lần dev sửa schema, phải chạy `pnpm payload migrate:create <tên>` và commit migration. Migration sẽ tự áp dụng khi deploy.
- Nếu đổi domain: sửa `NEXT_PUBLIC_SERVER_URL` + `SITE_DOMAIN` rồi chạy lại `./deploy/deploy.sh` (cần build lại vì URL được gắn vào lúc build).

## Chạy tạm bằng IP (chưa có tên miền)

Trong `.env` đặt `NEXT_PUBLIC_SERVER_URL=http://<ip>`, `SITE_DOMAIN=<ip>` và `CADDYFILE=./deploy/Caddyfile.ip`, rồi `./deploy/deploy.sh`. Site chạy HTTP ở cổng 80, không có HTTPS.

Khi tên miền đã trỏ về máy chủ: xoá dòng `CADDYFILE`, sửa hai biến còn lại theo tên miền và chạy lại `./deploy/deploy.sh` (image được build lại vì URL nằm trong bản build). Caddy tự xin chứng chỉ HTTPS.
