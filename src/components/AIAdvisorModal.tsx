import React, { useState } from "react";
import { Campaign, CampaignCategory } from "../types";
import { usePlatform } from "../context/PlatformContext";
import {
  X,
  Sparkles,
  Bot,
  Loader2,
  Heart,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Target,
  Sliders,
  DollarSign,
  CheckCircle2,
} from "lucide-react";

interface AIAdvisorModalProps {
  onClose: () => void;
  onSelectCampaign: (campaign: Campaign) => void;
  onDonateToCampaign: (campaign: Campaign) => void;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({
  onClose,
  onSelectCampaign,
  onDonateToCampaign,
}) => {
  const { campaigns, currency, formatCurrency, getAIRecommendations } = usePlatform();

  const [selectedCauses, setSelectedCauses] = useState<CampaignCategory[]>([
    "Education",
    "Clean Water",
    "Healthcare",
  ]);
  const [budget, setBudget] = useState<number>(100);
  const [urgencyPreference, setUrgencyPreference] = useState<"urgent_first" | "balanced" | "long_term">("balanced");
  const [locationPreference, setLocationPreference] = useState<string>("Global & Local");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<any | null>(null);

  const causesList: CampaignCategory[] = [
    "Education",
    "Healthcare",
    "Food",
    "Housing",
    "Environment",
    "Animals",
    "Disaster Relief",
    "Clean Water",
  ];

  const toggleCause = (cause: CampaignCategory) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(selectedCauses.filter((c) => c !== cause));
    } else {
      setSelectedCauses([...selectedCauses, cause]);
    }
  };

  const handleGenerate = async () => {
    if (selectedCauses.length === 0) {
      alert("Please choose at least one cause category.");
      return;
    }
    setIsLoading(true);
    try {
      const recs = await getAIRecommendations({
        preferredCauses: selectedCauses,
        budget,
        location: locationPreference,
        urgencyPreference,
      });
      setRecommendations(recs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="ai-advisor-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="ai-advisor-modal-content"
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xs">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-lg">AI Philanthropy Portfolio Advisor</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Personalized high-impact giving plans matched with verified charities.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {!recommendations ? (
            <div className="space-y-6">
              {/* Causes Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  1. What causes resonate most with you?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {causesList.map((c) => {
                    const isSelected = selectedCauses.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCause(c)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{c}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold uppercase tracking-wider text-slate-500">
                    2. Planned Monthly or One-Time Giving
                  </label>
                  <span className="font-bold text-slate-900 text-sm">
                    {currency} {budget}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{currency} 20</span>
                  <span>{currency} 250</span>
                  <span>{currency} 500</span>
                  <span>{currency} 1,000+</span>
                </div>
              </div>

              {/* Urgency & Strategy Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "urgent_first" as const,
                    title: "Emergency First",
                    desc: "Prioritize acute crises & urgent relief.",
                  },
                  {
                    id: "balanced" as const,
                    title: "Balanced Impact",
                    desc: "Blend immediate humanitarian aid & long-term development.",
                  },
                  {
                    id: "long_term" as const,
                    title: "Systemic Solutions",
                    desc: "Focus on education, environment & sustained growth.",
                  },
                ].map(({ id, title, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setUrgencyPreference(id)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      urgencyPreference === id
                        ? "border-indigo-600 bg-indigo-50/60 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="font-bold text-slate-900 block">{title}</span>
                    <span className="text-slate-500 text-[11px] mt-1 block">{desc}</span>
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> AI Analyzing 10+ Campaigns...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" /> Generate Optimal Giving Portfolio
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Recommendations Output */
            <div className="space-y-6 animate-in fade-in" id="ai-advisor-results">
              {/* Executive Summary Strategy */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-700" />
                  <h4 className="font-bold text-indigo-950 text-sm">Recommended Philanthropy Strategy</h4>
                </div>
                <p className="text-xs text-indigo-900 leading-relaxed">{recommendations.rationale}</p>
                {recommendations.expectedOutcome && (
                  <p className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 p-2 rounded-lg mt-2">
                    🎯 Forecasted Impact: {recommendations.expectedOutcome}
                  </p>
                )}
              </div>

              {/* Recommended Campaigns Allocations */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Suggested Allocation Portfolio
                </span>

                <div className="space-y-3">
                  {recommendations.recommendedCampaigns?.map((rec: any, idx: number) => {
                    const matchedCamp =
                      campaigns.find((c) => c.id === rec.campaignId) ||
                      campaigns[idx % campaigns.length];

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={matchedCamp.imageUrl}
                            alt=""
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                          />
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {matchedCamp.category}
                            </span>
                            <h4
                              onClick={() => {
                                onSelectCampaign(matchedCamp);
                                onClose();
                              }}
                              className="font-bold text-slate-900 text-sm hover:text-emerald-700 cursor-pointer line-clamp-1"
                            >
                              {matchedCamp.title}
                            </h4>
                            <p className="text-xs text-slate-500 italic">"{rec.reason}"</p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                          <div className="text-left sm:text-right">
                            <span className="text-xs font-bold text-indigo-700 block">
                              {rec.suggestedShare}% Allocation
                            </span>
                            <span className="text-sm font-black text-slate-900">
                              {currency} {((budget * rec.suggestedShare) / 100).toFixed(0)}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              onDonateToCampaign(matchedCamp);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                          >
                            Donate
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reset Advisor */}
              <div className="pt-2 flex justify-between items-center border-t border-slate-200">
                <button
                  onClick={() => setRecommendations(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  ← Adjust Preferences
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
