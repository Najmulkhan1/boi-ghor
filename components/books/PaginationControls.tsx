"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/books?${params.toString()}`);
    
    // পেজ পরিবর্তনের পর উপরে স্ক্রল করবে
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 pb-10">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="rounded-xl"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1 mx-2">
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          // শুধুমাত্র বর্তমান পেজের আশেপাশের কয়েকটা পেজ দেখাবে (খুব বেশি পেজ হলে লজিক আরও জটিল করা যায়)
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "ghost"}
              className={`h-10 w-10 rounded-xl ${
                currentPage === pageNum ? "bg-blue-600 hover:bg-blue-700" : ""
              }`}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="rounded-xl"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}