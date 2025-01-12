'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FinanceTags } from "./finance-tags"
import { CreditCard, DollarSign, Briefcase, ShoppingCart, Gift } from 'lucide-react'

const financeTags = [
  { id: 'income', name: 'Income', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'expense', name: 'Expense', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'subscription', name: 'Subscription', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'investment', name: 'Investment', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'gift', name: 'Gift', icon: <Gift className="w-4 h-4" /> },
]

export default function AddNewForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    // Here you would typically send the form data to your backend
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating API call
    setLoading(false)
    router.push('/dashboard')
  }

  const renderForm = () => {
    switch (selectedTag) {
      case 'income':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="source">Income Source</Label>
              <Input id="source" placeholder="Enter income source" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="Enter amount" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date Received</Label>
              <Input id="date" type="date" required />
            </div>
          </>
        )
      case 'expense':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="category">Expense Category</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="Enter amount" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date of Expense</Label>
              <Input id="date" type="date" required />
            </div>
          </>
        )
      case 'subscription':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Subscription Name</Label>
              <Input id="name" placeholder="Enter subscription name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="Enter amount" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-cycle">Billing Cycle</Label>
              <Select>
                <SelectTrigger id="billing-cycle">
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" required />
            </div>
          </>
        )
      case 'investment':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="type">Investment Type</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select investment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="bonds">Bonds</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="Enter amount" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date of Investment</Label>
              <Input id="date" type="date" required />
            </div>
          </>
        )
      case 'gift':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient/Giver</Label>
              <Input id="recipient" placeholder="Enter recipient or giver name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount/Value</Label>
              <Input id="amount" type="number" placeholder="Enter amount or value" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter gift description" />
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <FinanceTags
          tags={financeTags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />
        {selectedTag && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {renderForm()}
            </div>
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Adding..." : "Add Transaction"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

