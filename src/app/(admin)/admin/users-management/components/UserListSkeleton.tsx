"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface UserListSkeletonProps {
  rows?: number;
}

export function UserListSkeleton({ rows = 10 }: UserListSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="border-b border-gray-100">
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-32" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-16" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-20" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="py-4 px-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
