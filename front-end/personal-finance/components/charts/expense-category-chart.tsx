"use client";

import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ExpenseCategoryChart() {
  const [option, setOption] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    async function fetchExpenseCategoryChart() {
      try {
        const reportResponse = await axios.get(
          `http://localhost:3005/api/reports/expense-categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const groupedData = reportResponse.data.data;

        if (!groupedData || Object.keys(groupedData).length === 0) {
          console.error("No expense data found.");
          return;
        }

        const seriesData = Object.keys(groupedData).map((categoryName) => ({
          name: categoryName,
          value: groupedData[categoryName].amount,
        }));

        const totalExpense = seriesData.reduce(
          (sum, item) => sum + item.value,
          0
        );

        const newOption = {
          tooltip: {
            trigger: "item",
            formatter: (params: any) => {
              const percent = ((params.value / totalExpense) * 100).toFixed(1);
              return `${
                params.name
              }<br/>Amount: ${params.value.toLocaleString()}₫<br/>Percentage: ${percent}%`;
            },
          },
          legend: {
            orient: "vertical",
            right: "5%",
            top: "middle",
            data: seriesData.map((item) => item.name),
            textStyle: {
              fontSize: 12,
            },
          },
          series: [
            {
              name: "Expense Categories",
              type: "pie",
              radius: ["40%", "60%"],
              center: ["40%", "50%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "outside",
                formatter: "{b}",
                textStyle: {
                  fontSize: 14,
                  lineHeight: 20,
                },
              },
              labelLine: {
                show: false,
                length: 15,
                length2: 10,
              },
              itemStyle: {
                borderRadius: 5,
                borderWidth: 2,
                borderColor: "#fff",
              },
              emphasis: {
                scale: true,
                scaleSize: 10,
                label: {
                  fontSize: 16,
                  fontWeight: "bold",
                },
              },
              data: seriesData,
            },
          ],
        };

        setOption(newOption);
      } catch (error) {
        console.error("Error loading category chart data:", error);
      }
    }

    fetchExpenseCategoryChart();
  }, []);

  if (!option) {
    return <div>Loading chart data...</div>;
  }

  return (
    <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
  );
}
