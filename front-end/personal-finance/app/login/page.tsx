"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Gọi sang User Service (ví dụ: http://localhost:3001/api/users/login)
      // Đảm bảo URL này đúng với backend của bạn.
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userId", user.id);
      }

      router.push("/dashboard");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "Login failed");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      title="Login to your Account"
      description="Welcome back! Please enter your details"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            disabled={isLoading}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            required
          />
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        <Button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <div className="text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-violet-600 hover:text-violet-700"
          >
            Create account
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
