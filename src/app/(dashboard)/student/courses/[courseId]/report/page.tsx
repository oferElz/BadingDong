"use client";
import React, { useEffect, useState } from "react";
import DonutChart from "@/components/DonutChart";
import BarChart from "@/components/BarChart";
import StatusComponent from "@/components/StatusComponent";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { useSession } from "next-auth/react";

type TableRow = {
  _id: string;
  date: string;
  type: string;
  status: string;
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

  const tableColumns = [
    { header: "Date", accessor: "date" },
    { header: "Type", accessor: "type" },
    { header: "Status", accessor: "status" },
  ];

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

        const status = {
          pending: data.appeals.pending || 0,
          approved: data.appeals.approved || 0,
          declined: data.appeals.declined || 0,
        };
        setStatusData(status);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const filteredData = tableData.filter(
    (row) =>
      row.date.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.type.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.status.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderRow = (item: TableRow) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 dark:border-gray-700 even:bg-slate-50 even:dark:bg-grey-background text-sm hover:bg-purple-100 dark:hover:bg-dark-purple-200 dark:text-dark-text"
    >
      <td className="p-4">{item.date}</td>
      <td>{item.type}</td>
      <td>{item.status}</td>
    </tr>
  );

  return (
    <div className="ml-6 mt-4 mr-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Course Report</h1>
          <p className="text-gray-600 dark:text-gray-400">{courseId}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-dark-container p-4 rounded-md flex-1 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold dark:text-dark-text">Course Records</h2>
          <div className="flex items-center gap-4 w-auto">
            <TableSearch value={searchValue} onChange={setSearchValue} />
          </div>
        </div>
        <Table columns={tableColumns} renderRow={renderRow} data={filteredData} />
      </div>

      {/* Charts and Status Section */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="border rounded-md p-4 shadow-sm bg-white flex flex-col items-center">
          <DonutChart
            title="Attendance Percentage"
            data={attendanceData}
            colors={["#31C48D", "#F05252"]}
          />
        </div>

        {/* Bar Chart */}
        <div className="border rounded-md p-4 shadow-sm bg-white">
          <BarChart
            title="Attendance Overview"
            categories={["Class", "Tutorial", "Lab"]}
            data={barChartData}
          />
        </div>

        {/* Appeals Sent */}
        <div className="border rounded-md shadow-sm bg-white">
          <StatusComponent
            title="Appeals Sent"
            statusCards={[
              {
                value: statusData.pending,
                label: "Pending",
                backgroundColor: "#FEF3C7",
                textColor: "#D97706",
              },
              {
                value: statusData.approved,
                label: "Approved",
                backgroundColor: "#D1FAE5",
                textColor: "#059669",
              },
              {
                value: statusData.declined,
                label: "Declined",
                backgroundColor: "#FEE2E2",
                textColor: "#B91C1C",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
