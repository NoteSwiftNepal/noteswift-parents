"use client";

import React, { useState } from "react";
import { useParentAuth } from "@/context/parent-auth-context";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle2, XCircle, AlertCircle, CalendarRange, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

function AttendanceContent() {
  const { activeChild } = useParentAuth();
  const [filter, setFilter] = useState<"all" | "present" | "absent" | "late" | "leave">("all");

  if (!activeChild) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading student profile...</p>
        </div>
      </div>
    );
  }

  const attendance = activeChild.attendanceHistory || [];

  // Calculate counts
  const totalDays = attendance.length;
  const presentDays = attendance.filter(r => r.status === "present").length;
  const absentDays = attendance.filter(r => r.status === "absent").length;
  const lateDays = attendance.filter(r => r.status === "late").length;
  const leaveDays = attendance.filter(r => r.status === "leave").length;

  const filteredAttendance = attendance.filter(record => {
    if (filter === "all") return true;
    return record.status === filter;
  });

  const getStatusBadge = (status: "present" | "absent" | "late" | "leave") => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-150 rounded-full font-semibold px-3 py-0.5 text-xs">Present</Badge>;
      case "absent":
        return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-150 rounded-full font-semibold px-3 py-0.5 text-xs">Absent</Badge>;
      case "late":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-150 rounded-full font-semibold px-3 py-0.5 text-xs">Late</Badge>;
      case "leave":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-150 rounded-full font-semibold px-3 py-0.5 text-xs">Approved Leave</Badge>;
    }
  };

  const getStatusColor = (status: "present" | "absent" | "late" | "leave") => {
    switch (status) {
      case "present": return "bg-green-500";
      case "absent": return "bg-red-500";
      case "late": return "bg-amber-500";
      case "leave": return "bg-blue-500";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">
          Attendance Analytics
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-semibold">
          Track daily class participation records and approved leaves.
        </p>
      </div>

      {/* Attendance Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Attendance Percentage */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-300 shadow-sm sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-1.5">
            <CardTitle className="text-xs font-bold text-blue-700 uppercase tracking-wider">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-4xl font-extrabold text-blue-900">
              {activeChild.attendancePercent}%
            </div>
            <p className="text-xs text-blue-700 font-bold">Goal: Keep above 90%</p>
          </CardContent>
        </Card>

        {/* Present Days */}
        <Card className="border-gray-300 shadow-sm bg-white">
          <CardHeader className="pb-1.5 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Present</CardTitle>
            <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-gray-900">{presentDays}</div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-semibold">Days present</p>
          </CardContent>
        </Card>

        {/* Late Days */}
        <Card className="border-gray-300 shadow-sm bg-white">
          <CardHeader className="pb-1.5 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Late</CardTitle>
            <Clock className="h-4.5 w-4.5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-gray-900">{lateDays}</div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-semibold">Late arrivals</p>
          </CardContent>
        </Card>

        {/* Approved Leave */}
        <Card className="border-gray-300 shadow-sm bg-white">
          <CardHeader className="pb-1.5 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Leaves</CardTitle>
            <AlertCircle className="h-4.5 w-4.5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-gray-900">{leaveDays}</div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-semibold">Approved leaves</p>
          </CardContent>
        </Card>

        {/* Absent Days */}
        <Card className="border-gray-300 shadow-sm bg-white">
          <CardHeader className="pb-1.5 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Absent</CardTitle>
            <XCircle className="h-4.5 w-4.5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-red-650">{absentDays}</div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-semibold">Unexcused absences</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Layout: Visual Attendance Calendar Grid + Detailed Logs */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Visual Attendance Calendar Grid */}
        <Card className="border-gray-300 shadow-sm bg-white md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
              <CalendarRange className="h-5 w-5 text-blue-500" />
              Calendar Grid (Last 30 Days)
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Daily attendance status grid.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {attendance.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs font-semibold">
                No calendar grid data. Participation logs will show up here once class sessions are active.
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-3 max-w-[280px] mx-auto pt-4">
                {attendance.map((record, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "aspect-square rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm relative group cursor-pointer transition-transform hover:scale-105",
                      getStatusColor(record.status)
                    )}
                  >
                    {new Date(record.date).getDate()}
                    
                    {/* Tooltip */}
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 shadow-md">
                      {record.date} ({record.status})
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Map Legend */}
            <div className="mt-8 grid grid-cols-2 gap-2 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-green-500 shrink-0" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500 shrink-0" />
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-amber-500 shrink-0" />
                <span>Late</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-blue-500 shrink-0" />
                <span>Approved Leave</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Detailed Attendance Logs Table */}
        <Card className="border-gray-300 shadow-sm bg-white md:col-span-2">
          <CardHeader className="border-b border-gray-300 pb-4 flex flex-row items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-base font-bold text-gray-800">Attendance Log</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Comprehensive list of daily registry reports.</CardDescription>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-1 bg-secondary/60 p-1 rounded-xl border border-gray-300">
              {(["all", "present", "absent", "late", "leave"] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-lg font-bold capitalize transition-all",
                    filter === type ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-805"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50/25 text-xs font-bold text-gray-500 uppercase select-none">
                    <th className="py-3 px-3 sm:px-6">Date</th>
                    <th className="py-3 px-3 sm:px-6">Status</th>
                    <th className="py-3 px-3 sm:px-6">Reason / Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 text-xs sm:text-sm">
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((record, idx) => (
                      <tr key={idx} className="hover:bg-secondary/15 transition-colors">
                        <td className="py-2 sm:py-3.5 px-3 sm:px-6 font-semibold text-gray-700">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </td>
                        <td className="py-2 sm:py-3.5 px-3 sm:px-6">{getStatusBadge(record.status)}</td>
                        <td className="py-2 sm:py-3.5 px-3 sm:px-6 text-gray-500 font-semibold">
                          {record.reason || "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-gray-500 font-semibold">
                        No attendance records match the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <AttendanceContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
