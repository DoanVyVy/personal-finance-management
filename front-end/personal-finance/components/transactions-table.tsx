'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Search } from 'lucide-react'

// Mock data for transactions
const transactions = [
  { id: 1, date: '2023-05-01', description: 'Salary', amount: 5000, type: 'Income' },
  { id: 2, date: '2023-05-02', description: 'Rent', amount: -1500, type: 'Expense' },
  { id: 3, date: '2023-05-03', description: 'Groceries', amount: -200, type: 'Expense' },
  { id: 4, date: '2023-05-04', description: 'Freelance Work', amount: 1000, type: 'Income' },
  { id: 5, date: '2023-05-05', description: 'Netflix Subscription', amount: -15, type: 'Subscription' },
  { id: 6, date: '2023-05-06', description: 'Stock Investment', amount: -500, type: 'Investment' },
  { id: 7, date: '2023-05-07', description: 'Birthday Gift', amount: 100, type: 'Gift' },
  { id: 8, date: '2023-05-08', description: 'Electricity Bill', amount: -80, type: 'Expense' },
  { id: 9, date: '2023-05-09', description: 'Dividend Payment', amount: 50, type: 'Income' },
  { id: 10, date: '2023-05-10', description: 'Restaurant Dinner', amount: -75, type: 'Expense' },
]

export default function TransactionsTable() {
  const [sortColumn, setSortColumn] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const sortedAndFilteredTransactions = transactions
    .filter(transaction => 
      (filterType === 'all' || transaction.type === filterType) &&
      (transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       transaction.amount.toString().includes(searchTerm))
    )
    .sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Search className="text-gray-400" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Income">Income</SelectItem>
            <SelectItem value="Expense">Expense</SelectItem>
            <SelectItem value="Subscription">Subscription</SelectItem>
            <SelectItem value="Investment">Investment</SelectItem>
            <SelectItem value="Gift">Gift</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button variant="ghost" onClick={() => handleSort('date')}>
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('description')}>
                Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('amount')}>
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('type')}>
                Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.date}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                ${Math.abs(transaction.amount).toFixed(2)}
              </TableCell>
              <TableCell>{transaction.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

