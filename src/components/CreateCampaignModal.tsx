import React, { useState } from "react";
import { Campaign, CampaignCategory, BudgetAllocation, CampaignMilestone } from "../types";
import { usePlatform } from "../context/PlatformContext";
import { useAuth } from "../context/AuthContext";
import {
  X,
  Sparkles,
  Bot,
  Loader2,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Layers,
} from "lucide-react";

interface CreateCampaignModalProps {
  onClose: () => void;
  onSuccess: (newCampaign: Campaign) => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const { createCampaign, generateAICampaignDraft, analyzeCampaignIntegrityAI, currency } = usePlatform();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [category, setCategory] = useState<CampaignCategory>("Education");
  const [goal, setGoal] = useState<string>("25000");
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0]
  );
  const [location, setLocation] = useState<string>("Regional Community Centers");
  const [imageUrl, setImageUrl] = useState<string>(
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80"
  );
  const [description, setDescription] = useState<string>("");
  const [urgent, setUrgent] = useState<boolean>(false);

  // Budget allocations
  const [budgetList, setBudgetList] = useState<BudgetAllocation[]>([
    { item: "Direct Community Aid / Supplies", percentage: 75, amount: 18750 },
    { item: "Field Logistics & Transport", percentage: 15, amount: 3750 },
    { item: "Monitoring & Auditing", percentage: 10, amount: 2500 },
  ]);

  // AI draft assistant state
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [keyObjectives, setKeyObjectives] = useState<string>("");
  const [integrityReport, setIntegrityReport] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAiDraft = async () => {
    if (!title.trim()) {
      alert("Please enter a campaign title first to guide the AI.");
      return;
    }
    setIsGeneratingAi(true);
    try {
      const result = await generateAICampaignDraft({
        title,
        category,
        targetAmount: parseFloat(goal) || 10000,
        keyPoints: keyObjectives || `Direct support and long-term sustainability for ${category} initiative.`,
      });

      if (result.story) setDescription(result.story);
      if (result.tagline) setTagline(result.tagline);
      if (result.budgetBreakdown && Array.isArray(result.budgetBreakdown)) {
        const totalG = parseFloat(goal) || 10000;
        setBudgetList(
          result.budgetBreakdown.map((b: any) => ({
            item: b.item,
            percentage: b.percentage,
            amount: (totalG * b.percentage) / 100,
          }))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleAddBudgetItem = () => {
    setBudgetList([...budgetList, { item: "New Expense Item", percentage: 10, amount: 1000 }]);
  };

  const handleRemoveBudgetItem = (idx: number) => {
    setBudgetList(budgetList.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    try {
      const goalNum = parseFloat(goal) || 10000;

      const milestones: CampaignMilestone[] = [
        {
          id: `m-${Date.now()}-1`,
          percentage: 25,
          title: "Phase 1: Mobilization & Procurement",
          description: "Initial equipment and volunteer coordination.",
          reached: false,
        },
        {
          id: `m-${Date.now()}-2`,
          percentage: 50,
          title: "Phase 2: Halfway Impact Milestone",
          description: "Reaching primary community beneficiaries.",
          reached: false,
        },
        {
          id: `m-${Date.now()}-3`,
          percentage: 100,
          title: "Phase 3: Full Delivery & Audited Impact Report",
          description: "Complete outcome verification and certification.",
          reached: false,
        },
      ];

      const newCamp = createCampaign({
        title,
        tagline: tagline || title,
        category,
        goal: goalNum,
        raised: 0,
        daysLeft: 60,
        endDate,
        location,
        imageUrl,
        galleryImages: [imageUrl],
        description,
        urgent,
        budgetBreakdown: budgetList,
        milestones,
        organization: {
          id: currentUser.id || "org-user",
          name: currentUser.organizationName || currentUser.name,
          logo: currentUser.avatar,
          isVerified: Boolean(currentUser.isVerified),
          taxExemptNumber: currentUser.taxExemptId || "80G / 501(c)(3) Compliant",
          location: currentUser.location || "Headquarters",
          contactEmail: currentUser.email,
        },
        tags: [category, "Grassroots", "Verified Aid"],
        beneficiaryCount: 500,
      });

      onSuccess(newCamp);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="create-campaign-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="create-campaign-modal-content"
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Charity Fundraising Portal
            </span>
            <h2 className="text-xl font-bold">Create New Charity Campaign</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* AI Drafting Assistant Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-emerald-50 border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-950">AI Campaign Co-Pilot</h4>
                  <p className="text-[11px] text-indigo-700">
                    Draft a transparent, compelling narrative, milestones & budget breakdown with Gemini
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAiDraft}
                disabled={isGeneratingAi}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Drafting Story...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Generate with AI
                  </>
                )}
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder="Optional key objectives (e.g. Provide 500 backpacks and solar lamps to middle school girls)"
                value={keyObjectives}
                onChange={(e) => setKeyObjectives(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-indigo-200/80 bg-white/90 text-xs focus:border-indigo-600 outline-hidden"
              />
            </div>
          </div>

          {/* Basic Campaign Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar-Powered Clean Water for 12 Remote Villages"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:border-emerald-600 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CampaignCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:border-emerald-600 outline-hidden bg-white"
                >
                  <option value="Education">🎓 Education</option>
                  <option value="Healthcare">🏥 Healthcare</option>
                  <option value="Food">🍲 Food & Nutrition</option>
                  <option value="Housing">🏠 Housing & Shelter</option>
                  <option value="Environment">🌱 Environment</option>
                  <option value="Animals">🐾 Animal Rescue</option>
                  <option value="Disaster Relief">🚨 Disaster Relief</option>
                  <option value="Clean Water">💧 Clean Water</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Fundraising Goal (USD $) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    required
                    min="500"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Target Field Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Austin, TX / Rural Gujarat"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Campaign End Date
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Campaign Photo URL
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                One-Sentence Tagline
              </label>
              <input
                type="text"
                placeholder="A compelling hook for donors..."
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Comprehensive Campaign Story & Cause *
              </label>
              <textarea
                rows={6}
                required
                placeholder="Explain the background, why funds are needed, and exact plan for execution..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="urgent-checkbox"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <label htmlFor="urgent-checkbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Mark as Urgent Emergency Relief (Featured badge on browse page)
              </label>
            </div>
          </div>

          {/* Transparent Budget Breakdown */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Transparent Budget Breakdown
                </h4>
                <p className="text-[11px] text-slate-400">
                  Donors value clear accounting of expenditure.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddBudgetItem}
                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            <div className="space-y-2">
              {budgetList.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => {
                      const updated = [...budgetList];
                      updated[idx].item = e.target.value;
                      setBudgetList(updated);
                    }}
                    placeholder="Expense item..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-hidden"
                  />
                  <div className="w-24 relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={item.percentage}
                      onChange={(e) => {
                        const updated = [...budgetList];
                        updated[idx].percentage = parseFloat(e.target.value) || 0;
                        setBudgetList(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-right pr-6 focus:border-emerald-600 outline-hidden"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                  </div>
                  {budgetList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBudgetItem(idx)}
                      className="p-2 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Launching Campaign...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Publish & Launch Campaign
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
