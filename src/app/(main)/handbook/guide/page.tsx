"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default function HandbookGuidePage() {
  const guides = [
    {
      id: 1,
      title: "Hướng dẫn sử dụng cơ bản",
      description: "Tìm hiểu cách khởi động và sử dụng hệ thống ADAS lần đầu tiên",
      content: (
        <div className="space-y-2 text-gray-700">
          <p><strong>1. Khởi động hệ thống ADAS</strong><br />
            Nhấn nút <strong>Bật ADAS</strong> trên bảng điều khiển, hệ thống sẽ kiểm tra camera, cảm biến và GPS.</p>
          <p><strong>2. Giao diện hiển thị</strong><br />
            Thanh trạng thái hiển thị kết nối camera, GPS, cảm biến. Biểu tượng các chức năng cảnh báo: mắt, buồn ngủ, làn đường, vật cản.</p>
          <p><strong>3. Điều chỉnh âm lượng cảnh báo</strong><br />
            Sử dụng thanh trượt để đặt mức cảnh báo phù hợp (khuyến nghị 70–80%).</p>
          <p><strong>4. Tắt/bật cảnh báo</strong><br />
            Bật/tắt từng chức năng từ menu <strong>Cài đặt → Cảnh báo</strong>.</p>
        </div>
      ),
    },
    {
      id: 2,
      title: "Cảnh báo buồn ngủ",
      description: "Hệ thống cảnh báo khi tài xế có dấu hiệu mệt mỏi",
      content: (
        <div className="space-y-2 text-gray-700">
          <p><strong>1. Cách hoạt động</strong><br />
            Camera hướng về mặt tài xế, theo dõi nhãn cầu và cử động mắt. Hệ thống tính toán Eye Aspect Ratio (EAR).</p>
          <p><strong>2. Hiển thị cảnh báo</strong><br />
            Khi phát hiện dấu hiệu mệt mỏi: âm thanh liên tục, biểu tượng mắt nhấp nháy, thông báo chữ: "Buồn ngủ – xin dừng xe nghỉ".</p>
          <p><strong>3. Tùy chỉnh nhạy cảm</strong><br />
            Chọn độ nhạy thấp, trung bình, cao trong cài đặt.</p>
          <p><strong>4. Hướng dẫn phản ứng</strong><br />
            Ngừng xe tại nơi an toàn, nghỉ ngơi ít nhất 15 phút trước khi lái tiếp.</p>
        </div>
      ),
    },
    {
      id: 3,
      title: "Nhận diện biển báo giao thông",
      description: "Hệ thống phát hiện và cảnh báo biển báo trên đường",
      content: (
        <div className="space-y-2 text-gray-700">
          <p><strong>1. Các loại biển báo hỗ trợ</strong><br />
            Tốc độ giới hạn, cấm vượt, nguy hiểm, dừng xe, làn đường, hướng đi.</p>
          <p><strong>2. Cách hoạt động</strong><br />
            Camera phía trước quét đường, AI Object Detection nhận diện ký hiệu biển báo và hiển thị biểu tượng trên màn hình.</p>
          <p><strong>3. Cảnh báo</strong><br />
            Biểu tượng biển báo hiển thị trên màn hình, phát âm thanh nếu bật.</p>
          <p><strong>4. Tùy chỉnh</strong><br />
            Bật/tắt cảnh báo cho từng loại biển báo, chọn hiển thị trên màn hình hoặc chỉ âm thanh.</p>
        </div>
      ),
    },
    {
      id: 4,
      title: "Phát hiện làn đường & vật cản",
      description: "Giúp xe giữ làn và cảnh báo va chạm phía trước",
      content: (
        <div className="space-y-2 text-gray-700">
          <p><strong>1. Phát hiện làn đường</strong><br />
            Camera quét vạch kẻ đường, cảnh báo lệch làn bằng biểu tượng nhấp nháy và âm thanh ngắn. Có thể rung vô-lăng nếu tích hợp.</p>
          <p><strong>2. Phát hiện vật cản / va chạm</strong><br />
            Camera + cảm biến radar quét khoảng cách trước. Biểu tượng xe phía trước trên màn hình, âm thanh cảnh báo cấp 1 (nhẹ) hoặc cấp 2 (nguy hiểm).</p>
          <p><strong>3. Hướng dẫn phản ứng</strong><br />
            Giữ khoảng cách an toàn, giảm tốc độ. Khi nguy hiểm, phanh ngay theo cảnh báo hệ thống.</p>
        </div>
      ),
    },
  ];

  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
  {/* Header */}
  <div className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 px-6 py-4">
    <h1 className="text-2xl font-bold">Hướng dẫn sử dụng</h1>
    <p className="text-gray-600 dark:text-gray-300 mt-1">Các bài hướng dẫn chi tiết giúp bạn sử dụng ADAS một cách hiệu quả</p>
  </div>

  {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-4">
          {guides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div
                  className="flex items-center justify-between"
                  onClick={() => setExpandedId(expandedId === guide.id ? null : guide.id)}
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 transition-colors text-gray-800 dark:text-gray-200 hover:text-blue-600">
                      {guide.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{guide.description}</p>
                  </div>
                  <ChevronRight
                    className={`h-6 w-6 text-gray-400 dark:text-gray-400 transition-transform flex-shrink-0 ml-4 ${
                      expandedId === guide.id ? "rotate-90 text-blue-600" : ""
                    }`}
                  />
                </div>
                {expandedId === guide.id && guide.content}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
