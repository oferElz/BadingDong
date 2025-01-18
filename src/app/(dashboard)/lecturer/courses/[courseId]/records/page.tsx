"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation"; // Add useParams
import TableSearch from "@/components/TableSearch";
import Image from "next/image";

interface Student {
  id: string;
  name: string;
  status: "attended" | "missed";
}

export default function RecordsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  // Get courseId from params and type from searchParams
  const courseId = params.courseId as string;
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!courseId || !type) return;

      try {
        const dateParam = selectedDate ? `&date=${selectedDate}` : "";
        const response = await fetch(
          `/api/lecturers/records?courseId=${courseId}&type=${type}${dateParam}`
        );
        if (!response.ok) throw new Error("Failed to fetch records");
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAttendance();
  }, [courseId, type, selectedDate]);

  // Search functionality
  useEffect(() => {
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTermLower) ||
        student.id.toLowerCase().includes(searchTermLower) ||
        student.status.toLowerCase().includes(searchTermLower)
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const toggleAttendance = async (studentId: string, currentStatus: string) => {
    try {
      const attendanceDate =
        selectedDate || new Date().toISOString().split("T")[0];
      const newStatus = currentStatus === "attended" ? "missed" : "attended";

      const response = await fetch("/api/lecturers/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          type,
          studentId,
          date: attendanceDate,
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error("Failed to update attendance");

      // Update local state
      setStudents(
        students.map((student) =>
          student.id === studentId ? { ...student, status: newStatus } : student
        )
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleCreateRecords = async () => {
    const confirmCreate = window.confirm(
      "Are you sure you want to create records for today?"
    );
    if (!confirmCreate) return;

    try {
      const response = await fetch("/api/lecturers/records/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          type,
          date: new Date().toISOString().split("T")[0],
        }),
      });

      if (!response.ok) throw new Error("Failed to create records");
      const today = new Date().toISOString().split("T")[0];
      if (selectedDate === today) {
        setSelectedDate(""); // Clear it first
        setTimeout(() => setSelectedDate(today), 10); // Set it back after a tiny delay
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteRecords = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all records for today?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch("/api/lecturers/records/bulk", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          type,
          date: new Date().toISOString().split("T")[0],
        }),
      });

      if (!response.ok) throw new Error("Failed to delete records");
      // Optimistically update local state - clear records for today
      if (selectedDate === new Date().toISOString().split("T")[0]) {
        setStudents([]);
        setFilteredStudents([]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Attendance Records</h1>
          <p className="text-gray-600">
            {courseId} / {type}
          </p>
        </div>
        <div className="flex flex-col gap-3 items-end">
          <div className="flex items-center gap-2">
            <TableSearch value={searchTerm} onChange={setSearchTerm} />
            <Image
              src="/add.svg"
              alt="Create Records"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={handleCreateRecords}
            />
            <Image
              src="/trash.svg"
              alt="Delete Records"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={handleDeleteRecords}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filter by Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="border rounded px-3 py-2"
              max="9999-12-31"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleAttendance(student.id, student.status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      student.status === "attended"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {student.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "No matching records found"
              : `No records found ${
                  selectedDate ? "for the selected date" : ""
                }`}
          </div>
        )}
      </div>
    </div>
  );
}
