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
import {
  PlusCircle,
  Edit,
  Trash2,
  DollarSign,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Budget {
  id: number;
  category_id: number;
  limit_amount: number;
  start_date: string;
  end_date: string;
  spent: number;
}

interface Category {
  id: number;
  name: string;
}

const API_BASE_URL = "http://localhost:3004/api";
const CATEGORY_API_URL = "http://localhost:3003/api/categories";

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: "",
    limit_amount: "",
    start_date: "",
    end_date: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<number | null>(null);
  const [editBudgetForm, setEditBudgetForm] = useState({
    category: "",
    limit_amount: "",
    start_date: "",
    end_date: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchBudgets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/budgets`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Error fetching budgets");
      const data = await res.json();
      setBudgets(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${CATEGORY_API_URL}/by-type?type=expense`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Error fetching categories");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        console.error("Categories data is not an array", data);
        setCategories([]);
      }
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/budgets`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          category: parseInt(newBudget.category),
          limit_amount: parseFloat(newBudget.limit_amount),
          start_date: newBudget.start_date,
          end_date: newBudget.end_date,
        }),
      });
      if (!res.ok) throw new Error("Error creating budget");
      const createdBudget = await res.json();

      setBudgets((prev) => [...prev, createdBudget]);
      setNewBudget({
        category: "",
        limit_amount: "",
        start_date: "",
        end_date: "",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenEditDialog = (budget: Budget) => {
    setEditingBudgetId(budget.id);
    setEditBudgetForm({
      category: budget.category_id.toString(),
      limit_amount: budget.limit_amount.toString(),
      start_date: budget.start_date,
      end_date: budget.end_date,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudgetId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/budgets/${editingBudgetId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          category: parseInt(editBudgetForm.category),
          limit_amount: parseFloat(editBudgetForm.limit_amount),
          start_date: editBudgetForm.start_date,
          end_date: editBudgetForm.end_date,
        }),
      });
      if (!res.ok) throw new Error("Error updating budget");
      const updatedBudget = await res.json();

      setBudgets((prev) =>
        prev.map((b) => (b.id === editingBudgetId ? updatedBudget : b))
      );

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteBudget = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/budgets/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Error deleting budget");
      await res.json();

      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(
      (c) => Number(c.id) === Number(categoryId)
    );
    return category ? category.name : "Unknown";
  };

  const getChartOption = () => {
    const categoryNames = budgets.map((budget) =>
      getCategoryName(budget.category_id)
    );
    const spentData = budgets.map((budget) => budget.spent);
    const limitData = budgets.map((budget) => budget.limit_amount);

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: function (params: any) {
          const spentValue = params[0].value;
          const limitValue = params[1].value;
          const percentage = limitValue
            ? ((spentValue / limitValue) * 100).toFixed(2)
            : 0;
          const categoryName = params[0].axisValue;
          return `${categoryName}<br/>Spent: $${spentValue}<br/>Limit: $${limitValue}<br/>Used: ${percentage}%`;
        },
      },
      legend: { data: ["Spent", "Budget Limit"] },
      xAxis: {
        type: "value",
        name: "Amount ($)",
        nameLocation: "middle",
        nameGap: 30,
      },
      yAxis: {
        type: "category",
        data: categoryNames,
      },
      series: [
        {
          name: "Spent",
          type: "bar",
          data: spentData,
          itemStyle: { color: "#10B981" },
        },
        {
          name: "Budget Limit",
          type: "bar",
          data: limitData,
          itemStyle: { color: "#3B82F6" },
        },
      ],
    };
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-3xl font-bold">Budget Overview</CardTitle>
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
                  <select
                    id="category"
                    value={newBudget.category}
                    onChange={(e) =>
                      setNewBudget({ ...newBudget, category: e.target.value })
                    }
                    required
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limit_amount">Limit Amount</Label>
                  <Input
                    id="limit_amount"
                    type="number"
                    value={newBudget.limit_amount}
                    onChange={(e) =>
                      setNewBudget({
                        ...newBudget,
                        limit_amount: e.target.value,
                      })
                    }
                    placeholder="Enter limit amount"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newBudget.start_date}
                    onChange={(e) =>
                      setNewBudget({ ...newBudget, start_date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={newBudget.end_date}
                    onChange={(e) =>
                      setNewBudget({ ...newBudget, end_date: e.target.value })
                    }
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
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Budget Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => {
              const spentPercentage =
                (budget.spent / budget.limit_amount) * 100;
              const isOverBudget = spentPercentage > 100;
              const isNearLimit =
                spentPercentage >= 80 && spentPercentage <= 100;

              return (
                <Card
                  key={budget.id}
                  className={`overflow-hidden ${
                    isOverBudget
                      ? "border-red-500 dark:border-red-700"
                      : isNearLimit
                      ? "border-yellow-500 dark:border-yellow-700"
                      : "border-green-500 dark:border-green-700"
                  }`}
                >
                  <CardHeader
                    className={`
                    ${
                      isOverBudget
                        ? "bg-red-100 dark:bg-red-900"
                        : isNearLimit
                        ? "bg-yellow-100 dark:bg-yellow-900"
                        : "bg-green-100 dark:bg-green-900"
                    }
                  `}
                  >
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span>{getCategoryName(budget.category_id)}</span>
                      {isOverBudget && (
                        <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
                      )}
                      {isNearLimit && (
                        <AlertCircle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                      )}
                      {!isOverBudget && !isNearLimit && (
                        <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between text-sm font-medium">
                      <span
                        className={
                          isOverBudget
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-600 dark:text-gray-400"
                        }
                      >
                        Spent: ${budget.spent}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Limit: ${budget.limit_amount}
                      </span>
                    </div>
                    <Progress
                      value={spentPercentage}
                      className={`h-2 ${
                        isOverBudget
                          ? "bg-red-200 dark:bg-red-800"
                          : isNearLimit
                          ? "bg-yellow-200 dark:bg-yellow-800"
                          : "bg-green-200 dark:bg-green-800"
                      }`}
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {budget.start_date} to {budget.end_date}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {spentPercentage.toFixed(1)}% used
                      </span>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditDialog(budget)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBudget(budget.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateBudget} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_category">Category</Label>
              <select
                id="edit_category"
                value={editBudgetForm.category}
                onChange={(e) =>
                  setEditBudgetForm({
                    ...editBudgetForm,
                    category: e.target.value,
                  })
                }
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_limit_amount">Limit Amount</Label>
              <Input
                id="edit_limit_amount"
                type="number"
                value={editBudgetForm.limit_amount}
                onChange={(e) =>
                  setEditBudgetForm({
                    ...editBudgetForm,
                    limit_amount: e.target.value,
                  })
                }
                placeholder="Enter limit amount"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_start_date">Start Date</Label>
              <Input
                id="edit_start_date"
                type="date"
                value={editBudgetForm.start_date}
                onChange={(e) =>
                  setEditBudgetForm({
                    ...editBudgetForm,
                    start_date: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_end_date">End Date</Label>
              <Input
                id="edit_end_date"
                type="date"
                value={editBudgetForm.end_date}
                onChange={(e) =>
                  setEditBudgetForm({
                    ...editBudgetForm,
                    end_date: e.target.value,
                  })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Update Budget
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
