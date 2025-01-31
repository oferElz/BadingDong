"use client";
import { useState, useEffect } from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { useSession } from "next-auth/react";

// Type definition for an appeal object
type Appeal = {
  _id: string; // Unique identifier for the appeal
  lecture_date: string; // Date of the lecture the appeal is related to
  lecture_time: string; // Time of the lecture
  lecture_type: string; // Type of lecture (class, tutorial, lab)
  lecturer: string; // Lecturer's ID
  appeal_date: string; // Date when the appeal was submitted
  student_id: string; // ID of the student who submitted the appeal
  appeal_reason: string; // Reason provided by the student for appealing
  status: string; // Status of the appeal (Pending, Approved, Declined)
};

export default function LecturerAppealsPage() {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();

  // Fetch appeals from the DB, filtering by 'Pending' status 
  // and matching the current lecturer's ID from the session
  const fetchAppeals = async () => {
    try {
      const response = await fetch(
        `/api/lecturers/appeals?status=Pending&lecturerId=${session?.user?.id}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch appeals");
      const data = await response.json();
      setAppeals(data);
    } catch (error) {
      console.error("Error fetching appeals:", error);
    }
  };

  // fetch or Re-fetch appeals
  useEffect(() => {
    fetchAppeals();
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [session?.user?.id]);


  // Handle approving or declining an appeal
  const handleAction = async (
    appealId: string,
    newStatus: "Approved" | "Declined"
  ) => {
    try {
      const response = await fetch("/api/lecturers/appeals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: appealId, status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update appeal");
      await fetchAppeals(); // Refresh appeals list to reflect changes
    } catch (error) {
      console.error("Error updating appeal:", error);
    }
  };

  // Filter appeals based on the user's search query
  const filteredData = appeals.filter((item) => {
    const combined = `${item.lecture_date} ${item.lecture_time} ${item.lecture_type} ${item.student_id} ${item.appeal_reason}`;
    return combined.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Define columns for rendering the table headers
  const columns = [
    { header: "Lecture Date", accessor: "lecture_date" },
    { header: "Lecture Time", accessor: "lecture_time" },
    { header: "Lecture Type", accessor: "lecture_type" },
    { header: "Student ID", accessor: "student_id" },
    { header: "Appeal Reason", accessor: "appeal_reason" },
    { header: "Actions", accessor: "action" },
  ];

  // Render each row of the table, including buttons to approve or decline
  const renderRow = (item: Appeal) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 dark:border-gray-700 even:bg-slate-50 even:dark:bg-grey-background text-sm hover:bg-PurpleLight dark:hover:bg-dark-PurpleLight dark:text-dark-text"
    >
      <td className="px-4 py-2">{item.lecture_date}</td>
      <td className="px-4 py-2">{item.lecture_time}</td>
      <td className="px-4 py-2">{item.lecture_type}</td>
      <td className="px-4 py-2">{item.student_id}</td>
      <td className="px-4 py-2 align-top">
        <div
          className="bg-transparent:bg-dark-transparent p-2 leading-relaxed rounded-md text-sm text-black dark:text-white 
            whitespace-pre-wrap break-words overflow-y-auto max-w-lg"
          style={{ maxHeight: "150px" }}
        >
          {item.appeal_reason}
        </div>
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            className="bg-green-500 text-white py-1 px-2 rounded"
            onClick={() => handleAction(item._id, "Approved")}
          >
            Approve
          </button>
          <button
            className="bg-red-500 text-white py-1 px-2 rounded"
            onClick={() => handleAction(item._id, "Declined")}
          >
            Decline
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-w-[350px] bg-white dark:bg-dark-container p-4 rounded-md m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold dark:text-dark-text">
          Pending Appeals
        </h1>
        <div className="flex items-center gap-4 w-auto md:w-auto flex-nowrap">
          <TableSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={filteredData} />
    </div>
  );
}
