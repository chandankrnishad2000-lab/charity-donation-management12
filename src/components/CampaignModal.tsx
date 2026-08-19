import React, { useState } from "react";
import { Campaign, VolunteerOpportunity } from "../types";
import { usePlatform } from "../context/PlatformContext";
import { CampaignProgress } from "./CampaignProgress";
import {
  X,
  Heart,
  Share2,
  Users,
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowRight,
  Flame,
  FileText,
  PieChart,
  History,
  MessageSquare,
  Gift,
  QrCode,
  Loader2,
  Bot,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface CampaignModalProps {
  campaign: Campaign | null;
  onClose: () => void;
  onDonate: (campaign: Campaign) => void;
  onApplyVolunteer?: (opportunity: VolunteerOpportunity) => void;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({
  campaign,
  onClose,
  onDonate,
  onApplyVolunteer,
}) => {
  const {
    formatCurrency,
    isBookmarked,
    toggleBookmark,
    donations,
    volunteerOpportunities,
    summarizeCampaignAI,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<"story" | "budget" | "updates" | "donors" | "volunteers">(
    "story"
  );
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  if (!campaign) return null;

  const bookmarked = isBookmarked(campaign.id);
  const percent = Math.min(Math.round((campaign.raised / Math.max(campaign.goal, 1)) * 100), 100);

  // Filter donations for this campaign
  const campaignDonations = donations.filter((d) => d.campaignId === campaign.id);

  // Find volunteer drive for this campaign if any
  const campaignVolOps = volunteerOpportunities.filter((v) => v.campaignId === campaign.id);

  const handleFetchAiSummary = async () => {
    if (aiSummary) return;
    setLoadingAi(true);
    try {
      const summary = await summarizeCampaignAI(campaign);
      setAiSummary(summary);
    } catch (e) {
      console.error("AI summary error", e);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const gallery =
    campaign.galleryImages && campaign.galleryImages.length > 0
      ? campaign.galleryImages
      : [campaign.imageUrl];

  return (
    <div
      id="campaign-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="campaign-modal-content"
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Control Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-xs sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {campaign.category}
            </span>
            {campaign.urgent && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-600" /> Urgent
              </span>
            )}
            <span className="text-xs text-slate-500 hidden sm:inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" /> {campaign.location}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(!showQrModal)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="QR Code Donation"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">QR Donate</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Share Campaign"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? "Link Copied!" : "Share"}</span>
            </button>
            <button
              onClick={() => toggleBookmark(campaign.id)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            >
              <Heart className={`w-4 h-4 ${bookmarked ? "fill-rose-600 text-rose-600" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {/* Hero Section with Media and Core Stats */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Title & Tagline */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {campaign.title}
              </h1>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                {campaign.tagline}
              </p>
            </div>

            {/* Gallery / Image Container */}
            <div className="space-y-3">
              <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                <img
                  src={gallery[activeImageIndex] || campaign.imageUrl}
                  alt={campaign.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx ? "border-emerald-600 scale-103 shadow-xs" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* QR Quick Scan Card if toggled */}
            {showQrModal && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Instant Mobile Giving
                  </span>
                  <h4 className="text-base font-bold">Scan with any Camera or UPI App</h4>
                  <p className="text-xs text-slate-400">
                    Directly routes your mobile contribution with instant 80G/501(c)(3) tax receipt.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl text-slate-900 flex flex-col items-center">
                  <QrCode className="w-24 h-24 text-slate-900" />
                  <span className="text-[10px] font-mono font-bold text-slate-500 mt-1">
                    ID: {campaign.id}
                  </span>
                </div>
              </div>
            )}

            {/* Financial Status Box */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      {formatCurrency(campaign.raised)}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">
                      raised of {formatCurrency(campaign.goal)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Verified direct aid allocation with zero intermediary platform deductions.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-700">{percent}%</span>
                  <span className="text-xs text-slate-400 block font-medium">Funded</span>
                </div>
              </div>

              {/* Progress Bar with Milestone checkpoints */}
              <CampaignProgress
                raised={campaign.raised}
                goal={campaign.goal}
                milestones={campaign.milestones}
                size="md"
              />

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-center text-xs text-slate-600">
                <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                  <span className="font-bold text-slate-900 block text-sm">{campaign.donorCount}</span>
                  <span className="text-slate-500 text-[11px]">Generous Donors</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                  <span className="font-bold text-slate-900 block text-sm">
                    {campaign.beneficiaryCount ? `${campaign.beneficiaryCount.toLocaleString()}+` : "1,000+"}
                  </span>
                  <span className="text-slate-500 text-[11px]">Direct Beneficiaries</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                  <span className="font-bold text-slate-900 block text-sm">{campaign.daysLeft}</span>
                  <span className="text-slate-500 text-[11px]">Days Remaining</span>
                </div>
              </div>

              {/* Matching Gift Callout */}
              {campaign.matchingGift && campaign.matchingGift.remainingMatch > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>{campaign.matchingGift.multiplier}x Impact Match</strong> active by{" "}
                      {campaign.matchingGift.sponsor}
                    </span>
                  </div>
                  <span className="font-bold text-amber-800">
                    {formatCurrency(campaign.matchingGift.remainingMatch)} left
                  </span>
                </div>
              )}

              {/* Big Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  id="campaign-modal-donate-btn"
                  onClick={() => onDonate(campaign)}
                  className="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5 fill-white text-white" />
                  Make a Donation
                </button>

                {campaignVolOps.length > 0 ? (
                  <button
                    onClick={() => {
                      if (onApplyVolunteer && campaignVolOps[0]) {
                        onApplyVolunteer(campaignVolOps[0]);
                      }
                    }}
                    className="py-3.5 px-6 rounded-2xl border-2 border-slate-800 hover:bg-slate-800 hover:text-white text-slate-900 font-bold text-base transition-all flex items-center justify-center gap-2"
                  >
                    <Users className="w-5 h-5" />
                    Apply as Volunteer
                  </button>
                ) : (
                  <button
                    onClick={handleShare}
                    className="py-3.5 px-6 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    {copiedLink ? "Link Copied to Clipboard!" : "Spread the Word"}
                  </button>
                )}
              </div>
            </div>

            {/* Non-profit Organization Info Strip */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={campaign.organization.logo}
                  alt={campaign.organization.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">{campaign.organization.name}</h4>
                    {campaign.organization.isVerified && (
                      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Verified Org
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tax Exemption: {campaign.organization.taxExemptNumber} • {campaign.organization.location}
                  </p>
                </div>
              </div>
              <a
                href={`mailto:${campaign.organization.contactEmail}`}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1"
              >
                Contact Organizers <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* AI Campaign Assistant & Transparency Summary */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950">AI Donor Clarity & Impact Summary</h4>
                    <p className="text-[11px] text-indigo-700">Powered by Gemini 3.7 Flash</p>
                  </div>
                </div>
                {!aiSummary && (
                  <button
                    onClick={handleFetchAiSummary}
                    disabled={loadingAi}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                  >
                    {loadingAi ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Summarize in 30 Seconds
                      </>
                    )}
                  </button>
                )}
              </div>

              {aiSummary && (
                <div className="p-3.5 rounded-xl bg-white border border-indigo-200 space-y-2.5 text-xs text-slate-700 animate-in fade-in">
                  <p className="font-medium text-slate-900 leading-relaxed">{aiSummary.summary}</p>
                  {aiSummary.keyHighlights && (
                    <div className="space-y-1 pt-1">
                      <span className="font-bold text-indigo-950 text-[11px] uppercase tracking-wider block">
                        Verified Strengths:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                        {aiSummary.keyHighlights.map((h: string, i: number) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {aiSummary.urgentNeeds && (
                    <p className="text-[11px] text-rose-800 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-100">
                      <strong>Immediate Need:</strong> {aiSummary.urgentNeeds}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Deep-Dive Tabs */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 gap-6 overflow-x-auto text-sm font-semibold">
              {[
                { id: "story", label: "Story & Cause", icon: FileText },
                { id: "budget", label: "Budget & Transparency", icon: PieChart },
                { id: "updates", label: `Field Updates (${campaign.updates.length})`, icon: History },
                { id: "donors", label: `Wall of Donors (${campaignDonations.length})`, icon: MessageSquare },
                { id: "volunteers", label: `Volunteer Drive (${campaignVolOps.length})`, icon: Users },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`pb-3.5 flex items-center gap-1.5 whitespace-nowrap transition-colors border-b-2 -mb-px ${
                    activeTab === id
                      ? "border-emerald-600 text-emerald-700 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab 1: Story */}
            {activeTab === "story" && (
              <div className="space-y-6 text-slate-700 text-sm leading-relaxed" id="tab-story-content">
                <div className="whitespace-pre-line prose max-w-none text-slate-700">
                  {campaign.description}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                  {campaign.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Budget Breakdown & Transparency */}
            {activeTab === "budget" && (
              <div className="space-y-6" id="tab-budget-content">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    Transparent Financial Expenditure Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    We maintain a strict 100% audited ledger for every dollar disbursed to ensure accountability.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {campaign.budgetBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
                    >
                      <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                        <span>{item.item}</span>
                        <span className="text-emerald-700">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="text-right text-xs font-semibold text-slate-600">
                        Allocated: {formatCurrency(item.amount)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Anti-Fraud Certification */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold">Third-Party Audited & Zero Platform Fee</p>
                    <p className="text-slate-600">
                      Receipts and vendor purchase invoices are cryptographically stamped into our public transparency ledger.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Updates */}
            {activeTab === "updates" && (
              <div className="space-y-6" id="tab-updates-content">
                {campaign.updates.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No field updates posted yet. The organizers will publish progress reports soon.
                  </p>
                ) : (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                    {campaign.updates.map((update) => (
                      <div key={update.id} className="relative pl-8 space-y-2">
                        <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-white" />
                        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-bold text-slate-900 text-base">{update.title}</h4>
                            <span className="text-xs text-slate-400">{update.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{update.content}</p>

                          {update.imageUrl && (
                            <img
                              src={update.imageUrl}
                              alt=""
                              className="rounded-xl w-full max-h-64 object-cover border border-slate-100"
                            />
                          )}

                          {update.impactMetrics && (
                            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-semibold">
                              🎯 Real-World Impact: {update.impactMetrics}
                            </div>
                          )}

                          <div className="text-[11px] text-slate-400 pt-1 flex justify-between">
                            <span>Posted by {update.author}</span>
                            {update.fundsDeployed && (
                              <span className="font-semibold text-slate-600">
                                Deployed: {formatCurrency(update.fundsDeployed)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Wall of Donors */}
            {activeTab === "donors" && (
              <div className="space-y-4" id="tab-donors-content">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Showing community contributions & messages</span>
                  <span>{campaignDonations.length} Contributions</span>
                </div>

                {campaignDonations.length === 0 ? (
                  <div className="py-8 text-center space-y-3">
                    <Heart className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-500">Be the first to ignite this campaign with a gift!</p>
                    <button
                      onClick={() => onDonate(campaign)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
                    >
                      Donate Now
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {campaignDonations.map((d) => (
                      <div key={d.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                              {d.isAnonymous ? "A" : d.donorName.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900">
                              {d.isAnonymous ? "Anonymous Supporter" : d.donorName}
                            </span>
                            {d.isRecurring && (
                              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                                Monthly Partner
                              </span>
                            )}
                          </div>
                          {d.message && (
                            <p className="text-slate-600 italic pl-9">"{d.message}"</p>
                          )}
                          {d.dedication && (
                            <p className="text-[11px] text-amber-800 font-medium pl-9">
                              🌟 Dedication: {d.dedication}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-slate-900 text-sm">
                            {formatCurrency(d.amount)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{d.date.split(" ")[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Volunteer Opportunities */}
            {activeTab === "volunteers" && (
              <div className="space-y-4" id="tab-volunteers-content">
                {campaignVolOps.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No active volunteer openings for this campaign at the moment.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {campaignVolOps.map((op) => (
                      <div
                        key={op.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{op.title}</h4>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 w-fit">
                            {op.spotsTotal - op.spotsFilled} Spots Left
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{op.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{op.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{op.isRemote ? "Remote / Virtual" : op.location}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {op.skillsRequired.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            if (onApplyVolunteer) onApplyVolunteer(op);
                          }}
                          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          Apply for this Volunteer Spot <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
