"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Eye, AlertTriangle } from "lucide-react";

export function DemoSection() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      {/* THAY ĐỔI: Dùng w-full và max-w-screen-2xl (rất rộng) thay vì max-w-6xl */}
      <div className="w-full max-w-screen-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Xem hệ thống hoạt động
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Video Demo Section */}
          <div className="bg-blue-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
            {" "}
            {/* Tăng chiều cao lên xíu cho đẹp */}
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
              <Play className="w-8 h-8 text-blue-400 fill-blue-400" />
            </div>
            <p className="text-gray-700 font-medium">Nhấn để xem</p>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            {/* ... Code các Feature giữ nguyên ... */}
            {/* Feature 1 */}
            <div className="bg-blue-100 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Giao diện trực quan
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Dashboard hiển thị thông tin thời gian thực
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-blue-100 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Cảnh báo buồn ngủ
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Âm thanh và hình ảnh cảnh báo phù hợp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Phần này nên giữ gọn ở giữa thì đẹp hơn, nhưng tôi đã bỏ giới hạn container cha nên phải tự set width cho nó */}
        <div className="border border-gray-300 rounded-2xl p-8 text-center bg-gray-50 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Sẵn sàng tham gia trải nghiệm ADAS?
          </h3>
          <p className="text-gray-600 mb-6">
            Tham gia miễn phí và bảo vệ hành trình an toàn hơn
          </p>
          <Button className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-3 rounded-full">
            Đăng ký miễn phí
          </Button>
        </div>
      </div>
    </section>
  );
}
