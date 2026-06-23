"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useParentAuth } from "@/context/parent-auth-context";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Award, 
  BookOpen, 
  Percent, 
  Compass,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Simple custom component to render a GPA progress card/graph
function GpaTrendChart({ data }: { data: { term: string; gpa: number }[] }) {
  const maxGpa = 4.0;
  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-end h-44 gap-4 px-2 border-b border-gray-300 pb-2">
        {data.map((item, idx) => {
          const heightPercent = (item.gpa / maxGpa) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              {/* Value bubble on hover */}
              <span className="text-xs font-bold text-blue-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.gpa.toFixed(2)}
              </span>
              {/* Bar */}
              <div 
                style={{ height: `${heightPercent}%` }}
                className="w-full sm:w-10 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-indigo-600 shadow-sm relative"
              >
                <div className="absolute inset-0 bg-white/10 rounded-t-lg opacity-0 hover:opacity-100 transition-opacity"></div>
              </div>
              {/* Label */}
              <span className="text-xs text-gray-500 mt-2 text-center truncate w-full font-bold">
                {item.term}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 px-2 font-bold">
        <span>Max Scale: 4.00 GPA</span>
        <span className="flex items-center gap-1 font-extrabold text-blue-600">
          <TrendingUp className="h-3.5 w-3.5" />
          Improving GPA Trend
        </span>
      </div>
    </div>
  );
}

function AcademicProgressContent() {
  const { activeChild } = useParentAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  if (!activeChild) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500 font-semibold">Loading student profile...</p>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp className="h-4.5 w-4.5 text-green-500" />;
    if (trend === "down") return <TrendingDown className="h-4.5 w-4.5 text-red-500" />;
    return <Minus className="h-4.5 w-4.5 text-gray-400" />;
  };

  const getTrendBadge = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-300 font-bold">Improving</Badge>;
    if (trend === "down") return <Badge variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-300 font-bold">Needs Review</Badge>;
    return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300 font-bold">Stable</Badge>;
  };

  const handleDownloadReport = () => {
    toast({
      title: "Report Card PDF",
      description: `Report card for ${activeChild.fullName} is being generated... (Demo only)`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Quick Stats */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-300 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">
            Academic Performance Analysis
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold">
            View subjects grades, historical GPA rankings, and terminal report cards.
          </p>
        </div>
        <Button onClick={handleDownloadReport} className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 border border-blue-600">
          <Download className="h-4 w-4" />
          <span>Download Report Card</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-300 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-blue-700 uppercase tracking-wider">Current cumulative GPA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-4xl font-extrabold text-blue-900">{activeChild.gpa.toFixed(2)}</div>
            <p className="text-xs sm:text-sm text-blue-700 font-bold">Ranked #4 in {activeChild.grade.split(" (")[0]}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50/50 border-green-300 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-green-700 uppercase tracking-wider">Best Performing Subject</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-extrabold text-green-950">Science</div>
            <p className="text-xs sm:text-sm text-green-700 font-bold">Average: 92% (Grade: A+)</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50/50 border-purple-300 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-purple-700 uppercase tracking-wider">Academic Standing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-extrabold text-purple-950">Excellent</div>
            <p className="text-xs sm:text-sm text-purple-700 font-bold">Top 8% of the class grade</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] bg-secondary/80 rounded-xl p-1 mb-4 border border-gray-300">
          <TabsTrigger value="overview" className="rounded-lg text-sm font-semibold transition-all">Overview & Trends</TabsTrigger>
          <TabsTrigger value="breakdown" className="rounded-lg text-sm font-semibold transition-all">Term-wise Grades</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview & Trends */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Subject Performance List */}
            <Card className="md:col-span-2 border-gray-300 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Subject-Wise Performance
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Current marks average and performance direction.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {activeChild.subjectPerformance.map((subj, idx) => (
                  <div key={idx} className="space-y-2 border-b border-gray-300 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">{subj.subject}</span>
                        {getTrendBadge(subj.trend)}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-500">Grade {subj.grade}</span>
                        <span className="font-extrabold text-gray-900">{subj.percentage}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={subj.percentage} className="flex-1 h-2 rounded-full" />
                      {getTrendIcon(subj.trend)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* GPA Historical Trend */}
            <Card className="border-gray-300 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                  GPA Semester Trend
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Historical GPA trajectory over terms.</CardDescription>
              </CardHeader>
              <CardContent>
                <GpaTrendChart data={activeChild.academicProgress.gpaTrend} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Term-wise Grades */}
        <TabsContent value="breakdown" className="space-y-6">
          {activeChild.academicProgress.gradesBreakdown.map((termRecord, idx) => (
            <Card key={idx} className="border-gray-300 shadow-sm bg-white">
              <CardHeader className="border-b border-gray-300 bg-gray-50/50 flex flex-row items-center justify-between py-4 px-6 rounded-t-xl flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-bold text-gray-800">{termRecord.term}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Final grading and report cards for the term</CardDescription>
                </div>
                <Badge className="bg-blue-600 text-white font-bold text-sm px-3.5 py-1 rounded-full border border-blue-600">
                  Term GPA: {termRecord.gpa.toFixed(2)}
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300 bg-gray-50/20 text-xs font-bold text-gray-500 uppercase select-none">
                        <th className="py-3 px-3 sm:px-6">Subject</th>
                        <th className="py-3 px-3 sm:px-6 text-center">Marks</th>
                        <th className="py-3 px-3 sm:px-6 text-center">Total</th>
                        <th className="py-3 px-3 sm:px-6 text-center">Grade</th>
                        <th className="py-3 px-3 sm:px-6 text-right">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300 text-xs sm:text-sm">
                      {termRecord.subjects.map((subject, subIdx) => (
                        <tr key={subIdx} className="hover:bg-secondary/25 transition-colors">
                          <td className="py-3 sm:py-4 px-3 sm:px-6 font-bold text-gray-800">{subject.name}</td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6 text-center font-semibold text-gray-900">{subject.marksObtained}</td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6 text-center text-gray-500 font-semibold">{subject.totalMarks}</td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6 text-center">
                            <span className={cn(
                              "font-bold px-2 py-0.5 rounded-full text-[10px] sm:text-xs border",
                              subject.grade.startsWith("A") ? "bg-green-100 text-green-700 border-green-300" :
                              subject.grade.startsWith("B") ? "bg-blue-100 text-blue-700 border-blue-300" :
                              "bg-yellow-100 text-yellow-700 border-yellow-300"
                            )}>
                              {subject.grade}
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6 text-right text-gray-650 font-bold text-xs sm:text-sm">
                            {subject.marksObtained >= 90 ? "Excellent" :
                             subject.marksObtained >= 80 ? "Very Good" :
                             subject.marksObtained >= 70 ? "Good" : "Needs Improvement"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AcademicProgressPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <AcademicProgressContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
