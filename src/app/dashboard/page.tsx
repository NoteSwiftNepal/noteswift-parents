"use client";

import { useParentAuth } from "@/context/parent-auth-context";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ArrowUpRight,
  BookMarked,
  Bell,
  CalendarDays,
  UserCheck,
  Loader2,
  BrainCircuit
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { mockDatabase } from "@/data/mockData";

function DashboardContent() {
  const { parent, activeChild } = useParentAuth();

  if (!activeChild) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading student profile...</p>
        </div>
      </div>
    );
  }

  // Heatmap rendering helpers
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const heatmapData = activeChild.activityHeatmap; // 56 entries (8 weeks * 7 days)
  
  // Group heatmapData into columns of 7 days (representing weeks)
  const weeks: number[][] = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  const getHeatmapColor = (hours: number) => {
    if (hours === 0) return "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 border border-gray-200/50";
    if (hours === 1) return "bg-emerald-200 hover:bg-emerald-300";
    if (hours === 2) return "bg-emerald-400 hover:bg-emerald-500";
    if (hours === 3) return "bg-emerald-600 hover:bg-emerald-700";
    return "bg-emerald-800 hover:bg-emerald-900";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-xl -mb-8"></div>
        
        <div className="relative z-10 space-y-3">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
            Parent Overview
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Namaste, {parent?.fullName}!
          </h2>
          <p className="text-blue-100 text-sm md:text-base max-w-xl">
            Here's how <span className="font-bold text-white underline decoration-yellow-400 underline-offset-4">{activeChild.fullName}</span> is progressing today. Check attendance, assignment alerts, and term grades.
          </p>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Classes Attended */}
        <Card className="hover:shadow-md transition-shadow border-gray-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Classes Today</CardTitle>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-gray-900">
              {activeChild.classesAttendedToday} / {activeChild.totalClassesToday}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold">Attended classes</p>
          </CardContent>
        </Card>

        {/* Due Assignments */}
        <Card className="hover:shadow-md transition-shadow border-gray-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assignments Due</CardTitle>
            <div className="p-2 rounded-xl bg-yellow-50 text-yellow-600">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="text-3xl font-extrabold text-gray-900">
              {activeChild.assignmentsDueCount}
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant={activeChild.assignmentsDueStatus === "On track" ? "secondary" : "destructive"} className="text-xs px-2.5 py-0.5 rounded-full font-bold">
                {activeChild.assignmentsDueStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Study Hours */}
        <Card className="hover:shadow-md transition-shadow border-gray-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Study Time Today</CardTitle>
            <div className="p-2 rounded-xl bg-green-50 text-green-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-gray-900">
              {activeChild.studyHoursToday} hrs
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold">Active on learning portal</p>
          </CardContent>
        </Card>

        {/* Mock Test Score */}
        <Card className="hover:shadow-md transition-shadow border-gray-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Latest Test Score</CardTitle>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-gray-900">
              {activeChild.latestMockTestScore}%
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold">Math Trigonometry Exam</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: AI Insights + Heatmap */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: AI Recommendations & Insights */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-gray-300 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-300 pb-4">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-indigo-500 shrink-0" />
                <span>Academic Insights & Recommendations</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Learning indicators based on active performance logs.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {activeChild.aiInsights.map((insight, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm",
                    insight.type === "warning" ? "bg-red-50/50 border-red-300 text-red-900" :
                    insight.type === "good" ? "bg-green-50/50 border-green-300 text-green-900" :
                    "bg-blue-50/50 border-blue-300 text-blue-900"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-xl",
                    insight.type === "warning" ? "bg-red-100 text-red-600" :
                    insight.type === "good" ? "bg-green-100 text-green-600" :
                    "bg-blue-100 text-blue-600"
                  )}>
                    {insight.type === "warning" ? <AlertTriangle className="h-5 w-5" /> :
                     insight.type === "good" ? <CheckCircle className="h-5 w-5" /> :
                     <Info className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-bold capitalize">
                      {insight.type === "warning" ? "Needs Attention" :
                       insight.type === "good" ? "Academic Success" : "General Update"}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-medium">{insight.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activity Heatmap Grid */}
          <Card className="border-gray-300 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-300 pb-4">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-500" />
                Study Activity Log (Last 8 Weeks)
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Daily learning hours tracked on the NoteSwift student app.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center sm:items-start gap-4">
                <div className="flex items-start gap-2 overflow-x-auto w-full pb-2">
                  {/* Row Names */}
                  <div className="grid grid-rows-7 gap-1 text-xs font-bold text-gray-500 pr-1 pt-1 select-none">
                    {daysOfWeek.map((day, idx) => (
                      <div key={idx} className="h-4 flex items-center justify-end pr-1">
                        {idx % 2 === 1 && day}
                      </div>
                    ))}
                  </div>

                  {/* Grid Box */}
                  <div className="flex gap-1.5">
                    {weeks.map((week, wIdx) => (
                      <div key={wIdx} className="grid grid-rows-7 gap-1.5">
                        {week.map((hours, dIdx) => (
                          <div
                            key={dIdx}
                            className={cn(
                              "h-4 w-4 rounded-sm transition-all duration-200 cursor-pointer relative group",
                              getHeatmapColor(hours)
                            )}
                            title={`Week ${wIdx + 1}, Day ${dIdx + 1}: ${hours} study hours`}
                          >
                            {/* Simple tooltip wrapper */}
                            <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 shadow-md">
                              {hours} hrs studied
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 self-end text-xs font-bold text-gray-500 select-none">
                  <span>Less</span>
                  <div className="h-3 w-3 rounded-sm bg-gray-100 border border-gray-300/50"></div>
                  <div className="h-3 w-3 rounded-sm bg-emerald-200"></div>
                  <div className="h-3 w-3 rounded-sm bg-emerald-400"></div>
                  <div className="h-3 w-3 rounded-sm bg-emerald-600"></div>
                  <div className="h-3 w-3 rounded-sm bg-emerald-800"></div>
                  <span>More</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Upcoming Alerts & Notices */}
        <div className="space-y-6">
          {/* Actionable Alerts */}
          <Card className="border-gray-300 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-300 pb-4">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-500" />
                Action Items & Deadlines
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Important tasks that require prompt attention.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-3.5">
              {activeChild.upcomingAlerts.map((alert, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-gray-300 hover:bg-secondary/20 transition-all">
                  <span className={cn(
                    "flex h-2.5 w-2.5 rounded-full mt-1.5 shrink-0",
                    alert.statusDot === "red" ? "bg-red-500 animate-pulse" :
                    alert.statusDot === "yellow" ? "bg-yellow-500" :
                    alert.statusDot === "green" ? "bg-green-500" : "bg-blue-500"
                  )} />
                  <div className="flex-1 space-y-1.5">
                    <p className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
                      {alert.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                      <span className="capitalize bg-secondary px-1.5 py-0.5 rounded-md font-bold text-gray-650">
                        {alert.type}
                      </span>
                      <span>•</span>
                      <span>Due: {alert.relativeTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Activity Timeline */}
          <Card className="border-gray-300 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-300 pb-4">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-500" />
                Today's Log
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Live study activity logged today.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative border-l-2 border-gray-300 pl-6 ml-3 space-y-6">
                {activeChild.activityTimeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle Dot */}
                    <div className="absolute -left-[37px] top-0.5 flex items-center justify-center h-6 w-6 rounded-full bg-white border-2 border-indigo-500 shadow-sm">
                      <BookMarked className="h-3 w-3 text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {item.time}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-800">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                        {item.subtext}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* School Announcements Section */}
      <Card className="border-gray-300 shadow-sm bg-white">
        <CardHeader className="border-b border-gray-300 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-500" />
                School Notice Board
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Important school-wide circulars and announcements.</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-xl border-gray-300">
              <Link href="/messages" className="flex items-center gap-1">
                <span>View Message Center</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {mockDatabase.notices.map((notice) => (
              <div 
                key={notice.id} 
                className="p-5 rounded-2xl border border-gray-300 bg-gradient-to-b from-gray-50/50 to-white hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant={notice.category === "exam" ? "destructive" : notice.category === "event" ? "default" : "secondary"} className="text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    {notice.category}
                  </Badge>
                  <span className="text-xs text-gray-500 font-bold">{notice.date}</span>
                </div>
                <h4 className="text-sm font-bold text-gray-800 line-clamp-1 leading-snug">
                  {notice.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 font-medium line-clamp-3 leading-relaxed">
                  {notice.content}
                </p>
                <div className="border-t border-gray-300 pt-2.5 text-xs text-gray-500 font-semibold flex items-center justify-between">
                  <span>Issued by:</span>
                  <span className="font-bold text-gray-700">{notice.author}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
