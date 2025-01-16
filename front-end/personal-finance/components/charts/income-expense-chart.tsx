"use client";

import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface ChartProps {
  timeUnit?: "monthly" | "quarterly" | "yearly"; // Tham số để xác định thời gian
}

export default function IncomeExpenseChart({
  timeUnit = "monthly",
}: ChartProps) {
  const [option, setOption] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    async function fetchReportData() {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3005/api/reports/income-expenses?timeUnit=${timeUnit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data.data.groupedData;
        if (!data || typeof data !== "object") {
          console.error("Data is not available or not an object.");
          setLoading(false);
          return;
        }

        const labels = Object.keys(data).sort((a, b) => {
          const dateA = new Date(
            timeUnit === "quarterly" ? a.replace("-Q", "-") : `${a}-01`
          );
          const dateB = new Date(
            timeUnit === "quarterly" ? b.replace("-Q", "-") : `${b}-01`
          );
          return dateA.getTime() - dateB.getTime();
        });

        const incomes = labels.map((label) => data[label].income || 0);
        const expenses = labels.map((label) => data[label].expense || 0);
        const nets = labels.map(
          (label) => (data[label].income || 0) - (data[label].expense || 0)
        );

        const newOption = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999",
              },
            },
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true },
            },
          },
          legend: {
            data: ["Income", "Expenses", "Net"],
          },
          xAxis: [
            {
              type: "category",
              data: labels,
              axisPointer: {
                type: "shadow",
              },
              axisLabel: {
                formatter: (value: string) => {
                  if (timeUnit === "quarterly") {
                    return value.replace("-Q", " Q");
                  }
                  return value;
                },
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "Amount",
              axisLabel: {
                // Thay đổi định dạng từ $ sang VND
                formatter: (value: number) => `${value}₫`,
              },
            },
          ],
          series: [
            {
              name: "Income",
              type: "bar",
              data: incomes,
            },
            {
              name: "Expenses",
              type: "bar",
              data: expenses,
            },
            {
              name: "Net",
              type: "line",
              data: nets,
            },
          ],
        };

        setOption(newOption);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReportData();
  }, [timeUnit]);

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  if (!option) {
    return <div>No data available</div>;
  }

  return <ReactECharts option={option} style={{ height: "400px" }} />;
}
