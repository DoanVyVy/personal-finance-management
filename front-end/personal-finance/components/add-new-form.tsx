"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Load categories từ API dựa vào loại (income/expense)
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
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCategories(response.data.data || []);
          setSelectedCategory(undefined); // Reset selectedCategory khi thay đổi selectedTag
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
        return;
      }

      const formData = new FormData(event.currentTarget);
      const transactionData = {
        category_id: selectedCategory,
        amount: parseFloat(formData.get("amount") as string),
        date: formData.get("date"),
        description: formData.get("description"),
        type: selectedTag,
      };

      await axios.post(
        `http://localhost:3002/api/transactions`,
        transactionData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Transaction added successfully!");
      setLoading(false);
      router.push("/dashboard");
    } catch (error) {
      toast.error("Error adding transaction.");
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryType) {
      toast.error("Please provide a category name and select a type.");
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
        { name: newCategoryName.trim(), type: newCategoryType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories((prev) => [...prev, response.data.data]);
      setNewCategoryName("");
      setNewCategoryType(null);
      setIsAddingCategory(false);
      toast.success("Category added successfully!");
    } catch (error) {
      toast.error("Error adding category.");
    }
  };

  const renderForm = () => {
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            name="category"
            required
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Input id="date" name="date" type="date" required />
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
                      <Label htmlFor="newCategoryType">Type</Label>
                      <Select
                        name="newCategoryType"
                        required
                        value={newCategoryType || ""}
                        onValueChange={(value) => setNewCategoryType(value)}
                      >
                        <SelectTrigger id="newCategoryType">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
