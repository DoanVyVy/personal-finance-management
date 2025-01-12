'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import IncomeExpenseChart from "./charts/income-expense-chart"
import ExpenseCategoryChart from "./charts/expense-category-chart"
import SavingsChart from "./charts/savings-chart"
import InvestmentPerformanceChart from "./charts/investment-performance-chart"

export default function ReportsOverview() {
  return (
    <Tabs defaultValue="monthly" className="w-full">
      <TabsList>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
        <TabsTrigger value="yearly">Yearly</TabsTrigger>
      </TabsList>
      <TabsContent value="monthly" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeExpenseChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseCategoryChart />
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Savings Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <SavingsChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Investment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <InvestmentPerformanceChart />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="quarterly">
        {/* Duplicate the monthly content here, adjusting data as needed */}
      </TabsContent>
      <TabsContent value="yearly">
        {/* Duplicate the monthly content here, adjusting data as needed */}
      </TabsContent>
    </Tabs>
  )
}

