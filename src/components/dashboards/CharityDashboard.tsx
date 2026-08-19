import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { useAuth } from "../../context/AuthContext";
import { Campaign, VolunteerApplication } from "../../types";
import { CampaignProgress } from "../CampaignProgress";
import {
  Building2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Users,
  TrendingUp,
  DollarSign,
  Send,
  MessageSquare,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface CharityDashboardProps {
  onCreateCampaign: () => void;
  onPostUpdate: (campaign: Campaign) => void;
  onSelectCampaign: (campaign: Campaign) => void;
}

export const CharityDashboard: React.FC<CharityDashboardProps> = ({
  onCreateCampaign,
  onPostUpdate,
  onSelectCampaign,
}) => {
  const { currentUser } = useAuth();
  const {
    campaigns,
    donations,
    volunteerApplications,
    updateVolunteerApplicationStatus,
    formatCurrency,
  } = usePlatform();

  const [activeSubTab, setActiveSubTab] = useState<"campaigns" | "volunteers" | "donors">("campaigns");

  // Filter campaigns belonging to this charity
  const orgCampaigns = campaigns.filter(
    (c) =>
      c.organization.id === currentUser.id ||
      c.organization.name.toLowerCase() === (currentUser.organizationName || currentUser.name).toLowerCase()
  );

  const activeOrgCampaigns = orgCampaigns.length > 0 ? orgCampaigns : campaigns.slice(0, 3);

  // Total raised
  const totalRaised = activeOrgCampaigns.reduce((acc, c) => acc + c.raised, 0);
  const totalDonors = activeOrgCampaigns.reduce((acc, c) => acc + c.donorCount, 0);

  // Volunteer apps
  const orgVolunteerApps = volunteerApplications;

  return (
    <div className="space-y-8 animate-in fade-in" id="charity-dashboard-view">
      {/* Organization Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || "https://images.unsplash.com/photo-1579208575657-c595a053b9b7?w=150&auto=format&fit=crop&q=80"}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/40 shadow-xs"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">{currentUser.organizationName || currentUser.name}</h2>
              {currentUser.isVerified ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Non-Profit
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  <AlertTriangle className="w-3.5 h-3.5" /> Verification In Review
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300">
              Tax ID: {currentUser.taxExemptId || "80G-DEL-984421"} • Registered 501(c)(3) / Section 8 Foundation
            </p>
          </div>
        </div>

        <button
          id="charity-create-campaign-btn"
          onClick={onCreateCampaign}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Campaign
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
            Total Funds Raised
          </span>
          <p className="text-2xl font-black text-slate-900">{formatCurrency(totalRaised)}</p>
          <span className="text-xs text-emerald-700 font-semibold">100% Disbursed to Causes</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
            Active Campaigns
          </span>
          <p className="text-2xl font-black text-slate-900">{activeOrgCampaigns.length} Active</p>
          <span className="text-xs text-slate-500">Across education & relief</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
            Donor Community
          </span>
          <p className="text-2xl font-black text-slate-900">{totalDonors.toLocaleString()} Donors</p>
          <span className="text-xs text-slate-500">Avg gift: $65</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
            Volunteer Applications
          </span>
          <p className="text-2xl font-black text-slate-900">{orgVolunteerApps.length} Applicants</p>
          <span className="text-xs text-slate-500">
            {orgVolunteerApps.filter((a) => a.status === "pending").length} pending review
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveSubTab("campaigns")}
          className={`pb-3 border-b-2 -mb-px transition-colors ${
            activeSubTab === "campaigns"
              ? "border-emerald-600 text-emerald-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Managed Campaigns ({activeOrgCampaigns.length})
        </button>
        <button
          onClick={() => setActiveSubTab("volunteers")}
          className={`pb-3 border-b-2 -mb-px transition-colors ${
            activeSubTab === "volunteers"
              ? "border-emerald-600 text-emerald-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Volunteer Applicants ({orgVolunteerApps.length})
        </button>
      </div>

      {/* Tab 1: Managed Campaigns */}
      {activeSubTab === "campaigns" && (
        <div className="space-y-4" id="managed-campaigns-section">
          <div className="space-y-4">
            {activeOrgCampaigns.map((camp) => {
              const percent = Math.min(
                Math.round((camp.raised / Math.max(camp.goal, 1)) * 100),
                100
              );

              return (
                <div
                  key={camp.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={camp.imageUrl}
                      alt=""
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="space-y-1.5 flex-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {camp.category}
                        </span>
                        {camp.urgent && (
                          <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded">
                            Urgent
                          </span>
                        )}
                      </div>
                      <h4
                        onClick={() => onSelectCampaign(camp)}
                        className="font-bold text-slate-900 text-base hover:text-emerald-700 cursor-pointer"
                      >
                        {camp.title}
                      </h4>

                      {/* Progress */}
                      <div className="space-y-1 max-w-md">
                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                          <span>
                            {formatCurrency(camp.raised)} raised of {formatCurrency(camp.goal)}
                          </span>
                          <span className="text-emerald-700 font-bold">{percent}%</span>
                        </div>
                        <CampaignProgress
                          raised={camp.raised}
                          goal={camp.goal}
                          showMilestonePins={false}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0">
                    <button
                      onClick={() => onPostUpdate(camp)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Post Milestone Update
                    </button>
                    <button
                      onClick={() => onSelectCampaign(camp)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                    >
                      View Story
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Volunteer Applicants */}
      {activeSubTab === "volunteers" && (
        <div className="space-y-4" id="volunteer-applicants-section">
          {orgVolunteerApps.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-400">
              No volunteer applications received yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orgVolunteerApps.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{app.volunteerName}</h4>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            app.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : app.status === "rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Applied for: <strong className="text-slate-800">{app.opportunityTitle}</strong> • {app.appliedAt}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateVolunteerApplicationStatus(app.id, "approved")}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => updateVolunteerApplicationStatus(app.id, "rejected")}
                            className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs flex items-center gap-1"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" /> Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <p className="text-slate-700 italic">"{app.message}"</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-500 pt-1 border-t border-slate-200/60">
                      <div>
                        <strong className="text-slate-700 block">Email:</strong> {app.volunteerEmail}
                      </div>
                      <div>
                        <strong className="text-slate-700 block">Phone:</strong> {app.phone}
                      </div>
                      <div>
                        <strong className="text-slate-700 block">Availability:</strong> {app.availability}
                      </div>
                    </div>
                    {app.skills && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {app.skills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
