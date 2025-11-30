"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, AlertTriangle, TrafficCone, Route, Camera } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HandbookIntroducePage() {
  const router = useRouter();

  return (
    <div className="flex-1 overflow-y-auto">
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
            className="text-blue-600 border-white hover:bg-white"
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
            {/* Feature Card 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 border-b border-gray-300">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-lg">Theo dõi tầm nhìn</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <CardDescription className="text-sm text-gray-600 leading-snug">
                  Hệ thống giám sát tầm nhìn phía trước, cảnh báo khi có chướng ngại vật hoặc có điểm mù.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 border-b border-gray-300"> 
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                  <CardTitle className="text-lg">Cảnh báo mệt mỏi</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <CardDescription className="text-sm text-gray-600 leading-snug">
                  Phát hiện dấu hiệu mệt mỏi của tài xế thông qua hình ảnh và cảnh báo để dừng nghỉ.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 border-b border-gray-300"> 
                <div className="flex items-center gap-2 mb-1">
                  <TrafficCone className="h-6 w-6 text-red-600" />
                  <CardTitle className="text-lg">Phát hiện vị trí</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <CardDescription className="text-sm text-gray-600 leading-snug">
                  Nhận diện các biển báo giao thông, đèn tín hiệu, và cảnh báo tài xế về các luật lệ giao thông.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature Card 4 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 border-b border-gray-300"> 
                <div className="flex items-center gap-2 mb-1">
                  <Route className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-lg">Hỗ trợ giữ làn</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <CardDescription className="text-sm text-gray-600 leading-snug">
                  Cảnh báo khi xe sắp vượt qua vạch kẻ đường, hỗ trợ tài xế giữ đúng làn đường.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Xem trực tiếp</h2>
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
          <h2 className="text-2xl font-bold mb-4">Muốn tìm hiểu thêm?</h2>
          <p className="text-gray-600 mb-8">
            Khám phá hướng dẫn chi tiết và các chính sách sử dụng
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => router.push("/handbook/guide")}
            >
              Hướng dẫn sử dụng
            </Button>
            <Button 
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