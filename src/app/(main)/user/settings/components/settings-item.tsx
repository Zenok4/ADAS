"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

const ToggleSwitch = ({
  toggled,
  onToggle,
}: {
  toggled: boolean;
  onToggle: (toggled: boolean) => void;
}) => (
  <button
    onClick={() => onToggle(!toggled)}
    className={`w-12 h-6 rounded-full p-1 transition-colors ${
      toggled ? "bg-blue-500" : "bg-gray-200"
    }`}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
        toggled ? "translate-x-6" : ""
      }`}
    />
  </button>
);

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
    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

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
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    className="w-32"
  />
);

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
    className={`flex items-center justify-between text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
      variant === "destructive"
        ? "text-red-600 bg-red-50 hover:bg-red-100"
        : "text-gray-700 bg-gray-50 hover:bg-gray-100"
    }`}
  >
    <span>{label}</span>
    {variant === "default" && <ChevronRight size={16} className="text-gray-400" />}
  </button>
);

export const SettingsItem = ({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: React.ReactNode;
}) => (
  <div className="p-6 flex justify-between items-center">
    <div>
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <div className="flex-shrink-0">{control}</div>
  </div>
);

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
    control={<SelectInput options={options} value={value} onChange={onChange} />}
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
      <ButtonInput label={buttonLabel} onClick={onClick} variant="destructive" />
    }
  />
);