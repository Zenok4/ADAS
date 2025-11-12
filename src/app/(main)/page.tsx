"use client";

import { MenuData, MenuType } from "@/type/menu";
import MenuTemplate from "./components/menu-template";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  User,
  Settings,
  AudioLines,
  Camera,
  Gauge,
  Ban,
  TrafficCone,
  Globe,
  BookOpen,
  Shield,
  Database,
  Info,
  Volume2,
  Split,
  Building2,
  ScanEye,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";

const HomePage = () => {
  const menu: MenuType[] = Object.values(MenuData);
  const router = useRouter();
  const {user, loading} = useSession();

  if(!loading && user){
    console.log("user home page", user);
  }

  return (
    <div className="bg-[#0a2a43] min-h-screen">
      <h1 className="flex justify-center py-10 text-4xl font-bold text-white">
        HỆ THỐNG
      </h1>

      {menu &&
        menu.map((item: MenuType, index: number) => (
          <div
            className="w-96 flex mx-auto my-5 border-[#80d4ff] bg-[#113a5c] border-2 rounded-xl p-4"
            key={index}
          >
            <MenuTemplate title={item.title}>
              {/* TÀI KHOẢN */}
              {item.title === MenuData.Profile.title && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3 w-full">
                    <User className="h-10 w-10 text-[#36B0BB]" />
                    <p className="text-white">Đăng nhập để sử dụng ứng dụng</p>
                  </div>
                  <div
                    onClick={() => router.push("/login")}
                    className="w-full cursor-pointer"
                  >
                    <Button variant="main" className="w-full">
                      Đăng nhập
                    </Button>
                  </div>
                </div>
              )}

              {/* CÀI ĐẶT CHUNG */}
              {item.title === MenuData.Settings.title && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Settings className="h-6 w-6 text-[#36B0BB]" />
                    <p className="text-white">Ngôn ngữ: Tiếng Việt</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Volume2 className="h-6 w-6 text-[#36B0BB]" />
                    <p className="text-white">Lời chào: Giọng nói</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-white">Âm lượng: 80</p>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="80"
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="audio-mode"
                      defaultChecked
                      className="w-5 h-5"
                    />
                    <label
                      htmlFor="audio-mode"
                      className="text-white cursor-pointer"
                    >
                      Chế độ dò âm (Bật)
                    </label>
                  </div>

                  <Button variant="main" className="w-full">
                    Cài đặt gốc
                  </Button>
                </div>
              )}

              {/* PHÁT HIỆN LÀN ĐƯỜNG */}
              {item.title === MenuData.LaneDetec.title && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-5 w-full">
                    <AudioLines className="h-10 w-10 text-[#36B0BB]" />
                    <div className="flex flex-col">
                      <p className="text-lg text-white">Cảnh báo lệch làn</p>
                      <p className="text-[#b0d8ff] text-sm">
                        Âm báo, độ nhạy, hướng dẫn làn đường
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* NHẬN DẠNG BIỂN BÁO GIAO THÔNG */}
              {item.title === MenuData.SignRegonize.title && (
                <div className="bg-[#0a2a43] rounded-xl p-3 flex flex-col gap-3">
                  {/* Camera */}
                  <div
                    onClick={() => router.push("/sign-camera")}
                    className="flex items-center gap-3 p-2 hover:bg-[#1a4060] rounded-lg transition-colors cursor-pointer"
                  >
                    <Camera className="h-8 w-8 text-[#36B0BB]" />
                    <div className="flex flex-col">
                      <p className="text-[#80d4ff] font-medium">Camera</p>
                      <p className="text-[#80d4ff] text-sm">
                        Cảnh báo trước: 200m
                      </p>
                    </div>
                  </div>

                  {/* Hướng cảnh báo Camera */}
                  <div
                    onClick={() => router.push("/sign-navigation")}
                    className="flex items-center gap-3 p-2 hover:bg-[#1a4060] rounded-lg transition-colors cursor-pointer"
                  >
                    <Split className="h-8 w-8 text-[#36B0BB]" />
                    <div className="flex flex-col">
                      <p className="text-[#80d4ff] font-medium">
                        Hướng cảnh báo Camera
                      </p>
                      <p className="text-[#80d4ff] text-sm">Tất cả các hướng</p>
                    </div>
                  </div>

                  {/* Camera giám sát tốc độ */}
                  <div
                    onClick={() => router.push("/sign-speed")}
                    className="flex items-center gap-3 p-2 hover:bg-[#1a4060] rounded-lg transition-colors cursor-pointer"
                  >
                    <Gauge className="h-8 w-8 text-[#36B0BB]" />
                    <div className="flex flex-col">
                      <p className="text-[#80d4ff] font-medium">
                        Camera giám sát tốc độ
                      </p>
                      <p className="text-[#80d4ff] text-sm">
                        Cảnh báo trước: 400m
                      </p>
                    </div>
                  </div>

                  {/* Cấm vượt/Hết cấm vượt */}
                  <div
                    onClick={() => router.push("/sign-no-pass")}
                    className="flex items-center gap-3 p-2 hover:bg-[#1a4060] rounded-lg transition-colors cursor-pointer"
                  >
                    <Ban className="h-8 w-8 text-[#36B0BB]" />
                    <div className="flex flex-col">
                      <p className="text-[#80d4ff] font-medium">
                        Cấm vượt/Hết cấm vượt
                      </p>
                      <p className="text-[#80d4ff] text-sm">
                        Cảnh báo trước: 100m
                      </p>
                    </div>
                  </div>

                  {/* Biển tốc độ tối đa */}
                  <div
                    onClick={() => router.push("/sign-speed-limit")}
                    className="flex items-center gap-3 p-2 hover:bg-[#1a4060] rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-full border-2 border-[#36B0BB] flex items-center justify-center">
                      <span className="text-[#36B0BB] text-xs font-bold">
                        60
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[#80d4ff] font-medium">
                        Biển tốc độ tối đa
                      </p>
                      <p className="text-[#80d4ff] text-sm">
                        Cảnh báo trước: 100m
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PHÁT HIỆN VẬT THỂ */}
              {item.title === MenuData.ObjectDetect.title && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-5 w-full">
                    <TriangleAlert className="h-10 w-10 text-[#36B0BB]" />
                    <div className="flex flex-col">
                      <p className="text-lg text-white">
                        Cảnh báo vật thể phía trước
                      </p>
                      <p className="text-[#b0d8ff] text-sm">
                        Người đi bộ, xe máy, ô tô, động vật...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PHÁT HIỆN BUỒN NGỦ */}
              {item.title === MenuData.DrownsyDetect.title && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-5 w-full">
                    <div className="relative">
                      <ScanEye className="h-10 w-10 text-[#36B0BB]" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-lg text-white">Cảnh báo buồn ngủ</p>
                      <p className="text-[#b0d8ff] text-sm">
                        Phát hiện nhắm mắt, ngáp, mất tập trung
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* GIỚI THIỆU */}
              {item.title === MenuData.Introduction.title && (
                <div className="flex flex-col gap-3">
                  <div
                    onClick={() => router.push("/info")}
                    className="flex items-center gap-3 w-full p-2 text-left text-white hover:bg-[#1a4060] rounded-lg transition-all cursor-pointer"
                  >
                    <Globe className="h-6 w-6 text-[#36B0BB]" />
                    <span className="flex-1">Trang web giới thiệu</span>
                    <ChevronRight className="h-5 w-5 text-[#36B0BB]" />
                  </div>

                  <div
                    onClick={() => router.push("/guides")}
                    className="flex items-center gap-3 w-full p-2 text-left text-white hover:bg-[#1a4060] rounded-lg transition-all cursor-pointer"
                  >
                    <BookOpen className="h-6 w-6 text-[#36B0BB]" />
                    <span className="flex-1">Hướng dẫn sử dụng</span>
                    <ChevronRight className="h-5 w-5 text-[#36B0BB]" />
                  </div>

                  <div
                    onClick={() => router.push("/policy")}
                    className="flex items-center gap-3 w-full p-2 text-left text-white hover:bg-[#1a4060] rounded-lg transition-all cursor-pointer"
                  >
                    <Shield className="h-6 w-6 text-[#36B0BB]" />
                    <span className="flex-1">Chính sách bảo mật</span>
                    <ChevronRight className="h-5 w-5 text-[#36B0BB]" />
                  </div>

                  <div
                    onClick={() => router.push("/information")}
                    className="flex items-center gap-3 w-full p-2 text-left text-white hover:bg-[#1a4060] rounded-lg transition-all cursor-pointer"
                  >
                    <Database className="h-6 w-6 text-[#36B0BB]" />
                    <span className="flex-1">Thông tin dữ liệu</span>
                    <ChevronRight className="h-5 w-5 text-[#36B0BB]" />
                  </div>

                  <div className="flex items-center justify-center mt-4">
                    <div className="border-2 border-[#3399cc] rounded-xl px-6 py-2 bg-[#0a2a43] text-[#b0d8ff] font-medium flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      <span>Phiên bản: 1.0.0</span>
                    </div>
                  </div>
                </div>
              )}
            </MenuTemplate>
          </div>
        ))}
    </div>
  );
};

export default HomePage;
