
import { NotifyType, NotifyTypeValue } from "@/type/notify";
import { useCallback, useRef, useState } from "react";

/**
 * Hook quản lý notify dialog.
 * - showNotify(type, message, options?) => Promise<void> resolves when dialog closed
 * - hideNotify() closes and resolves
 *
 * Hook KHÔNG render UI — bạn render <NotifyDialog .../> ở component cha,
 * truyền state open/type/message và onClose = hideNotify
 */

type ShowNotifyArgs = {
  type: NotifyTypeValue;
  message: string;
  title?: string;
  primaryActionText?: string;
  // optional callback to be invoked if user clicks primary action (before close)
  onPrimaryAction?: (() => void) | undefined;
  onClose?: (() => void) | undefined;
};

export function useNotifyDialog() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<NotifyTypeValue>(NotifyType.Info as NotifyTypeValue);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [primaryActionText, setPrimaryActionText] = useState<string | undefined>(undefined);
  const primaryActionRef = useRef<(() => void) | undefined>(undefined);
  const closeActionRef = useRef<(() => void) | undefined>(undefined);

  const resolverRef = useRef<(() => void) | null>(null);

  const showNotify = useCallback((args: ShowNotifyArgs) => {
    // resolve any previous
    if (resolverRef.current) {
      resolverRef.current();
      resolverRef.current = null;
    }

    setType(args.type);
    setTitle(args.title);
    setMessage(args.message);
    setPrimaryActionText(args.primaryActionText);
    primaryActionRef.current = args.onPrimaryAction;
    closeActionRef.current = args.onClose;

    setOpen(true);

    return new Promise<void>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const hideNotify = useCallback(() => {
    closeActionRef.current?.();
    setOpen(false);
    if (resolverRef.current) {
      resolverRef.current();
      resolverRef.current = null;
    }
    closeActionRef.current = undefined;
  }, []);

  const handlePrimaryAction = useCallback(() => {
    try {
      primaryActionRef.current?.();
    } finally {
      // close after primary action (you can change behavior if want)
      hideNotify();
    }
  }, [hideNotify]);

  return {
    // state for rendering
    open,
    type,
    title,
    message,
    primaryActionText,

    // controls
    showNotify,        // (args) => Promise<void>
    hideNotify,        // () => void
    handlePrimaryAction, // to pass to NotifyDialog
  };
}