// components/SearchPagination.tsx
'use client'

interface SearchPaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function SearchPagination({
    currentPage,
    totalPages,
    onPageChange
}: SearchPaginationProps) {
    if (totalPages <= 1) return null

    const getPageNumbers = (): number[] => {
        const pages: number[] = []
        const showPages = 5
        const halfShow = Math.floor(showPages / 2)

        let start = Math.max(1, currentPage - halfShow)
        let end = Math.min(totalPages, start + showPages - 1)

        if (end - start + 1 < showPages) {
            start = Math.max(1, end - showPages + 1)
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        return pages
    }

    return (
        <nav className="flex justify-center items-center space-x-2 mt-8" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Previous page"
            >
                Previous
            </button>

            {getPageNumbers().map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium border rounded-md transition-colors duration-200 ${currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                    {pageNum}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Next page"
            >
                Next
            </button>
        </nav>
    )
}