"use client"
import { useState, useEffect } from "react"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import FormModal from "@/components/FormModal"

type ClassItem = {
  _id: string
  id: string
  name: string
}

export default function ClassListPage() {
  const [classList, setClassList] = useState<ClassItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const role = "admin"

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses")
      const data = await response.json()
      setClassList(data)
    } catch (error) {
      console.error("Error fetching courses:", error)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const filteredData = classList.filter(
    item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = async (newItem: Omit<ClassItem, "_id">) => {
    const exists = classList.find(i => i.id.toLowerCase() === newItem.id.toLowerCase())
    if (exists) {
      alert("A course with this code already exists.")
      return
    }
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
      if (!response.ok) throw new Error("Failed to create course")
      await fetchCourses()
    } catch (error) {
      console.error("Error creating course:", error)
    }
  }

  const handleUpdate = async (updatedItem: ClassItem) => {
    const conflict = classList.find(
      i => i._id !== updatedItem._id && i.id.toLowerCase() === updatedItem.id.toLowerCase()
    )
    if (conflict) {
      alert("A course with this code already exists.")
      return
    }
    try {
      const response = await fetch("/api/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      })
      if (!response.ok) throw new Error("Failed to update course")
      await fetchCourses()
    } catch (error) {
      console.error("Error updating course:", error)
    }
  }

  const handleDelete = async (_id: string) => {
    try {
      const response = await fetch("/api/courses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      })
      if (!response.ok) throw new Error("Failed to delete course")
      await fetchCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  const columns = [
    { header: "Course Name", accessor: "name" },
    { header: "Course Code", accessor: "id" },
    { header: "Actions", accessor: "action" },
  ]

  const renderRow = (item: ClassItem) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 dark:border-gray-700 even:bg-slate-50 even:dark:bg-grey-background text-sm hover:bg-PurpleLight dark:hover:bg-dark-PurpleLight dark:text-dark-text"
    >
      <td className="px-4 py-2">{item.name}</td>
      <td className="px-4 py-2">{item.id}</td>
      <td className="px-4 py-2">
        {role === "admin" && (
          <div className="flex items-center gap-2">
            <FormModal
              model="courses"
              mode="update"
              item={item}
              onUpdate={handleUpdate}
            />
            <FormModal
              model="courses"
              mode="delete"
              item={item}
              onDelete={handleDelete}
            />
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <div className="min-w-[400px] bg-white dark:bg-dark-container p-4 rounded-md m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold dark:text-dark-text">All Courses</h1>
        <div className="flex items-center gap-4 w-auto md:w-auto flex-nowrap">
          <TableSearch value={searchQuery} onChange={setSearchQuery} />
          {role === "admin" && <FormModal model="courses" mode="create" onCreate={handleCreate} />}
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={filteredData} />
    </div>
  )
}
