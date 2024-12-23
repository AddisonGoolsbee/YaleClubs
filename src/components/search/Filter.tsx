import React, { useState, useRef, useEffect } from "react";

interface FilterProps {
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  allItems: string[];
  label: string;
}

const Filter = ({ selectedItems, setSelectedItems, allItems, label }: FilterProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableItems = allItems.filter((item) => !selectedItems.includes(item));

  const handleAddItem = (item: string) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const handleRemoveItem = (item: string) => {
    setSelectedItems((prev) => prev.filter((selected) => selected !== item));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="border px-4 py-2 rounded cursor-pointer w-80 sm:w-60 max-w-full flex items-center justify-between h-9 md:h-11"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <div className="flex items-center overflow-x-auto min-w-0 space-x-2">
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <div
                key={item}
                className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center space-x-1 flex-shrink-0 justify-between"
              >
                <span className="truncate">{item}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item);
                  }}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  &#x2715;
                </button>
              </div>
            ))
          ) : (
            <span className="text-gray-600">{label}</span>
          )}
        </div>
        <span className="ml-2">&#x25BC;</span>
      </div>
      {showDropdown && (
        <div className="absolute mt-2 w-72 max-w-full bg-white border rounded shadow-lg z-10">
          <div className="flex flex-col p-2 gap-2 max-h-72 overflow-y-auto">
            {availableItems.length > 0 ? (
              availableItems.map((item) => (
                <div
                  key={item}
                  className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded"
                  onClick={() => handleAddItem(item)}
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="text-gray-600 px-4 py-2">No more {label.toLowerCase()} available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
