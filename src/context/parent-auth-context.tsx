"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { mockDatabase, ParentProfile, ChildData } from '@/data/mockData';

interface ParentAuthContextType {
  parent: ParentProfile | null;
  children: ChildData[];
  activeChild: ChildData | null;
  setActiveChild: (child: ChildData) => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (fullName: string, phoneNumber: string) => Promise<{ success: boolean }>;
}

const ParentAuthContext = createContext<ParentAuthContextType | undefined>(undefined);

export function ParentAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [parent, setParent] = useState<ParentProfile | null>(null);
  const [activeChild, setActiveChildState] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const childrenList = mockDatabase.children;

  const setActiveChild = (child: ChildData) => {
    setActiveChildState(child);
    localStorage.setItem('activeChildId', child.id);
  };

  const checkAuthStatus = () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('parentToken');
      if (!token) {
        setParent(null);
        setActiveChildState(null);
        return;
      }

      // Populate local state from mock database
      setParent(mockDatabase.parent);
      
      const savedChildId = localStorage.getItem('activeChildId');
      const active = childrenList.find(c => c.id === savedChildId) || childrenList[0];
      setActiveChildState(active || null);
    } catch (err) {
      console.error('Parent auth check error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      setError(null);

      // Simple mock check
      if (email.toLowerCase() === mockDatabase.parent.email.toLowerCase() && password === 'password123') {
        localStorage.setItem('parentToken', 'mock-parent-jwt-token-12345');
        localStorage.setItem('parentId', mockDatabase.parent.id);
        localStorage.setItem('parentEmail', mockDatabase.parent.email);
        localStorage.setItem('isAuthenticated', 'true');
        
        setParent(mockDatabase.parent);
        const defaultChild = childrenList[0];
        setActiveChildState(defaultChild || null);
        if (defaultChild) {
          localStorage.setItem('activeChildId', defaultChild.id);
        }

        return { success: true };
      } else {
        return { success: false, message: 'Invalid email or password. Use demo credentials: reena.sharma@example.com / password123' };
      }
    } catch (error: any) {
      console.error('Parent login error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('parentToken');
    localStorage.removeItem('parentId');
    localStorage.removeItem('parentEmail');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('activeChildId');
    setParent(null);
    setActiveChildState(null);
    setError(null);
    router.push('/login');
  };

  const updateProfile = async (fullName: string, phoneNumber: string): Promise<{ success: boolean }> => {
    if (parent) {
      const updatedParent = { ...parent, fullName, phoneNumber };
      setParent(updatedParent);
      mockDatabase.parent.fullName = fullName;
      mockDatabase.parent.phoneNumber = phoneNumber;
      return { success: true };
    }
    return { success: false };
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const isAuthenticated = !!parent;

  const value: ParentAuthContextType = {
    parent,
    children: childrenList,
    activeChild,
    setActiveChild,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    updateProfile
  };

  return (
    <ParentAuthContext.Provider value={value}>
      {children}
    </ParentAuthContext.Provider>
  );
}

export function useParentAuth() {
  const context = useContext(ParentAuthContext);
  if (context === undefined) {
    throw new Error('useParentAuth must be used within a ParentAuthProvider');
  }
  return context;
}
