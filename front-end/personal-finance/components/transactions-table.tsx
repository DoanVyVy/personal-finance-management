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

interface Transaction {
  createdAt: string;
  id: number;
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortColumn, setSortColumn] = useState<TransactionKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    async function fetchData() {
      try {
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
  }, []);

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

  const handleSort = (column: TransactionKey) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
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
                <TableRow key={transaction.id}>
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
    </div>
  );
}
