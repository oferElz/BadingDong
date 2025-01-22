"use client"
import { useState, useEffect } from "react"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import FormModal from "@/components/FormModal"
import { useSession } from "next-auth/react"

type Lecturer = {
  _id: string
  first_name: string
  last_name: string
  username: string
  id?: string
  courses: string[]
}

export default function LecturersList() {
  const [lecturersData, setLecturersData] = useState<Lecturer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [role, setRole] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.role) setRole(session.user.role)
  }, [session])

  const fetchLecturers = async () => {
    try {
      const response = await fetch("/api/lecturers")
      if (!response.ok) throw new Error("Failed to fetch lecturers")
      const data = await response.json()
      setLecturersData(data)
    } catch (error) {
      console.error("Error fetching lecturers:", error)
    }
  }

  useEffect(() => {
    fetchLecturers()
  }, [])

  const handleCreate = async (newLecturer: Omit<Lecturer, "_id">) => {
    if (lecturersData.find(i => i.id?.toLowerCase() === newLecturer.id?.toLowerCase())) {
      alert("A lecturer with this ID already exists.")
      return
    }
    if (lecturersData.find(i => i.username.toLowerCase() === newLecturer.username.toLowerCase())) {
      alert("A lecturer with this username already exists.")
      return
    }
    try {
      const response = await fetch("/api/lecturers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLecturer),
      })
      if (!response.ok) throw new Error("Failed to create lecturer")
      await fetchLecturers()
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error("Error creating lecturer:", error)
    }
  }

  const handleUpdate = async (updatedLecturer: Lecturer) => {
    const conflictId = lecturersData.find(
      i =>
        i._id !== updatedLecturer._id &&
        i.id?.toLowerCase() === updatedLecturer.id?.toLowerCase()
    )
    if (conflictId) {
      alert("A lecturer with this ID already exists.")
      return
    }
    const conflictUsername = lecturersData.find(
      i =>
        i._id !== updatedLecturer._id &&
        i.username.toLowerCase() === updatedLecturer.username.toLowerCase()
    )
    if (conflictUsername) {
      alert("A lecturer with this username already exists.")
      return
    }
    try {
      const response = await fetch("/api/lecturers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLecturer),
      })
      if (!response.ok) throw new Error("Failed to update lecturer")
      await fetchLecturers()
    } catch (error) {
      console.error("Error updating lecturer:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/lecturers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      })
      if (!response.ok) throw new Error("Failed to delete lecturer")
      await fetchLecturers()
    } catch (error) {
      console.error("Error deleting lecturer:", error)
    }
  }

  const filteredData = lecturersData.filter(l => {
    const fullName = `${l.first_name} ${l.last_name}`
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Username", accessor: "username" },
    { header: "Courses", accessor: "courses" },
    { header: "Actions", accessor: "action" },
  ]

  const renderRow = (item: Lecturer) => (
    <tr key={item._id} className="border-b border-gray-200 dark:border-gray-700 even:bg-slate-50 even:dark:bg-grey-background text-sm hover:bg-PurpleLight dark:hover:bg-dark-PurpleLight dark:text-dark-text">
      <td className="p-4">{`${item.first_name} ${item.last_name}`}</td>
      <td>{item.username}</td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {item.courses.length > 0 ? (
            item.courses.map((course, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-200"
              >
                {course}
              </span>
            ))
          ) : (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-200">
              No Courses
            </span>
          )}
        </div>
      </td>
      <td>
        {role === "admin" && (
          <div className="flex items-center gap-2">
            <FormModal model="lecturers" mode="update" item={item} onUpdate={handleUpdate} />
            <FormModal model="lecturers" mode="delete" item={item} onDelete={handleDelete} />
          </div>
        )}
      </td>
    </tr>
  )

  return (
    <div className="bg-white dark:bg-dark-container p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold dark:text-dark-text">All Lecturers</h1>
        <div className="flex items-center gap-4 w-auto md:w-auto flex-nowrap">
          <TableSearch value={searchQuery} onChange={setSearchQuery} />
          {role === "admin" && (
            <FormModal model="lecturers" mode="create" onCreate={handleCreate} />
          )}
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={filteredData} />
    </div>
  )
}