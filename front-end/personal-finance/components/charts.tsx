"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function Charts() {
  const [incomeData, setIncomeData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [expenseData, setExpenseData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    async function fetchData() {
      try {
        // Fetch income and expense data
        const response = await axios.get(
          `http://localhost:3005/api/reports/income-expenses?timeUnit=monthly`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const monthlyData = response.data.data.groupedData;
        let labels = Object.keys(monthlyData);

        // Sort labels by month/year
        labels.sort((a, b) => {
          const dateA = new Date(`${a}-01`).getTime(); // Chuyển thành số milliseconds
          const dateB = new Date(`${b}-01`).getTime(); // Chuyển thành số milliseconds
          return dateA - dateB;
        });

        const incomeValues = labels.map((month) => monthlyData[month].income);
        const expenseValues = labels.map((month) => monthlyData[month].expense);

        // Set income data
        setIncomeData({
          labels,
          datasets: [
            {
              data: incomeValues,
              backgroundColor: "#6C5DD3",
              borderRadius: 8,
            },
          ],
        });

        // Set expense data
        setExpenseData({
          labels,
          datasets: [
            {
              data: expenseValues,
              backgroundColor: "#FF6B6B",
              borderRadius: 8,
            },
          ],
        });
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Income
            <div className="mt-1 text-2xl font-bold">
              {" "}
              {incomeData.datasets[0]?.data.reduce(
                (a: number, b: number) => a + b,
                0
              ) || 0}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={incomeData} options={options} height={200} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Expense
            <div className="mt-1 text-2xl font-bold">
              {" "}
              {expenseData.datasets[0]?.data.reduce(
                (a: number, b: number) => a + b,
                0
              ) || 0}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={expenseData} options={options} height={200} />
        </CardContent>
      </Card>
    </div>
  );
}
