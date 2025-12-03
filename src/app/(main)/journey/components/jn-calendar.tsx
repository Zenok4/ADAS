"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface JourneyCalendarProps {
    selectedDate: Date | undefined;
    onSelectDate: (date: Date | undefined) => void;
}

export default function JourneyCalendar({ selectedDate, onSelectDate }: JourneyCalendarProps) {
    return (
        <div className="absolute z-20 bg-white dark:bg-gray-700 border rounded-lg shadow-lg p-2">
            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={onSelectDate}
                footer={
                    <div className="flex justify-between mt-2 text-sm">
                        <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => onSelectDate(undefined)}
                        >
                            Đóng
                        </button>
                        <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => onSelectDate(new Date())}
                        >
                            Hôm nay
                        </button>
                    </div>
                }
            />
        </div>
    );
}
