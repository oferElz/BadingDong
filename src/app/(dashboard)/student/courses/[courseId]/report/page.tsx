"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import StatusComponent from "@/components/StatusComponent";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { useSession } from "next-auth/react";

// Dynamically import DonutChart and BarChart with SSR disabled
const DonutChart = dynamic(() => import("@/components/DonutChart"), { ssr: false });
const BarChart = dynamic(() => import("@/components/BarChart"), { ssr: false });

// Data structure representing each row in the attendance records table
type TableRow = {
  _id: string; // Unique identifier for the record
  date: string; // Date of the record
  type: string; // Type of class (Class, Tutorial, Lab)
  status: string; // Attendance status for that record (Attended, Missed)
};

export default function ReportPage({ params }: { params: { courseId: string } }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { courseId } = params;

  const [attendanceData, setAttendanceData] = useState<Record<string, [number, number]>>({
    default: [0, 0],
    class: [0, 0],
    tutorial: [0, 0],
    lab: [0, 0],
  });
  const [barChartData, setBarChartData] = useState<{ name: string; color: string; data: number[] }[]>([]);
  const [statusData, setStatusData] = useState<{ pending: number; approved: number; declined: number }>(
    { pending: 0, approved: 0, declined: 0 }
  );
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  // Define the columns for the attendance table
  const tableColumns = [
    { header: "Date", accessor: "date" },
    { header: "Type", accessor: "type" },
    { header: "Status", accessor: "status" },
  ];

  // Fetch attendance data, appeals, and records from the DB
  useEffect(() => {
    if (!userId || !courseId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/students/records?userId=${userId}&courseId=${courseId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        const data = await response.json();

        // Construct an object storing total attended/missed
        // for all course types together and for each type
        const newData: Record<string, [number, number]> = {
          default: [
            data.attendance.reduce((sum: number, item: { attended: number }) => sum + item.attended, 0),
            data.attendance.reduce((sum: number, item: { missed: number }) => sum + item.missed, 0),
          ],
          class: [
            data.attendance.find((item: any) => item.type === "Class")?.attended || 0,
            data.attendance.find((item: any) => item.type === "Class")?.missed || 0,
          ],
          tutorial: [
            data.attendance.find((item: any) => item.type === "Tutorial")?.attended || 0,
            data.attendance.find((item: any) => item.type === "Tutorial")?.missed || 0,
          ],
          lab: [
            data.attendance.find((item: any) => item.type === "Lab")?.attended || 0,
            data.attendance.find((item: any) => item.type === "Lab")?.missed || 0,
          ],
        };

        setAttendanceData(newData);

        // Prepare bar chart data from the newData object
        const barData = [
          {
            name: "Attended",
            color: "#31C48D",
            data: [
              newData.class[0],
              newData.tutorial[0],
              newData.lab[0],
            ],
          },
          {
            name: "Missed",
            color: "#F05252",
            data: [
              newData.class[1],
              newData.tutorial[1],
              newData.lab[1],
            ],
          },
        ];
        setBarChartData(barData);

        // Extract appeals data for pending, approved, and declined
        const status = {
          pending: data.appeals.pending || 0,
          approved: data.appeals.approved || 0,
          declined: data.appeals.declined || 0,
        };
        setStatusData(status);

        // Set the table data for the attendance records
        setTableData(data.records || []);
      } catch (err: any) {
        console.error("Error fetching attendance data:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, courseId]);

  // If the page is still loading data, display a loading message
  if (loading) {
    return <p className="p-6 text-gray-700 dark:text-gray-300">Loading...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500 dark:text-red-400">Error: {error}</p>;
  }

  // Filter the table records based on the user's search input
  const filteredData = tableData.filter(
    (row) =>
      row.date.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.type.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.status.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Render row in the table
  const renderRow = (item: TableRow) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 dark:border-gray-700 
        even:bg-slate-50 even:dark:bg-gray-800 
        text-sm 
        hover:bg-purple-100 dark:hover:bg-gray-700 
        text-gray-800 dark:text-gray-200"
    >
      <td className="px-4 py-2">{item.date}</td>
      <td className="px-4 py-2">{item.type}</td>
      <td className="px-4 py-2">{item.status}</td>
    </tr>
  );

  return (
    <div className="min-w-[300px] bg-white dark:bg-dark-container p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Course Report</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{courseId}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-dark-container p-3 rounded-md flex-1 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md font-semibold text-gray-800 dark:text-white">Course Records</h2>
          <div className="flex items-center gap-2 w-auto">
            <TableSearch value={searchValue} onChange={setSearchValue} />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto">
          <Table columns={tableColumns} renderRow={renderRow} data={filteredData} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="border rounded-md p-1 shadow-sm bg-white dark:bg-dark-container flex flex-col items-center">
          <DonutChart
            title="Attendance Percentage"
            data={attendanceData}
            colors={["#31C48D", "#F05252"]}
            labels={["Attended", "Missed"]}
            centerContent={{
              label: "Attendance",
              formatter: (series, seriesTotals) => {
                const total = seriesTotals.reduce((a, b) => a + b, 0);
                const attended = series[0] || 0;
                return total > 0 ? `${((attended / total) * 100).toFixed(1)}%` : "0%";
              },
            }}
          />
        </div>
        <div className="border rounded-md p-1 shadow-sm bg-white dark:bg-dark-container">
          <BarChart
            title="Attendance Overview"
            categories={["Class", "Tutorial", "Lab"]}
            data={barChartData}
          />
        </div>
        <div className="border rounded-md shadow-sm bg-white dark:bg-dark-container p-1">
          <StatusComponent
            title="Appeals Sent"
            statusCards={[
              { value: statusData.pending, label: "Pending", backgroundColor: "#FEF3C7", textColor: "#D97706" },
              { value: statusData.approved, label: "Approved", backgroundColor: "#D1FAE5", textColor: "#059669" },
              { value: statusData.declined, label: "Declined", backgroundColor: "#FEE2E2", textColor: "#B91C1C" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
