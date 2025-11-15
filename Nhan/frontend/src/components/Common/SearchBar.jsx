import { useState } from "react";
import React from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
// import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    setSearchTerm(""); 
  };

  const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Điều hướng đến trang shop với query
            navigate(`/shop?keyword=${encodeURIComponent(searchTerm.trim())}`);
            setIsOpen(false); // Đóng thanh search sau khi tìm
        }
    };
  return (
    <div
      className={`flex items-center justify-center transition-all duration-300 ease-in-out ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-200 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
            />
            {/* search icons */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>
          {/* close button  */}
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={handleSearchToggle}
          >
            <HiMiniXMark className="h-6 w-6 text-gray-800" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6 text-gray-800" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
