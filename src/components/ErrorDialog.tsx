"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ErrorMessages, ErrorType, type ErrorTypeValue } from "@/type/error";
import { AlertCircle, Ban, Lock, ShieldAlert, X } from "lucide-react";

type Props = {
  open: boolean;
  type: ErrorTypeValue;
  message: string;
  onClose: () => void;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
  detail?: string;
};

// Định nghĩa các meta thông tin cho từng loại lỗi với icon, màu sắc, tiêu đề tùy theo loại lỗi
const META: Record<
  ErrorTypeValue,
  {
    title: string;
    Icon: React.ElementType;
    bgClass: string;
    iconBgClass: string;
    iconClass: string;
    titleClass: string;
  }
> = {
  [ErrorType.IPForbidden]: {
    title: ErrorMessages[ErrorType.IPForbidden],
    Icon: Ban,
    bgClass: "bg-red-50 dark:bg-red-950/20",
    iconBgClass: "bg-red-100 dark:bg-red-900/30",
    iconClass: "text-red-600 dark:text-red-400",
    titleClass: "text-red-800 dark:text-red-300",
  },
  [ErrorType.AccessForbidden]: {
    title: ErrorMessages[ErrorType.AccessForbidden],
    Icon: ShieldAlert,
    bgClass: "bg-orange-50 dark:bg-orange-950/20",
    iconBgClass: "bg-orange-100 dark:bg-orange-900/30",
    iconClass: "text-orange-600 dark:text-orange-400",
    titleClass: "text-orange-800 dark:text-orange-300",
  },
  [ErrorType.NoPermission]: {
    title: ErrorMessages[ErrorType.NoPermission],
    Icon: Lock,
    bgClass: "bg-amber-50 dark:bg-amber-950/20",
    iconBgClass: "bg-amber-100 dark:bg-amber-900/30",
    iconClass: "text-amber-600 dark:text-amber-400",
    titleClass: "text-amber-800 dark:text-amber-300",
  },
  [ErrorType.Generic]: {
    title: ErrorMessages[ErrorType.Generic],
    Icon: AlertCircle,
    bgClass: "bg-muted",
    iconBgClass: "bg-background",
    iconClass: "text-muted-foreground",
    titleClass: "text-foreground",
  },
};

export default function ErrorDialog({
  open,
  type,
  message,
  onClose,
  primaryActionText,
  onPrimaryAction,
  detail,
}: Props) {
  const meta = META[type] ?? META[ErrorType.Generic];
  const Icon = meta.Icon;

  // Giao diện dialog lỗi
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg w-[94vw] sm:w-[520px] rounded-xl p-0 shadow-2xl border-0 bg-card overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <button
          aria-label="Đóng"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className={`px-6 pt-6 pb-4 ${meta.bgClass}`}>
          <DialogHeader className="text-left">
            <div className="flex items-start gap-4">
              <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.iconBgClass}`}
                >
                  <Icon className={`h-5 w-5 ${meta.iconClass}`} />
                </div>
              </div>

              <div className="min-w-0 flex-1 pt-1 my-auto">
                <DialogTitle
                  className={`text-xl font-semibold ${meta.titleClass} leading-tight`}
                >
                  {meta.title}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6">
          <DialogDescription asChild>
            <p className="text-sm text-card-foreground leading-relaxed mb-4">
              {message}
            </p>
          </DialogDescription>

          {detail && (
            <div className="mb-6 p-3 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {detail}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            {onPrimaryAction && primaryActionText && (
              <Button
                onClick={onPrimaryAction}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                {primaryActionText}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium border-border hover:bg-muted/50 transition-all duration-200 bg-transparent"
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}