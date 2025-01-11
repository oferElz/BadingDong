"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation"; // Add useParams

interface Student {
  id: string;
  name: string;
  status: "attended" | "missed";
}

export default function RecordsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const searchParams = useSearchParams();
  const params = useParams(); // Add this
  const router = useRouter();

  // Get courseId from params and type from searchParams
  const courseId = params.courseId as string; // Changed this line
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!courseId || !type) return; // Add this check

      try {
        const dateParam = selectedDate ? `&date=${selectedDate}` : "";
        const response = await fetch(
          `/api/lecturers/records?courseId=${courseId}&type=${type}${dateParam}`
        );
        if (!response.ok) throw new Error("Failed to fetch records");
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAttendance();
  }, [courseId, type, selectedDate]);

  const toggleAttendance = async (studentId: string, currentStatus: string) => {
    try {
      // Ensure we have a date when toggling attendance
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
    // If date is cleared (empty string), it will show all records
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
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter by Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="border rounded px-3 py-2"
            max="9999-12-31"
          />
          {selectedDate && (
            <button
              onClick={() => handleDateChange("")}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filter
            </button>
          )}
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
            {students.map((student) => (
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
        {students.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No records found {selectedDate && "for the selected date"}
          </div>
        )}
      </div>
    </div>
  );
}
