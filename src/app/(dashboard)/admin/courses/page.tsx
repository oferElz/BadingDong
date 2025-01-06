"use client";
import { useState } from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import FormModal from "@/components/FormModal";

type ClassItem = {
  id: number;
  name: string;
  code: number;
  teachers: string[];
};

const initialData: ClassItem[] = [
  { id: 1, name: "1A", code: 1234, teachers: ["Harriet Alvarado", "Mayme Keller"] },
  { id: 2, name: "2B", code: 1234, teachers: ["Harriet Alvarado", "Mayme Keller"] },
  { id: 3, name: "3C", code: 1234, teachers: ["Harriet Alvarado", "Mayme Keller"] },
];

export default function ClassListPage() {
  const [classList, setClassList] = useState<ClassItem[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const role = "admin"; 

  const filteredData = classList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teachers.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.code.toString().includes(searchQuery)
  );

  const handleCreate = (newItem: Omit<ClassItem, "id">) => {
    const newId = classList.length ? Math.max(...classList.map((c) => c.id)) + 1 : 1;
    setClassList([...classList, { ...newItem, id: newId }]);
  };

  const handleUpdate = (updatedItem: ClassItem) => {
    setClassList((prev) =>
      prev.map((c) => (c.id === updatedItem.id ? updatedItem : c))
    );
  };

  const handleDelete = (id: number) => {
    setClassList((prev) => prev.filter((c) => c.id !== id));
  };

  const columns = [
    { header: "Class Name", accessor: "name" },
    { header: "Course Code", accessor: "code", className: "hidden md:table-cell" },
    { header: "Teachers", accessor: "teachers", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: ClassItem) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PurpleLight"
    >
      <td className="p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.code}</td>
      <td className="hidden md:table-cell">{item.teachers.join(", ")}</td>
      <td>
        {role === "admin" && (
          <div className="flex items-center gap-2">
            <FormModal model="courses" mode="update" item={item} onUpdate={handleUpdate} />
            <FormModal model="courses" mode="delete" item={item} onDelete={handleDelete} />
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch value={searchQuery} onChange={setSearchQuery} />
          {role === "admin" && <FormModal model="courses" mode="create" onCreate={handleCreate} />}
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={filteredData} />
    </div>
  );
}
