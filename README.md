# ShipS Backend API

Backend API cho ứng dụng ShipS - Hệ thống quản lý giao hàng.

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/your-username/ships-backend.git
cd ships-backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env và cấu hình các biến môi trường:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

4. Chạy server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Đăng ký tài khoản
- POST /api/auth/login - Đăng nhập
- GET /api/auth/me - Lấy thông tin user hiện tại
- PUT /api/auth/updatedetails - Cập nhật thông tin user
- PUT /api/auth/updatepassword - Đổi mật khẩu

### Users
- GET /api/users - Lấy danh sách users (Admin)
- GET /api/users/:id - Lấy thông tin user
- POST /api/users - Tạo user mới (Admin)
- PUT /api/users/:id - Cập nhật user
- DELETE /api/users/:id - Xóa user

### Products
- GET /api/products - Lấy danh sách sản phẩm
- GET /api/products/:id - Lấy chi tiết sản phẩm
- POST /api/products - Tạo sản phẩm mới (Admin)
- PUT /api/products/:id - Cập nhật sản phẩm (Admin)
- DELETE /api/products/:id - Xóa sản phẩm (Admin)

### Orders
- GET /api/orders - Lấy danh sách đơn hàng
- GET /api/orders/:id - Lấy chi tiết đơn hàng
- POST /api/orders - Tạo đơn hàng mới
- PUT /api/orders/:id - Cập nhật đơn hàng
- DELETE /api/orders/:id - Xóa đơn hàng

### Reviews
- GET /api/reviews - Lấy danh sách đánh giá
- GET /api/reviews/:id - Lấy chi tiết đánh giá
- POST /api/reviews - Tạo đánh giá mới
- PUT /api/reviews/:id - Cập nhật đánh giá
- DELETE /api/reviews/:id - Xóa đánh giá

### Coupons
- GET /api/coupons - Lấy danh sách mã giảm giá
- GET /api/coupons/:id - Lấy chi tiết mã giảm giá
- POST /api/coupons - Tạo mã giảm giá mới (Admin)
- PUT /api/coupons/:id - Cập nhật mã giảm giá (Admin)
- DELETE /api/coupons/:id - Xóa mã giảm giá (Admin)
- POST /api/coupons/validate - Kiểm tra mã giảm giá
- POST /api/coupons/:id/use - Sử dụng mã giảm giá

### Notifications
- GET /api/notifications - Lấy danh sách thông báo
- GET /api/notifications/:id - Lấy chi tiết thông báo
- POST /api/notifications - Tạo thông báo mới
- PUT /api/notifications/:id - Cập nhật thông báo
- DELETE /api/notifications/:id - Xóa thông báo

### Addresses
- GET /api/addresses - Lấy danh sách địa chỉ
- GET /api/addresses/:id - Lấy chi tiết địa chỉ
- POST /api/addresses - Tạo địa chỉ mới
- PUT /api/addresses/:id - Cập nhật địa chỉ
- DELETE /api/addresses/:id - Xóa địa chỉ
- PUT /api/addresses/:id/default - Đặt địa chỉ mặc định

## Authentication

Tất cả các API endpoints (trừ đăng ký và đăng nhập) đều yêu cầu JWT token trong header:

```
Authorization: Bearer <your_token>
```

## Phân quyền

- Admin: Có quyền truy cập tất cả các endpoints
- Staff: Có quyền xem và cập nhật đơn hàng
- Shipper: Có quyền xem và cập nhật trạng thái đơn hàng
- Customer: Có quyền tạo và quản lý đơn hàng của mình

## CORS

API đã được cấu hình để chấp nhận requests từ các domain được chỉ định trong biến môi trường CORS_ORIGIN.

## Error Handling

API trả về các mã lỗi HTTP chuẩn:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Contributing

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## License

MIT License 