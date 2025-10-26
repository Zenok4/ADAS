"use client";

import type { LucideIcon } from "lucide-react";

type InfoCardProps = {
  icon: LucideIcon; // Icon từ lucide-react
  label: string;
  value: string | number;
};

const InfoCard = ({ icon: Icon, label, value }: InfoCardProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-2">
      <Icon className="text-gray-600 w-5 h-5" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default InfoCard;
