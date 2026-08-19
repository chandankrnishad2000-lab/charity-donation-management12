import React, { useState } from "react";
import { Campaign } from "../types";
import { usePlatform } from "../context/PlatformContext";
import { useAuth } from "../context/AuthContext";
import { X, Send, Loader2, Image as ImageIcon, DollarSign } from "lucide-react";

interface PostUpdateModalProps {
  campaign: Campaign | null;
  onClose: () => void;
}

export const PostUpdateModal: React.FC<PostUpdateModalProps> = ({ campaign, onClose }) => {
  const { postCampaignUpdate, formatCurrency } = usePlatform();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [impactMetrics, setImpactMetrics] = useState<string>("");
  const [fundsDeployed, setFundsDeployed] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!campaign) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));

      postCampaignUpdate(campaign.id, {
        title: title.trim(),
        content: content.trim(),
        author: currentUser.name || "Campaign Director",
        imageUrl: imageUrl.trim() || undefined,
        impactMetrics: impactMetrics.trim() || undefined,
        fundsDeployed: fundsDeployed ? parseFloat(fundsDeployed) : undefined,
      });

      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="post-update-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="post-update-modal-content"
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-emerald-400 font-semibold uppercase">Field Progress</span>
            <h3 className="font-bold text-base">Post Campaign Milestone Update</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-800">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Update Headline *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 500 Food Kits Distributed to Flood Families"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:border-emerald-600 outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Story & Progress Narrative *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe on-the-ground achievements, volunteer feedback, and next steps..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Field Photo URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Tangible Impact Metric
              </label>
              <input
                type="text"
                placeholder="e.g. 1,200 Children vaccinated"
                value={impactMetrics}
                onChange={(e) => setImpactMetrics(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Funds Deployed (USD $)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={fundsDeployed}
                onChange={(e) => setFundsDeployed(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing Update...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Publish Update to Donors
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
