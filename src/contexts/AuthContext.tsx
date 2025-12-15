import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Branch = 'CSE' | 'EEE' | 'Mechanical' | 'ECE' | 'Civil';

interface User {
  id: string;
  name: string;
  email: string;
  branch: Branch;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, branch: Branch) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('nhance_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login - in production, this would call an API
    const storedUsers = JSON.parse(localStorage.getItem('nhance_users') || '[]');
    const foundUser = storedUsers.find((u: User & { password: string }) => 
      u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('nhance_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    // Demo admin account
    if (email === 'admin@nhance.edu' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Admin',
        email: 'admin@nhance.edu',
        branch: 'CSE',
        isAdmin: true,
      };
      setUser(adminUser);
      localStorage.setItem('nhance_user', JSON.stringify(adminUser));
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string, branch: Branch): Promise<boolean> => {
    const storedUsers = JSON.parse(localStorage.getItem('nhance_users') || '[]');
    
    if (storedUsers.some((u: User) => u.email === email)) {
      return false;
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      branch,
      isAdmin: false,
    };
    
    storedUsers.push(newUser);
    localStorage.setItem('nhance_users', JSON.stringify(storedUsers));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('nhance_user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nhance_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
