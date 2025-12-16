"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, AlertTriangle, TrafficCone, Route, Camera } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HandbookIntroducePage() {
  const router = useRouter();

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-300 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">HỆ THỐNG HỖ TRỢ LÁI XE NÂNG CAO</h1>
          <p className="text-lg text-blue-50 mb-1">
            Bảo vệ hành trình với AI thời gian thực
          </p>
          <br />
          <Button 
            size="lg" 
            variant="outline" 
            className="text-blue-600 border-white hover:bg-white dark:bg-gray-200"
            onClick={() => router.push("/handbook/guide")}
          >
            Bắt đầu tìm hiểu
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">4 chức năng bảo vệ chính</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{
              icon: Eye, title: "Theo dõi tầm nhìn", color: "text-blue-600",
              desc: "Hệ thống giám sát tầm nhìn phía trước, cảnh báo khi có chướng ngại vật hoặc có điểm mù."
            },{
              icon: AlertTriangle, title: "Cảnh báo mệt mỏi", color: "text-amber-600",
              desc: "Phát hiện dấu hiệu mệt mỏi của tài xế thông qua hình ảnh và cảnh báo để dừng nghỉ."
            },{
              icon: TrafficCone, title: "Phát hiện vị trí", color: "text-red-600",
              desc: "Nhận diện các biển báo giao thông, đèn tín hiệu, và cảnh báo tài xế về các luật lệ giao thông."
            },{
              icon: Route, title: "Hỗ trợ giữ làn", color: "text-green-600",
              desc: "Cảnh báo khi xe sắp vượt qua vạch kẻ đường, hỗ trợ tài xế giữ đúng làn đường."
            }].map((f, i) => (
              <Card key={i} className="hover:shadow-lg bg-white dark:bg-gray-800 hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-2 border-b border-gray-300 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <f.icon className={`h-6 w-6 ${f.color}`} />
                    <CardTitle className="text-lg text-gray-800 dark:text-gray-200">{f.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
                    {f.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">Xem trực tiếp</h2>
          <div className="bg-black rounded-lg p-6 flex items-center justify-center h-80">
            <div className="flex flex-col items-center gap-3 text-white">
              <Camera className="h-12 w-12 text-gray-400" />
              <p className="text-gray-400">Hình ảnh camera trực tiếp</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Muốn tìm hiểu thêm?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Khám phá hướng dẫn chi tiết và các chính sách sử dụng
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-6 py-2 rounded hover:text-white hover:bg-gray-600 dark:hover:bg-gray-500 transition"
              onClick={() => router.push("/handbook/guide")}
            >
              Hướng dẫn sử dụng
            </Button>
            <Button
              className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-6 py-2 rounded hover:text-white hover:bg-gray-600 dark:hover:bg-gray-500 transition"
              onClick={() => router.push("/handbook/policy")}
            >
              Chính sách & Quy định
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
