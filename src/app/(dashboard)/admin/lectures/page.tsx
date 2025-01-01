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
  _id: string;
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

// Our columns, except for students — we'll handle that as a custom cell
const columns = [
  { header: "Course ID", accessor: "course_id" },
  { header: "Type", accessor: "type" },
  { header: "Day of Week", accessor: "day_of_week" },
  { header: "Start Time", accessor: "start_time" },
  { header: "End Time", accessor: "end_time" },
  { header: "Lecturer", accessor: "lecturer_id" },
  {
    header: "Students",
    accessor: "students_ids", // We'll render a custom cell for this
  },
];

export default function LecturesPage() {
  const [lectures, setLectures] = useState<LectureDoc[]>([]);
  const [expandedLecture, setExpandedLecture] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 1) FETCH LECTURES FROM /api/lectures ON MOUNT
  useEffect(() => {
    fetch("/api/lectures")
      .then((res) => res.json())
      .then((data) => {
        setLectures(data);
      })
      .catch((err) => console.error("Error fetching lectures:", err));
  }, []);

  // 2) TOGGLE FOR EXPANDING STUDENT IDS
  const toggleExpand = (lectureId: string) => {
    setExpandedLecture((prev) => (prev === lectureId ? null : lectureId));
  };
  
  const filteredData = lectures.filter((item) => {
    return (
      item.course_id.toString().includes(searchQuery) ||
      item.type.includes(searchQuery) ||
      item.start_time.includes(searchQuery) ||
      item.end_time.includes(searchQuery) ||
      item.lecturer_details.name.includes(searchQuery) ||
      item.lecturer_details.id.includes(searchQuery) ||
      item.day_of_week.includes(searchQuery) ||
      item.students_details.some(
        (student) =>
          student.name.includes(searchQuery) || student.id.includes(searchQuery)
      )
    );
  });
  // 3) RENDER EACH TABLE ROW
  const renderRow = (item: LectureDoc) => {
    const isExpanded = expandedLecture === item._id;
    const arrowSrc = isExpanded ? "/arrow-right.svg" : "/arrow-down.svg";
    const buttonText = isExpanded ? "Hide" : "Show";
    
    return (
      <tr
        key={item._id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
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
        {/* Students Column: arrow toggle */}
        <td>
          <button
            onClick={() => toggleExpand(item._id)}
            className="flex items-center gap-1"
          >
            <Image src={arrowSrc} alt="Expand" width={14} height={14} />
            <span>{buttonText}</span>
          </button>
  
          {isExpanded && (
            <div className="mt-2 p-2 rounded-md w-full overflow-x-hidden">
              <ul className="list-disc list-inside">
                {item.students_details.map((student) => (
                  <li key={student.id} className="text-xs">
                    {student.name} ({student.id})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </td>
        <td>
        <div className="flex items-center gap-2">
          {(
            <>
              <FormModal table="class" type="update" data={item} />
              <FormModal table="class" type="delete" id={parseInt(item._id)} />
            </>
          )}
        </div>
      </td>
      </tr>
    );
  };
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Lectures</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch value={searchQuery} onChange={setSearchQuery} />
          <div className="flex items-center gap-4 self-end">
            {<FormModal table="class" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={filteredData} />
    </div>
  );
};