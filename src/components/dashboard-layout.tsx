"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  ClipboardList,
  Award,
  MessageSquare,
  Compass,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  Menu,
  ChevronDown,
  User,
  Globe,
  Loader2,
  Calendar,
  Lock
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useParentAuth } from "@/context/parent-auth-context";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Navigation links configuration
const navSections = [
  {
    title: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/academic-progress", label: "Academic Progress", icon: GraduationCap },
      { href: "/attendance", label: "Attendance", icon: CalendarDays },
      { href: "/assignments", label: "Assignments", icon: ClipboardList },
      { href: "/mock-tests", label: "Mock Tests / Exams", icon: Award },
    ]
  },
  {
    title: "Communication",
    items: [
      { href: "/messages", label: "Messages", icon: MessageSquare },
      { href: "/career-guidance", label: "Career Guidance", icon: Compass },
    ]
  },
  {
    title: "Account",
    items: [
      { href: "/payments", label: "Payments", icon: CreditCard },
      { href: "/settings", label: "Settings", icon: Settings },
    ]
  }
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { parent, children: linkedChildren, activeChild, setActiveChild, logout } = useParentAuth();
  
  const [lang, setLang] = useState<"EN" | "NP">("EN");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Trigger page transition loading on route change
  React.useEffect(() => {
    if (pathname !== prevPathname) {
      setIsPageLoading(true);
      setPrevPathname(pathname);
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [pathname, prevPathname]);

  // Handle student profile switch loading simulation
  const handleStudentSwitch = (child: any) => {
    setIsPageLoading(true);
    setActiveChild(child);
    toast({
      title: "Student Switched",
      description: `Dashboard context switched to ${child.fullName}.`,
    });
    setTimeout(() => {
      setIsPageLoading(false);
    }, 600);
  };

  // Trigger loader immediately on user link clicks to avoid "stalling" feel during compilation or pre-fetching
  const handleLinkClick = (href: string) => {
    if (pathname !== href) {
      setIsPageLoading(true);
    }
  };

  // Mock Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Aarav's Science Project is due tomorrow.", time: "2 hours ago", unread: true },
    { id: 2, text: "New feedback from Mr. Kiran Adhikari (Math).", time: "1 day ago", unread: true },
    { id: 3, text: "Parent-Teacher Association Meeting scheduled for July 2.", time: "2 days ago", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const getPageTitle = () => {
    for (const section of navSections) {
      const match = section.items.find(item => item.href === pathname);
      if (match) return match.label;
    }
    return "Parents Portal";
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background/95">
        {/* SIDEBAR */}
        <Sidebar className="h-full border-r border-gray-300 bg-sidebar/80 backdrop-blur supports-[backdrop-filter]:bg-sidebar/70">
          <SidebarHeader className="border-b border-gray-300 py-4 px-6">
            <Link
              href="/dashboard"
              onClick={() => handleLinkClick("/dashboard")}
              className="flex items-center gap-2"
            >
              <img
                src="/assets/logo.png"
                alt="NoteSwift Logo"
                className="h-10 w-10 object-contain rounded-xl"
              />
              <div className="flex flex-col">
                <span className="font-bold text-base leading-none text-gray-800">NoteSwift</span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-bold">Parents Portal</span>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-4 py-6 space-y-6">
            {navSections.map((section, idx) => {
              const hasLinkedChildren = linkedChildren && linkedChildren.length > 0;
              return (
                <div key={idx} className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                      const isAccessible = item.href === "/dashboard" || item.href === "/settings" || hasLinkedChildren;
                      
                      if (!isAccessible) {
                        return (
                          <div
                            key={item.href}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-400 cursor-not-allowed text-xs sm:text-sm font-bold opacity-50 select-none"
                            title="Please link a student profile to access this section."
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="w-5 h-5 text-gray-400" />
                              <span>{item.label}</span>
                            </div>
                            <Lock className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => handleLinkClick(item.href)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-xs sm:text-sm font-bold",
                            isActive
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg"
                              : "text-foreground/80 hover:bg-secondary/80 hover:text-foreground"
                          )}
                        >
                          <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500")} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </SidebarContent>

          {/* SIDEBAR FOOTER */}
          <SidebarFooter className="border-t border-gray-300 p-4 space-y-2">
            {parent && (
              <div className="flex items-center gap-3 p-2 rounded-xl bg-secondary/60 border border-gray-200">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-sm font-bold text-blue-700 border border-blue-300 shrink-0">
                  {parent.avatarEmoji}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-extrabold text-xs sm:text-sm truncate text-gray-800 animate-fade-in">{parent.fullName}</span>
                  <span className="text-[10px] sm:text-xs text-gray-500 font-bold">Parent Account</span>
                </div>
              </div>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full justify-start gap-2.5 h-11 px-3 rounded-xl border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-700 transition-all duration-200 font-bold text-xs sm:text-sm bg-white"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin text-red-500" />
              ) : (
                <LogOut className="h-4 w-4 text-gray-500 group-hover:text-red-500" />
              )}
              <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* MAIN INSET */}
        <SidebarInset className="flex flex-col flex-1 min-h-screen">
          {/* TOPBAR */}
          <header className="sticky top-0 flex h-16 items-center justify-between border-b border-gray-300 px-4 sm:px-6 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="hidden md:flex flex-col">
                <h1 className="text-lg font-bold text-gray-800 font-headline leading-tight">{getPageTitle()}</h1>
                <span className="text-[11px] text-gray-500 font-bold">{formattedDate}</span>
              </div>
            </div>
 
            {/* Topbar Actions */}
            <div className="flex items-center gap-3">
              {/* CHILD SWITCHER DROPDOWN */}
              {activeChild && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2.5 h-11 px-2 sm:px-3.5 rounded-xl border-gray-300 hover:bg-secondary/40 shadow-sm transition-all duration-200 bg-white">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs shrink-0 border border-blue-200 select-none">
                        {activeChild.avatarEmoji}
                      </div>
                      <div className="hidden sm:flex flex-col items-start text-left select-none gap-0.5">
                        <span className="text-[8px] font-extrabold text-gray-500 uppercase tracking-wider leading-none">Active Student</span>
                        <span className="text-[11px] font-bold text-gray-800 leading-none">{activeChild.fullName}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500 ml-0.5 sm:ml-1 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl border border-gray-300 shadow-lg p-1.5 bg-white">
                    <DropdownMenuLabel className="text-[9px] font-bold text-gray-500 uppercase tracking-wider px-2.5 py-1.5">Switch Student</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {linkedChildren.map((child) => (
                      <DropdownMenuItem
                        key={child.id}
                        onClick={() => handleStudentSwitch(child)}
                        className={cn(
                          "flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer transition-colors",
                          activeChild.id === child.id ? "bg-blue-50 text-blue-700 font-bold text-xs" : "hover:bg-secondary/60 text-gray-700 text-xs"
                        )}
                      >
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] shrink-0 border border-blue-200">
                          {child.avatarEmoji}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">{child.fullName}</span>
                          <span className="text-[10px] text-gray-500 font-semibold">{child.grade}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* NOTIFICATION BELL */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-gray-300 hover:bg-secondary/40 text-gray-600 relative shadow-sm shrink-0 bg-white">
                    <Bell className="h-4.5 w-4.5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white shadow-sm leading-none">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 rounded-xl border border-gray-300 shadow-lg p-0 bg-white">
                  <div className="flex items-center justify-between p-4 border-b border-gray-300">
                    <h4 className="text-xs font-bold text-gray-800">Notifications</h4>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-[11px] text-blue-600 font-bold hover:underline">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-gray-300 max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className={cn("p-4 text-[11px] transition-colors", n.unread ? "bg-blue-50/50" : "")}>
                          <p className="font-semibold text-gray-800">{n.text}</p>
                          <span className="text-[10px] text-gray-500 font-bold mt-1 block">{n.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500 font-bold text-xs">
                        No notifications
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </header>

          {/* MAIN CONTENT CONTAINER */}
          <main className="flex-1 w-full p-4 sm:p-6 md:p-8 overflow-y-auto">
            {isPageLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] h-full py-20 space-y-4">
                <div className="relative flex items-center justify-center">
                  {/* Outer pulse ring */}
                  <div className="absolute w-16 h-16 rounded-full border-4 border-blue-100 animate-ping"></div>
                  {/* Spinning double colored ring */}
                  <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-indigo-600 border-b-transparent border-l-transparent animate-spin"></div>
                  {/* Center small dot */}
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div className="space-y-1.5 text-center">
                  <h3 className="text-sm font-bold text-gray-800 tracking-wide">Syncing Student Data</h3>
                  <p className="text-xs text-gray-500 font-semibold animate-pulse">Retrieving records from school cloud...</p>
                </div>
              </div>
            ) : (
              children
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
