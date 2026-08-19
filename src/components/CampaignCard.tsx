import React from "react";
import { Campaign } from "../types";
import { usePlatform } from "../context/PlatformContext";
import { CampaignProgress } from "./CampaignProgress";
import {
  Heart,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  HeartPulse,
  Utensils,
  Home,
  Trees,
  Cat,
  AlertTriangle,
  Droplets,
} from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
  onSelect: (campaign: Campaign) => void;
  onDonate: (campaign: Campaign) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Education: <GraduationCap className="w-3.5 h-3.5" />,
  Healthcare: <HeartPulse className="w-3.5 h-3.5" />,
  Food: <Utensils className="w-3.5 h-3.5" />,
  Housing: <Home className="w-3.5 h-3.5" />,
  Environment: <Trees className="w-3.5 h-3.5" />,
  Animals: <Cat className="w-3.5 h-3.5" />,
  "Disaster Relief": <AlertTriangle className="w-3.5 h-3.5" />,
  "Clean Water": <Droplets className="w-3.5 h-3.5" />,
};

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onSelect,
  onDonate,
}) => {
  const { formatCurrency, isBookmarked, toggleBookmark } = usePlatform();
  const bookmarked = isBookmarked(campaign.id);
  const percent = Math.min(Math.round((campaign.raised / Math.max(campaign.goal, 1)) * 100), 100);

  return (
    <div
      id={`campaign-card-${campaign.id}`}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      {/* Image and Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-800 backdrop-blur-xs shadow-xs">
              {CATEGORY_ICONS[campaign.category] || <Sparkles className="w-3.5 h-3.5" />}
              {campaign.category}
            </span>
            {campaign.urgent && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs animate-pulse">
                <Flame className="w-3 h-3" />
                Urgent Need
              </span>
            )}
          </div>

          <button
            id={`bookmark-btn-${campaign.id}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(campaign.id);
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-rose-600 transition-colors shadow-xs"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark campaign"}
          >
            <Heart
              className={`w-4 h-4 ${bookmarked ? "fill-rose-600 text-rose-600" : ""}`}
            />
          </button>
        </div>

        {/* Organization Name on Bottom of Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white text-xs font-medium">
          <span className="truncate drop-shadow-xs">{campaign.organization.name}</span>
          {campaign.organization.isVerified && (
            <span className="inline-flex items-center gap-0.5 text-emerald-300 text-[11px] font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded-md backdrop-blur-xs">
              <CheckCircle2 className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3
            onClick={() => onSelect(campaign)}
            className="font-bold text-slate-900 text-lg line-clamp-2 leading-snug cursor-pointer hover:text-emerald-700 transition-colors"
          >
            {campaign.title}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
            {campaign.tagline || campaign.description}
          </p>
        </div>

        {/* Matching Gift Notice */}
        {campaign.matchingGift && campaign.matchingGift.remainingMatch > 0 && (
          <div className="px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">
              <strong>{campaign.matchingGift.multiplier}x Match Active</strong> by {campaign.matchingGift.sponsor}
            </span>
          </div>
        )}

        {/* Progress & Stats */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex justify-between items-baseline">
            <div className="space-y-0.5">
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(campaign.raised)}
              </span>
              <span className="text-xs text-slate-500 font-medium ml-1.5">
                raised of {formatCurrency(campaign.goal)}
              </span>
            </div>
            <span className="text-sm font-bold text-emerald-700">{percent}%</span>
          </div>

          <CampaignProgress
            raised={campaign.raised}
            goal={campaign.goal}
            showMilestonePins={false}
            size="sm"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {campaign.donorCount.toLocaleString()} Donors
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {campaign.daysLeft > 0 ? `${campaign.daysLeft} days left` : "Ending soon"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-2 gap-2">
          <button
            id={`details-btn-${campaign.id}`}
            onClick={() => onSelect(campaign)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
          >
            View Story
          </button>
          <button
            id={`donate-btn-${campaign.id}`}
            onClick={() => onDonate(campaign)}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1"
          >
            Donate
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
