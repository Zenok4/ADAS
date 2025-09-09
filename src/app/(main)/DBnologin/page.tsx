"use client";

import { Camera, Check, Navigation, OctagonMinus, ScanEye, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardGuest() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a2a43] text-white px-4">
            {/* Khung giả lập màn hình điện thoại */}
            <div className="w-full max-w-xs bg-[#0a2a43] border border-[#80d4ff]/40 rounded-2xl shadow-lg flex flex-col overflow-hidden">

                {/* HEADER */}
                <header className="h-12 flex items-center justify-between px-4 border-b border-[#80d4ff]/30">
                    {/* Logo + tên */}
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded bg-[#113a5c] border border-[#80d4ff] flex items-center justify-center text-[11px] font-bold text-[#80d4ff]">
                            A
                        </div>
                        <span className="text-sm font-semibold">DASHBOARD</span>
                    </div>

                    {/* Nút icon 4 chấm */}
                    <button className="rounded-lg border border-[#80d4ff] bg-[#113a5c] p-1 shadow-md hover:scale-105 transition">
                        <div className="grid grid-cols-2 gap-0.5">
                            {[0, 1, 2, 3].map((i) => (
                                <span
                                    key={i}
                                    className="h-1.5 w-1.5 rounded-full bg-[#80d4ff]"
                                />
                            ))}
                        </div>
                    </button>
                </header>

                {/* BODY */}
                <main className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                    {/* Intro */}
                    <div className="text-center">
                        
                        <h1 className="mt-3 text-lg font-bold text-white leading-snug">
                            Hệ thống hỗ trợ lái xe tiên tiến
                        </h1>
                        <p className="mt-1 text-xs text-[#b0d8ff]">
                            Bảo vệ hành trình của bạn với AI thời gian thực.
                        </p>

                        <button
                            onClick={() => router.push("/login")}
                            className="mt-4 w-full bg-[#0E6193] text-white font-semibold py-2.5 rounded-lg shadow-md active:scale-95"
                        >
                            Trải nghiệm ngay
                        </button>
                    </div>

                    {/* Module chính */}
                    <section className="space-y-3">
                        <h2 className="text-base font-semibold text-[#80d4ff] text-center">
                            4 Chức năng bảo vệ chính
                        </h2>

                        {/* Buồn ngủ */}
                        <div className="rounded-xl border border-[#80d4ff]/60 bg-[#0d2a42] p-3 flex items-center gap-3">
                            <ScanEye className="h-6 w-6 text-[#80d4ff] flex-shrink-0" />
                            <div>
                                <p className="text-[#80d4ff] font-medium text-sm">Cảnh báo buồn ngủ</p>
                                <p className="text-xs text-gray-300">Phát hiện mệt mỏi qua mắt</p>
                            </div>
                        </div>

                        {/* Vật cản */}
                        <div className="rounded-xl border border-[#80d4ff]/60 bg-[#0d2a42] p-3 flex items-center gap-3">
                            <TriangleAlert className="h-6 w-6 text-[#80d4ff] flex-shrink-0" />
                            <div>
                                <p className="text-[#80d4ff] font-medium text-sm">Phát hiện vật cản</p>
                                <p className="text-xs text-gray-300">Cảnh báo va chạm phía trước</p>
                            </div>
                        </div>

                        {/* Biển báo */}
                        <div className="rounded-xl border border-[#80d4ff]/60 bg-[#0d2a42] p-3 flex items-center gap-3">
                        <OctagonMinus className="h-6 w-6 text-[#80d4ff] flex-shrink-0" />
                        <div>
                            <p className="text-[#80d4ff] font-medium text-sm">Nhận diện biển báo</p>
                            <p className="text-xs text-gray-300">Đọc & cảnh báo biển báo giao thông</p>
                        </div>
                        </div>


                        {/* Làn đường */}
                        <div className="rounded-xl border border-[#80d4ff]/60 bg-[#0d2a42] p-3 flex items-center gap-3">
                            <Navigation className="h-6 w-6 text-[#80d4ff] flex-shrink-0" />
                            <div>
                                <p className="text-[#80d4ff] font-medium text-sm">Giám sát làn đường</p>
                                <p className="text-xs text-gray-300">Cảnh báo lệch làn không tín hiệu</p>
                            </div>
                        </div>
                    </section>

                    {/* Tiêu đề */}
                    <h2 className="text-center text-[#80d4ff] font-semibold text-lg"> Xem hệ thống hoạt động </h2>

                    {/* Video Demo */}
                    <div className="rounded-xl border border-[#80d4ff]/50 bg-[#10324d] p-6 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-[#80d4ff]"
                            viewBox="0 0 24 24" fill="currentColor" >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        <p className="mt-2 font-medium">Video Demo</p>
                        <p className="text-xs text-gray-300">Nhấn để xem</p>
                    </div>

                    {/* Danh sách tính năng */}
                    <div className="space-y-3">
                        <div className="rounded-lg border border-[#80d4ff]/50 bg-[#10324d] p-3 flex items-center gap-2">
                            <Check className="h-5 w-5 text-[#80d4ff] flex-shrink-0" />
                            <div>
                                <p className="font-medium text-[#80d4ff]">Giao diện trực quan</p>
                                <p className="text-xs text-gray-300">
                                    Dashboard hiển thị trạng thái real-time
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg border border-[#80d4ff]/50 bg-[#10324d] p-3 flex items-center gap-2">
                            <Check className="h-5 w-5 text-[#80d4ff] flex-shrink-0" />
                            <div>
                                <p className="font-medium text-[#80d4ff]">Cảnh báo thông minh</p>
                                <p className="text-xs text-gray-300">
                                    Âm thanh và hình ảnh không phiền nhiễu
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-6">
                        <h3 className="text-base font-semibold text-white">
                            Sẵn sàng trải nghiệm ADAS?
                        </h3>
                        <p className="text-xs text-gray-300 mt-1">
                            Tham gia miễn phí và bảo vệ hành trình an toàn hơn.
                        </p>
                        <button className="mt-3 w-full rounded-xl bg-[#80d4ff] py-2 font-medium text-[#0d2a42] active:scale-95">
                            Đăng ký miễn phí
                        </button>
                    </div>
                </main>

                {/* FOOTER */}
                <footer className="py-3 text-center text-[10px] text-[#b0d8ff] border-t border-[#80d4ff]/30">
                    © 2025 ADAS Project
                </footer>
            </div>
        </div>
    );
}
