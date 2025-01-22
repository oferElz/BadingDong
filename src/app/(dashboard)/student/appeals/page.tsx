"use client"
import { useEffect, useState } from "react"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import Image from "next/image"
import { useSession } from "next-auth/react"
import StudentAppealForm from "./StudentAppealForm"

type MissedRecord = {
  _id: string
  course_id: string
  type: string
  day_of_week: string
  start_time: string
  date: string
  lecturer_id: string
  status: string
  isAppealed: boolean
}

export default function StudentAppealsPage() {
  const [records, setRecords] = useState<MissedRecord[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<MissedRecord | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { data: session } = useSession()

  const fetchRecords = async () => {
    if (!session?.user?.id) return
    try {
      const res = await fetch(`/api/students/appeals?studentId=${session.user.id}`)
      if (!res.ok) throw new Error("Failed to fetch missed records")
      const data = await res.json()
      setRecords(data)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [session?.user?.id])

  const filteredData = records.filter(rec => {
    const combined = `${rec.course_id} ${rec.type} ${rec.day_of_week} ${rec.start_time} ${rec.date}`
    return combined.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Course", accessor: "course_id" },
    { header: "Type", accessor: "type" },
    { header: "Time", accessor: "start_time" },
    { header: "Day", accessor: "day_of_week" },
    { header: "Actions", accessor: "action" },
  ]

  const renderRow = (item: MissedRecord) => (
    <tr key={item._id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PurpleLight">
      <td className="p-4">{item.date?.slice(0,10)}</td>
      <td>{item.course_id}</td>
      <td>{item.type}</td>
      <td>{item.start_time}</td>
      <td>{item.day_of_week}</td>
      <td>
        {item.isAppealed ? (
          <span className="text-gray-400 text-xs">Already Appealed</span>
        ) : (
          <button
            onClick={() => {
              setSelectedRecord(item)
              setShowForm(true)
            }}
            className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 text-xs"
          >
            Appeal
          </button>
        )}
      </td>
    </tr>
  )

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Appealable Records</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={filteredData} />
      {showForm && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[60%] lg:w-[40%]">
            <StudentAppealForm
              record={selectedRecord}
              onClose={() => {
                setShowForm(false)
                setSelectedRecord(null)
              }}
              onSuccess={() => {
                setShowForm(false)
                setSelectedRecord(null)
                fetchRecords()
              }}
            />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => {
                setShowForm(false)
                setSelectedRecord(null)
              }}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
