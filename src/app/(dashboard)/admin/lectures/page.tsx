"use client";
import FormModal from "@/components/FormModal";
import { useState, useEffect } from "react";
import Table from "@/components/Table";
import Image from "next/image";
import TableSearch from "@/components/TableSearch";

type UserDetails = {
  id: string;
  name: string;
};

type LectureDoc = {
  _id: string; // Changed to string after transformation
  course_id: string;
  type: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  lecturer_id: string;
  lecturer_details: UserDetails;
  students_ids: string[];
  students_details: UserDetails[];
};

// Define table columns
const columns = [
  { header: "Course ID", accessor: "course_id" },
  { header: "Type", accessor: "type" },
  { header: "Day of Week", accessor: "day_of_week" },
  { header: "Start Time", accessor: "start_time" },
  { header: "End Time", accessor: "end_time" },
  { header: "Lecturer", accessor: "lecturer_id" },
  { header: "Students", accessor: "students_ids" },
];

export default function LecturesPage() {
  const [lectures, setLectures] = useState<LectureDoc[]>([]);
  const [expandedLecture, setExpandedLecture] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch lectures from API and transform _id
  const fetchLectures = async () => {
    try {
      const response = await fetch("/api/lectures");
      if (!response.ok) {
        throw new Error("Failed to fetch lectures");
      }
      const data: any[] = await response.json();

      // Transform _id from { $oid: string } to string
      const transformedData: LectureDoc[] = data.map((lecture) => ({
        ...lecture,
        _id: typeof lecture._id === "string" ? lecture._id : lecture._id.$oid,
      }));

      setLectures(transformedData);
    } catch (error) {
      console.error("Error fetching lectures:", error);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  // Handle lecture creation
  const handleCreate = async (
    newLecture: Omit<LectureDoc, "_id" | "lecturer_details" | "students_details">
  ) => {
    try {
      const response = await fetch("/api/lectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLecture),
      });

      if (!response.ok) {
        throw new Error("Failed to create lecture");
      }

      await fetchLectures();
    } catch (error) {
      console.error("Error creating lecture:", error);
    }
  };

  // Handle lecture update
  const handleUpdate = async (
    updatedLecture: Omit<LectureDoc, "lecturer_details" | "students_details">
  ) => {
    try {
      const response = await fetch("/api/lectures", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLecture),
      });

      if (!response.ok) {
        throw new Error("Failed to update lecture");
      }

      await fetchLectures();
    } catch (error) {
      console.error("Error updating lecture:", error);
    }
  };

  // Handle lecture deletion
  const handleDelete = async (_id: string) => {
    try {
      const response = await fetch("/api/lectures", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete lecture");
      }

      await fetchLectures();
    } catch (error) {
      console.error("Error deleting lecture:", error);
    }
  };

  // Toggle lecture expansion to show/hide student details
  const toggleExpand = (lectureId: string) => {
    setExpandedLecture((prev) => (prev === lectureId ? null : lectureId));
  };

  // Filter lectures based on search query
  const filteredData = lectures.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.course_id?.toLowerCase().includes(query) ||
      item.type?.toLowerCase().includes(query) ||
      item.start_time?.toLowerCase().includes(query) ||
      item.end_time?.toLowerCase().includes(query) ||
      item.lecturer_details?.name.toLowerCase().includes(query) ||
      item.lecturer_details?.id.toLowerCase().includes(query) ||
      item.day_of_week?.toLowerCase().includes(query) ||
      item.students_details?.some(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.id.toLowerCase().includes(query)
      )
    );
  });

  // Render each table row
  const renderRow = (item: LectureDoc) => {
    const isExpanded = expandedLecture === item._id;
    const arrowSrc = isExpanded ? "/arrow-right.svg" : "/arrow-down.svg";
    const buttonText = isExpanded ? "Hide" : "Show";

    return (
      <tr
        key={item._id}
        className="border-b border-gray-200 dark:border-gray-700 even:bg-slate-50 even:dark:bg-grey-background text-sm hover:bg-PurpleLight dark:hover:bg-dark-PurpleLight dark:text-dark-text"
      >
        <td className="p-4">{item.course_id}</td>
        <td>{item.type}</td>
        <td>{item.day_of_week}</td>
        <td>{item.start_time}</td>
        <td>{item.end_time}</td>
        <td>
          {item.lecturer_details
            ? `${item.lecturer_details.name} (${item.lecturer_details.id})`
            : item.lecturer_id}
        </td>
        <td>
          {/* Show/Hide Button */}
          <button
            onClick={() => toggleExpand(item._id)}
            className="flex items-center gap-1"
          >
            <Image src={arrowSrc} alt="Expand" width={14} height={14} className="dark:invert" />
            <span>{buttonText}</span>
          </button>

          {/* Expanded Student Details */}
          {isExpanded && (
            <div className="mt-2 p-2 rounded-md w-full overflow-x-hidden">
              <ul className="list-disc list-inside">
                {item.students_details.length > 0 ? (
                  item.students_details.map((student) => (
                    <li key={student.id} className="text-xs">
                      {student.name} ({student.id})
                    </li>
                  ))
                ) : (
                  <li className="text-xs">No students available.</li>
                )}
              </ul>
            </div>
          )}
        </td>
        <td>
          <div className="flex items-center gap-2">
            {/* Update Lecture Modal */}
            <FormModal
              model="lectures"
              mode="update"
              item={item}
              onUpdate={handleUpdate}
            />
            {/* Delete Lecture Modal */}
            <FormModal
              model="lectures"
              mode="delete"
              item={item}
              onDelete={handleDelete}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white dark:bg-dark-container p-4 rounded-md flex-1 m-4 mt-0">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold dark:text-dark-text">Lectures</h1>
        <div className="flex items-center gap-4 w-auto md:w-auto flex-nowrap">
          <TableSearch value={searchQuery} onChange={setSearchQuery} />
          <div className="flex items-center gap-4 self-end">
            {/* Create Lecture Modal */}
            <FormModal model="lectures" mode="create" onCreate={handleCreate} />
          </div>
        </div>
      </div>
      {/* Lectures Table */}
      <Table columns={columns} renderRow={renderRow} data={filteredData} />
    </div>
  );
}
//check