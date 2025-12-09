"use client";

import { Users, AlertTriangle, TrendingUp } from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

export default function SystemOverview() {
  const stats: StatCard[] = [
    {
      label: "Tổng số người dùng trong hệ thống",
      value: "1,247",
      icon: <Users className="w-8 h-8 text-slate-600" />,
      description: "Tổng số người dùng",
    },
    {
      label: "Cảnh báo trong 24h",
      value: "89",
      icon: <AlertTriangle className="w-8 h-8 text-slate-600" />,
      description: "Cảnh báo trong 24h",
    },
    {
      label: "Độ chính xác hệ thống",
      value: "98.5%",
      icon: <TrendingUp className="w-8 h-8 text-slate-600" />,
      description: "Độ chính xác hệ thống",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Tổng quan hệ thống
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600 font-medium max-w-xs">
                {stat.label}
              </p>
              {stat.icon}
            </div>
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {stat.value}
            </p>
            <p className="text-xs text-slate-500">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
