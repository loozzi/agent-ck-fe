# Chat Assistant - Trợ lý ảo AI

## Tổng quan

Chat Assistant là tính năng trợ lý ảo AI được tích hợp vào tất cả các layout của ứng dụng (User, Admin, Trainer), cho phép người dùng chat với AI về các chủ đề liên quan đến chứng khoán và đầu tư.

## Tính năng chính

### 1. **Nút truy cập nhanh**

- Hiển thị ở góc dưới bên phải màn hình
- Có hiệu ứng hover và animation
- Indicator trạng thái hoạt động (chấm xanh)
- Responsive trên mobile và desktop

### 2. **Popup chat**

- Kích thước tối ưu cho cả mobile (70% chiều cao) và desktop (500px)
- Header với tên trợ lý và các nút điều khiển
- Vùng chat với scroll và load more lịch sử
- Input area với auto-resize textarea

### 3. **Tính năng chat**

- **Tin nhắn chào mừng**: Hiển thị khi chưa có lịch sử chat
- **Pending message**: Hiển thị ngay tin nhắn của user khi đang gửi
- **Markdown support**: Hỗ trợ hiển thị code, list, bold, italic, blockquote
- **Timestamp**: Hiển thị thời gian gửi tin nhắn
- **Load more**: Tự động load thêm lịch sử khi scroll lên trên
- **Auto scroll**: Tự động cuộn xuống khi có tin nhắn mới

### 4. **Điều khiển popup**

- **Minimize**: Thu gọn popup (chỉ hiển thị trên desktop)
- **Close**: Đóng popup hoàn toàn
- **Clear history**: Xóa toàn bộ lịch sử chat với dialog xác nhận

### 5. **Keyboard shortcuts**

- **Enter**: Gửi tin nhắn
- **Shift + Enter**: Xuống dòng mới trong textarea

## Cấu trúc Component

```
components/common/
├── ChatAssistantButton.tsx     # Nút floating và logic điều khiển popup
└── ChatAssistantPopup.tsx      # Popup chat với tất cả tính năng
```

## Integration

### Các Layout đã tích hợp:

- `UserLayout` - Layout cho user thường
- `AdminLayout` - Layout cho admin
- `TrainerLayout` - Layout cho trainer

### Cách tích hợp:

```tsx
import ChatAssistantButton from '@/components/common/ChatAssistantButton'

// Trong JSX của layout
;<ChatAssistantButton />
```

## Redux Integration

Sử dụng các action từ `chat.slice.ts`:

- `sendMessage`: Gửi tin nhắn
- `fetchChatHistories`: Lấy lịch sử chat
- `deleteChatHistories`: Xóa lịch sử chat

## Responsive Design

### Mobile (< 768px):

- Popup chiếm full width với margin
- Chiều cao 70% viewport
- Ẩn nút minimize
- Tooltip ẩn

### Desktop (≥ 768px):

- Popup có width cố định 384px
- Chiều cao 500px
- Hiển thị đầy đủ các controls
- Tooltip hiển thị khi hover

## Styling

- Sử dụng Tailwind CSS
- Gradient background cho header và button
- Shadow và animation effects
- Consistent với design system của app

## Performance

- Lazy loading cho lịch sử chat
- Debounce cho auto-resize textarea
- Efficient re-renders với useCallback và useMemo
- Cleanup event listeners và timeouts

## API Dependencies

Phụ thuộc vào các API endpoints:

- `POST /chat/send` - Gửi tin nhắn
- `GET /chat/history` - Lấy lịch sử
- `DELETE /chat/clear` - Xóa lịch sử

## Customization

### Thay đổi vị trí button:

```tsx
// Trong ChatAssistantButton.tsx
<div className='fixed bottom-6 right-6 z-40'>
```

### Thay đổi kích thước popup:

```tsx
// Trong ChatAssistantPopup.tsx
<Card className='w-full max-w-sm md:w-96 h-[70vh] md:h-[500px]'>
```

### Thay đổi thông điệp chào mừng:

```tsx
// Trong getDisplayMessages function
content: 'Tin nhắn chào mừng tùy chỉnh...'
```

## Testing

Để test tính năng:

1. Click vào nút chat floating
2. Thử gửi tin nhắn
3. Test các nút điều khiển (minimize, close, clear history)
4. Test responsive trên mobile và desktop
5. Test keyboard shortcuts

## Troubleshooting

### Popup không mở được:

- Kiểm tra Redux store có đúng state không
- Kiểm tra API endpoints có hoạt động không

### Tin nhắn không gửi được:

- Kiểm tra network requests
- Kiểm tra Redux actions và reducers

### Responsive không hoạt động:

- Kiểm tra Tailwind classes
- Kiểm tra viewport meta tag

## Future Enhancements

- [ ] Drag & drop cho popup position
- [ ] Multiple chat sessions
- [ ] Voice input/output
- [ ] File attachments
- [ ] Chat themes
- [ ] Notification badges
- [ ] Offline support
