"use client";

import React, { useState } from "react";
import { useParentAuth } from "@/context/parent-auth-context";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, Loader2, Check } from "lucide-react";

function SettingsContent() {
  const { parent, updateProfile } = useParentAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(parent?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(parent?.phoneNumber || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Notification states
  const [emailDigest, setEmailDigest] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Full name and phone number fields cannot be left empty.",
      });
      return;
    }

    setIsUpdating(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const result = await updateProfile(fullName, phoneNumber);
    setIsUpdating(false);

    if (result.success) {
      toast({
        title: "Profile Updated",
        description: "Your parent profile information has been successfully saved.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile settings.",
      });
    }
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Preferences Saved",
      description: "Your notification alert preferences have been successfully updated.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">
          Account Settings
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-semibold">
          Manage your contact credentials and adjust notification preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Personal Profile Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-gray-300 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-300 pb-4">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Personal Profile
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">
                Update your primary name and phone number. This name will appear on fee statements.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-bold text-gray-700">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name"
                      className="h-11 border-gray-300 text-xs sm:text-sm rounded-xl focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-xs font-bold text-gray-700">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      className="h-11 border-gray-300 text-xs sm:text-sm rounded-xl focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-gray-700">Email Address (Sign in ID)</Label>
                  <Input
                    id="email"
                    value={parent?.email || ""}
                    disabled
                    className="h-11 border-gray-250 bg-secondary/35 text-xs sm:text-sm rounded-xl cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 font-bold">
                    Sign in email ID is managed by the system administrator and cannot be modified.
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-300 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm px-6 h-11 flex items-center gap-1.5 border border-blue-600"
                  >
                    {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isUpdating ? "Updating profile..." : "Save Profile Settings"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security Credentials */}
          <Card className="border-gray-300 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-300 pb-4">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" />
                Security Credentials
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">
                Change password to protect account access. (Stub Simulation)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700">New Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled
                    className="h-11 border-gray-300 bg-secondary/15 cursor-not-allowed rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700">Confirm New Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled
                    className="h-11 border-gray-300 bg-secondary/15 cursor-not-allowed rounded-xl"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 font-bold">
                Password controls are locked for demo accounts.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Notification settings */}
        <div className="space-y-6">
          <Card className="border-gray-300 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-300 pb-4">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-500" />
                Notifications
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">
                Configure real-time academic digests.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Digest Switch */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-gray-850 leading-tight">Weekly Email Digest</Label>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                    Receive weekly summary report cards detailing grading progress and attendance rates.
                  </p>
                </div>
                <Switch
                  checked={emailDigest}
                  onCheckedChange={setEmailDigest}
                  className="rounded-full"
                />
              </div>

              {/* SMS Warnings */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-gray-855 leading-tight">Critical SMS Alerts</Label>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                    Receive direct SMS messages regarding unexcused absences or urgent payments.
                  </p>
                </div>
                <Switch
                  checked={smsAlerts}
                  onCheckedChange={setSmsAlerts}
                  className="rounded-full"
                />
              </div>

              {/* Push Notifications */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-gray-860 leading-tight">Instant Push Alerts</Label>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                    Receive instant push updates on assignments graded or messages sent by teachers.
                  </p>
                </div>
                <Switch
                  checked={pushAlerts}
                  onCheckedChange={setPushAlerts}
                  className="rounded-full"
                />
              </div>

              <div className="pt-4 border-t border-gray-300 flex justify-end">
                <Button
                  onClick={handleSaveNotifications}
                  type="button"
                  className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm px-6 h-10 flex items-center gap-1.5 border border-blue-600"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Preferences</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <SettingsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
