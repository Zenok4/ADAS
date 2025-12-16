"use client";

import { JSX, useMemo } from "react";
// Import các component Pagination từ thư mục ui
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

// --- KHAI BÁO KIỂU DỮ LIỆU ---
interface JNPaginationProps {
  totalItems: number; // Tổng số mục (tức là allFilteredTrips.length)
  itemsPerPage: number; // Số mục trên mỗi trang (Hằng số, ví dụ 5)
  currentPage: number; // Trang hiện tại
  onPageChange: (page: number) => void; // Hàm xử lý khi chuyển trang
}

export default function JNPagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: JNPaginationProps) {
  
  // Tính toán Tổng số trang
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  // Nếu chỉ có một trang hoặc không có mục nào, không hiển thị phân trang
  if (totalPages <= 1) {
    return null;
  }

  // --- Hỗ trợ hiển thị Pagination (Giữ logic hiển thị số trang từ page.tsx) ---
  const renderPaginationItems = () => {
    const items: JSX.Element[] = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Hiển thị Trang 1 và dấu Ellipsis (nếu cần)
    if (startPage > 1) {
        items.push(
            <PaginationItem key={1}>
                <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
            </PaginationItem>
        );
        if (startPage > 2) {
            items.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
        }
    }

    // Hiển thị các số trang chính giữa
    for (let i = startPage; i <= endPage; i++) {
        items.push(
            <PaginationItem key={i}>
                <PaginationLink 
                    onClick={() => onPageChange(i)} 
                    isActive={i === currentPage}
                >
                    {i}
                </PaginationLink>
            </PaginationItem>
        );
    }

    // Hiển thị Trang cuối và dấu Ellipsis (nếu cần)
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            items.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
        }
        items.push(
            <PaginationItem key={totalPages}>
                <PaginationLink onClick={() => onPageChange(totalPages)}>{totalPages}</PaginationLink>
            </PaginationItem>
        );
    }

    return items;
  };


  return (
    <Pagination className="mt-6">
      <PaginationContent>
        {/* Nút trang trước */}
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(currentPage - 1)}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {/* Các nút số trang và Ellipsis */}
        {renderPaginationItems()}

        {/* Nút trang kế tiếp */}
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}