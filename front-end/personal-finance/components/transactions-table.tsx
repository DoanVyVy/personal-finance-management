"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast"; // <--- import hook toast

interface Transaction {
  id: number;
  createdAt: string;
  note: string;
  amount: number;
  type: string;
  category_id?: number;
}

interface Category {
  id: number;
  name: string;
}

type TransactionKey = keyof Transaction;

export default function TransactionsTable() {
  const { toast } = useToast(); // <--- lấy hàm toast
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [sortColumn, setSortColumn] = useState<TransactionKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // State cho popup Edit
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Form state cho phần edit
  const [editNote, setEditNote] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState("income");
  const [editCategory, setEditCategory] = useState<string | undefined>(
    undefined
  );

  // Lấy token từ localStorage (nếu cần)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  useEffect(() => {
    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    async function fetchData() {
      try {
        // Giả sử transactions ở port 3002, categories ở port 3003
        const [transactionsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:3002/api/transactions", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:3003/api/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setTransactions(transactionsResponse.data);
        setCategories(categoriesResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [token]);

  // Lọc transactions theo type, category và search
  const filteredTransactions = transactions.filter((tx) => {
    const note = tx.note || "";
    const search = searchTerm.toLowerCase();

    const matchType = filterType === "all" || tx.type === filterType;
    const matchCategory =
      filterCategory === "all" || String(tx.category_id) === filterCategory;
    const matchSearch =
      note.toLowerCase().includes(search) ||
      tx.amount.toString().includes(searchTerm);

    return matchType && matchCategory && matchSearch;
  });

  // Sắp xếp transactions
  const sortedAndFilteredTransactions = [...filteredTransactions].sort(
    (a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    }
  );

  // Khi click vào header => đổi chiều sort
  const handleSort = (column: TransactionKey) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Khi click vào một dòng => mở popup edit
  const handleRowClick = (tx: Transaction) => {
    setEditingTransaction(tx);
    setEditNote(tx.note);
    setEditAmount(tx.amount.toString());
    setEditType(tx.type);
    setEditCategory(tx.category_id ? tx.category_id.toString() : undefined);

    setIsEditDialogOpen(true);
  };

  // Xử lý lưu thay đổi (PUT)
  const handleSaveTransaction = async () => {
    if (!editingTransaction || !token) return;

    const updatedTx = {
      note: editNote,
      amount: parseFloat(editAmount),
      type: editType,
      category_id: editCategory ? parseInt(editCategory) : null,
    };

    try {
      const res = await axios.put(
        `http://localhost:3002/api/transactions/${editingTransaction.id}`,
        updatedTx,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật state
      const newData = transactions.map((tx) =>
        tx.id === editingTransaction.id ? res.data : tx
      );
      setTransactions(newData);

      // Thông báo toast thành công
      toast({
        title: "Transaction updated",
        description: `Transaction #${editingTransaction.id} has been updated successfully.`,
      });

      // Đóng dialog
      setIsEditDialogOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update transaction.",
      });
    }
  };

  // Xử lý xoá (DELETE)
  const handleDeleteTransaction = async () => {
    if (!editingTransaction || !token) return;

    try {
      await axios.delete(
        `http://localhost:3002/api/transactions/${editingTransaction.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Xoá khỏi state
      const newData = transactions.filter(
        (tx) => tx.id !== editingTransaction.id
      );
      setTransactions(newData);

      // Thông báo toast thành công
      toast({
        title: "Transaction deleted",
        description: `Transaction #${editingTransaction.id} has been deleted.`,
      });

      // Đóng dialog
      setIsEditDialogOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete transaction.",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* --- Bộ lọc & search --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Search className="text-gray-400" />
        </div>

        <div className="flex items-center space-x-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- Bảng transactions --- */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%] pl-4">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("createdAt")}
                  className="p-0 hover:bg-transparent"
                >
                  Date
                  <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
              <TableHead className="w-[40%] pl-4">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("note")}
                  className="p-0 hover:bg-transparent"
                >
                  Description
                  <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
              <TableHead className="w-[20%] pl-4">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("amount")}
                  className="p-0 hover:bg-transparent"
                >
                  Amount
                  <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
              <TableHead className="w-[20%] pl-4">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("type")}
                  className="p-0 hover:bg-transparent"
                >
                  Type
                  <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredTransactions.map((transaction) => {
              const displayDate = new Date(
                transaction.createdAt
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });

              return (
                <TableRow
                  key={transaction.id}
                  onClick={() => handleRowClick(transaction)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell className="pl-4">{displayDate}</TableCell>
                  <TableCell className="pl-4">{transaction.note}</TableCell>
                  <TableCell
                    className={`pl-4 ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="pl-4">{transaction.type}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {sortedAndFilteredTransactions.length === 0 && (
        <p className="mt-4 text-sm text-center text-gray-500">
          No transactions found.
        </p>
      )}

      {/* --- Popup Edit/Delete Transaction --- */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update your transaction details, or delete it below.
            </DialogDescription>
          </DialogHeader>

          {editingTransaction && (
            <div className="flex flex-col mt-4 space-y-4">
              <label className="flex flex-col space-y-1">
                <span className="text-sm font-medium">Note</span>
                <Input
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                />
              </label>

              <label className="flex flex-col space-y-1">
                <span className="text-sm font-medium">Amount</span>
                <Input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
              </label>

              <label className="flex flex-col space-y-1">
                <span className="text-sm font-medium">Type</span>
                <Select value={editType} onValueChange={setEditType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className="flex flex-col space-y-1">
                <span className="text-sm font-medium">Category</span>
                <Select
                  value={editCategory || ""}
                  onValueChange={(val) => setEditCategory(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="destructive" onClick={handleDeleteTransaction}>
              Delete
            </Button>
            <Button onClick={handleSaveTransaction}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
