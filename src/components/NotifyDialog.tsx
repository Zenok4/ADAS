"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { NotifyDefaultTitle, NotifyType, NotifyTypeValue } from "@/type/notify";

type Props = {
  open: boolean;
  type: NotifyTypeValue;
  title?: string; // optional override
  message: string;
  onClose: () => void;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
};

/**
 * A beautifully designed notify dialog with enhanced visual hierarchy and interactions.
 */
export default function NotifyDialog({
  open,
  type,
  title,
  message,
  onClose,
  primaryActionText,
  onPrimaryAction,
}: Props) {
  const meta = {
    [NotifyType.Success]: {
      Icon: CheckCircle,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      titleColor: "text-emerald-900",
      borderColor: "border-emerald-200",
      primaryButton: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    [NotifyType.Info]: {
      Icon: Info,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      titleColor: "text-blue-900",
      borderColor: "border-blue-200",
      primaryButton: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    [NotifyType.Warning]: {
      Icon: AlertTriangle,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      titleColor: "text-amber-900",
      borderColor: "border-amber-200",
      primaryButton: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    [NotifyType.Error]: {
      Icon: XCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      titleColor: "text-red-900",
      borderColor: "border-red-200",
      primaryButton: "bg-red-600 hover:bg-red-700 text-white",
    },
  }[type];

  const Title = title ?? NotifyDefaultTitle[type];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={`max-w-md w-[95vw] sm:w-[480px] rounded-3xl p-0 shadow-2xl border-0 bg-white overflow-hidden ${meta.borderColor} border-t-4`}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <DialogHeader className="text-left">
            <div className="flex gap-5 items-start">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${meta.iconBg} shadow-sm`}
              >
                <meta.Icon className={`h-8 w-8 ${meta.iconColor}`} />
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <DialogTitle
                  className={`text-xl font-bold ${meta.titleColor} leading-tight`}
                >
                  {Title}
                </DialogTitle>
                <DialogDescription asChild>
                  <p className="mt-3 text-base text-gray-700 leading-relaxed break-words">
                    {message}
                  </p>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-8 flex gap-3 justify-end">
            {onPrimaryAction && primaryActionText ? (
              <Button
                onClick={onPrimaryAction}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${meta.primaryButton} focus:ring-2 focus:ring-offset-2`}
              >
                {primaryActionText}
              </Button>
            ) : null}
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-semibold border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 bg-transparent dark:hover:text-gray-600 dark:hover:bg-gray-100"
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}