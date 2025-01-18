"use client";
import React from "react";
import DonutChart from "@/components/DonutChart";
import BarChart from "@/components/BarChart";
import StatusComponent from "@/components/StatusComponent";

export default function ReportPage() {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Donut Chart */}
      <div className="border rounded-md p-4 shadow-sm bg-white flex flex-col items-center">
        <DonutChart
          title="Attendance Percentage"
          data={{
            default: [75, 25],
            class: [80, 20],
            tutorial: [70, 30],
            lab: [60, 40],
          }}
          colors={["#31C48D", "#F05252"]}
        />
      </div>

      {/* Bar Chart */}
      <div className="border rounded-md p-4 shadow-sm bg-white">
        <BarChart
          title="Attendance Overview"
          categories={["Class", "Tutorial", "Lab"]}
          data={[
            { name: "Attended", color: "#31C48D", data: [8, 7, 5] },
            { name: "Missed", color: "#F05252", data: [2, 3, 1] },
          ]}
        />
      </div>

      {/* Appeals Sent */}
      <div className="border rounded-md shadow-sm bg-white">
        <StatusComponent
          title="Appeals Sent"
          statusCards={[
            {
              value: 10,
              label: "Pending",
              backgroundColor: "#FEF3C7", // Light yellow
              textColor: "#D97706", // Dark yellow
            },
            {
              value: 25,
              label: "Accepted",
              backgroundColor: "#D1FAE5", // Light green
              textColor: "#059669", // Dark green
            },
            {
              value: 5,
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
