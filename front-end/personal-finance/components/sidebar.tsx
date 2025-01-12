"use client";

import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  PlusCircle,
  Receipt,
  User,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutDialog } from "./logout-dialog";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 border-r bg-white p-6 flex flex-col overflow-y-auto">
      <div className="flex items-center mb-8">
        <span className="text-xl font-bold">
          Sub<span className="text-blue-600">Trackr</span>
        </span>
      </div>

      <nav className="space-y-2 flex-grow overflow-y-auto">
        <Button
          variant={pathname === "/dashboard" ? "default" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>

        <Button
          variant={pathname === "/add" ? "default" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add new
          </Link>
        </Button>

        <Button
          variant={pathname === "/transactions" ? "default" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/transactions">
            <Receipt className="mr-2 h-4 w-4" />
            Transactions
          </Link>
        </Button>

        <Button
          variant={pathname === "/reports" ? "default" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/reports">
            <BarChart className="mr-2 h-4 w-4" />
            Reports
          </Link>
        </Button>

        <Button
          variant={pathname === "/account" ? "default" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/account">
            <User className="mr-2 h-4 w-4" />
            Account
          </Link>
        </Button>
      </nav>

      <div className="mt-auto">
        <LogoutDialog />
      </div>
    </div>
  );
}
