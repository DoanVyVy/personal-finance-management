"use client";

import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
}

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: "", amount: "" });

  useEffect(() => {
    // TODO: Fetch budgets from API
    const mockBudgets: Budget[] = [
      { id: "1", category: "Food", amount: 500, spent: 350 },
      { id: "2", category: "Transportation", amount: 200, spent: 250 },
      { id: "3", category: "Entertainment", amount: 300, spent: 200 },
      { id: "4", category: "Utilities", amount: 400, spent: 380 },
    ];
    setBudgets(mockBudgets);
  }, []);

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudgetItem: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      amount: parseFloat(newBudget.amount),
      spent: 0,
    };
    setBudgets([...budgets, newBudgetItem]);
    setNewBudget({ category: "", amount: "" });
    setIsDialogOpen(false);
  };

  const getChartOption = () => {
    const categories = budgets.map((budget) => budget.category);
    const spentData = budgets.map((budget) => budget.spent);
    const budgetData = budgets.map((budget) => budget.amount);

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params: any) {
          const spentValue = params[0].value;
          const budgetValue = params[1].value;
          const percentage = ((spentValue / budgetValue) * 100).toFixed(2);
          return `${params[0].name}<br/>Spent: $${spentValue}<br/>Budget: $${budgetValue}<br/>Used: ${percentage}%`;
        },
      },
      legend: {
        data: ["Spent", "Budget"],
      },
      xAxis: {
        type: "value",
        name: "Amount ($)",
        nameLocation: "middle",
        nameGap: 30,
      },
      yAxis: {
        type: "category",
        data: categories,
      },
      series: [
        {
          name: "Spent",
          type: "bar",
          data: spentData,
          itemStyle: {
            color: "#91cc75",
          },
        },
        {
          name: "Budget",
          type: "bar",
          data: budgetData,
          itemStyle: {
            color: "#5470c6",
          },
        },
      ],
    };
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Budgets</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Budget</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddBudget} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newBudget.category}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, category: e.target.value })
                  }
                  placeholder="Enter budget category"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newBudget.amount}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, amount: e.target.value })
                  }
                  placeholder="Enter budget amount"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Budget
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ReactECharts option={getChartOption()} style={{ height: "400px" }} />
        <div className="mt-4 space-y-2">
          {budgets.map((budget) => (
            <div key={budget.id} className="flex items-center justify-between">
              <span className="font-semibold">{budget.category}</span>
              <span
                className={`text-sm ${
                  budget.spent > budget.amount
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                ${budget.spent} / ${budget.amount}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
