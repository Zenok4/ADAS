"use client";

import { MenuData, MenuType } from "@/type/menu";
import MenuTemplate from "./components/menu-template";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const menu: MenuType[] = Object.values(MenuData);

  // Thử thay đổi dữ liệu menu (sẽ bị lỗi do bất biến)
  // MenuData.Profile.title = "BBBBB";

  console.log("Menu Data:", menu);
  return (
    <div>
      <h1 className="flex justify-center my-10 text-4xl font-bold">Hệ Thống</h1>
      {menu &&
        menu.map((item: MenuType, index: number) => (
          <div
            className="w-96 flex mx-auto my-5 border-[#80d4ff] bg-[#113a5c] border-2 rounded-xl p-2 px-4"
            key={index}
          >
            <MenuTemplate title={item.title}>
              {/* Custome Nội dung cho Menu Profile */}
              {item.title === MenuData.Profile.title && (
                <div>
                  <div className="mb-3">Đăng nhập để sử dụng ứng dụng</div>
                  <Button className="w-full py-5" variant="main">
                    Đăng Nhập
                  </Button>
                </div>
              )}
            </MenuTemplate>
          </div>
        ))}
    </div>
  );
};

export default HomePage;
