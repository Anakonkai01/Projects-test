import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null; // Không hiển thị nếu chỉ có 1 trang

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={`px-4 py-2 mx-1 border rounded ${
                        i === currentPage 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex justify-center items-center mt-12">
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
                Trước
            </button>
            {renderPageNumbers()}
            <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-1 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
                Sau
            </button>
        </div>
    );
};

export default Pagination;