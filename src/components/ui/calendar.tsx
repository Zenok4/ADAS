"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  return (
    <div className={cn("rounded-lg border shadow-sm bg-white dark:bg-gray-700 p-2", className)}>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        footer={
          <div className="flex justify-between mt-2 text-sm">
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => onSelect?.(undefined)}
            >
              Đóng
            </button>
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => onSelect?.(new Date())}
            >
              Hôm nay
            </button>
          </div>
        }
      />
    </div>
  );
}
