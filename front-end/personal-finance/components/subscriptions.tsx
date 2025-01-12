import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const subscriptions = [
  {
    name: "Apollo Services",
    status: "Active",
    expirationDate: "02 May 2024",
    amount: "₹ 999/-",
  },
  {
    name: "Google Ads Services",
    status: "Active",
    expirationDate: "05 Jun 2024",
    amount: "₹ 1299/-",
  },
  {
    name: "LinkedIn Premium",
    status: "Active",
    expirationDate: "14 Apr 2024",
    amount: "₹ 1999/-",
  },
]

export default function Subscriptions() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Your Subscriptions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expiration date</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.name}>
              <TableCell>{subscription.name}</TableCell>
              <TableCell>
                <Badge variant="success" className="bg-green-100 text-green-800">
                  {subscription.status}
                </Badge>
              </TableCell>
              <TableCell>{subscription.expirationDate}</TableCell>
              <TableCell>{subscription.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

