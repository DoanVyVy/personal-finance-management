"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import Sidebar from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true); // để hiển thị Loading nếu cần
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Lấy token & userId từ localStorage (giả sử đã lưu ở trang login)
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    // Nếu không có token hoặc userId => có thể điều hướng về /login
    if (!token || !userId) {
      // Ở đây chỉ báo lỗi, hoặc bạn dùng next/router để push("/login")
      setErrorMessage("No token or userId found. Please login.");
      setLoading(false);
      return;
    }

    // Gọi API User Service: GET /api/users/:id
    // Thêm header Authorization: Bearer <token>
    async function fetchUser() {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Giả sử backend trả object { id, email, name, ... }
        const { name } = res.data;
        setUserName(name);
      } catch (error: any) {
        console.error("Error fetching user info:", error);
        setErrorMessage(
          error?.response?.data?.error || "Cannot fetch user info"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (errorMessage) {
    return <div className="p-4 text-red-500">{errorMessage}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 ml-64 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Hi, {userName}</h1>
          </div>
          <Button variant="ghost" size="icon">
            <BellIcon className="w-5 h-5" />
          </Button>
        </div>
        {children}
      </main>
    </div>
  );
}
