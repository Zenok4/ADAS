"use client";
import React from "react";

export const SettingsTab = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 font-medium rounded-t-lg border-b-2 transition-colors ${
      isActive
        ? "border-blue-500 text-blue-500"
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);