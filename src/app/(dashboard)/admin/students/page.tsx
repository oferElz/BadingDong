"use client"
import { useState, useEffect } from "react"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import FormModal from "@/components/FormModal"
import { useSession } from "next-auth/react"

type Student = {
  _id: string
  first_name: string
  last_name: string
  username: string
  id: string
  role: string
}

export default function StudentListPage() {
  const [studentsData, setStudentsData] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const role = "admin"
  const { data: session } = useSession()

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students")
        if (!response.ok) throw new Error("Failed to fetch students")
        const data = await response.json()
        setStudentsData(data)
      } catch (error) {
        console.error("Error fetching students:", error)
      }
    }
    fetchStudents()
  }, [])

  const filteredData = studentsData.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleCreate = async (newStudent: Omit<Student, "_id">) => {
    if (studentsData.find(i => i.id.toLowerCase() === newStudent.id.toLowerCase())) {
      alert("A student with this ID already exists.")
      return
    }
    if (studentsData.find(i => i.username.toLowerCase() === newStudent.username.toLowerCase())) {
      alert("A student with this username already exists.")
      return
    }
    try {
      const response = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      })
      if (!response.ok) throw new Error("Failed to create student")
      const updatedStudents = await fetch("/api/students").then(res => res.json())
      setStudentsData(updatedStudents)
    } catch (error) {
      console.error("Error creating student:", error)
    }
  }

  const handleUpdate = async (updatedStudent: Student) => {
    const conflictId = studentsData.find(
      i =>
        i._id !== updatedStudent._id &&
        i.id.toLowerCase() === updatedStudent.id.toLowerCase()
    )
    if (conflictId) {
      alert("A student with this ID already exists.")
      return
    }
    const conflictUsername = studentsData.find(
      i =>
        i._id !== updatedStudent._id &&
        i.username.toLowerCase() === updatedStudent.username.toLowerCase()
    )
    if (conflictUsername) {
      alert("A student with this username already exists.")
      return
    }
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent),
      })
      if (!response.ok) throw new Error("Failed to update student")
      const updatedStudents = await fetch("/api/students").then(res => res.json())
      setStudentsData(updatedStudents)
    } catch (error) {
      console.error("Error updating student:", error)
    }
  }

  const handleDelete = async (_id: string) => {
    try {
      const response = await fetch("/api/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      })
      if (!response.ok) throw new Error("Failed to delete student")
      const updatedStudents = await fetch("/api/students").then(res => res.json())
      setStudentsData(updatedStudents)
    } catch (error) {
      console.error("Error deleting student:", error)
    }
  }

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Username", accessor: "username" },
    { header: "Student ID", accessor: "id" },
    { header: "Actions", accessor: "action" },
  ]

  const renderRow = (item: Student) => (
    <tr key={item._id} className="border-b border-gray-200 dark:border-gray-700 even:bg-slate-50 even:dark:bg-grey-background text-sm hover:bg-PurpleLight dark:hover:bg-dark-PurpleLight dark:text-dark-text">
      <td className="p-4">{`${item.first_name} ${item.last_name}`}</td>
      <td>{item.username}</td>
      <td>{item.id}</td>
      <td>
        {role === "admin" && (
          <div className="flex items-center gap-2">
            <FormModal model="students" mode="update" item={item} onUpdate={handleUpdate} />
            <FormModal model="students" mode="delete" item={item} onDelete={handleDelete} />
          </div>
        )}
      </td>
    </tr>
  )

  return (
    <div className="bg-white dark:bg-dark-container p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold dark:text-dark-text">All Students</h1>
        <div className="flex items-center gap-4 w-auto md:w-auto flex-nowrap">
          <TableSearch value={searchQuery} onChange={setSearchQuery} />
          {role === "admin" && <FormModal model="students" mode="create" onCreate={handleCreate} />}
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={filteredData} />
    </div>
  )
}
