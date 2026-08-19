import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { Campaign, CharityVerification } from "../../types";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
  Building2,
  TrendingUp,
  FileCheck,
  Bot,
  Sparkles,
  Loader2,
  ExternalLink,
  Flame,
  Search,
} from "lucide-react";

interface AdminDashboardProps {
  onSelectCampaign: (campaign: Campaign) => void;
  onOpenLedger: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectCampaign,
  onOpenLedger,
}) => {
  const {
    campaigns,
    donations,
    charityVerifications,
    approveCharityVerification,
    rejectCharityVerification,
    formatCurrency,
    analyzeCampaignIntegrityAI,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<"verifications" | "campaigns" | "integrity">("verifications");
  const [selectedAuditCamp, setSelectedAuditCamp] = useState<Campaign | null>(null);
  const [auditReport, setAuditReport] = useState<any | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  const totalDonationsSum = donations.reduce((acc, curr) => acc + curr.amount, 0);

  const pendingVerifications = charityVerifications.filter((v) => v.status === "pending");

  const handleRunAiAudit = async (campaign: Campaign) => {
    setSelectedAuditCamp(campaign);
    setIsAuditing(true);
    try {
      const res = await analyzeCampaignIntegrityAI(campaign);
      setAuditReport(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in" id="admin-dashboard-view">
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Governance & Compliance
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">System Administration & Trust Center</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Audit charity credentials, review non-profit verification documents, and run automated AI fraud screening.
          </p>
        </div>

        <button
          onClick={onOpenLedger}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 shrink-0"
        >
          <FileCheck className="w-4 h-4" />
          View Public Audit Ledger
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
            Total Platform Inflow
          </span>
          <p className="text-2xl font-black text-slate-900">{formatCurrency(totalDonationsSum)}</p>
          <span className="text-xs text-emerald-700 font-semibold">{donations.length} Transactions</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
            Charity Verification Queue
          </span>
          <p className="text-2xl font-black text-amber-600">
            {pendingVerifications.length} Pending
          </p>
          <span className="text-xs text-slate-500">80G & 501(c)(3) Audits</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
            Live Active Campaigns
          </span>
          <p className="text-2xl font-black text-slate-900">{campaigns.length} Campaigns</p>
          <span className="text-xs text-slate-500">100% Transparency</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
            AI Fraud Screening Score
          </span>
          <p className="text-2xl font-black text-emerald-600 flex items-center gap-1">
            99.6% <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </p>
          <span className="text-xs text-slate-500">Zero flagged anomalies</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("verifications")}
          className={`pb-3 border-b-2 -mb-px transition-colors ${
            activeTab === "verifications"
              ? "border-emerald-600 text-emerald-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Charity Verification Queue ({charityVerifications.length})
        </button>
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`pb-3 border-b-2 -mb-px transition-colors ${
            activeTab === "campaigns"
              ? "border-emerald-600 text-emerald-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Campaign Moderation ({campaigns.length})
        </button>
        <button
          onClick={() => setActiveTab("integrity")}
          className={`pb-3 border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
            activeTab === "integrity"
              ? "border-indigo-600 text-indigo-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Bot className="w-4 h-4 text-indigo-600" />
          AI Fraud & Integrity Scanner
        </button>
      </div>

      {/* Tab 1: Verification Queue */}
      {activeTab === "verifications" && (
        <div className="space-y-4" id="charity-verification-queue">
          <div className="space-y-4">
            {charityVerifications.map((v) => (
              <div
                key={v.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-base">{v.organizationName}</h4>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        v.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : v.status === "rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                    <div>
                      <strong className="text-slate-700 block">Registration Reg No:</strong>
                      <span className="font-mono">{v.registrationNumber}</span>
                    </div>
                    <div>
                      <strong className="text-slate-700 block">Tax Exemption ID:</strong>
                      <span className="font-mono text-emerald-800 font-semibold">{v.taxExemptId}</span>
                    </div>
                    <div>
                      <strong className="text-slate-700 block">Location:</strong>
                      <span>{v.location}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-4">
                    <span>Contact: {v.contactEmail}</span>
                    <span>Document: {v.documentsSubmitted[0]}</span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  {v.status === "pending" && (
                    <>
                      <button
                        onClick={() => approveCharityVerification(v.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve & Verify
                      </button>
                      <button
                        onClick={() => rejectCharityVerification(v.id, "Requires additional audit filing.")}
                        className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Campaigns Moderation */}
      {activeTab === "campaigns" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Campaign Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Organization</th>
                  <th className="p-4 text-right">Raised / Goal</th>
                  <th className="p-4 text-center">Urgent</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 max-w-xs truncate">
                      {camp.title}
                    </td>
                    <td className="p-4 text-slate-600">{camp.category}</td>
                    <td className="p-4 text-slate-700 font-medium">{camp.organization.name}</td>
                    <td className="p-4 text-right font-semibold text-slate-900 whitespace-nowrap">
                      {formatCurrency(camp.raised)} / {formatCurrency(camp.goal)}
                    </td>
                    <td className="p-4 text-center">
                      {camp.urgent ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          Urgent
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Standard</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onSelectCampaign(camp)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: AI Fraud & Integrity Scanner */}
      {activeTab === "integrity" && (
        <div className="space-y-6" id="ai-fraud-scanner-section">
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-indigo-950 text-sm">Gemini Pre-Flight Campaign Auditor</h4>
                <p className="text-xs text-indigo-700">
                  Scans budget allocation realism, risk markers, and credibility signals.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Select a Campaign to Audit:
              </span>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    onClick={() => handleRunAiAudit(camp)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAuditCamp?.id === camp.id
                        ? "border-indigo-600 bg-indigo-50/60 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-slate-900 text-sm truncate">{camp.title}</h5>
                      <span className="text-xs text-slate-500 font-mono">{formatCurrency(camp.goal)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{camp.organization.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Output Box */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="font-bold text-slate-900 text-sm">Automated Integrity Report</span>
                {isAuditing && (
                  <span className="text-xs text-indigo-600 flex items-center gap-1 font-semibold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Scanning...
                  </span>
                )}
              </div>

              {auditReport ? (
                <div className="space-y-4 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-700">Platform Trust Score</span>
                    <span className="text-xl font-black text-emerald-700">
                      {auditReport.trustScore} / 100
                    </span>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-slate-900 block">Assessment Verdict:</strong>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                      {auditReport.verdict}
                    </p>
                  </div>

                  {auditReport.strengths && (
                    <div className="space-y-1">
                      <strong className="text-emerald-800 block">Verified Strengths:</strong>
                      <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                        {auditReport.strengths.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {auditReport.flags && auditReport.flags.length > 0 && (
                    <div className="space-y-1">
                      <strong className="text-amber-800 block">Items Flagged for Review:</strong>
                      <ul className="list-disc pl-4 text-amber-700 space-y-0.5">
                        {auditReport.flags.map((f: string, i: number) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  Click on any campaign on the left to run an instant AI fraud & integrity audit.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
