"use client";

import Layout from "@/components/layout";
import AddNewForm from "@/components/add-new-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddNewPage() {
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
      <h1 className="text-2xl font-semibold mb-6">Add New Transaction</h1>
      <AddNewForm />
    </Layout>
  );
}
