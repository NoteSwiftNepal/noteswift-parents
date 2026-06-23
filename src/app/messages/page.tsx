"use client";

import React, { useState } from "react";
import { useParentAuth } from "@/context/parent-auth-context";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  Search, 
  UserCheck, 
  Info,
  Calendar,
  Sparkles,
  Users,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockDatabase, ChatThread, Message, Teacher } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

function MessagesContent() {
  const { activeChild, parent } = useParentAuth();
  const { toast } = useToast();
  
  // Chats list loaded from mock data
  const [threads, setThreads] = useState<ChatThread[]>(mockDatabase.chats);
  const [activeThreadId, setActiveThreadId] = useState<string>(mockDatabase.chats[0]?.id || "");
  const [typedMessage, setTypedMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  if (!activeChild) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading student profile...</p>
        </div>
      </div>
    );
  }

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeThread) return;

    const newMessage: Message = {
      id: `m-new-${Date.now()}`,
      sender: "parent",
      text: typedMessage,
      timestamp: new Date().toISOString(),
    };

    const updatedThreads = threads.map(t => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          lastMessage: typedMessage,
          lastMessageTime: new Date().toISOString(),
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    setTypedMessage("");

    // Simulate teacher automated response in 1.5 seconds!
    setTimeout(() => {
      const responseMessage: Message = {
        id: `m-resp-${Date.now()}`,
        sender: "teacher",
        text: `Thank you for your message. I have received it regarding ${activeChild.fullName} and will look into it as soon as possible.`,
        timestamp: new Date().toISOString(),
      };

      const finalThreads = updatedThreads.map(t => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            lastMessage: responseMessage.text,
            lastMessageTime: responseMessage.timestamp,
            messages: [...t.messages, responseMessage]
          };
        }
        return t;
      });

      setThreads(finalThreads);
      toast({
        title: "New Message Received",
        description: `Reply from ${activeThread.teacher.name}.`,
      });
    }, 1500);
  };

  const filteredThreads = threads.filter(t => 
    t.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">
          Message Center
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-semibold">
          Direct communication line with {activeChild.fullName}'s teachers.
        </p>
      </div>

      {/* Main Messaging Hub */}
      <div className="flex md:grid md:grid-cols-3 gap-0 md:gap-6 h-[600px] border border-gray-300 rounded-3xl bg-white shadow-sm overflow-hidden">
        {/* Left Panel: Chats List */}
        <div className={cn(
          "w-full md:w-auto md:col-span-1 border-r border-gray-300 flex flex-col h-full bg-gray-50/50",
          mobileView === "chat" ? "hidden md:flex" : "flex"
        )}>
          {/* Search bar */}
          <div className="p-4 border-b border-gray-300 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search teacher or subject..."
                className="pl-9 h-10 rounded-xl border-gray-300 bg-secondary/30 focus:bg-white transition-all text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-300">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                return (
                  <button
                    key={thread.id}
                    onClick={() => {
                      setActiveThreadId(thread.id);
                      setMobileView("chat");
                    }}
                    className={cn(
                      "w-full text-left p-4 flex gap-3 transition-colors text-xs sm:text-sm",
                      isActive ? "bg-blue-50/50" : "hover:bg-gray-150/40 bg-white"
                    )}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold border border-blue-200 shrink-0">
                      {thread.teacher.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-800 truncate">{thread.teacher.name}</span>
                        <span className="text-xs text-gray-500 shrink-0 font-bold">
                          {new Date(thread.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <p className="text-xs font-bold text-blue-700">{thread.teacher.subject}</p>
                      <p className="text-xs text-gray-500 truncate font-semibold">
                        {thread.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500 text-xs font-bold">
                No conversations found.
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Active Conversation Window */}
        <div className={cn(
          "w-full md:w-auto md:col-span-2 flex flex-col h-full bg-white",
          mobileView === "list" ? "hidden md:flex" : "flex"
        )}>
          {activeThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-gray-300 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileView("list")}
                    className="md:hidden h-9 w-9 rounded-xl border border-gray-300 hover:bg-secondary/40 shrink-0"
                  >
                    <ArrowLeft className="h-4.5 w-4.5 text-gray-600" />
                  </Button>
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-750 font-extrabold text-sm border border-blue-200">
                    {activeThread.teacher.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-800 leading-snug">{activeThread.teacher.name}</h3>
                    <p className="text-xs text-gray-500 font-bold">Subject Lead: {activeThread.teacher.subject}</p>
                  </div>
                </div>
                
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border border-green-300 rounded-full font-bold text-xs px-2.5 py-0.5">
                  Online
                </Badge>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/20">
                {activeThread.messages.map((message) => {
                  const isParent = message.sender === "parent";
                  return (
                    <div 
                      key={message.id}
                      className={cn(
                        "flex w-full items-end gap-2.5",
                        isParent ? "justify-end" : "justify-start"
                      )}
                    >
                      {!isParent && (
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 shrink-0">
                          {activeThread.teacher.name.charAt(0)}
                        </div>
                      )}
                      
                      <div className={cn(
                        "max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm shadow-sm space-y-1 border",
                        isParent 
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none border-blue-600" 
                          : "bg-white border-gray-300 text-gray-800 rounded-bl-none"
                      )}>
                        <p className="leading-relaxed font-medium">{message.text}</p>
                        <span className={cn(
                          "text-xs block text-right font-bold",
                          isParent ? "text-blue-100" : "text-gray-500"
                        )}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {isParent && parent && (
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 shrink-0 select-none">
                          {parent.avatarEmoji}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300 bg-white flex gap-3 shrink-0">
                <Input
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder={`Send a secure message to ${activeThread.teacher.name}...`}
                  className="flex-1 rounded-xl h-11 border-gray-300 text-xs sm:text-sm focus:border-blue-500"
                />
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white h-11 px-5 rounded-xl flex items-center gap-1.5 font-bold text-xs sm:text-sm border border-blue-600">
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 font-bold">
              <MessageSquare className="h-12 w-12 mb-3 text-gray-400" />
              <p>Select a teacher conversation thread to begin messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <MessagesContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
