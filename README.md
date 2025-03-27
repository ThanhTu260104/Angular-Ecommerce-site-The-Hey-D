# Tổng quan Dự án Frontend & Backend

## Frontend

### Cài đặt và Phát triển

- **Phiên bản Angular CLI**: 19.2.3
- **Khởi chạy development server**: `ng serve` (truy cập tại http://localhost:4200/)
- **Build dự án**: `ng build`
- **Chạy unit tests**: `ng test`
- **Chạy end-to-end tests**: `ng e2e`

### Các lệnh Angular CLI

```bash
ng generate component ten-component  # Tạo component mới
ng generate --help                  # Xem tất cả lệnh có sẵn
```

### Dependencies

**Core Dependencies:**
```json
{
  "@angular/common": "^19.2.0",
  "@angular/core": "^19.2.0",
  "@angular/router": "^19.2.0",
  "express": "^4.18.2"
}
```

**Development Dependencies:**
```json
{
  "@angular-devkit/build-angular": "^19.2.3",
  "@angular/cli": "^19.2.3",
  "@angular/compiler-cli": "^19.2.0",
  "typescript": "~5.7.2"
}
```

## Backend

### Cài đặt và Cấu hình

- **Công nghệ**: Node.js, Express.js, MySQL, Sequelize ORM
- **Khởi chạy server**: `npm start` hoặc `node index.js`

### Dependencies

```json
{
  "express": "^4.21.2",
  "cors": "^2.8.5", 
  "mysql2": "^3.13.0",
  "sequelize": "^6.37.6",
  "bcryptjs": "latest",
  "jsonwebtoken": "latest"
}
```

### Cấu trúc Database

- **LoaiModel**: Quản lý danh mục sản phẩm
- **SanPhamModel**: Quản lý thông tin sản phẩm
- **ThuocTinhModel**: Quản lý thuộc tính sản phẩm
- **DonHangModel**: Quản lý đơn hàng
- **DonHangChiTietModel**: Chi tiết đơn hàng

### API Endpoints

#### Sản phẩm
- `GET /api/sanpham` - Danh sách sản phẩm
- `GET /api/sphot/:sosp?` - Sản phẩm nổi bật
- `GET /api/spmoi/:sosp?` - Sản phẩm mới
- `GET /api/sp/:id` - Chi tiết sản phẩm
- `GET /api/sptrongloai/:id` - Sản phẩm theo danh mục
- `GET /api/timkiem/:tu_khoa/:page?` - Tìm kiếm sản phẩm

#### Danh mục
- `GET /api/loai` - Danh sách danh mục
- `GET /api/loai/:id` - Chi tiết danh mục

#### Đơn hàng
- `POST /api/luudonhang` - Tạo đơn hàng
- `POST /api/luugiohang` - Lưu giỏ hàng

#### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Thông tin người dùng

### Tài liệu tham khảo

[Tài liệu Angular CLI](https://angular.io/cli)