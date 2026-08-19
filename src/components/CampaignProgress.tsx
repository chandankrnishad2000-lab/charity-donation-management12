import React from "react";
import { CampaignMilestone } from "../types";

interface CampaignProgressProps {
  raised: number;
  goal: number;
  milestones?: CampaignMilestone[];
  showMilestonePins?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const CampaignProgress: React.FC<CampaignProgressProps> = ({
  raised,
  goal,
  milestones = [],
  showMilestonePins = true,
  className = "",
  size = "md",
}) => {
  const percentage = Math.min(Math.round((raised / Math.max(goal, 1)) * 100), 100);
  const rawPercentage = Math.round((raised / Math.max(goal, 1)) * 100);

  const heightClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`} id="campaign-progress-container">
      <div className="relative w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
        <div
          className={`bg-emerald-600 rounded-full transition-all duration-700 ease-out ${heightClasses[size]}`}
          style={{ width: `${Math.max(percentage, 3)}%` }}
        />
      </div>

      {showMilestonePins && milestones.length > 0 && (
        <div className="relative w-full pt-1">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>0%</span>
            {milestones.map((m) => (
              <span
                key={m.id}
                className={`transition-colors ${
                  m.reached ? "text-emerald-700 font-semibold" : "text-slate-400"
                }`}
                title={m.title}
              >
                {m.percentage}% {m.reached ? "✓" : ""}
              </span>
            ))}
            <span className="font-semibold text-slate-700">{rawPercentage}% Funded</span>
          </div>
        </div>
      )}
    </div>
  );
};
