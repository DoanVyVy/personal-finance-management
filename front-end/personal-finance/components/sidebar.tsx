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
    <div className="fixed top-0 bottom-0 left-0 flex flex-col w-64 p-6 overflow-y-auto bg-white border-r">
      <div className="flex items-center mb-8">
        <span className="text-xl font-bold">
          Group<span className="text-blue-600"> 14</span>
        </span>
      </div>

      <nav className="flex-grow space-y-2 overflow-y-auto">
        <Button
          variant={pathname === "/dashboard" ? "default" : "ghost"}
          className="justify-start w-full"
          asChild
        >
          <Link href="/dashboard">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </Button>

        <Button
          variant={pathname === "/add" ? "default" : "ghost"}
          className="justify-start w-full"
          asChild
        >
          <Link href="/add">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add new
          </Link>
        </Button>

        <Button
          variant={pathname === "/transactions" ? "default" : "ghost"}
          className="justify-start w-full"
          asChild
        >
          <Link href="/transactions">
            <Receipt className="w-4 h-4 mr-2" />
            Transactions
          </Link>
        </Button>

        <Button
          variant={pathname === "/reports" ? "default" : "ghost"}
          className="justify-start w-full"
          asChild
        >
          <Link href="/reports">
            <BarChart className="w-4 h-4 mr-2" />
            Reports
          </Link>
        </Button>

        <Button
          variant={pathname === "/account" ? "default" : "ghost"}
          className="justify-start w-full"
          asChild
        >
          <Link href="/account">
            <User className="w-4 h-4 mr-2" />
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
