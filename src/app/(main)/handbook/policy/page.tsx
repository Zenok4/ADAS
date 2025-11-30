"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function HandbookPolicyPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const policies = [
    {
      id: 1,
      title: "Chính sách bảo mật dữ liệu",
      content: (
        <div className="space-y-2 text-gray-600 leading-relaxed">
          <div>
            <strong>1. Mục đích thu thập thông tin</strong>
            <p>Ứng dụng thu thập thông tin để cung cấp cảnh báo đúng hạn và cải thiện trải nghiệm người dùng.</p>
          </div>
          <div>
            <strong>2. Phạm vi sử dụng thông tin</strong>
            <p>Thông tin được dùng để xử lý dữ liệu, gửi cảnh báo, và tối ưu hệ thống.</p>
          </div>
          <div>
            <strong>3. Lưu trữ và bảo mật dữ liệu</strong>
            <p>Dữ liệu được bảo mật bằng mã hóa và chỉ lưu giữ trong thời gian cần thiết.</p>
          </div>
          <div>
            <strong>4. Quyền của người dùng</strong>
            <p>Người dùng có quyền xem, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân.</p>
          </div>
          <div>
            <strong>5. Liên hệ</strong>
            <p>Email hỗ trợ: supportadas@app.vn</p>
          </div>
            <div className="mt-4 border-t pt-4">
                    <div className="mt-4">
                      <Button variant="outline">Gửi yêu cầu</Button>
                    </div>
                  </div>
        </div>
        ),
      },
    {
      id: 2,
      title: "Điều khoản sử dụng",
      content:
        "Người dùng đồng ý sử dụng hệ thống ADAS một cách an toàn và hợp pháp. Bạn chịu trách nhiệm về mọi hành động sử dụng hệ thống của mình. Chúng tôi không chịu trách nhiệm về các tai nạn hoặc thiệt hại phát sinh từ việc sử dụng không đúng cách.",
    },
    {
      id: 3,
      title: "Trách nhiệm của người dùng",
      content:
        "Người lái xe vẫn có trách nhiệm chính trong việc điều khiển xe. Hệ thống ADAS chỉ là hỗ trợ và không thay thế cho sự chú ý của tài xế. Luôn tuân thủ luật lệ giao thông và điều khiển xe một cách an toàn.",
    },
    {
      id: 4,
      title: "Chính sách bảo hành",
      content:
        "Hệ thống ADAS được bảo hành trong 12 tháng từ ngày mua. Nếu gặp sự cố kỹ thuật, vui lòng liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi để được hỗ trợ.",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold">Chính sách & Quy định</h1>
        <p className="text-gray-600 mt-1">
          Thông tin về chính sách, điều khoản sử dụng và trách nhiệm pháp lý
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-4">
          {policies.map((policy) => (
            <Card
              key={policy.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === policy.id ? null : policy.id)
                }
              >
                <h3 className="font-bold text-lg text-left">{policy.title}</h3>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${expandedId === policy.id ? "rotate-180" : ""
                    }`}
                />
              </button>
              {expandedId === policy.id && (
                <CardContent className="pt-0 px-6 pb-4 border-t">
                  <p className="text-gray-600 leading-relaxed">
                    {policy.content}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
