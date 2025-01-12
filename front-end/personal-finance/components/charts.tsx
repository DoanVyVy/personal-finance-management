'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const spendingData = {
  labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  datasets: [
    {
      data: [30000, 35000, 32000, 38000, 28000, 36000],
      backgroundColor: '#6C5DD3',
      borderRadius: 8,
    },
  ],
}

const expenditureData = {
  labels: ['Wordpress', 'Microsoft', 'Google Ads', 'LinkedIn', 'Apollo'],
  datasets: [
    {
      data: [2000, 2500, 1800, 2200, 2400],
      backgroundColor: '#6C5DD3',
      borderRadius: 8,
    },
  ],
}

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
}

export default function Charts() {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Spending
            <div className="text-2xl font-bold mt-1">₹ 48000/-</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={spendingData} options={options} height={200} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Expenditure
            <div className="text-2xl font-bold mt-1">₹ 8000/-</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={expenditureData} options={options} height={200} />
        </CardContent>
      </Card>
    </div>
  )
}

