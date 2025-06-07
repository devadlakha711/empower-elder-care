import React, { useState, useEffect } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationContainerProps<T> {
  data: T[];
  itemsPerPage: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderContainer?: (items: React.ReactNode[]) => React.ReactNode;
  className?: string;
  siblingCount?: number;
}

const PaginationContainer = <T,>({
  data,
  itemsPerPage,
  renderItem,
  renderContainer,
  className,
  siblingCount = 1,
}: PaginationContainerProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState<T[]>([]);
  
  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  // Update current page if it exceeds the total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [data, totalPages, currentPage]);
  
  // Update paginated data when current page or data changes
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedData(data.slice(start, end));
  }, [data, currentPage, itemsPerPage]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of the container
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    const totalBlocks = totalNumbers + 2; // +2 for ... blocks
    
    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 1 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, -1, totalPages];
    }
    
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 1 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, -1, ...rightRange];
    }
    
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, -1, ...middleRange, -1, totalPages];
    }
    
    return [];
  };
  
  // Render items using the provided render function
  const renderedItems = paginatedData.map((item, index) => renderItem(item, index));
  
  // Default container if not provided
  const defaultContainer = (items: React.ReactNode[]) => <div className="grid gap-4 md:grid-cols-2">{items}</div>;
  
  // Use provided container or default
  const itemsContainer = renderContainer ? renderContainer(renderedItems) : defaultContainer(renderedItems);
  
  return (
    <div className={className}>
      {/* Render paginated items */}
      {data.length > 0 ? (
        itemsContainer
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No items available</p>
        </div>
      )}
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {/* Previous button */}
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} href="#" />
              </PaginationItem>
            )}
            
            {/* Page numbers */}
            {getPageNumbers().map((page, index) => {
              if (page === -1) {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    href="#"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            {/* Next button */}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} href="#" />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PaginationContainer; 
