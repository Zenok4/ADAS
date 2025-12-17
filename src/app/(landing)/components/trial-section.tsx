"use client";

import { Button } from "@/components/ui/button";

export function TrialSection() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Hệ thống hỗ trợ lái xe tiên tiến
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Bảo vệ hành trình của bạn với AI thời gian thực
        </p>
        <Button className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-3 rounded-full">
          Trải nghiệm ngay
        </Button>
      </div>
    </section>
  );
}
