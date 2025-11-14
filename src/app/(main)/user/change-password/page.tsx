"use client";

import { useState } from "react";

// Import layout chung
import { UserHeader } from "../../../(main)/components/user-header";
import { UserSidebar } from "../../../(main)/components/user-sidebar";

// Import component mới
import { PasswordInput } from "./components/password-input";

export default function ChangePasswordPage() {
  const [collapsed, setCollapsed] = useState(false);

  // State cho các ô mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <UserHeader />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        <UserSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        {/* Main Content (áp dụng padding 'pt-20' giống các trang khác) */}
        <main
          className={`flex-1 p-8 pt-20 transition-all duration-300 ${
            collapsed ? "ml-16" : "ml-64"
          }`}
        >
          {/* ----- NỘI DUNG TRANG ĐỔI MẬT KHẨU ----- */}
          <h1 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h1>
          <p className="text-gray-500 mb-6">
            Cập nhật mật khẩu của bạn để bảo vệ tài khoản
          </p>

          {/* Card chính */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-2xl mx-auto">
            {/* Form Fields */}
            <div className="p-6 space-y-6">
              <PasswordInput
                label="Mật khẩu hiện tại"
                placeholder="Nhập mật khẩu hiện tại"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <PasswordInput
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <PasswordInput
                label="Xác nhận mật khẩu mới"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Security Tips */}
            <div className="p-6 bg-gray-50 border-t border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">
                Lời khuyên bảo mật:
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
                <li>
                  Không sử dụng mật khẩu giống với các tài khoản khác
                </li>
                <li>
                  Thay đổi mật khẩu định kỳ để bảo vệ tài khoản
                </li>
                <li>Không chia sẻ mật khẩu với bất kỳ ai</li>
                <li>
                  Sử dụng trình quản lý mật khẩu để lưu trữ an toàn
                </li>
              </ul>
            </div>

            {/* Actions Footer */}
            <div className="p-6 flex justify-end gap-3">
              <button className="px-5 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                Hủy
              </button>
              <button className="px-5 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors">
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}