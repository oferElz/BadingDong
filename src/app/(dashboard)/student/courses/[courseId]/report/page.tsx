"use client";
import React, { useEffect, useState } from "react";
import DonutChart from "@/components/DonutChart";
import BarChart from "@/components/BarChart";
import StatusComponent from "@/components/StatusComponent";
import { useSession } from "next-auth/react";

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
  const [statusData, setStatusData] = useState<{ pending: number; approved: number; rejected: number }>(
    { pending: 0, approved: 0, rejected: 0 }
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Construct the data structure for DonutChart
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

        // Construct data for BarChart
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

        // Construct data for StatusComponent
        const status = {
          pending: data.appeals.pending || 0,
          approved: data.appeals.approved || 0,
          rejected: data.appeals.rejected || 0, // Change 'declined' to 'rejected'
        };
        setStatusData(status);
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

  return (
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
              backgroundColor: "#FEF3C7", // Light yellow
              textColor: "#D97706", // Dark yellow
            },
            {
              value: statusData.approved,
              label: "Approved",
              backgroundColor: "#D1FAE5", // Light green
              textColor: "#059669", // Dark green
            },
            {
              value: statusData.rejected, // Change 'declined' to 'rejected'
              label: "Rejected",
              backgroundColor: "#FEE2E2", // Light red
              textColor: "#B91C1C", // Dark red
            },
          ]}
        />
      </div>
    </div>
  );
}
