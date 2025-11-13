"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Helper to generate page range
const range = (start: number, end: number) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const usePagination = ({
  currentPage,
  totalPages,
  siblingCount = 1,
}: {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}) => {
  const paginationItems = (): (number | string)[] => {
    const totalPageNumbers = siblingCount * 2 + 5; // e.g. 1 ... 4 5 6 ... 10 (7 items)

    /*
      Case 1:
      Nếu tổng số trang nhỏ hơn số trang chúng ta muốn hiển thị,
      trả về toàn bộ dải trang [1...totalPages]
    */
    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    /*
      Case 2: Không có ... bên trái, nhưng có ... bên phải
      e.g. [1, 2, 3, 4, 5, ..., 10]
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, "...", totalPages];
    }

    /*
      Case 3: Có ... bên trái, nhưng không có ... bên phải
      e.g. [1, ..., 6, 7, 8, 9, 10]
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, "...", ...rightRange];
    }

    /*
      Case 4: Có cả ... bên trái và bên phải
      e.g. [1, ..., 4, 5, 6, ..., 10]
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }
    
    // SỬA LỖI: Fallback để TypeScript không báo lỗi
    return [];
  };

  return paginationItems() || [];
};

export function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationComponentProps) {
  if (totalPages <= 1) {
    return null;
  }

  const paginationItems = usePagination({ currentPage, totalPages });

  return (
    <div className="flex items-center justify-end gap-4 py-4 px-6">
      <span className="text-sm text-gray-700">
        Trang {currentPage} / {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="w-9 px-0"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Trang trước</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {paginationItems.map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            className="w-9"
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={typeof page !== "number"}
          >
            {typeof page === "number" ? (
              page
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="w-9 px-0"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Trang sau</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}