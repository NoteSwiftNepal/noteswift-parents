"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { mockDatabase, ParentProfile, ChildData } from '@/data/mockData';
import { USE_MOCK_DATA, API_BASE_URL } from '@/config/app-config';

interface ParentAuthContextType {
  parent: ParentProfile | null;
  children: ChildData[];
  activeChild: ChildData | null;
  setActiveChild: (child: ChildData) => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginWithPhone: (phoneNumber: string) => Promise<{ success: boolean; otp?: string; message?: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; message?: string }>;
  registerWithPhone: (fullName: string, phoneNumber: string, email?: string, acceptTerms?: boolean) => Promise<{ success: boolean; otp?: string; message?: string }>;
  linkStudent: (code: string) => Promise<{ success: boolean; message?: string }>;
  unlinkStudent: (studentId: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (fullName: string, phoneNumber: string) => Promise<{ success: boolean }>;
}

const ParentAuthContext = createContext<ParentAuthContextType | undefined>(undefined);

export function ParentAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [parent, setParent] = useState<ParentProfile | null>(null);
  const [linkedChildren, setLinkedChildren] = useState<ChildData[]>([]);
  const [activeChild, setActiveChildState] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Temporary state during login/register OTP verification flows
  const [pendingPhone, setPendingPhone] = useState<string>('');
  const [pendingRegData, setPendingRegData] = useState<{ fullName: string; email?: string } | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');

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
        setLinkedChildren([]);
        return;
      }

      // Populate local state from mock database or stored state
      const savedParent = localStorage.getItem('parentProfile');
      if (savedParent && savedParent !== 'undefined' && savedParent !== 'null') {
        try {
          setParent(JSON.parse(savedParent));
        } catch (e) {
          setParent(null);
        }
      } else {
        if (USE_MOCK_DATA) {
          setParent(mockDatabase.parent);
        } else {
          setParent(null);
        }
      }
      
      const savedChildren = localStorage.getItem('parentChildren');
      let currentChildren: ChildData[] = [];
      if (savedChildren && savedChildren !== 'undefined' && savedChildren !== 'null') {
        try {
          currentChildren = JSON.parse(savedChildren);
        } catch (e) {
          currentChildren = [];
        }
      } else {
        if (USE_MOCK_DATA) {
          const parentPhone = localStorage.getItem('parentPhone');
          if (parentPhone === mockDatabase.parent.phoneNumber || parentPhone === '9841234567' || !parentPhone) {
            currentChildren = mockDatabase.children;
          } else {
            currentChildren = [];
          }
        } else {
          currentChildren = [];
        }
      }
      setLinkedChildren(currentChildren);
      
      const savedChildId = localStorage.getItem('activeChildId');
      const active = currentChildren.find(c => c.id === savedChildId) || currentChildren[0];
      setActiveChildState(active || null);

      // Background fetch to sync state with backend database in real environment runs
      if (!USE_MOCK_DATA && token) {
        (async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/parent/dashboard`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.status === 401 || res.status === 403) {
              console.warn('Parent session expired. Logging out.');
              logout();
              return;
            }

            if (!res.ok) {
              console.warn(`Parent background sync returned status: ${res.status}`);
              return;
            }

            const data = await res.json();
            if (data.error === true) {
              if (data.status === 401 || data.status === 403) {
                console.warn('Parent session expired. Logging out.');
                logout();
              } else {
                console.warn(`Parent background sync returned error: ${data.message}`);
              }
              return;
            }

            const resultData = data.result || {};
            if (resultData.parent) {
              const updatedParent = resultData.parent;
              const updatedChildren = resultData.children || [];
              
              localStorage.setItem('parentProfile', JSON.stringify(updatedParent));
              localStorage.setItem('parentChildren', JSON.stringify(updatedChildren));
              
              setParent(updatedParent);
              setLinkedChildren(updatedChildren);
              
              const latestChildId = localStorage.getItem('activeChildId');
              const latestActive = updatedChildren.find((c: any) => c.id === latestChildId) || updatedChildren[0];
              setActiveChildState(latestActive || null);
            }
          } catch (err) {
            console.warn('Failed to perform background parent status sync:', err);
          }
        })();
      }
    } catch (err) {
      console.error('Parent auth check error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Keep login function for backward compatibility
    try {
      setLoading(true);
      setError(null);
      if (email.toLowerCase() === mockDatabase.parent.email.toLowerCase() && password === 'password123') {
        localStorage.setItem('parentToken', 'mock-parent-jwt-token-12345');
        localStorage.setItem('parentId', mockDatabase.parent.id);
        localStorage.setItem('parentEmail', mockDatabase.parent.email);
        localStorage.setItem('parentPhone', mockDatabase.parent.phoneNumber);
        localStorage.setItem('parentProfile', JSON.stringify(mockDatabase.parent));
        localStorage.setItem('parentChildren', JSON.stringify(mockDatabase.children));
        localStorage.setItem('isAuthenticated', 'true');
        
        setParent(mockDatabase.parent);
        setLinkedChildren(mockDatabase.children);
        setActiveChildState(mockDatabase.children[0]);
        localStorage.setItem('activeChildId', mockDatabase.children[0].id);

        return { success: true };
      } else {
        return { success: false, message: 'Invalid email or password.' };
      }
    } catch (error: any) {
      console.error('Parent login error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const loginWithPhone = async (phoneNumber: string): Promise<{ success: boolean; otp?: string; message?: string }> => {
    try {
      setLoading(true);
      setError(null);

      if (!USE_MOCK_DATA) {
        const response = await fetch(`${API_BASE_URL}/parent/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber, purpose: 'login' })
        });
        const data = await response.json();
        if (!response.ok || data.error === true) {
          return { success: false, message: data.message || 'Failed to send OTP' };
        }
        setPendingPhone(phoneNumber);
        setPendingRegData(null);
        return { success: true };
      }

      await new Promise(resolve => setTimeout(resolve, 800));
      
      const otp = '123456';
      setGeneratedOtp(otp);
      setPendingPhone(phoneNumber);
      setPendingRegData(null);
      
      return { success: true, otp };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to send OTP' };
    } finally {
      setLoading(false);
    }
  };

  const registerWithPhone = async (fullName: string, phoneNumber: string, email?: string, acceptTerms?: boolean): Promise<{ success: boolean; otp?: string; message?: string }> => {
    try {
      setLoading(true);
      setError(null);
      if (!acceptTerms) {
        return { success: false, message: 'You must accept the Terms and Conditions' };
      }

      if (!USE_MOCK_DATA) {
        const response = await fetch(`${API_BASE_URL}/parent/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber, purpose: 'register', fullName, email })
        });
        const data = await response.json();
        if (!response.ok || data.error === true) {
          return { success: false, message: data.message || 'Failed to send OTP' };
        }
        setPendingPhone(phoneNumber);
        setPendingRegData({ fullName, email });
        return { success: true };
      }

      await new Promise(resolve => setTimeout(resolve, 800));
      
      const otp = '123456';
      setGeneratedOtp(otp);
      setPendingPhone(phoneNumber);
      setPendingRegData({ fullName, email });
      
      return { success: true, otp };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to send OTP' };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      setError(null);

      if (!USE_MOCK_DATA) {
        const response = await fetch(`${API_BASE_URL}/parent/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: pendingPhone,
            otpCode: otp,
            fullName: pendingRegData?.fullName,
            email: pendingRegData?.email
          })
        });
        const data = await response.json();
        if (!response.ok || data.error === true) {
          return { success: false, message: data.message || 'Verification failed' };
        }

        const resultData = data.result || {};
        localStorage.setItem('parentToken', resultData.token);
        localStorage.setItem('parentPhone', pendingPhone);
        localStorage.setItem('parentProfile', JSON.stringify(resultData.parent));
        localStorage.setItem('parentChildren', JSON.stringify(resultData.children || []));
        localStorage.setItem('isAuthenticated', 'true');
        
        setParent(resultData.parent);
        setLinkedChildren(resultData.children || []);
        if (resultData.children && resultData.children.length > 0) {
          localStorage.setItem('activeChildId', resultData.children[0].id);
          setActiveChildState(resultData.children[0]);
        } else {
          setActiveChildState(null);
        }
        return { success: true };
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otp !== generatedOtp && otp !== '123456') {
        return { success: false, message: 'Invalid OTP code. Enter 123456 for demo.' };
      }
      
      localStorage.setItem('parentToken', 'mock-parent-jwt-token-12345');
      localStorage.setItem('parentPhone', pendingPhone);
      localStorage.setItem('isAuthenticated', 'true');
      
      if (pendingRegData) {
        const newParent: ParentProfile = {
          id: `p-${Date.now()}`,
          email: pendingRegData.email || '',
          fullName: pendingRegData.fullName,
          phoneNumber: pendingPhone,
          avatarEmoji: pendingRegData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'P'
        };
        localStorage.setItem('parentProfile', JSON.stringify(newParent));
        localStorage.setItem('parentChildren', JSON.stringify([]));
        
        setParent(newParent);
        setLinkedChildren([]);
        setActiveChildState(null);
      } else {
        const isDemoProfile = pendingPhone.includes('9841234567') || pendingPhone === '9841234567';
        if (isDemoProfile) {
          localStorage.setItem('parentProfile', JSON.stringify(mockDatabase.parent));
          localStorage.setItem('parentChildren', JSON.stringify(mockDatabase.children));
          localStorage.setItem('activeChildId', mockDatabase.children[0].id);
          
          setParent(mockDatabase.parent);
          setLinkedChildren(mockDatabase.children);
          setActiveChildState(mockDatabase.children[0]);
        } else {
          const newParent: ParentProfile = {
            id: `p-${Date.now()}`,
            email: '',
            fullName: 'NoteSwift Parent',
            phoneNumber: pendingPhone,
            avatarEmoji: 'NP'
          };
          localStorage.setItem('parentProfile', JSON.stringify(newParent));
          localStorage.setItem('parentChildren', JSON.stringify([]));
          
          setParent(newParent);
          setLinkedChildren([]);
          setActiveChildState(null);
        }
      }
      
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Verification failed' };
    } finally {
      setLoading(false);
    }
  };

  const linkStudent = async (code: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);

      if (!USE_MOCK_DATA) {
        const token = localStorage.getItem('parentToken');
        const response = await fetch(`${API_BASE_URL}/parent/link-student`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ linkCode: code })
        });
        const data = await response.json();
        if (!response.ok || data.error === true) {
          return { success: false, message: data.message || 'Failed to link student' };
        }
        
        const newChild = data.result?.linkedStudent;
        const updatedChildren = [...linkedChildren, newChild];
        localStorage.setItem('parentChildren', JSON.stringify(updatedChildren));
        localStorage.setItem('activeChildId', newChild.id);
        
        setLinkedChildren(updatedChildren);
        setActiveChildState(newChild);
        return { success: true };
      }

      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const cleanCode = code.trim().toUpperCase();
      const pattern = /^NSP-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
      if (!pattern.test(cleanCode)) {
        return { success: false, message: 'Invalid code format. Code must match NSP-XXXX-XXXX (e.g. NSP-4X8K-92LQ)' };
      }
      
      const hasAarav = linkedChildren.some(c => c.id === 'c1');
      const studentToLink = hasAarav ? mockDatabase.children[1] : mockDatabase.children[0];
      
      if (linkedChildren.some(c => c.id === studentToLink.id)) {
        return { success: false, message: `Student ${studentToLink.fullName} is already linked.` };
      }
      
      const updatedChildren = [...linkedChildren, studentToLink];
      localStorage.setItem('parentChildren', JSON.stringify(updatedChildren));
      localStorage.setItem('activeChildId', studentToLink.id);
      
      setLinkedChildren(updatedChildren);
      setActiveChildState(studentToLink);
      
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to link student. Try again.' };
    } finally {
      setLoading(false);
    }
  };

  const unlinkStudent = async (studentId: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);

      if (!USE_MOCK_DATA) {
        const token = localStorage.getItem('parentToken');
        const response = await fetch(`${API_BASE_URL}/parent/unlink-student`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ studentId })
        });
        const data = await response.json();
        if (!response.ok || data.error === true) {
          return { success: false, message: data.message || 'Failed to unlink student' };
        }
        
        const updatedChildren = linkedChildren.filter(c => c.id !== studentId);
        localStorage.setItem('parentChildren', JSON.stringify(updatedChildren));
        
        setLinkedChildren(updatedChildren);
        if (activeChild?.id === studentId) {
          const nextActive = updatedChildren[0] || null;
          setActiveChildState(nextActive);
          if (nextActive) {
            localStorage.setItem('activeChildId', nextActive.id);
          } else {
            localStorage.removeItem('activeChildId');
          }
        }
        return { success: true };
      }

      await new Promise(resolve => setTimeout(resolve, 800));
      const updatedChildren = linkedChildren.filter(c => c.id !== studentId);
      localStorage.setItem('parentChildren', JSON.stringify(updatedChildren));
      setLinkedChildren(updatedChildren);
      if (activeChild?.id === studentId) {
        const nextActive = updatedChildren[0] || null;
        setActiveChildState(nextActive);
        if (nextActive) {
          localStorage.setItem('activeChildId', nextActive.id);
        } else {
          localStorage.removeItem('activeChildId');
        }
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to unlink student' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('parentToken');
    localStorage.removeItem('parentId');
    localStorage.removeItem('parentEmail');
    localStorage.removeItem('parentPhone');
    localStorage.removeItem('parentProfile');
    localStorage.removeItem('parentChildren');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('activeChildId');
    setParent(null);
    setLinkedChildren([]);
    setActiveChildState(null);
    setError(null);
    router.push('/login');
  };

  const updateProfile = async (fullName: string, phoneNumber: string): Promise<{ success: boolean }> => {
    try {
      if (!parent) return { success: false };

      if (!USE_MOCK_DATA) {
        const token = localStorage.getItem('parentToken');
        const response = await fetch(`${API_BASE_URL}/parent/profile`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ fullName, phoneNumber })
        });
        const data = await response.json();
        if (!response.ok || data.error === true) return { success: false };
        
        const updatedParent = { ...parent, fullName, phoneNumber };
        setParent(updatedParent);
        localStorage.setItem('parentProfile', JSON.stringify(updatedParent));
        return { success: true };
      }

      const updatedParent = { ...parent, fullName, phoneNumber };
      setParent(updatedParent);
      mockDatabase.parent.fullName = fullName;
      mockDatabase.parent.phoneNumber = phoneNumber;
      localStorage.setItem('parentProfile', JSON.stringify(updatedParent));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const isAuthenticated = !!parent;

  const value: ParentAuthContextType = {
    parent,
    children: linkedChildren,
    activeChild,
    setActiveChild,
    loading,
    error,
    isAuthenticated,
    login,
    loginWithPhone,
    verifyOtp,
    registerWithPhone,
    linkStudent,
    unlinkStudent,
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
