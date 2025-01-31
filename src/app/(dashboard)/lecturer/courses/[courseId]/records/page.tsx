"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";

// Interface defining the shape of a student object
interface Student {
  id: string; // Unique identifier for the student
  name: string; // Student's full name
  status: "attended" | "missed"; // Attendance status
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

  // Fetch attendance records from the server based on the selected date,
  // the current courseId, and the class type
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

  // Filter the students whenever searchTerm changes
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

  // Toggle a student's attendance status between 'attended' and 'missed'
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
      setStudents((prev) =>
        prev.map((student) =>
          student.id === studentId ? { ...student, status: newStatus } : student
        )
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handler to update the date used for fetching records
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  // Create attendance records for the current date
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

      // If today's date is the selected one, force refetch
      const today = new Date().toISOString().split("T")[0];
      if (selectedDate === today) {
        setSelectedDate(""); // Clear first
        setTimeout(() => setSelectedDate(today), 10); // Re-set after a tiny delay
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Delete attendance records for the current date
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

      // Clear records for today if today's date is selected
      if (selectedDate === new Date().toISOString().split("T")[0]) {
        setStudents([]);
        setFilteredStudents([]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-w-[650px] bg-white dark:bg-dark-container text-black dark:text-dark-text p-6 rounded-md m-4">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Attendance Records</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {courseId} / {type}
          </p>
        </div>
        <div className="flex flex-col gap-3 items-end">
          {/* Top Right Icons + Search */}
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
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium dark:text-gray-300">
              Filter by Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="border dark:border-gray-700 dark:bg-dark-surface rounded px-3 py-2 text-sm"
              max="9999-12-31"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-grey-background rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            {/* Table Head Row in Light & Dark */}
            <tr className="bg-gray-50 dark:bg-dark-surface">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Attendance Toggle Button */}
                  <button
                    onClick={() => toggleAttendance(student.id, student.status)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium
                      transition-colors
                      ${
                        student.status === "attended"
                          ? // Light-mode attended
                            "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700"
                          : // Light-mode missed
                            "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700"
                      }
                    `}
                  >
                    {student.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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