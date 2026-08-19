import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { useAuth } from "../../context/AuthContext";
import { VolunteerOpportunity } from "../../types";
import {
  Users,
  Award,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileCheck,
} from "lucide-react";

interface VolunteerDashboardProps {
  onApplyOpportunity: (opportunity: VolunteerOpportunity) => void;
}

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({
  onApplyOpportunity,
}) => {
  const { currentUser } = useAuth();
  const { volunteerOpportunities, volunteerApplications } = usePlatform();
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Filter user applications
  const userApps = volunteerApplications.filter(
    (a) => a.volunteerId === currentUser.id || a.volunteerEmail === currentUser.email
  );

  return (
    <div className="space-y-8 animate-in fade-in" id="volunteer-dashboard-view">
      {/* Volunteer Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
            <Users className="w-3.5 h-3.5" /> Certified Community Volunteer
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Welcome, {currentUser.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            You have contributed over 48 hours of on-the-ground volunteer work across relief, food drives, and youth mentorship.
          </p>
        </div>

        <button
          onClick={() => setShowCertificate(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 shrink-0"
        >
          <Award className="w-4 h-4" />
          View Certificate of Service
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
            Service Hours Logged
          </span>
          <p className="text-2xl font-black text-slate-900">48 Hours</p>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Coordinators
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
            Drives Participated
          </span>
          <p className="text-2xl font-black text-slate-900">6 Missions</p>
          <span className="text-xs text-slate-500">Food, Medical, Shelter</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
            Active Applications
          </span>
          <p className="text-2xl font-black text-slate-900">{userApps.length} Submitted</p>
          <span className="text-xs text-slate-500">
            {userApps.filter((a) => a.status === "approved").length} approved
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
            Impact Badge Level
          </span>
          <p className="text-2xl font-black text-amber-600 flex items-center gap-1">
            <Award className="w-6 h-6 text-amber-500" /> Gold Tier
          </p>
          <span className="text-xs text-slate-500">Top 5% volunteer</span>
        </div>
      </div>

      {/* Volunteer Certificate Generator Modal */}
      {showCertificate && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowCertificate(false)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center print:hidden">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" /> Verified Volunteer Recognition
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Certificate
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Certificate Paper */}
            <div className="p-8 sm:p-12 text-center space-y-6 border-8 border-double border-emerald-700 m-4 rounded-2xl bg-gradient-to-b from-white via-emerald-50/20 to-white">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
                  CHARITY BRIDGE FOUNDATION
                </span>
                <h3 className="text-3xl font-serif font-black text-slate-900">
                  Certificate of Appreciation
                </h3>
                <p className="text-xs text-slate-500 italic">This official recognition is presented to</p>
              </div>

              <div className="py-2 border-b-2 border-slate-800 max-w-sm mx-auto">
                <h4 className="text-2xl font-bold font-serif text-slate-900">{currentUser.name}</h4>
              </div>

              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                In heartfelt recognition of outstanding dedication, compassion, and exemplary humanitarian service contributing <strong>48 verified volunteer hours</strong> toward community crisis relief and youth empowerment.
              </p>

              <div className="pt-8 flex justify-between items-end border-t border-slate-200 text-left text-xs">
                <div>
                  <p className="font-bold text-slate-900">Dr. Elena Vance</p>
                  <p className="text-[11px] text-slate-500">Director of Volunteer Operations</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] text-slate-400 block">ID: VOL-CERT-98241</span>
                  <p className="font-bold text-emerald-800 text-[11px]">Officially Verified Seal ✓</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Submitted Applications */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-lg">My Volunteer Applications</h3>

        {userApps.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-400">
            You haven't applied to any volunteer drives yet. Check out open opportunities below!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userApps.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 text-sm">{app.opportunityTitle}</h4>
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
                <p className="text-xs text-slate-500">Applied on {app.appliedAt}</p>
                <p className="text-xs text-slate-600 italic line-clamp-2">"{app.message}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Open Volunteer Drives */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Explore Open Volunteer Opportunities</h3>
            <p className="text-xs text-slate-500">Give your time, skills, and energy to verified causes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {volunteerOpportunities.map((op) => (
            <div
              key={op.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {op.category}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {op.spotsTotal - op.spotsFilled} spots open
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base">{op.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {op.description}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{op.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{op.isRemote ? "Remote / Virtual" : op.location}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {op.skillsRequired.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onApplyOpportunity(op)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
                >
                  Apply to Volunteer <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
