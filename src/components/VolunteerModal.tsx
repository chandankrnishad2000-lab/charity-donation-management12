import React, { useState } from "react";
import { VolunteerOpportunity } from "../types";
import { usePlatform } from "../context/PlatformContext";
import { useAuth } from "../context/AuthContext";
import {
  X,
  Users,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";

interface VolunteerModalProps {
  opportunity: VolunteerOpportunity | null;
  onClose: () => void;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({
  opportunity,
  onClose,
}) => {
  const { applyForVolunteerOpportunity } = usePlatform();
  const { currentUser } = useAuth();

  const [volunteerName, setVolunteerName] = useState<string>(currentUser.name || "Alex Rivera");
  const [volunteerEmail, setVolunteerEmail] = useState<string>(currentUser.email || "alex.volunteer@example.com");
  const [phone, setPhone] = useState<string>(currentUser.phone || "+1 (555) 019-2834");
  const [skillsInput, setSkillsInput] = useState<string>(
    currentUser.skills ? currentUser.skills.join(", ") : "First Aid, Team Coordination, Logistics"
  );
  const [availability, setAvailability] = useState<string>("Weekends & evenings");
  const [message, setMessage] = useState<string>(
    "I am eager to contribute my time and energy to this cause. Available for scheduled briefings."
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!opportunity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((r) => setTimeout(r, 800));

      applyForVolunteerOpportunity({
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        organizationId: opportunity.organizationId,
        volunteerId: currentUser.id,
        volunteerName: volunteerName.trim(),
        volunteerEmail: volunteerEmail.trim(),
        phone: phone.trim(),
        skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
        availability: availability.trim(),
        message: message.trim(),
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="volunteer-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="volunteer-modal-content"
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Volunteer Application</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900">Application Submitted!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {opportunity.organizationName} will review your profile and reach out via email/phone with orientation details.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                Back to Opportunities
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Opportunity Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 text-sm block">{opportunity.title}</span>
                <p className="text-slate-600">{opportunity.organizationName}</p>
                <div className="grid grid-cols-2 gap-2 text-slate-500 pt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opportunity.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opportunity.isRemote ? "Remote" : opportunity.location}</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={volunteerEmail}
                    onChange={(e) => setVolunteerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Availability</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saturdays, 4 hrs/week"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">
                  Relevant Skills (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CPR, Teaching, Driving, Cooking, Spanish"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">
                  Why do you want to join this initiative?
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Volunteer Application
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
