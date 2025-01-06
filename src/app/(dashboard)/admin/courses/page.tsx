"use client";
import { useState, useEffect } from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import FormModal from "@/components/FormModal";

type ClassItem = {
  _id: string; // MongoDB ObjectId as a string
  id: string; // Course code (e.g., "CS1010")
  name: string; // Course name (e.g., "Web Technologies")
};

export default function ClassListPage() {
  const [classList, setClassList] = useState<ClassItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const role = "admin";

  // Fetch courses from the API
  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      const data = await response.json();
      setClassList(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses(); // Initial fetch on component mount
  }, []);

  console.log("Fetched classes:", classList);

  // Filter courses based on search query
  const filteredData = classList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle creating a new course
  const handleCreate = async (newItem: Omit<ClassItem, "_id">) => {
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      console.log('new item', newItem)

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      await fetchCourses(); // Refresh the course list after creation
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  // Handle updating an existing course
  const handleUpdate = async (updatedItem: ClassItem) => {
    try {
      const response = await fetch("/api/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      await fetchCourses(); // Refresh the course list after update
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  // Handle deleting a course
  const handleDelete = async (_id: string) => {
    try {
      const response = await fetch("/api/courses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      console.log('_id', _id)

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      await fetchCourses(); // Refresh the course list after deletion
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Define table columns
  const columns = [
    { header: "Course Name", accessor: "name" },
    { header: "Course Code", accessor: "id", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  // Render each table row
  const renderRow = (item: ClassItem) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PurpleLight"
    >
      <td className="p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.id}</td>
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

  // Render the class list page
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
