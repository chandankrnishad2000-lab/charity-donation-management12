import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePlatform } from "../context/PlatformContext";
import { UserRole } from "../types";
import {
  Heart,
  Globe,
  Bell,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  Search,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  FileCheck,
  Compass,
} from "lucide-react";

interface NavbarProps {
  currentView: "discover" | "volunteer_drives" | "dashboard";
  onNavigate: (view: "discover" | "volunteer_drives" | "dashboard") => void;
  onOpenAdvisor: () => void;
  onOpenLedger: () => void;
  onCreateCampaign?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAdvisor,
  onOpenLedger,
  onCreateCampaign,
}) => {
  const { currentUser, switchRole, switchUser } = useAuth();
  const { currency, setCurrency, notifications, markNotificationRead, markAllNotificationsRead } = usePlatform();

  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: "donor",
      label: "Donor Persona",
      desc: "Rahul Sharma (Verified Donor)",
      icon: <Heart className="w-4 h-4 text-rose-500" />,
    },
    {
      role: "charity",
      label: "Charity Non-Profit",
      desc: "Hope For All Foundation",
      icon: <Building2 className="w-4 h-4 text-indigo-500" />,
    },
    {
      role: "volunteer",
      label: "Active Volunteer",
      desc: "Alex Rivera (Field Volunteer)",
      icon: <Users className="w-4 h-4 text-emerald-500" />,
    },
    {
      role: "admin",
      label: "Platform Admin",
      desc: "Compliance & Trust Center",
      icon: <ShieldCheck className="w-4 h-4 text-amber-500" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Logo */}
          <div
            onClick={() => onNavigate("discover")}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-xs">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">PureHeart</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate("discover")}
              className={`transition-colors ${
                currentView === "discover" ? "text-emerald-600 font-bold" : "hover:text-slate-900"
              }`}
            >
              Explore
            </button>

            <button
              onClick={() => onNavigate("discover")}
              className="hover:text-slate-900 transition-colors"
            >
              Campaigns
            </button>

            <button
              onClick={() => onNavigate("volunteer_drives")}
              className={`transition-colors ${
                currentView === "volunteer_drives" ? "text-emerald-600 font-bold" : "hover:text-slate-900"
              }`}
            >
              Volunteers
            </button>

            <button
              onClick={onOpenLedger}
              className="hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              Impact Ledger
            </button>

            <button
              onClick={onOpenAdvisor}
              className="hover:text-slate-900 transition-colors text-indigo-600 font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              AI Advisor
            </button>

            <button
              onClick={() => onNavigate("dashboard")}
              className={`transition-colors px-3 py-1.5 rounded-lg text-xs font-bold ${
                currentView === "dashboard"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
              }`}
            >
              Dashboard
            </button>
          </nav>

          {/* Right Controls (Currency, Notifications, User Persona) */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-1.5 px-2.5 rounded-xl border-none outline-hidden cursor-pointer"
              title="Change Currency"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notifications-toggle-btn"
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotificationMenu && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 space-y-3 z-50 animate-in fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Live Notifications ({notifications.length})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-emerald-700 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 rounded-xl text-xs space-y-1 cursor-pointer transition-colors ${
                            n.read ? "bg-slate-50 text-slate-600" : "bg-emerald-50/70 border border-emerald-100 text-slate-900 font-medium"
                          }`}
                        >
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-slate-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Persona & Role Switcher */}
            <div className="relative">
              <div
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-3 cursor-pointer select-none pl-2 py-1 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{currentUser.role === "donor" ? "Verified Donor" : currentUser.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-300 bg-slate-200 shrink-0">
                  <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Role Dropdown Menu */}
              {showRoleMenu && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 z-50 animate-in fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role Mode
                    </span>
                    <p className="text-xs text-slate-500">Test all 4 distinct platform perspectives</p>
                  </div>

                  {roles.map(({ role, label, desc, icon }) => (
                    <button
                      key={role}
                      onClick={() => {
                        switchRole(role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs transition-colors flex items-center justify-between ${
                        currentUser.role === role
                          ? "bg-slate-900 text-white font-bold"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {icon}
                        <div>
                          <span className="block font-bold">{label}</span>
                          <span className={`text-[10px] block ${currentUser.role === role ? "text-slate-300" : "text-slate-500"}`}>
                            {desc}
                          </span>
                        </div>
                      </div>
                      {currentUser.role === role && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 md:hidden"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2 text-xs font-bold text-slate-700">
            <button
              onClick={() => {
                onNavigate("discover");
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-2 rounded-xl hover:bg-slate-50"
            >
              Explore Campaigns
            </button>
            <button
              onClick={() => {
                onNavigate("volunteer_drives");
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-2 rounded-xl hover:bg-slate-50"
            >
              Volunteer Drives
            </button>
            <button
              onClick={() => {
                onOpenLedger();
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-2 rounded-xl hover:bg-slate-50"
            >
              Transparency Ledger
            </button>
            <button
              onClick={() => {
                onOpenAdvisor();
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700"
            >
              AI Philanthropy Advisor
            </button>
            <button
              onClick={() => {
                onNavigate("dashboard");
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
            >
              My Dashboard
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
