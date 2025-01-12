"use client";

import Layout from "@/components/layout";
import ReportsOverview from "@/components/reports-overview";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Financial Reports</h1>
      <ReportsOverview />
    </Layout>
  );
}
