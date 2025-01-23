"use client";
import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

interface BarChartProps {
  title: string;
  categories: string[];
  data: { name: string; color: string; data: number[] }[];
}

const BarChart: React.FC<BarChartProps> = ({ title, categories, data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  useEffect(() => {
    const options = {
      series: data,
      chart: {
        type: "bar",
        height: 400,
        toolbar: { show: false },
        animations: { enabled: true },
        background: 'transparent'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "70%",
          borderRadius: 6,
        },
      },
      legend: {
        show: true,
        position: "bottom",
        labels: {
          colors: ['#6B7280', '#6B7280'], // Light and dark colors
          useSeriesColors: false
        }
      },
      dataLabels: { enabled: false },
      tooltip: {
        theme: 'dark',
        shared: true,
        intersect: false,
        y: { formatter: (value: number) => `${value}` },
      },
      xaxis: {
        categories,
        labels: {
          style: {
            fontFamily: "Inter, sans-serif",
            colors: ['#6B7280'], // Gray color for light mode
            cssClass: "dark:text-gray-400"
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: "Inter, sans-serif",
            colors: ['#6B7280'], // Gray color for light mode
            cssClass: "dark:text-gray-400"
          },
        },
      },
      grid: {
        show: true,
        borderColor: '#E5E7EB', // Light border color
        strokeDashArray: 4,
        padding: { left: 10, right: 10 },
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } }
      },
      fill: { opacity: 1 },
    };

    if (chartRef.current) {
      chartInstance.current = new ApexCharts(chartRef.current, options);
      chartInstance.current.render();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [categories, data]);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.updateOptions({
        series: data,
        xaxis: { categories },
      });
    }
  }, [categories, data]);

  return (
    <div className="p-2">
      <h2 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-white">{title}</h2>
      <div ref={chartRef}></div>
    </div>
  );
};

export default BarChart;