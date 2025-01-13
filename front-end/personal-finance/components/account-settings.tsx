"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

import { User, Lock } from "lucide-react";

interface UserData {
  name: string;
  email: string;
}

export default function AccountSettings() {
  // State cho profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // State cho đổi password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Thông báo hoặc lỗi
  const [message, setMessage] = useState<string | null>(null);

  // Giả định userId & token đã lưu ở localStorage khi login
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // Lấy thông tin user ban đầu từ backend
  useEffect(() => {
    if (!userId || !token) return;

    // Gọi API lấy thông tin user
    axios
      .get(`http://localhost:3001/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const userData = res.data as UserData;
        setName(userData.name);
        setEmail(userData.email);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  }, [userId, token]);

  // Cập nhật tên & email
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!userId || !token) {
      setMessage("No user session found. Please log in again.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3001/api/users/${userId}`,
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
    }
  };

  // Đổi password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!userId || !token) {
      setMessage("No user session found. Please log in again.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match!");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3001/api/users/${userId}/password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Password updated successfully!");
      // Reset field
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage("Failed to update password.");
    }
  };

  return (
    <Tabs defaultValue="profile" className="w-full">
      {/* Tabs Header */}
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="profile" className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center">
          <Lock className="w-4 h-4 mr-2" />
          Security
        </TabsTrigger>
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <form onSubmit={handleSaveProfile}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      {/* Security Tab */}
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <form onSubmit={handleUpdatePassword}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Update Password</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      {/* Thông báo success/error */}
      {message && (
        <p className="mt-4 text-center text-sm text-red-500">{message}</p>
      )}
    </Tabs>
  );
}
