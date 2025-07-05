# Logic Rule Controller - Quản lý quy tắc logic chứng khoán

## Tổng quan

Màn hình quản lý quy tắc logic cho phép trainer tạo, chỉnh sửa, xóa và quản lý các quy tắc logic giao dịch chứng khoán với giao diện drag & drop trực quan.

## Tính năng chính

### 1. **Giao diện Drag & Drop**

- Kéo thả các điều kiện logic
- Sắp xếp thứ tự điều kiện dễ dàng
- Giao diện block logic rõ ràng

### 2. **Form IF-THEN**

- **NẾU (IF)**: Điều kiện logic
  - Chỉ báo kỹ thuật (RSI, MACD, SMA, EMA, Bollinger Bands, Volume, Price)
  - Toán tử so sánh (>, <, >=, <=, ==, crosses above, crosses below)
  - Giá trị ngưỡng
- **THÌ (THEN)**: Hành động
  - Mua (BUY) 📈
  - Bán (SELL) 📉
  - Giữ (HOLD) ✋
  - Cảnh báo (ALERT) 🔔

### 3. **Quản lý quy tắc**

- ✅ **Tạo mới**: Tạo quy tắc logic với dialog
- ✏️ **Chỉnh sửa**: Cập nhật quy tắc hiện có
- 👁️ **Xem chi tiết**: Xem thông tin đầy đủ
- 🗑️ **Xóa**: Xóa quy tắc với xác nhận
- 🔄 **Bật/Tắt**: Kích hoạt/tạm dừng quy tắc

### 4. **Tìm kiếm và lọc**

- 🔍 Tìm kiếm theo tên, mô tả
- 🎯 Lọc theo chỉ báo kỹ thuật
- 🎬 Lọc theo hành động
- 📊 Lọc theo trạng thái (hoạt động/tạm dừng)

### 5. **Thống kê**

- 📈 Tổng số quy tắc
- ✅ Số quy tắc đang hoạt động
- ⏸️ Số quy tắc tạm dừng
- 📊 Phân bố theo hành động

## Cách sử dụng

### 1. Tạo quy tắc mới

1. Nhấn nút **"Tạo quy tắc mới"**
2. Nhập tên và mô tả quy tắc
3. Thêm điều kiện bằng nút **"Thêm điều kiện"**
4. Chọn chỉ báo kỹ thuật (VD: RSI)
5. Chọn toán tử so sánh (VD: <)
6. Nhập giá trị ngưỡng (VD: 30)
7. Chọn hành động (VD: Mua)
8. Chọn khung thời gian (VD: 1 ngày)
9. Nhấn **"Tạo mới"**

### 2. Chỉnh sửa quy tắc

1. Nhấn menu **"..."** trên card quy tắc
2. Chọn **"Chỉnh sửa"**
3. Thay đổi thông tin cần thiết
4. Nhấn **"Cập nhật"**

### 3. Xem chi tiết quy tắc

1. Nhấn menu **"..."** trên card quy tắc
2. Chọn **"Xem chi tiết"**
3. Xem thông tin đầy đủ về quy tắc

### 4. Xóa quy tắc

1. Nhấn menu **"..."** trên card quy tắc
2. Chọn **"Xóa"**
3. Xác nhận xóa trong dialog

### 5. Bật/Tắt quy tắc

- Sử dụng switch trên card quy tắc
- Quy tắc tắt sẽ có màu xám mờ

## Ví dụ quy tắc

### Quy tắc mua cổ phiếu

```
NẾU RSI < 30 VÀ Volume > 1000000
THÌ Mua
```

### Quy tắc bán cổ phiếu

```
NẾU RSI > 70 VÀ MACD crosses below Signal
THÌ Bán
```

### Quy tắc cảnh báo

```
NẾU Price crosses above SMA(20)
THÌ Cảnh báo
```

## Công nghệ sử dụng

- **React**: Framework UI
- **TypeScript**: Type safety
- **Redux Toolkit**: State management
- **Tailwind CSS**: Styling
- **Radix UI**: Component library
- **@hello-pangea/dnd**: Drag & drop
- **date-fns**: Date formatting
- **react-toastify**: Notifications

## Cấu trúc file

```
src/
├── components/common/
│   ├── LogicRuleDialog.tsx          # Dialog tạo/sửa quy tắc
│   ├── LogicRuleDetailDialog.tsx    # Dialog xem chi tiết
│   ├── DeleteLogicRuleDialog.tsx    # Dialog xác nhận xóa
│   ├── LogicRuleCard.tsx            # Card hiển thị quy tắc
│   └── LogicRuleController.css      # CSS custom
├── pages/trainer/
│   └── RuleController.tsx           # Màn hình chính
├── slices/
│   └── logicRule.slice.ts           # Redux slice
├── services/
│   └── logicRule.service.ts         # API service
└── types/
    └── logicRules.ts                # Type definitions
```

## API Endpoints

- `POST /trainer/logic-rules` - Tạo quy tắc mới
- `GET /trainer/logic-rules` - Lấy danh sách quy tắc
- `GET /trainer/logic-rules/:id` - Lấy chi tiết quy tắc
- `PUT /trainer/logic-rules/:id` - Cập nhật quy tắc
- `DELETE /trainer/logic-rules/:id` - Xóa quy tắc

## Responsive Design

- ✅ Mobile-first approach
- ✅ Responsive grid layout
- ✅ Touch-friendly interface
- ✅ Adaptive typography

## Accessibility

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels
- ✅ Color contrast compliance

## Performance

- ✅ Lazy loading
- ✅ Memoization
- ✅ Optimized re-renders
- ✅ Efficient state management

## Troubleshooting

### Lỗi thường gặp

1. **Không tải được danh sách quy tắc**
   - Kiểm tra kết nối mạng
   - Kiểm tra token xác thực
   - Kiểm tra API endpoint

2. **Drag & drop không hoạt động**
   - Đảm bảo đã cài đặt `@hello-pangea/dnd`
   - Kiểm tra browser support
   - Kiểm tra touch events trên mobile

3. **Dialog không hiển thị**
   - Kiểm tra z-index
   - Kiểm tra portal mounting
   - Kiểm tra CSS conflicts

## Tương lai

- [ ] Hỗ trợ nhiều điều kiện phức tạp hơn
- [ ] Backtesting quy tắc
- [ ] Import/Export quy tắc
- [ ] Template quy tắc có sẵn
- [ ] Notification real-time
- [ ] Advanced analytics
- [ ] Multi-language support
