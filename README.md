# Giới thiệu dự án Agent CK

Agent CK là hệ thống web quản lý và phân tích dữ liệu dành cho các đối tượng quản trị viên, huấn luyện viên và người dùng cuối. Dự án được xây dựng với React, Vite, TypeScript, sử dụng kiến trúc module hóa, dễ mở rộng và bảo trì.

## Tính năng chính

- Quản lý người dùng, bài học, khảo sát, tin tức, danh mục đầu tư, khuyến nghị, chat, email, v.v.
- Phân quyền theo vai trò: Admin, Trainer, User.
- Giao diện hiện đại, tối ưu cho cả desktop và mobile.
- Tích hợp xác thực, bảo mật, và các dịch vụ bên ngoài (Zalo, Email...).

## Cấu trúc thư mục

- `src/app/`: Quản lý state, hooks, cấu hình.
- `src/components/`: Các thành phần UI dùng chung.
- `src/layouts/`: Layout cho từng vai trò.
- `src/pages/`: Trang chức năng cho từng nhóm người dùng.
- `src/services/`: Tầng giao tiếp API.
- `src/slices/`: Redux slices quản lý state.
- `src/types/`: Định nghĩa kiểu dữ liệu.
- `src/utils/`: Hàm tiện ích dùng chung.

## Hướng dẫn thiết kế & phát triển

1. **Thiết kế giao diện**
   - Sử dụng React + CSS module cho từng component.
   - Tận dụng các layout có sẵn trong `src/layouts/`.
   - Tối ưu responsive với các hook như `use-mobile`.

2. **Quản lý state**
   - Sử dụng Redux Toolkit (slice trong `src/slices/`).
   - Tích hợp các hook custom để truy xuất state.

3. **Kết nối API**
   - Định nghĩa các service trong `src/services/`.
   - Sử dụng Axios cho các request HTTP.

4. **Thêm mới chức năng**
   - Tạo component UI trong `src/components/ui/`.
   - Tạo page mới trong `src/pages/`.
   - Thêm slice nếu cần quản lý state riêng.

5. **Phân quyền**
   - Sử dụng các navigator trong `src/navigators/` để kiểm soát truy cập theo vai trò.

## Hướng dẫn cài đặt & chạy dự án

1. Cài đặt Node.js (>= 16) và Yarn.
2. Clone dự án về máy:
   ```
   git clone <repo-url>
   ```
3. Cài đặt dependencies:
   ```
   yarn install
   ```
4. Tạo file cấu hình môi trường tại `src/configs/env.config.ts` (tham khảo mẫu).
5. Chạy dự án:
   ```
   yarn dev
   ```
6. Truy cập giao diện tại [http://localhost:5173](http://localhost:5173)

## Bàn giao & mở rộng

- Dễ dàng mở rộng thêm module mới bằng cách tạo service, slice, page và component tương ứng.
- Tài liệu code được chú thích rõ ràng, tuân thủ chuẩn TypeScript.
- Hỗ trợ tích hợp các dịch vụ bên ngoài theo yêu cầu.

### Hướng dẫn mở rộng thêm Component UI

1. Tạo file mới trong thư mục `src/components/ui/` (ví dụ: `MyButton.tsx`).
2. Định nghĩa component theo chuẩn React và TypeScript.
3. Thêm style riêng nếu cần (có thể tạo file CSS cùng tên).
4. Import và sử dụng component mới trong các page hoặc layout.

Ví dụ:

```tsx
// src/components/ui/MyButton.tsx
import React from 'react'
export const MyButton = ({ children, ...props }) => (
  <button {...props} className='my-btn'>
    {children}
  </button>
)
```

### Hướng dẫn thêm một trang mới

1. Tạo file mới trong `src/pages/` (ví dụ: `About.tsx`).
2. Định nghĩa nội dung trang theo chuẩn React.
3. Thêm route mới vào file navigator phù hợp (ví dụ: `src/navigators/AppNavigator.tsx`).
4. Nếu cần quản lý state riêng, tạo slice mới trong `src/slices/`.

Ví dụ:

```tsx
// src/pages/About.tsx
const About = () => <div>Giới thiệu về hệ thống</div>
export default About
```

Sau đó thêm vào navigator:

```tsx
// src/navigators/AppNavigator.tsx
import About from '../pages/About'
// ...existing code...
;<Route path='/about' element={<About />} />
```

---

Nếu cần bổ sung chi tiết về API, quy trình phát triển hoặc tài liệu kỹ thuật, vui lòng liên hệ đội ngũ phát triển.
