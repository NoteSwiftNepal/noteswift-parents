"use client";

import React, { useState } from "react";
import { useParentAuth } from "@/context/parent-auth-context";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { USE_MOCK_DATA } from "@/config/app-config";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, Loader2, Check, GraduationCap, Link2Off } from "lucide-react";

function SettingsContent() {
  const { parent, children: linkedChildren, updateProfile, linkStudent, unlinkStudent } = useParentAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(parent?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(parent?.phoneNumber || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Link/Unlink child state
  const [linkCode, setLinkCode] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);

  const handleUnlinkStudent = async (studentId: string, studentName: string) => {
    const confirm = window.confirm(`Are you sure you want to disconnect ${studentName} from your account? You will lose access to their academic stats, attendance, and progress reports.`);
    if (!confirm) return;

    setUnlinkingId(studentId);
    try {
      const result = await unlinkStudent(studentId);
      if (result.success) {
        toast({
          title: "Student Unlinked",
          description: `Successfully disconnected ${studentName}'s profile.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Unlink Failed",
          description: result.message || "Failed to disconnect student profile.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while unlinking student.",
      });
    } finally {
      setUnlinkingId(null);
    }
  };

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError("");
    
    if (!linkCode.trim()) {
      setLinkError("Please enter a linking code.");
      return;
    }
    
    setIsLinking(true);
    try {
      const result = await linkStudent(linkCode);
      setIsLinking(false);
      
      if (result.success) {
        toast({
          title: "Student Linked",
          description: "Student profile has been linked to your account successfully.",
        });
        setLinkCode("");
      } else {
        setLinkError(result.message || "Failed to link student profile.");
      }
    } catch (err) {
      setIsLinking(false);
      setLinkError("An error occurred. Please try again.");
    }
  };

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

          {/* Linked Students Card */}
          <Card className="border-gray-300 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-300 pb-4">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-500" />
                Linked Student Profiles
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">
                Manage linked child profiles or register a new student using their linking code.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Linked Students List */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-gray-700">Currently Linked Students</Label>
                {linkedChildren && linkedChildren.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {linkedChildren.map((child) => (
                      <div 
                        key={child.id} 
                        className="flex items-center justify-between p-3.5 rounded-xl border border-gray-300 bg-secondary/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs shrink-0 border border-blue-200 overflow-hidden">
                            {child.avatarEmoji && (child.avatarEmoji.startsWith('http://') || child.avatarEmoji.startsWith('https://')) ? (
                              <img src={child.avatarEmoji} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              child.avatarEmoji
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-800 leading-tight">{child.fullName}</span>
                            <span className="text-[10px] text-gray-500 font-bold">{child.grade}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={unlinkingId === child.id}
                          onClick={() => handleUnlinkStudent(child.id, child.fullName)}
                          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center rounded-lg transition-colors border border-transparent shrink-0"
                          title="Disconnect Student"
                        >
                          {unlinkingId === child.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                          ) : (
                            <Link2Off className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center text-xs text-gray-500 font-bold">
                    No student profiles linked to this account yet.
                  </div>
                )}
              </div>

              {/* Link Form */}
              <div className="border-t border-gray-200 pt-5 space-y-4">
                <h4 className="text-xs font-bold text-gray-800">Link Another Student</h4>
                <form onSubmit={handleLinkStudent} className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full space-y-2">
                    <Label htmlFor="linkCodeInput" className="text-[11px] font-bold text-gray-700">Parent Linking Code</Label>
                    <Input
                      id="linkCodeInput"
                      placeholder="NSP-XXXX-XXXX"
                      value={linkCode}
                      onChange={(e) => setLinkCode(e.target.value)}
                      className="h-11 border-gray-300 uppercase tracking-wider text-xs sm:text-sm rounded-xl focus:border-blue-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLinking}
                    className="h-11 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm px-5 shrink-0 border border-blue-600 w-full sm:w-auto"
                  >
                    {isLinking ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Linking...
                      </>
                    ) : (
                      "Link Student"
                    )}
                  </Button>
                </form>

                {/* Demo Assist */}
                {USE_MOCK_DATA && (
                  <div className="bg-yellow-50/70 border border-yellow-200 rounded-xl p-3.5 text-xs text-yellow-750 font-medium">
                    <p className="font-bold flex items-center gap-1 mb-0.5">
                      <span>💡</span> Demo Student Linking Code
                    </p>
                    <span>
                      Use code <span className="font-mono font-extrabold bg-white px-1.5 py-0.5 rounded border border-yellow-300 text-yellow-805">NSP-4X8K-92LQ</span> to link.
                    </span>
                  </div>
                )}

                {linkError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs font-bold text-red-650">
                    ⚠️ {linkError}
                  </div>
                )}
              </div>
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
