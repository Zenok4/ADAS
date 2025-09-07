"use client";

import { useEffect, useState } from "react";
import { RefreshCw, FileText, Target, PartyPopper } from "lucide-react";

const InformationPage = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate =
      today.getDate().toString().padStart(2, "0") +
      "-" +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      today.getFullYear();
    setCurrentDate(formattedDate);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a2a43] text-white px-4 py-6">
      {/* Tiêu đề */}
      <h1 className="text-center my-5 text-2xl md:text-3xl font-bold">
        Thông tin dữ liệu
      </h1>

      <div className="max-w-md mx-auto flex flex-col gap-5">
        {/* Card 1: Tự động cập nhật */}
        <div className="bg-[#113a5c] border border-[#80d4ff] rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#1a4a70] px-4 py-2 font-semibold text-[#80d4ff] flex items-center gap-2">
            <RefreshCw size={18} /> Tự động cập nhật
          </div>
          <div className="px-4 py-3 text-sm space-y-1">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-[#80d4ff]" />
              <strong>Dữ liệu của bạn đã được cập nhật phiên bản mới nhất:{" "}</strong>
            </div>
            {/* Thêm phiên bản mới */}
            <div className="pl-6 text-[#fffff] font-semibold">
              Phiên bản 1.0.0.0
            </div>
          </div>
        </div>

        {/* Card 2: Chi tiết dữ liệu */}
        <div className="bg-[#113a5c] border border-[#80d4ff] rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#1a4a70] px-4 py-2 font-semibold text-[#80d4ff] flex items-center gap-2">
            <FileText size={18} /> Chi tiết dữ liệu
          </div>
          <div className="px-4 py-3 text-sm space-y-3">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-[#80d4ff]" />
              <strong>Phiên bản dữ liệu hiện tại:</strong> {currentDate}
            </div>
            <hr className="border-t border-[#80d4ff]/50" />
            <div>
              Ứng dụng đã cập nhật các tuyến đường ở các phường ở Đà Nẵng sau đây:
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Phường Hải Châu 1</li>
                <li>Phường Hải Châu 2</li>
                <li>Phường Thạch Thang</li>
                <li>Phường Thanh Bình</li>
                <li>Phường Thuận Phước</li>
                <li>Phường Phước Ninh</li>
                <li>Phường Bình Hiên</li>
                <li>Phường Bình Thuận</li>
                <li>Phường Hòa Thuận Đông</li>
                <li>Phường Hòa Thuận Tây</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationPage;
