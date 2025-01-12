"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Lấy dữ liệu từ form
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Kiểm tra xác nhận password
    if (password !== confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/signup",
        {
          email,
          password,
          name,
        }
      );

      const { user, token } = response.data;
      if (token) {
        localStorage.setItem("accessToken", token);
      }

      router.push("/dashboard");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || "Sign up failed";
      setErrorMessage(errorMsg);
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create an Account"
      description="Enter your details to get started"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your name"
            disabled={isLoading}
            required
          />
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            required
          />
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <Button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-violet-600 hover:text-violet-700 font-medium"
          >
            Login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
