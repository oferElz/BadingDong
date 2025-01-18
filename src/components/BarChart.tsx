import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

interface BarChartProps {
  title: string; // Title for the chart
  categories: string[]; // Categories for the y-axis
  data: { name: string; color: string; data: number[] }[]; // Series data
}

const BarChart: React.FC<BarChartProps> = ({ title, categories, data }) => {
  const chartRef = useRef<HTMLDivElement>(null); // Reference to the chart container
  const chartInstance = useRef<ApexCharts | null>(null); // Reference to the chart instance

  useEffect(() => {
    // Chart configuration
    const options = {
      series: data,
      chart: {
        type: "bar",
        height: 400,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "70%", // Adjust bar width
          borderRadius: 6, // Rounded corners
        },
      },
      legend: {
        show: true,
        position: "bottom",
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (value: number) => `${value}`,
        },
      },
      xaxis: {
        categories,
        labels: {
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
          },
        },
      },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
          left: 10,
          right: 10,
        },
      },
      fill: {
        opacity: 1,
      },
    };

    // Create chart instance
    if (chartRef.current) {
      chartInstance.current = new ApexCharts(chartRef.current, options);
      chartInstance.current.render();
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [categories, data]);

  // Update chart on props change
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.updateOptions({
        series: data,
        xaxis: { categories },
      });
    }
  }, [categories, data]);

  return (
    <div>
      {/* Chart Title */}
      <h2 className="text-lg font-semibold text-center mb-4">{title}</h2>
      {/* Chart Container */}
      <div ref={chartRef}></div>
    </div>
  );
};

export default BarChart;
