"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import TransactionsTable from "@/components/transactions-table";

// 1. Import từ react-hot-toast
import { Toaster, toast } from "react-hot-toast";

export default function TransactionsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      // 2. Hiển thị toast thông báo
      toast.error("Vui lòng đăng nhập để truy cập!");
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    // Nếu chưa auth, tạm thời không render nội dung
    return (
      <>
        {/* Đặt Toaster để toast có thể hiển thị */}
        <Toaster />
      </>
    );
  }

  return (
    <Layout>
      {/* Đặt Toaster ở đây hoặc trong Layout nếu cần hiển thị toast toàn cục */}
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="mb-6 text-2xl font-semibold">Transactions</h1>
      <TransactionsTable />
    </Layout>
  );
}
