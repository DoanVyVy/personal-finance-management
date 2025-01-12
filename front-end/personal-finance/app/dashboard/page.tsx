"use client";

import Layout from "@/components/layout";
import Charts from "@/components/charts";
import Reminders from "@/components/reminders";
import Subscriptions from "@/components/subscriptions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
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
      <Charts />
      <Reminders />
      <Subscriptions />
    </Layout>
  );
}
