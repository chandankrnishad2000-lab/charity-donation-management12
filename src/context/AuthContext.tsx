import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "../types";
import { INITIAL_USERS } from "../data/initialData";

interface AuthContextType {
  currentUser: User;
  users: User[];
  switchRole: (role: UserRole) => void;
  loginAsUser: (userId: string) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  registerUser: (newUser: Omit<User, "id" | "joinedDate">) => User;
  allRoles: { role: UserRole; title: string; label: string; icon: string }[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "charity_platform_current_user";
const LOCAL_STORAGE_USERS_KEY = "charity_platform_users";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_USERS[0]; // Sarah Chen (Donor)
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentUser));
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    } catch {}
  }, [currentUser, users]);

  const switchRole = (role: UserRole) => {
    const userForRole = users.find((u) => u.role === role) || {
      id: `user-${role}-auto`,
      name: role.charAt(0).toUpperCase() + role.slice(1) + " Demo",
      email: `${role}@demo.org`,
      role,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-01-01",
    };
    setCurrentUser(userForRole);
  };

  const loginAsUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const registerUser = (newUserData: Omit<User, "id" | "joinedDate">): User => {
    const newUser: User = {
      ...newUserData,
      id: `user-${Date.now()}`,
      joinedDate: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return newUser;
  };

  const allRoles: { role: UserRole; title: string; label: string; icon: string }[] = [
    { role: "donor", title: "Donor", label: "Browse & Support Campaigns, View Receipts", icon: "Heart" },
    { role: "charity", title: "Charity Organization", label: "Create Campaigns, Manage Funds & Volunteers", icon: "Building2" },
    { role: "volunteer", title: "Volunteer", label: "Join Field Drives, Track Service Hours", icon: "Users" },
    { role: "admin", title: "Platform Admin", label: "Verify Charities, Audit Ledger & Analytics", icon: "ShieldCheck" },
  ];

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        switchRole,
        loginAsUser,
        updateCurrentUser,
        registerUser,
        allRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
