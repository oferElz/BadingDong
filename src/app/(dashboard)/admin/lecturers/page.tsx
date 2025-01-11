"use client";
import { useState, useEffect } from "react";
import FormModal from "@/components/FormModal";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";

type Lecturer = {
  _id: string;
  lecturer_id: string;
  name: string;
  username: string;
  courses: string[];
};

const columns = [
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Lecturer ID",
    accessor: "lecturer_id",
    className: "hidden md:table-cell",
  },
  {
    header: "Courses",
    accessor: "courses",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "text-center pl-8",
  },
];

const LecturersList = () => {
  const [lecturersData, setLecturersData] = useState<Lecturer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const response = await fetch("/api/lecturers");
        if (!response.ok) {
          throw new Error(`Failed to fetch lecturers: ${response.status}`);
        }
        const data = await response.json();
        setLecturersData(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredData = lecturersData.filter((lecturer) => {
    return (
      lecturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecturer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecturer.lecturer_id.includes(searchQuery) ||
      (lecturer.courses.length === 0 &&
        "none".includes(searchQuery.toLowerCase())) ||
      lecturer.courses.some((course) =>
        course.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  const renderRow = (item: Lecturer) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.username}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.lecturer_id}</td>
      <td className="hidden md:table-cell pr-4">
        {item.courses.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {item.courses.map((course, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
              >
                {course}
              </span>
            ))}
          </div>
        ) : (
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            None
          </span>
        )}
      </td>
      <td className="pl-8 text-center">
        <div className="flex items-center gap-2 justify-center">
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-Sky">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
          {role === "admin" && (
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-Purple">
              <Image src="/delete.png" alt="" width={16} height={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Lecturers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch value={searchQuery} onChange={setSearchQuery} />
          <div className="flex items-center gap-4 self-end">
            {role === "admin" && <FormModal table="lecturer" type="create" />}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={filteredData} />
    </div>
  );
};

export default LecturersList;
