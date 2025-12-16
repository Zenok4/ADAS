"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

// --- 1. Toggle Switch (Updated) ---
const ToggleSwitch = ({
  toggled,
  onToggle,
}: {
  toggled: boolean;
  onToggle: (toggled: boolean) => void;
}) => (
  <button
    onClick={() => onToggle(!toggled)}
    className={`w-10 h-5 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 dark:focus:ring-offset-slate-900 ${
      toggled ? "bg-blue-600" : "bg-gray-300 dark:bg-slate-700"
    }`}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
        toggled ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

// --- 2. Select Input (Updated) ---
const SelectInput = ({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-2 py-1.5 rounded-md border border-gray-300 bg-white text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 
    dark:bg-slate-950 dark:border-slate-800 dark:text-gray-100 cursor-pointer"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

// --- 3. Slider Input (Updated) ---
const SliderInput = ({
  min,
  max,
  step,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) => (
  <div className="flex items-center gap-3">
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-28 sm:w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
    />
    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[24px] text-right">
      {value}
    </span>
  </div>
);

// --- 4. Button Input (Updated) ---
const ButtonInput = ({
  label,
  onClick,
  variant = "default",
}: {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-md transition-colors border ${
      variant === "destructive"
        ? "text-red-600 bg-red-50 border-red-100 hover:bg-red-100 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/50"
        : "text-gray-700 bg-white border-gray-200 hover:bg-gray-50 dark:bg-slate-900 dark:border-slate-800 dark:text-gray-300 dark:hover:bg-slate-800"
    }`}
  >
    <span>{label}</span>
    {variant === "default" && (
      <ChevronRight size={14} className="text-gray-400" />
    )}
  </button>
);

// --- 5. Main Item Container (Compact & Dark Mode) ---
export const SettingsItem = ({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: React.ReactNode;
}) => (
  <div className="p-3 sm:p-4 flex justify-between items-center group hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
    <div className="pr-4 flex-1">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
        {title}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1 group-hover:line-clamp-none transition-all">
        {description}
      </p>
    </div>
    <div className="flex-shrink-0 ml-2">{control}</div>
  </div>
);

// --- EXPORT WRAPPERS ---

export const SettingsToggleItem = ({
  title,
  description,
  toggled,
  onToggle,
}: {
  title: string;
  description: string;
  toggled: boolean;
  onToggle: (toggled: boolean) => void;
}) => (
  <SettingsItem
    title={title}
    description={description}
    control={<ToggleSwitch toggled={toggled} onToggle={onToggle} />}
  />
);

export const SettingsSelectItem = ({
  title,
  description,
  options,
  value,
  onChange,
}: {
  title: string;
  description: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <SettingsItem
    title={title}
    description={description}
    control={
      <SelectInput options={options} value={value} onChange={onChange} />
    }
  />
);

export const SettingsSliderItem = ({
  title,
  description,
  min,
  max,
  step,
  value,
  onChange,
}: {
  title: string;
  description: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) => (
  <SettingsItem
    title={title}
    description={description}
    control={
      <SliderInput
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
      />
    }
  />
);

export const SettingsLinkItem = ({
  title,
  description,
  buttonLabel,
  onClick,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}) => (
  <SettingsItem
    title={title}
    description={description}
    control={<ButtonInput label={buttonLabel} onClick={onClick} />}
  />
);

export const SettingsDestructiveItem = ({
  title,
  description,
  buttonLabel,
  onClick,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}) => (
  <SettingsItem
    title={title}
    description={description}
    control={
      <ButtonInput
        label={buttonLabel}
        onClick={onClick}
        variant="destructive"
      />
    }
  />
);