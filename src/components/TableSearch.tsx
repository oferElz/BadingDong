"use client";
import Image from "next/image";

// Define the props for the TableSearch component.
// value: Optional string representing the current search value.
// onChange: Optional callback function triggered when the search input changes.
type TableSearchProps = {
  value?: string;
  onChange?: (value: string) => void;
};

// TableSearch component renders a search input with an accompanying search icon.
const TableSearch = ({ value = "", onChange }: TableSearchProps) => {
  return (
    <div className="w-auto md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-[200px] p-2 bg-transparent outline-none text-black dark:text-white"
      />
    </div>
  );
};

export default TableSearch;
