import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PlatformProvider, usePlatform } from "./context/PlatformContext";
import { Navbar } from "./components/Navbar";
import { CampaignCard } from "./components/CampaignCard";
import { CampaignModal } from "./components/CampaignModal";
import { DonationModal } from "./components/DonationModal";
import { DonationReceiptModal } from "./components/DonationReceiptModal";
import { VolunteerModal } from "./components/VolunteerModal";
import { CreateCampaignModal } from "./components/CreateCampaignModal";
import { PostUpdateModal } from "./components/PostUpdateModal";
import { AIAdvisorModal } from "./components/AIAdvisorModal";
import { TransparencyLedgerModal } from "./components/TransparencyLedgerModal";
import { DonorDashboard } from "./components/dashboards/DonorDashboard";
import { CharityDashboard } from "./components/dashboards/CharityDashboard";
import { VolunteerDashboard } from "./components/dashboards/VolunteerDashboard";
import { AdminDashboard } from "./components/dashboards/AdminDashboard";
import { Campaign, CampaignCategory, DonationReceipt, VolunteerOpportunity } from "./types";
import {
  Search,
  Flame,
  Sparkles,
  Heart,
  ShieldCheck,
  Award,
  Users,
  Building2,
  Calendar,
  MapPin,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  CheckCircle2,
  Lock,
} from "lucide-react";

const CATEGORIES: (CampaignCategory | "All")[] = [
  "All",
  "Education",
  "Healthcare",
  "Food",
  "Clean Water",
  "Disaster Relief",
  "Environment",
  "Animals",
  "Housing",
];

