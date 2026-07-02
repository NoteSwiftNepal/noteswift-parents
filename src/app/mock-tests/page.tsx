"use client";

import React from "react";
import { useParentAuth } from "@/context/parent-auth-context";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, HelpCircle, Calendar, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

function MockTestsContent() {
  const { activeChild } = useParentAuth();

  if (!activeChild) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading student profile...</p>
        </div>
      </div>
    );
  }

  const tests = activeChild.mockTests || [];

  // Calculate overall performance summary
  const totalTests = tests.length;
  const averageScore = totalTests > 0 
    ? Math.round(tests.reduce((sum, t) => sum + (t.score / t.totalMarks * 100), 0) / totalTests)
    : 0;

  const averageClassScore = totalTests > 0
    ? Math.round(tests.reduce((sum, t) => sum + t.classAverage, 0) / totalTests)
    : 0;

  const scoreDiff = averageScore - averageClassScore;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">
          Mock Tests & Terminal Exams
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-semibold">
          Track preparation benchmarks and class percentile averages for critical tests.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Average Test Score */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-300 shadow-sm">
          <CardHeader className="pb-1.5">
            <CardTitle className="text-xs font-bold text-blue-700 uppercase tracking-wider">Average Mock Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-blue-900">{averageScore}%</div>
            <p className="text-xs sm:text-sm text-blue-700 font-bold">Over {totalTests} exams taken</p>
          </CardContent>
        </Card>

        {/* Comparison with Class Average */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50/50 border-green-300 shadow-sm">
          <CardHeader className="pb-1.5">
            <CardTitle className="text-xs font-bold text-green-700 uppercase tracking-wider">vs Class Average</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-green-900">
              {scoreDiff >= 0 ? `+${scoreDiff}%` : `${scoreDiff}%`}
            </div>
            <p className="text-xs sm:text-sm text-green-700 font-bold flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Above average class percentile
            </p>
          </CardContent>
        </Card>

        {/* Overall Rank Estimation */}
        <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50/50 border-purple-300 shadow-sm">
          <CardHeader className="pb-1.5">
            <CardTitle className="text-xs font-bold text-purple-700 uppercase tracking-wider">Percentile rank</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-purple-900">Top 12%</div>
            <p className="text-xs sm:text-sm text-purple-700 font-bold">Estimated rank standing</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Comparison List */}
      <Card className="border-gray-300 shadow-sm bg-white">
        <CardHeader className="border-b border-gray-300 pb-4">
          <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-500" />
            Comparison Analysis
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">
            Detailed analysis comparing {activeChild.fullName}'s scores against class performance.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 px-0 sm:px-6">
          <div className="space-y-6">
            {tests.map((test) => {
              const studentPercentage = Math.round((test.score / test.totalMarks) * 100);
              const isAboveAverage = studentPercentage >= test.classAverage;

              return (
                <div key={test.id} className="p-4 sm:p-5 border border-gray-300 rounded-2xl bg-gradient-to-b from-gray-50/40 to-white hover:shadow-md transition-all space-y-4">
                  {/* Info Header */}
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {test.subject}
                        </span>
                        <span className="text-xs text-gray-500 font-bold flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {test.date}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-gray-800">{test.title}</h4>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="text-right">
                        <div className="text-base sm:text-lg font-extrabold text-gray-900">
                          {test.score} / {test.totalMarks}
                        </div>
                        <span className="text-xs text-gray-500 font-bold">Score Obtained</span>
                      </div>
                      <span className={cn(
                        "h-8.5 w-8.5 flex items-center justify-center rounded-xl text-xs font-bold shadow-sm shrink-0 border",
                        isAboveAverage ? "bg-green-100 text-green-700 border-green-300" : "bg-yellow-100 text-yellow-700 border-yellow-350"
                      )}>
                        {studentPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Graphical Comparison Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                      <span>Performance Index</span>
                      <span className={isAboveAverage ? "text-green-750 font-bold" : "text-amber-750 font-bold"}>
                        {isAboveAverage ? `+${studentPercentage - test.classAverage}% above average` : `${studentPercentage - test.classAverage}% below average`}
                      </span>
                    </div>

                    {/* Visual Comparison progress */}
                    <div className="relative pt-4 pb-2">
                      {/* Main progress bar (Student score) */}
                      <Progress value={studentPercentage} className="h-2 rounded-full" />
                      
                      {/* Indicator for Class Average */}
                      <div 
                        style={{ left: `${test.classAverage}%` }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex flex-col items-center group cursor-pointer"
                      >
                        {/* Vertical line indicator */}
                        <div className="h-5 w-1 bg-indigo-650 rounded-full shadow border border-white"></div>
                        {/* Tooltip detail */}
                        <span className="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-indigo-900 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 shadow-md">
                          Class Avg: {test.classAverage}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-550 pt-1.5 font-bold select-none">
                      <span>0% Failed</span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-500" /> Child's Score ({studentPercentage}%)
                        <span className="h-2.5 w-1 bg-indigo-600 rounded" /> Class Average ({test.classAverage}%)
                      </span>
                      <span>100% Perfect</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MockTestsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <MockTestsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
