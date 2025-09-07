# Giới thiệu dự án

Dự án này được tổ chức với cấu trúc thư mục rõ ràng, giúp dễ dàng quản lý và phát triển.

## Cấu trúc thư mục

```
.
├── app/
│   ├── (main)                      #Chỗ code những phần chính của hệ thống
│   └── (auth)                      #Chỗ code những thứ liên quan đến xác thực đăng nhập của hệ thống
├── helpers/                        
│   ├── formatDate.js
│   ├── logger.js
│   └── validate-const-type.js
├── types/
│   └── menu.ts
├── models/
├── package.json
└── README.md
```

### Giải thích các thư mục và file

#### helpers/

Chứa các hàm tiện ích dùng chung trong dự án:

- **formatDate.ts**: Định dạng ngày tháng theo chuẩn mong muốn.
- **logger.ts**: Ghi log các hoạt động của hệ thống.
- **validate-const-type.ts**: Bắt lỗi nếu có chỗ đổi giá trị biến được quy định trong type khi thực thi.

#### types/

Chứa các định nghĩa kiểu dữ liệu (TypeScript):

- **menu.ts**: Định nghĩa kiểu dữ liệu và dữ liệu cho menu.

#### src/

Chứa mã nguồn chính của dự án:

- **controllers/**: Xử lý logic cho các request.
- **models/**: Định nghĩa các mô hình dữ liệu.
- **routes/**: Định nghĩa các endpoint API.

#### package.json

Quản lý các dependencies và script của dự án.

### Giải thích cách code trong thư mục type

- Dữ liệu cố định và quy định về kiểu dữ liệu sẽ được viết trong file thư mục type
- Phải gọi helper makeConstData<Schema> trong type để luôn có ràng buộc chặt chẽ với Schema đã quy định trong type
- Nếu muốn sửa dữ liệu thì chỉ được phép sửa trong type

## Hướng dẫn sử dụng Menu Template

```typescript
import { MenuData, MenuType } from "@/type/menu";
import MenuTemplate from "./components/menu-template";
const T...
    const title = "Tài khoản"
    return(
        // Ví dụ cách truyền title cho menu
        <MenuTemplate title={title}>
            // Custome Nội dung cho Menu Profile
            {title === MenuData.Profile.title && (
                <div>
                    <div className="mb-3">Đăng nhập để sử dụng ứng dụng</div>
                    <Button className="w-full py-5" variant="main">
                        Đăng Nhập
                    </Button>
                </div>
            )}
        </MenuTemplate>;
    )
export default T...
```

### Cách clone dự án trên github
- Đầu tiên gõ lệnh bên dưới:
```
git clone https://github.com/Zenok4/ADAS.git
```
- Kế tiếp, gõ lệnh dưới để tải thư viện:

```
cd ADAS
npm i
```
### Cách commit lên github
- Chuyển sang cho đúng với branch của mình:
- Đầu tiên gõ lệnh bên dưới để kết nối và xem branch của mình tên gì
```
git remote add origin https://github.com/username/repo.git
git fetch origin
```
- Kế tiếp, gõ lệnh bên dưới để chuyển sang branch của mình
```
git switch [branch của bản thân]
```
- Bước commit và push code lên github: nhấn Ctr + Shift + G hoặc icon Source Control trong VS Code -> Nhấn nút commit
- Kế tiếp, gõ lệnh sau đây
```
git commit -m "[lời nhắn đang commit cái gì]"
git push
```

### Cách lấy dữ liệu mới từ nhánh main trên github
- Gõ lệnh dưới nếu đã commit code:
```
git merge main
```
- Gõ lệnh dưới nếu chưa commit code:
```
git stash
git pull origin main 
git stash pop
```
#### README.md

Tài liệu giới thiệu và hướng dẫn sử dụng dự án.