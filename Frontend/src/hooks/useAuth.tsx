import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

// API base URL - can be replaced with environment variable in production
const API_BASE_URL = 'http://localhost:3000';

interface UserType {
  _id: string;
  email: string;
  name: string;
  phone: string;
  district: string;
  state: string;
  role?: string;
}

interface AuthContextType {
  user: UserType | null;
  signUp: (
    email: string,
    password: string,
    metadata: {
      name: string;
      phone: string;
      district: string;
      state: string;
    }
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  fetchProfile: () => Promise<UserType | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile from backend
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/profile`, { withCredentials: true });
      if (res.data.status === 'success') {
        setUser(res.data.user);
        setLoading(false);
        return res.data.user;
      } else {
        setUser(null);
        setLoading(false);
        return null;
      }
    } catch {
      setUser(null);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const signUp = async (
    email: string,
    password: string,
    metadata: {
      name: string;
      phone: string;
      district: string;
      state: string;
    }
  ) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/signup`,
        { email, password, ...metadata },
        { withCredentials: true }
      );
      if (res.data.status === 'success') {
        await fetchProfile();
        toast({
          title: 'Account Created!',
          description: 'Signup successful.',
        });
        setLoading(false);
        return { error: null };
      } else {
        toast({
          title: 'Signup Failed',
          description: res.data.message,
          variant: 'destructive',
        });
        setLoading(false);
        return { error: res.data.message };
      }
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.response?.data?.message || error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.status === 'success') {
        await fetchProfile();
        toast({
          title: 'Welcome back!',
          description: 'You have been successfully logged in.',
        });
        setLoading(false);
        return { error: null };
      } else {
        toast({
          title: 'Login Failed',
          description: res.data.message,
          variant: 'destructive',
        });
        setLoading(false);
        return { error: res.data.message };
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.response?.data?.message || error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await axios.get(`${API_BASE_URL}/api/auth/logout`, { withCredentials: true });
      setUser(null);
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      setLoading(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'There was an error signing out.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    loading,
    fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}