import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    const newParams = new URLSearchParams(searchParams); // Tạo bản sao
    
    if (sortValue) {
        newParams.set('sort', sortValue); // Sửa 'sortBy' thành 'sort'
    } else {
        newParams.delete('sort'); // Xóa param nếu chọn 'Default'
    }
    
    // Khi sắp xếp, nên quay về trang 1
    newParams.delete('page'); 
    
    setSearchParams(newParams);
  }

  return (
    <div className='mb-4 flex items-center justify-end'>
      <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">Sắp xếp theo:</label>
      <select 
       id="sort"
       onChange={handleSortChange}
       value={searchParams.get('sort') || ''} // Sửa 'sortBy' thành 'sort'
       className='border p-2 rounded-md focus:outline-none bg-white'
      >
        <option value="">Mặc định (Mới nhất)</option>
        <option value="priceAsc">Giá: Thấp đến Cao</option>
        <option value="priceDesc">Giá: Cao đến Thấp</option>
        {/* <option value="popularity">Popularity</option> (Bị loại bỏ vì backend chưa hỗ trợ) */}
      </select>
    </div>
  )
}

export default SortOptions;