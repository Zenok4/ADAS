import { Loader2, AlertCircle } from "lucide-react";

// 1. COMPONENT CARD
export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 ${className}`}
  >
    {children}
  </div>
);

// 2. COMPONENT TEXT TIÊU ĐỀ
export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
    {children}
  </h3>
);

// 3. COMPONENT INFO ITEM (Dòng thông tin)
export const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) => (
  <div className="flex items-start gap-4">
    <Icon
      size={20}
      className="text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0"
    />
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 dark:text-gray-200">
        {value || (
          <span className="italic text-gray-400 text-sm">Chưa cập nhật</span>
        )}
      </p>
    </div>
  </div>
);

// 4. COMPONENT LOADING & ERROR
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <Loader2 size={32} className="text-blue-500 animate-spin mr-2" />
    <span className="text-gray-600 dark:text-gray-300">
      Đang tải dữ liệu...
    </span>
  </div>
);

export const ErrorView = ({ message }: { message: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <AlertCircle size={32} className="text-red-500 mr-2" />
    <span className="text-red-600 dark:text-red-400">{message}</span>
  </div>
);
