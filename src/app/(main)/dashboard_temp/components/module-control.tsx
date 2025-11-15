"use client";

import { Button } from "@/components/ui/button";
import { Module, MODULES } from "@/type/module";
import { useState } from "react";

const ModuleControl = () => {
  const [modules, setModules] = useState<Module[]>(MODULES);

  const toggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === id ? { ...module, isActive: !module.isActive } : module
      )
    );
  };

  return (
    <section className="rounded-xl border border-blue-200/20 bg-[#113a5c] p-6">
      <h2 className="text-center text-2xl font-bold text-white mb-6">
        Chức năng
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {modules.map((module) => (
          <div
            key={module.id}
            className="group rounded-lg border border-slate-600 bg-slate-800 p-3 transition-all hover:bg-slate-700"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-white">{module.name}</h3>

              <Button
                onClick={() => toggleModule(module.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  module.isActive
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {module.isActive ? "Tắt" : "Bật"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  module.isActive ? "bg-green-400" : "bg-gray-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  module.isActive ? "text-green-400" : "text-gray-400"
                }`}
              >
                {module.isActive ? "Đang chạy" : "Chờ"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 w-full">
        <Button
          variant={"main"}
          className="w-full px-10 py-6 text-lg font-semibold"
        >
          Bắt đầu
        </Button>
      </div>
    </section>
  );
};

export default ModuleControl;
