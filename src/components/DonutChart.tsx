import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";

interface DonutChartProps {
  title: string;
  data: Record<string, [number, number]>;
  colors?: string[];
}

interface ApexChartType {
  globals: {
    series: number[];
    seriesTotals: number[];
  }
}

const DonutChart: React.FC<DonutChartProps> = ({
  title,
  data,
  colors = ["#31C48D", "#F05252"],
}) => {
  const [currentSeries, setCurrentSeries] = useState<[number, number]>(
    data.default || [0, 0]
  );

  useEffect(() => {
    const options: ApexCharts.ApexOptions = {
      series: data.default,
      colors: colors,
      chart: {
        height: 320,
        width: "100%",
        type: "donut",
      },
      plotOptions: {
        pie: {
          donut: {
            size: "80%",
            labels: {
              show: true,
              name: { show: false },
              value: { show: false },
              total: {
                show: true,
                showAlways: true,
                label: " ",
                fontSize: "16px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                color: "#000",
                formatter: function(w: ApexChartType) {
                  const attended = w.globals.series[0] || 0;
                  const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                  const percentage = total > 0 ? (attended / total * 100).toFixed(1) : "0";
                  
                  return `
                    <div style="text-align:center;line-height:1.4;">
                      <div style="font-size:18px;font-weight:600;color:#000;">
                        Attendance
                      </div>
                      <div style="font-size:24px;color:#6B7280;margin-top:4px;">
                        ${percentage}%
                      </div>
                    </div>
                  `;
                }
              }
            }
          }
        }
      },
      labels: ["Attended", "Missed"],
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      tooltip: {
        enabled: true,
        theme: "dark",
        fillSeriesColor: false,
        y: {
          formatter: (val: number, opts: { globals: { seriesTotals: number[] } }) => {
            const total = opts.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
            return total > 0 ? `${(val / total * 100).toFixed(1)}%` : "0%";
          }
        }
      },
      dataLabels: {
        enabled: false,
      },
    };

    const chartEl = document.getElementById("donut-chart");
    if (!chartEl) return;

    const chart = new ApexCharts(chartEl, options);
    chart.render();

    const handleCheckboxChange = () => {
      const checkboxes = document.querySelectorAll<HTMLInputElement>(
        "#chart-checkboxes input[type='checkbox']"
      );
      const selectedKeys = Array.from(checkboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      // If nothing is checked or all boxes are checked, show default data
      const allChecked = selectedKeys.length === Object.keys(data).filter(key => key !== 'default').length;
      if (selectedKeys.length === 0 || allChecked) {
        setCurrentSeries(data.default);
        chart.updateSeries(data.default);
        return;
      }

      // Calculate aggregated data for selected categories
      const aggregated: [number, number] = selectedKeys.reduce(
        (acc: [number, number], key: string) => {
          acc[0] += data[key][0];
          acc[1] += data[key][1];
          return acc;
        },
        [0, 0]
      );

      setCurrentSeries(aggregated);
      chart.updateSeries(aggregated);
    };

    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      "#chart-checkboxes input[type='checkbox']"
    );
    checkboxes.forEach((cb) => cb.addEventListener("change", handleCheckboxChange));

    return () => {
      chart.destroy();
      checkboxes.forEach((cb) =>
        cb.removeEventListener("change", handleCheckboxChange)
      );
    };
  }, [data, colors]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div id="donut-chart" style={{ width: "100%", maxWidth: 420 }} />
      <div id="chart-checkboxes" className="flex gap-4 mt-4">
        {Object.keys(data).map(
          (key) =>
            key !== "default" && (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={key}
                  className="w-4 h-4 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </label>
            )
        )}
      </div>
    </div>
  );
};

export default DonutChart;