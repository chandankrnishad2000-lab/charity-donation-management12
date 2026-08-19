import React from "react";
import { usePlatform } from "../../context/PlatformContext";
import { useAuth } from "../../context/AuthContext";
import { Campaign, DonationReceipt } from "../../types";
import { CampaignCard } from "../CampaignCard";
import {
  Heart,
  Receipt,
  Sparkles,
  Award,
  Calendar,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Trash2,
} from "lucide-react";

interface DonorDashboardProps {
  onSelectCampaign: (campaign: Campaign) => void;
  onDonateToCampaign: (campaign: Campaign) => void;
  onViewReceipt: (receipt: DonationReceipt) => void;
  onOpenAdvisor: () => void;
  onExploreCampaigns: () => void;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({
  onSelectCampaign,
  onDonateToCampaign,
  onViewReceipt,
  onOpenAdvisor,
  onExploreCampaigns,
}) => {
  const { currentUser } = useAuth();
  const {
    campaigns,
    donations,
    receipts,
    recurringPledges,
    cancelRecurringPledge,
    formatCurrency,
    bookmarkedCampaignIds,
  } = usePlatform();

  // Filter donations for current user
  const userDonations = donations.filter(
    (d) => d.donorId === currentUser.id || d.donorEmail === currentUser.email
  );

  // Total given
  const totalDonated = userDonations.reduce((acc, curr) => acc + curr.amount, 0);

  // Unique campaigns supported
  const uniqueCampaignIds = new Set(userDonations.map((d) => d.campaignId));

  // User receipts
  const userReceipts = receipts.filter(
    (r) => r.donorEmail === currentUser.email || r.donorName === currentUser.name
  );

  // Bookmarked campaigns
  const bookmarkedCampaigns = campaigns.filter((c) =>
    bookmarkedCampaignIds.includes(c.id)
  );

  return (
    <div className="space-y-8 animate-in fade-in" id="donor-dashboard-view">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
            <Award className="w-3.5 h-3.5" /> Philanthropist & Impact Partner
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            You've directly impacted lives across {uniqueCampaignIds.size} humanitarian initiatives. Every dollar was tracked and verified.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={onOpenAdvisor}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI Giving Advisor
          </button>
          <button
            onClick={onExploreCampaigns}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            Discover Causes
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Lifetime Giving</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{formatCurrency(totalDonated)}</p>
          <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Tax Deductible
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Causes Supported</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{uniqueCampaignIds.size} Initiatives</p>
          <p className="text-xs text-slate-500">Across 4 countries</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Active Monthly Pledges</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{recurringPledges.length} Active</p>
          <p className="text-xs text-slate-500">Sustainable recurring aid</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Official Tax Receipts</span>
            <Receipt className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{userReceipts.length} Issued</p>
          <p className="text-xs text-slate-500">80G / 501(c)(3) Compliant</p>
        </div>
      </div>

      {/* Tangible Real-World Impact Card */}
      <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-slate-900 text-base">Your Tangible Community Footprint</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1">
            <span className="font-bold text-emerald-800 text-xl block">120+</span>
            <span className="font-semibold text-slate-900 block">Nutritious Meals Funded</span>
            <p className="text-slate-500">Provided to families facing severe food shortages.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1">
            <span className="font-bold text-emerald-800 text-xl block">3 Students</span>
            <span className="font-semibold text-slate-900 block">STEM School Supplies</span>
            <p className="text-slate-500">Equipped with books and learning tablets for a full semester.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1">
            <span className="font-bold text-emerald-800 text-xl block">500 Liters</span>
            <span className="font-semibold text-slate-900 block">Clean Drinking Water</span>
            <p className="text-slate-500">Purified & piped to underserved remote village clinics.</p>
          </div>
        </div>
      </div>

      {/* Active Monthly Recurring Pledges */}
      {recurringPledges.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-lg">Active Recurring Pledges</h3>
            <span className="text-xs text-slate-500 font-medium">Automatic monthly giving</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recurringPledges.map((pledge) => (
              <div
                key={pledge.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex justify-between items-center gap-4"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Monthly Partner
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{pledge.campaignTitle}</h4>
                  <p className="text-xs text-slate-500">
                    Next billing date: <strong className="text-slate-700">{pledge.nextBillingDate}</strong>
                  </p>
                </div>

                <div className="text-right space-y-2 shrink-0">
                  <p className="font-black text-slate-900 text-base">
                    {pledge.currency} {pledge.amount.toLocaleString()} / mo
                  </p>
                  <button
                    onClick={() => cancelRecurringPledge(pledge.id)}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Cancel Pledge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Donation History & Tax Receipts */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Donation History & Official Receipts</h3>
            <p className="text-xs text-slate-500">Download certified tax exemption invoices anytime.</p>
          </div>
        </div>

        {userDonations.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
            <Heart className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">You haven't made any donations yet.</p>
            <button
              onClick={onExploreCampaigns}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700"
            >
              Explore Charity Campaigns
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Campaign</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-center">Receipt Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userDonations.map((d) => {
                    const matchedReceipt = userReceipts.find(
                      (r) => r.transactionId === d.id || r.campaignTitle === d.campaignTitle
                    );

                    return (
                      <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 text-slate-500 whitespace-nowrap">{d.date.split(" ")[0]}</td>
                        <td className="p-4 font-semibold text-slate-900">
                          <p>{d.campaignTitle}</p>
                          {d.message && <p className="text-slate-400 font-normal italic">"{d.message}"</p>}
                        </td>
                        <td className="p-4 text-slate-600">{d.paymentMethod}</td>
                        <td className="p-4 text-right font-bold text-slate-900 text-sm whitespace-nowrap">
                          {formatCurrency(d.amount)}
                        </td>
                        <td className="p-4 text-center">
                          {matchedReceipt ? (
                            <button
                              onClick={() => onViewReceipt(matchedReceipt)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                            >
                              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                              View Tax Receipt
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Processed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Bookmarked Campaigns */}
      {bookmarkedCampaigns.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">Saved / Bookmarked Causes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedCampaigns.map((camp) => (
              <CampaignCard
                key={camp.id}
                campaign={camp}
                onSelect={onSelectCampaign}
                onDonate={onDonateToCampaign}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
