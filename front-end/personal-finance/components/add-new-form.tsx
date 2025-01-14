"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FinanceTags } from "./finance-tags";
import { DollarSign, ShoppingCart, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import toast from "react-hot-toast";

interface Budget {
  id: number;
  category_id: number;
  limit_amount: number;
  start_date: string;
  end_date: string;
  spent?: number;
}

const financeTags = [
  { id: "income", name: "Income", icon: <DollarSign className="w-4 h-4" /> },
  {
    id: "expense",
    name: "Expense",
    icon: <ShoppingCart className="w-4 h-4" />,
  },
];

export default function AddNewForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]); // Khai báo state budgets
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Lấy danh sách budgets khi component khởi tạo
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    axios
      .get(`http://localhost:3004/api/budgets`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBudgets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching budgets:", error);
      });
  }, []);

  // Lấy danh sách categories theo type (income/expense)
  useEffect(() => {
    if (selectedTag) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("No token found. Please login.");
        return;
      }

      async function fetchCategories() {
        try {
          const response = await axios.get(
            `http://localhost:3003/api/categories/by-type?type=${selectedTag}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const fetchedCategories = response.data.data || [];
          setCategories(fetchedCategories);

          // Reset hoặc đặt default category nếu có
          if (fetchedCategories.length > 0) {
            setSelectedCategory(fetchedCategories[0].id);
          } else {
            setSelectedCategory("");
          }
        } catch (error) {
          toast.error("Error loading categories.");
        }
      }

      fetchCategories();
    }
  }, [selectedTag]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("No token found. Please login.");
        setLoading(false);
        return;
      }

      const formData = new FormData(event.currentTarget);

      // Kiểm tra category_id trước khi gửi
      if (!selectedCategory) {
        toast.error("Please select a category.");
        setLoading(false);
        return;
      }

      const transactionData = {
        category_id: selectedCategory,
        amount: parseFloat(formData.get("amount") as string),
        date: formData.get("date"),
        note: formData.get("description"),
        type: selectedTag,
      };

      console.log("Submitting transaction:", transactionData); // Debug log

      // Gửi yêu cầu POST thêm giao dịch mới
      await axios.post(
        `http://localhost:3002/api/transactions`,
        transactionData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Transaction added successfully!");

      // Tìm budget tương ứng với category_id
      const matchingBudget = budgets.find(
        (b) => b.category_id === Number(selectedCategory)
      );

      // Nếu tìm thấy budget, cập nhật spent
      if (matchingBudget) {
        const updatedSpent =
          (matchingBudget.spent || 0) + transactionData.amount;
        // Gửi yêu cầu PUT để cập nhật budget
        await axios.put(
          `http://localhost:3004/api/budgets/${matchingBudget.id}`,
          {
            category: matchingBudget.category_id,
            limit_amount: matchingBudget.limit_amount,
            start_date: matchingBudget.start_date,
            end_date: matchingBudget.end_date,
            spent: updatedSpent,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Cập nhật lại danh sách budgets trong state nếu cần
        setBudgets((prevBudgets) =>
          prevBudgets.map((b) =>
            b.id === matchingBudget.id ? { ...b, spent: updatedSpent } : b
          )
        );
      }

      setLoading(false);
      router.push("/transactions");
    } catch (error) {
      console.error(error);
      toast.error("Error adding transaction.");
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please provide a category name.");
      return;
    }

    if (!selectedTag) {
      toast.error("Please select 'Income' or 'Expense' first!");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("No token found. Please login.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3003/api/categories`,
        { name: newCategoryName.trim(), type: selectedTag },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCategories((prev) => [...prev, response.data.data]);
      setNewCategoryName("");
      setIsAddingCategory(false);
      toast.success("Category added successfully!");
    } catch (error) {
      toast.error("Error adding category.");
    }
  };

  const renderForm = () => {
    // Lấy ngày hôm nay dưới dạng YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            required
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            {categories.length === 0 && (
              <option value="" disabled>
                No categories available
              </option>
            )}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={today} // Thiết lập ngày mặc định là hôm nay
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            placeholder="Enter description"
          />
        </div>
      </>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex justify-center mb-6 space-x-4">
          <FinanceTags
            tags={financeTags}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
          />
        </div>

        {selectedTag && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {renderForm()}

              <Dialog
                open={isAddingCategory}
                onOpenChange={setIsAddingCategory}
              >
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add New Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newCategoryName">Category Name</Label>
                      <Input
                        id="newCategoryName"
                        placeholder="Enter new category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddCategory} className="w-full">
                      Add Category
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Adding..." : "Add Transaction"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
