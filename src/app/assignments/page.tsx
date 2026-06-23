"use client";

import React, { useState } from "react";
import { useParentAuth } from "@/context/parent-auth-context";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Bookmark, 
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

function AssignmentsContent() {
  const { activeChild } = useParentAuth();
  const [activeTab, setActiveTab] = useState("all");

  if (!activeChild) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading student profile...</p>
        </div>
      </div>
    );
  }

  const assignments = activeChild.assignments;

  // Filter assignments based on tab selection
  const filteredAssignments = assignments.filter(item => {
    if (activeTab === "all") return true;
    return item.submissionStatus === activeTab;
  });

  const getStatusBadge = (status: "submitted" | "pending" | "late") => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200 rounded-full font-semibold px-3 py-0.5">Submitted</Badge>;
      case "pending":
        return <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-250 rounded-full font-semibold px-3 py-0.5 animate-pulse">Pending</Badge>;
      case "late":
        return <Badge variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 rounded-full font-semibold px-3 py-0.5">Late</Badge>;
    }
  };

  const getStatusIcon = (status: "submitted" | "pending" | "late") => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500 shrink-0" />;
      case "late":
        return <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-300 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">
            Homework & Assignments
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold">
            Monitor assignments due dates, completion statuses, and teacher grades.
          </p>
        </div>
      </div>

      {/* Tabs list to filter assignments */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
          <TabsList className="bg-secondary/60 rounded-xl p-1 grid grid-cols-4 w-full sm:max-w-[420px] border border-gray-300">
            <TabsTrigger value="all" className="rounded-lg text-xs sm:text-sm font-semibold transition-all">All</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg text-xs sm:text-sm font-semibold transition-all">Pending</TabsTrigger>
            <TabsTrigger value="submitted" className="rounded-lg text-xs sm:text-sm font-semibold transition-all">Submitted</TabsTrigger>
            <TabsTrigger value="late" className="rounded-lg text-xs sm:text-sm font-semibold transition-all">Late</TabsTrigger>
          </TabsList>
          
          <div className="text-xs font-bold text-gray-500 bg-secondary/30 px-3 py-1.5 rounded-lg border border-gray-300">
            Total: {filteredAssignments.length} Assignments Shown
          </div>
        </div>

        {/* Content Tabs */}
        <TabsContent value={activeTab} className="space-y-4 pt-1">
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <Card 
                  key={assignment.id} 
                  className={cn(
                    "hover:shadow-md transition-all border border-gray-300 bg-white relative overflow-hidden flex flex-col justify-between",
                    assignment.submissionStatus === "pending" ? "border-l-4 border-l-yellow-400" :
                    assignment.submissionStatus === "late" ? "border-l-4 border-l-red-400" :
                    "border-l-4 border-l-green-400"
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {assignment.subject}
                          </span>
                        </div>
                        <CardTitle className="text-sm sm:text-base font-bold text-gray-800 leading-snug">
                          {assignment.title}
                        </CardTitle>
                      </div>
                      {getStatusIcon(assignment.submissionStatus)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-2 flex flex-col justify-end gap-4">
                    <div className="flex items-center justify-between text-xs border-t border-gray-300 pt-3 flex-wrap gap-2">
                      <div className="flex items-center gap-1 text-gray-500 font-bold">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                      
                      {getStatusBadge(assignment.submissionStatus)}
                    </div>

                    {/* Score / Grade Section */}
                    {assignment.submissionStatus === "submitted" || assignment.submissionStatus === "late" ? (
                      <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between border border-gray-300/60">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                          <GraduationCap className="h-4.5 w-4.5 text-blue-500" />
                          <span>Evaluation Grade</span>
                        </div>
                        <span className="text-sm font-extrabold text-gray-850">
                          {assignment.score || "Pending Grading"}
                        </span>
                      </div>
                    ) : (
                      <div className="bg-yellow-50/50 rounded-xl p-3 flex items-center justify-between border border-yellow-200">
                        <div className="flex items-center gap-2 text-xs font-bold text-yellow-800">
                          <Bookmark className="h-4.5 w-4.5 text-yellow-600" />
                          <span>Action Required</span>
                        </div>
                        <span className="text-xs font-bold text-yellow-700">Needs Submission</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 py-16 text-center border-2 border-dashed rounded-3xl border-gray-300">
                <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-gray-700">No Assignments Found</h4>
                <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1 px-4 max-w-sm mx-auto">
                  There are no assignments matching the "{activeTab}" filter for {activeChild.fullName}.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AssignmentsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <AssignmentsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
