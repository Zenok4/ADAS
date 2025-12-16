"use client";

import type { LucideIcon } from "lucide-react";

type InfoCardProps = {
  icon: LucideIcon; // Icon từ lucide-react
  label: string;
  value: string | number;
};

const InfoCard = ({ icon: Icon, label, value }: InfoCardProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-2 dark:bg-gray-900 ">
      <Icon className="w-5 h-5 text-blue-500 dark:text-white transition-colors duration-200 hover:text-white" />
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-300 transition-colors duration-200">{label}</p>
        <p className="font-semibold text-gray-800 dark:text-white transition-colors duration-200">{value}</p> 
      </div>
    </div>
  );
};

export default InfoCard;
