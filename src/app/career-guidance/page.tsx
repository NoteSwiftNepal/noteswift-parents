"use client";

import React, { useState } from "react";
import { useParentAuth } from "@/context/parent-auth-context";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Compass, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Briefcase, 
  GraduationCap,
  Clock,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockDatabase } from "@/data/mockData";

function CareerGuidanceContent() {
  const { activeChild } = useParentAuth();
  const { toast } = useToast();
  
  if (!activeChild) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading student profile...</p>
        </div>
      </div>
    );
  }

  // Filter resources based on the active child's age/grade level
  const isHighSchool = activeChild.grade.includes("Grade 10");
  const filteredResources = mockDatabase.guidance.filter(resource => {
    if (isHighSchool) {
      // Grade 10: Career Planning, Academic Streams, Stress
      return ["Career Planning", "Academic Streams", "Mental Well-being"].includes(resource.category);
    } else {
      // Middle school Grade 7: Study Tips, Mental Stress, etc.
      return ["Study Tips", "Mental Well-being"].includes(resource.category);
    }
  });

  const handleReadResource = (title: string) => {
    toast({
      title: "Reading Resource",
      description: `Opening "${title}" guide details... (Demo only)`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-300 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800">
            Career Guidance & Planning Hub
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold">
            Curated resources, advice, and paths tailored to {activeChild.fullName}'s academic level.
          </p>
        </div>
      </div>

      {/* Level-Specific Guidance Notice */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-300 shadow-sm rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl"></div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl shrink-0 border border-indigo-200">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-indigo-900">
              Personalized Recommendations for {activeChild.fullName} ({isHighSchool ? "Secondary School Track" : "Middle School Track"})
            </h3>
            <p className="text-xs sm:text-sm text-indigo-700 leading-relaxed font-semibold">
              {isHighSchool 
                ? "Since Aarav is in Grade 10, this is a crucial year for stream choices (Science vs Commerce vs Humanities) and board preparation. Explore guidance tracks on elective choices and career roadmaps in Nepal."
                : "Since Ishan is in Grade 7, the focus is on foundation building, healthy study habits, and interest mapping. Help Ishan build time management skills and explore interactive science worksheets."}
            </p>
          </div>
        </div>
      </Card>

      {/* Suggested Career Pathways (Nepal Context) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Academic stream options */}
        <Card className="border-gray-300 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-500" />
              Stream Explorations (+2 Level)
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Major pathways available after secondary school (SEE).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-gray-300 rounded-2xl bg-secondary/15 hover:bg-secondary/30 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-800">Science Stream</h4>
                <Badge className="bg-blue-100 text-blue-750 hover:bg-blue-100 font-bold text-xs rounded-full border border-blue-300 px-2 py-0.5">Engineering / Medicine</Badge>
              </div>
              <p className="text-xs text-gray-550 leading-relaxed font-semibold">
                Focuses on Mathematics, Physics, Chemistry, Biology, and Computer Science. Ideal for students aiming for healthcare, software engineering, and scientific research careers.
              </p>
            </div>

            <div className="p-4 border border-gray-300 rounded-2xl bg-secondary/15 hover:bg-secondary/30 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-800">Management Stream</h4>
                <Badge className="bg-green-100 text-green-750 hover:bg-green-100 font-bold text-xs rounded-full border border-green-300 px-2 py-0.5">Business / Tech</Badge>
              </div>
              <p className="text-xs text-gray-550 leading-relaxed font-semibold">
                Focuses on Accountancy, Economics, Business Studies, and Computer Applications. Perfect for prospective entrepreneurs, accountants, managers, and IT business developers.
              </p>
            </div>

            <div className="p-4 border border-gray-300 rounded-2xl bg-secondary/15 hover:bg-secondary/30 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-800">Humanities & Law Stream</h4>
                <Badge className="bg-purple-100 text-purple-750 hover:bg-purple-100 font-bold text-xs rounded-full border border-purple-300 px-2 py-0.5">Arts / Civil Services</Badge>
              </div>
              <p className="text-xs text-gray-550 leading-relaxed font-semibold">
                Focuses on Sociology, Psychology, History, Mass Communication, and Political Sciences. Ideal for public speaking, legal tracks, teaching, journalism, and public policy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resources Articles List */}
        <Card className="border-gray-300 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              Recommended Reading
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Helpful manuals, stress advice and career guidance writeups.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredResources.map((resource) => (
              <div 
                key={resource.id}
                className="p-4 border border-gray-300 rounded-2xl hover:shadow-md transition-all flex flex-col justify-between h-full bg-white relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-50 text-indigo-750 border border-indigo-300">
                      {resource.category}
                    </Badge>
                    <span className="text-xs text-gray-500 font-bold flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {resource.readTime}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-850 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h4>
                  <p className="text-xs text-gray-550 leading-relaxed font-semibold">
                    {resource.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-gray-300 mt-4 flex items-center justify-end">
                  <Button 
                    onClick={() => handleReadResource(resource.title)}
                    variant="ghost" 
                    size="sm" 
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 rounded-xl border border-transparent hover:border-gray-200"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CareerGuidancePage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <CareerGuidanceContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
