import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IncomeExpenseChart from "./charts/income-expense-chart";
import ExpenseCategoryChart from "./charts/expense-category-chart";

type TimeUnit = "monthly" | "quarterly" | "yearly";

export default function ReportsOverview() {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("monthly");

  const handleTabChange = (value: string) => {
    setTimeUnit(value as TimeUnit);
  };

  return (
    <div className="w-full space-y-4">
      <Tabs
        defaultValue="monthly"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart timeUnit={timeUnit} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseCategoryChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