function MainContent() {
  const { currentUser } = useAuth();
  const { campaigns, volunteerOpportunities, donations, formatCurrency, currency } = usePlatform();

  // Navigation views
  const [currentView, setCurrentView] = useState<"discover" | "volunteer_drives" | "dashboard">(
    "discover"
  );

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<CampaignCategory | "All">("All");
  const [onlyUrgent, setOnlyUrgent] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"urgent" | "funded" | "goal" | "newest">("urgent");

  // Modals state
  const [activeCampaignModal, setActiveCampaignModal] = useState<Campaign | null>(null);
  const [activeDonationModal, setActiveDonationModal] = useState<Campaign | null>(null);
  const [activeReceiptModal, setActiveReceiptModal] = useState<DonationReceipt | null>(null);
  const [activeVolunteerModal, setActiveVolunteerModal] = useState<VolunteerOpportunity | null>(null);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState<boolean>(false);
  const [activePostUpdateCampaign, setActivePostUpdateCampaign] = useState<Campaign | null>(null);
  const [showAIAdvisorModal, setShowAIAdvisorModal] = useState<boolean>(false);
  const [showLedgerModal, setShowLedgerModal] = useState<boolean>(false);

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesUrgent = !onlyUrgent || c.urgent;

    return matchesSearch && matchesCategory && matchesUrgent;
  });

  // Sorted campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (sortBy === "urgent") {
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return a.daysLeft - b.daysLeft;
    }
    if (sortBy === "funded") {
      const pA = a.raised / a.goal;
      const pB = b.raised / b.goal;
      return pB - pA;
    }
    if (sortBy === "goal") {
      return b.goal - a.goal;
    }
    return 0;
  });

  // Featured campaign for the hero banner
  const featuredCampaign = campaigns.find((c) => c.urgent) || campaigns[0];
  const featuredPercent = featuredCampaign
    ? Math.min(Math.round((featuredCampaign.raised / Math.max(featuredCampaign.goal, 1)) * 100), 100)
    : 0;

  // Platform totals
  const totalRaisedPlatform = campaigns.reduce((acc, c) => acc + c.raised, 0);
  const totalDonorsPlatform = campaigns.reduce((acc, c) => acc + c.donorCount, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenAdvisor={() => setShowAIAdvisorModal(true)}
        onOpenLedger={() => setShowLedgerModal(true)}
        onCreateCampaign={() => setShowCreateCampaignModal(true)}
      />

      {/* Top 4-Card Metric Grid (Professional Polish Theme) */}
      <div className="border-b border-slate-200 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                Total Donations
              </p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRaisedPlatform)}</p>
              <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                ↑ 12% this month
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                Active Campaigns
              </p>
              <p className="text-2xl font-bold text-slate-900">{campaigns.length}</p>
              <p className="text-xs text-slate-500 mt-1">Across 8 categories</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                Lives Impacted
              </p>
              <p className="text-2xl font-bold text-slate-900">42,850</p>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Verified impact metrics</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                Volunteers
              </p>
              <p className="text-2xl font-bold text-slate-900">{totalDonorsPlatform > 0 ? totalDonorsPlatform : 1240}</p>
              <p className="text-xs text-slate-500 mt-1">Active this week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* VIEW 1: DISCOVER CAMPAIGNS (Bento Grid with Featured Hero & Verified Sidebar) */}
        {currentView === "discover" && (
          <div className="space-y-6 animate-in fade-in" id="discover-view">
            {/* Split Grid: Main Stage (col-span-8) + Side Action Panel (col-span-4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8-cols): Hero Banner + Search & Secondary Cards */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Featured Hero Campaign Card */}
                {featuredCampaign && (
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col group">
                    <div className="h-56 bg-slate-900 relative overflow-hidden">
                      <img
                        src={featuredCampaign.imageUrl}
                        alt={featuredCampaign.title}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-103 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <span className="bg-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2 inline-block shadow-xs">
                          Featured Campaign
                        </span>
                        <h2
                          onClick={() => setActiveCampaignModal(featuredCampaign)}
                          className="text-2xl sm:text-3xl font-bold hover:text-emerald-300 cursor-pointer transition-colors leading-tight"
                        >
                          {featuredCampaign.title}
                        </h2>
                        <p className="text-slate-200 text-xs sm:text-sm max-w-lg mt-1 line-clamp-2">
                          {featuredCampaign.tagline || featuredCampaign.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-semibold text-slate-700">
                            {formatCurrency(featuredCampaign.raised)}{" "}
                            <span className="text-slate-400 font-normal">
                              raised of {formatCurrency(featuredCampaign.goal)}
                            </span>
                          </span>
                          <span className="text-sm font-bold text-emerald-600">{featuredPercent}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${featuredPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                              <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 overflow-hidden">
                              <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400 overflow-hidden">
                              <img
                                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                              +{featuredCampaign.donorCount}
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                            Donors contributed
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveCampaignModal(featuredCampaign)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
                          >
                            View Story
                          </button>
                          <button
                            onClick={() => setActiveDonationModal(featuredCampaign)}
                            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
                          >
                            Donate Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search causes, charities, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-600 outline-hidden"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                      <button
                        onClick={() => setOnlyUrgent(!onlyUrgent)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                          onlyUrgent
                            ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <Flame className={`w-3.5 h-3.5 ${onlyUrgent ? "text-white" : "text-rose-600"}`} />
                        Urgent Only
                      </button>

                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
                      >
                        <option value="urgent">Sort: Urgent First</option>
                        <option value="funded">Sort: % Funded</option>
                        <option value="goal">Sort: Target Amount</option>
                      </select>
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-semibold">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all border ${
                          selectedCategory === cat
                            ? "bg-slate-900 text-white border-slate-900 font-bold"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* All Campaigns Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sortedCampaigns.map((camp) => (
                    <CampaignCard
                      key={camp.id}
                      campaign={camp}
                      onSelect={(c) => setActiveCampaignModal(c)}
                      onDonate={(c) => setActiveDonationModal(c)}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column (4-cols): Verified Impact & Recent Activity Stream */}
              <aside className="lg:col-span-4 flex flex-col gap-6">
                {/* Dark Verified Impact Card */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xs space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                    <span className="text-emerald-400 font-serif italic text-xl">✓</span> Verified Impact
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-1 bg-emerald-500 rounded-full shrink-0"></div>
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                          Latest Update
                        </p>
                        <p className="text-xs mt-0.5 leading-relaxed text-slate-200">
                          150 students received educational tablets in Spiti Valley. Check your receipt for the audit report.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-1 bg-blue-400 rounded-full shrink-0"></div>
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                          New Opportunity
                        </p>
                        <p className="text-xs mt-0.5 leading-relaxed text-slate-200">
                          Community Food Drive: 20 volunteers needed for Saturday morning distribution.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setCurrentView("volunteer_drives")}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold border border-white/10 text-white transition-colors"
                    >
                      Apply as Volunteer
                    </button>
                  </div>
                </div>

                {/* Recent Activity Live Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">Recent Live Activity</h3>
                  <div className="space-y-3 divide-y divide-slate-100">
                    {donations.slice(0, 5).map((d) => (
                      <div key={d.id} className="flex items-center gap-3 pt-3 first:pt-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                          {d.isAnonymous ? "A" : d.donorName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {d.isAnonymous ? "Anonymous Supporter" : d.donorName}{" "}
                            <span className="font-normal text-slate-500">donated</span> {d.currency}{" "}
                            {d.amount.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{d.campaignTitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowLedgerModal(true)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 transition-colors block text-center"
                  >
                    View Cryptographic Ledger →
                  </button>
                </div>

                {/* AI Advisor Promotion Tile */}
                <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-700" />
                    <h4 className="font-bold text-indigo-950 text-xs">Personalized Giving Plan</h4>
                  </div>
                  <p className="text-xs text-indigo-900 leading-relaxed">
                    Let Gemini evaluate active charities and craft an optimal high-impact portfolio tailored to your values.
                  </p>
                  <button
                    onClick={() => setShowAIAdvisorModal(true)}
                    className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    Launch AI Advisor
                  </button>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* VIEW 2: VOLUNTEER DRIVES */}
        {currentView === "volunteer_drives" && (
          <div className="space-y-6 animate-in fade-in" id="volunteer-drives-view">
            <div className="p-8 rounded-2xl bg-slate-900 text-white space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Community Hands & Hearts
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">Open Volunteer Mobilization Drives</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Donate your time, specialized skills, and empathy. Connect directly with non-profits organizing on-the-ground crisis relief and mentorship.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteerOpportunities.map((op) => (
                <div
                  key={op.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
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
                    <h3 className="font-bold text-slate-900 text-base">{op.title}</h3>
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
                      onClick={() => setActiveVolunteerModal(op)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
                    >
                      Apply to Volunteer <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: DASHBOARDS (ROLE-SPECIFIC) */}
        {currentView === "dashboard" && (
          <div>
            {currentUser.role === "donor" && (
              <DonorDashboard
                onSelectCampaign={(c) => setActiveCampaignModal(c)}
                onDonateToCampaign={(c) => setActiveDonationModal(c)}
                onViewReceipt={(r) => setActiveReceiptModal(r)}
                onOpenAdvisor={() => setShowAIAdvisorModal(true)}
                onExploreCampaigns={() => setCurrentView("discover")}
              />
            )}

            {currentUser.role === "charity" && (
              <CharityDashboard
                onCreateCampaign={() => setShowCreateCampaignModal(true)}
                onPostUpdate={(c) => setActivePostUpdateCampaign(c)}
                onSelectCampaign={(c) => setActiveCampaignModal(c)}
              />
            )}

            {currentUser.role === "volunteer" && (
              <VolunteerDashboard
                onApplyOpportunity={(op) => setActiveVolunteerModal(op)}
              />
            )}

            {currentUser.role === "admin" && (
              <AdminDashboard
                onSelectCampaign={(c) => setActiveCampaignModal(c)}
                onOpenLedger={() => setShowLedgerModal(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* MODALS */}
      <CampaignModal
        campaign={activeCampaignModal}
        onClose={() => setActiveCampaignModal(null)}
        onDonate={(c) => {
          setActiveCampaignModal(null);
          setActiveDonationModal(c);
        }}
        onApplyVolunteer={(op) => {
          setActiveCampaignModal(null);
          setActiveVolunteerModal(op);
        }}
      />

      <DonationModal
        campaign={activeDonationModal}
        onClose={() => setActiveDonationModal(null)}
        onReceiptGenerated={(r) => setActiveReceiptModal(r)}
      />

      <DonationReceiptModal
        receipt={activeReceiptModal}
        onClose={() => setActiveReceiptModal(null)}
      />

      <VolunteerModal
        opportunity={activeVolunteerModal}
        onClose={() => setActiveVolunteerModal(null)}
      />

      {showCreateCampaignModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateCampaignModal(false)}
          onSuccess={(newCamp) => {
            setShowCreateCampaignModal(false);
            setActiveCampaignModal(newCamp);
          }}
        />
      )}

      {activePostUpdateCampaign && (
        <PostUpdateModal
          campaign={activePostUpdateCampaign}
          onClose={() => setActivePostUpdateCampaign(null)}
        />
      )}

      {showAIAdvisorModal && (
        <AIAdvisorModal
          onClose={() => setShowAIAdvisorModal(false)}
          onSelectCampaign={(c) => setActiveCampaignModal(c)}
          onDonateToCampaign={(c) => setActiveDonationModal(c)}
        />
      )}

      {showLedgerModal && (
        <TransparencyLedgerModal onClose={() => setShowLedgerModal(false)} />
      )}

      {/* Professional Polish Certified Footer */}
      <footer className="px-8 py-5 bg-white border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4 mt-12">
        <div className="flex flex-wrap items-center gap-6">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            Server Status: Secure
          </span>
          <span>80G Tax Exemption Certified</span>
          <span>ISO 9001:2015 Charity Compliance</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button onClick={() => setShowLedgerModal(true)} className="hover:text-slate-900 font-medium">
            Transparency Report
          </button>
          <button onClick={() => setShowAIAdvisorModal(true)} className="hover:text-slate-900 font-medium">
            AI Portfolio Engine
          </button>
          <span className="font-bold text-slate-900 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified Platform
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlatformProvider>
        <MainContent />
      </PlatformProvider>
    </AuthProvider>
  );
}
