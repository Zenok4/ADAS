"use client";

import { Button } from "@/components/ui/button";
import MenuTemplate from "../components/menu-template";

type StepType = {
  title: string;
  description?: string;
  details?: string[];
};

const StepData: Record<string, StepType> = {
  Step1: {
    title: "Bước 1",
    description: "Đăng nhập ứng dụng bằng tài khoản Google hoặc số điện thoại.",
  },
  Step2: {
    title: "Bước 2",
    description:
      "Cho phép ứng dụng truy cập camera để nhận diện biển báo, làn đường và vật thể.",
  },
  Step3: {
    title: "Bước 3",
    description:
      "Bật GPS để hệ thống hiển thị cảnh báo giao thông theo thời gian thực.",
  },
  Step4: {
    title: "Bước 4",
    description: "Khi lái xe, ứng dụng sẽ tự động:",
    details: [
      "Cảnh báo giao thông và tốc độ",
      "Nhận diện biển báo",
      "Phát hiện làn đường, vật cản",
      "Cảnh báo buồn ngủ, mất tập trung",
    ],
  },
  Step5: {
    title: "Bước 5",
    description:
      "Vào mục Chi tiết dữ liệu để xem các tuyến đường đã được cập nhật mới nhất.",
  },
};

const InformationPage = () => {
  const steps: StepType[] = Object.values(StepData);

  return (
    <div>
      <h1 className="flex justify-center my-10 text-3xl md:text-4xl font-bold text-[#80d4ff]">
        Hướng Dẫn Sử Dụng
      </h1>

      {/* Toàn bộ step nằm chung trong 1 bảng giống PrivacyPage */}
      <div className="w-96 flex mx-auto my-5 border-[#80d4ff] bg-[#113a5c] border-2 rounded-xl p-4 flex-col space-y-4 text-white">
        {steps.map((item: StepType, index: number) => (
          <MenuTemplate key={index} title={item.title}>
            <p className="mb-2">{item.description}</p>

            {item.details && (
              <ul className="list-disc pl-6 space-y-1">
                {item.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            )}

            {/* Custom cho Step 1 */}
            {item.title === StepData.Step1.title && (
              <div className="mt-3">
                
              </div>
            )}
          </MenuTemplate>
        ))}

        <Button className="mt-3 w-full py-5" variant="main">
          Bắt đầu sử dụng
        </Button>
      </div>
    </div>
  );
};

export default InformationPage;
