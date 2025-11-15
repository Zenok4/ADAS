"use client";

import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  status: string;
  toggle: boolean;
  onToggle: () => void;
};

const FeatureCard = ({
  icon: Icon,
  title,
  status,
  toggle,
  onToggle,
}: FeatureCardProps) => {
  return (
    <div
      className={`flex items-center justify-between rounded-xl shadow-md p-4 w-full h-24 transition 
      ${toggle ? "bg-blue-50 border border-blue-300" : "bg-white border"}`}
    >
      {/* Icon + text */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-full">
          <Icon className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <p className="font-semibold text-gray-700">{title}</p>
          <p className={`text-sm ${toggle ? "text-green-600" : "text-red-500"}`}>
            {status}
          </p>
        </div>
      </div>

      {/* Toggle */}
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={toggle}
          onChange={onToggle}
          className="sr-only"
        />
        <div
          className={`w-10 h-5 rounded-full transition ${
            toggle ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`h-5 w-5 rounded-full bg-white shadow transform transition ${
              toggle ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </label>
    </div>
  );
};

export default FeatureCard;
