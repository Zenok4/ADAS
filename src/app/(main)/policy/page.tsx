"use client";

import MenuTemplate from "../components/menu-template";
import { Button } from "@/components/ui/button";

const PrivacyPage = () => {
  return (
    <div>
      <h1 className="flex justify-center my-10 text-3xl md:text-4xl font-bold text-[#80d4ff]">
        Chính Sách Bảo Mật
      </h1>

      <div className="w-96 flex mx-auto my-5 border-[#80d4ff] bg-[#113a5c] border-2 rounded-xl p-4 flex-col space-y-4 text-white">
        <MenuTemplate title="1. Mục đích thu thập thông tin">
          <p>
            Ứng dụng thu thập thông tin để cung cấp cảnh báo giao thông và cải thiện trải nghiệm người dùng.
          </p>
        </MenuTemplate>

        <MenuTemplate title="2. Phạm vi sử dụng thông tin">
          <p>
            Thông tin được dùng để xử lý dữ liệu, gửi cảnh báo, và tối ưu hệ thống.
          </p>
        </MenuTemplate>

        <MenuTemplate title="3. Lưu trữ và bảo mật dữ liệu">
          <p>
            Dữ liệu được bảo mật bằng mã hóa và chỉ lưu giữ trong thời gian cần thiết.
          </p>
        </MenuTemplate>

        <MenuTemplate title="4. Quyền của người dùng">
          <p>
            Người dùng có quyền xem, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân.
          </p>
        </MenuTemplate>

        <MenuTemplate title="5. Liên hệ">
          <p>Email hỗ trợ: supportadas@app.vn</p>
          <Button className="mt-3 w-full py-5" variant="main">
            Gửi Yêu Cầu
          </Button>
        </MenuTemplate>
      </div>
    </div>
  );
};

export default PrivacyPage;
