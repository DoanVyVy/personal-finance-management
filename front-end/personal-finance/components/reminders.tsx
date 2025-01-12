import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const reminders = [
  {
    id: 1,
    name: "Wordpress",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-smlzHZDAX8Xk82ZaKd9LkP7wwpTwZC.png",
    dueDate: "14 Apr",
    amount: 999,
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-smlzHZDAX8Xk82ZaKd9LkP7wwpTwZC.png",
    dueDate: "03 Apr",
    amount: 1499,
  },
  {
    id: 3,
    name: "LinkedIn",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-smlzHZDAX8Xk82ZaKd9LkP7wwpTwZC.png",
    dueDate: "03 Apr",
    amount: 1999,
  },
]

export default function Reminders() {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Upcoming reminders</h2>
      <div className="grid grid-cols-3 gap-4">
        {reminders.map((reminder) => (
          <Card key={reminder.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full mr-2" />
                  <span className="font-medium">{reminder.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Due: {reminder.dueDate}
                </span>
              </div>
              <Button className="w-full">₹ {reminder.amount}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

