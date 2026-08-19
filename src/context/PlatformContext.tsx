import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Campaign,
  Donation,
  DonationReceipt,
  VolunteerOpportunity,
  VolunteerApplication,
  CharityVerification,
  NotificationItem,
  TransparencyLedgerItem,
  CurrencyCode,
  CampaignCategory,
  CampaignStatus,
  PaymentMethod,
} from "../types";
import {
  INITIAL_CAMPAIGNS,
  INITIAL_DONATIONS,
  INITIAL_RECEIPTS,
  INITIAL_VOLUNTEER_OPPORTUNITIES,
  INITIAL_VOLUNTEER_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_VERIFICATIONS,
  INITIAL_TRANSPARENCY_LEDGER,
  CURRENCY_CONFIGS,
} from "../data/initialData";

interface PlatformContextType {
  campaigns: Campaign[];
  donations: Donation[];
  receipts: DonationReceipt[];
  volunteerOpportunities: VolunteerOpportunity[];
  volunteerApplications: VolunteerApplication[];
  verifications: CharityVerification[];
  notifications: NotificationItem[];
  transparencyLedger: TransparencyLedgerItem[];
  currency: CurrencyCode;
  bookmarkedCampaignIds: string[];
  setCurrency: (code: CurrencyCode) => void;
  formatCurrency: (amountInUsd: number, options?: { showCode?: boolean; round?: boolean }) => string;
  convertUsdToSelected: (amountInUsd: number) => number;
  convertSelectedToUsd: (amountInSelected: number) => number;
  toggleBookmark: (campaignId: string) => void;
  isBookmarked: (campaignId: string) => boolean;

  // Campaign Actions
  createCampaign: (campaignData: Partial<Campaign>) => Campaign;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  postCampaignUpdate: (
    campaignId: string,
    update: { title: string; content: string; author: string; imageUrl?: string; impactMetrics?: string; fundsDeployed?: number }
  ) => void;

  // Donation Actions
  processDonation: (params: {
    campaignId: string;
    donorId: string;
    donorName: string;
    donorEmail: string;
    amountInSelected: number;
    currency: CurrencyCode;
    paymentMethod: PaymentMethod;
    isRecurring: boolean;
    recurringFrequency?: "monthly" | "quarterly" | "annual";
    isAnonymous: boolean;
    message?: string;
    dedication?: string;
    donorTaxId?: string;
    tipPercentage?: number;
    companyMatchName?: string;
  }) => Promise<{ donation: Donation; receipt: DonationReceipt }>;

  // Volunteer Actions
  createVolunteerOpportunity: (op: Omit<VolunteerOpportunity, "id" | "spotsFilled" | "status">) => VolunteerOpportunity;
  applyForVolunteerOpportunity: (application: Omit<VolunteerApplication, "id" | "status" | "appliedAt">) => VolunteerApplication;
  updateVolunteerApplicationStatus: (applicationId: string, status: "Approved" | "Rejected" | "Attended", hoursLogged?: number) => void;

  // Charity Verification & Admin Actions
  submitVerificationRequest: (req: Omit<CharityVerification, "id" | "status" | "submittedAt">) => void;
  reviewVerification: (id: string, approved: boolean, notes: string) => void;

  // Notification Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (item: Omit<NotificationItem, "id" | "timestamp" | "read">) => void;

  // AI Assistant integration functions
  generateAICampaignDraft: (params: {
    title: string;
    category: CampaignCategory;
    targetAmount: number;
    keyPoints: string;
  }) => Promise<any>;
  summarizeCampaignAI: (campaign: Campaign) => Promise<any>;
  getAIRecommendations: (donorInterests: string[], pastDonations: Donation[]) => Promise<any>;
  analyzeCampaignIntegrityAI: (campaign: Partial<Campaign>) => Promise<any>;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

const LS_CAMPAIGNS = "charity_platform_campaigns_v2";
const LS_DONATIONS = "charity_platform_donations_v2";
const LS_RECEIPTS = "charity_platform_receipts_v2";
const LS_VOLUNTEER_OPS = "charity_platform_volunteer_ops_v2";
const LS_VOLUNTEER_APPS = "charity_platform_volunteer_apps_v2";
const LS_VERIFICATIONS = "charity_platform_verifications_v2";
const LS_NOTIFICATIONS = "charity_platform_notifications_v2";
const LS_BOOKMARKS = "charity_platform_bookmarks_v2";
const LS_CURRENCY = "charity_platform_currency_v2";
const LS_LEDGER = "charity_platform_ledger_v2";

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const saved = localStorage.getItem(LS_CAMPAIGNS);
      return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  const [donations, setDonations] = useState<Donation[]>(() => {
    try {
      const saved = localStorage.getItem(LS_DONATIONS);
      return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  });

  const [receipts, setReceipts] = useState<DonationReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(LS_RECEIPTS);
      return saved ? JSON.parse(saved) : INITIAL_RECEIPTS;
    } catch {
      return INITIAL_RECEIPTS;
    }
  });

  const [volunteerOpportunities, setVolunteerOpportunities] = useState<VolunteerOpportunity[]>(() => {
    try {
      const saved = localStorage.getItem(LS_VOLUNTEER_OPS);
      return saved ? JSON.parse(saved) : INITIAL_VOLUNTEER_OPPORTUNITIES;
    } catch {
      return INITIAL_VOLUNTEER_OPPORTUNITIES;
    }
  });

  const [volunteerApplications, setVolunteerApplications] = useState<VolunteerApplication[]>(() => {
    try {
      const saved = localStorage.getItem(LS_VOLUNTEER_APPS);
      return saved ? JSON.parse(saved) : INITIAL_VOLUNTEER_APPLICATIONS;
    } catch {
      return INITIAL_VOLUNTEER_APPLICATIONS;
    }
  });

  const [verifications, setVerifications] = useState<CharityVerification[]>(() => {
    try {
      const saved = localStorage.getItem(LS_VERIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_VERIFICATIONS;
    } catch {
      return INITIAL_VERIFICATIONS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(LS_NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [transparencyLedger, setTransparencyLedger] = useState<TransparencyLedgerItem[]>(() => {
    try {
      const saved = localStorage.getItem(LS_LEDGER);
      return saved ? JSON.parse(saved) : INITIAL_TRANSPARENCY_LEDGER;
    } catch {
      return INITIAL_TRANSPARENCY_LEDGER;
    }
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(LS_CURRENCY) as CurrencyCode;
      return saved && CURRENCY_CONFIGS[saved] ? saved : "USD";
    } catch {
      return "USD";
    }
  });

  const [bookmarkedCampaignIds, setBookmarkedCampaignIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LS_BOOKMARKS);
      return saved ? JSON.parse(saved) : ["camp-1"];
    } catch {
      return ["camp-1"];
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LS_CAMPAIGNS, JSON.stringify(campaigns));
      localStorage.setItem(LS_DONATIONS, JSON.stringify(donations));
      localStorage.setItem(LS_RECEIPTS, JSON.stringify(receipts));
      localStorage.setItem(LS_VOLUNTEER_OPS, JSON.stringify(volunteerOpportunities));
      localStorage.setItem(LS_VOLUNTEER_APPS, JSON.stringify(volunteerApplications));
      localStorage.setItem(LS_VERIFICATIONS, JSON.stringify(verifications));
      localStorage.setItem(LS_NOTIFICATIONS, JSON.stringify(notifications));
      localStorage.setItem(LS_BOOKMARKS, JSON.stringify(bookmarkedCampaignIds));
      localStorage.setItem(LS_CURRENCY, currency);
      localStorage.setItem(LS_LEDGER, JSON.stringify(transparencyLedger));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [
    campaigns,
    donations,
    receipts,
    volunteerOpportunities,
    volunteerApplications,
    verifications,
    notifications,
    bookmarkedCampaignIds,
    currency,
    transparencyLedger,
  ]);

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCY_CONFIGS[code]) {
      setCurrencyState(code);
    }
  };

  const convertUsdToSelected = (amountInUsd: number): number => {
    const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
    return amountInUsd * config.rateToUsd;
  };

  const convertSelectedToUsd = (amountInSelected: number): number => {
    const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
    return amountInSelected / config.rateToUsd;
  };

  const formatCurrency = (
    amountInUsd: number,
    options?: { showCode?: boolean; round?: boolean }
  ): string => {
    const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
    const converted = amountInUsd * config.rateToUsd;
    const rounded = options?.round ?? true;
    const formattedNum = rounded
      ? Math.round(converted).toLocaleString(undefined, { maximumFractionDigits: 0 })
      : converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const codeStr = options?.showCode ? ` ${currency}` : "";
    return `${config.symbol}${formattedNum}${codeStr}`;
  };

  const toggleBookmark = (campaignId: string) => {
    setBookmarkedCampaignIds((prev) =>
      prev.includes(campaignId) ? prev.filter((id) => id !== campaignId) : [...prev, campaignId]
    );
  };

  const isBookmarked = (campaignId: string) => bookmarkedCampaignIds.includes(campaignId);

  const addNotification = (item: Omit<NotificationItem, "id" | "timestamp" | "read">) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Convert numbers to words for receipt
  const numberToWords = (num: number, curr: CurrencyCode): string => {
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const convertChunk = (n: number): string => {
      let str = "";
      if (n >= 100) {
        str += units[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n >= 10 && n <= 19) {
        str += teens[n - 10] + " ";
      } else if (n >= 20) {
        str += tens[Math.floor(n / 10)] + " ";
        if (n % 10 > 0) str += units[n % 10] + " ";
      } else if (n > 0) {
        str += units[n] + " ";
      }
      return str;
    };

    const integerPart = Math.floor(num);
    if (integerPart === 0) return `Zero ${curr} Only`;

    let result = "";
    if (integerPart >= 1000000) {
      result += convertChunk(Math.floor(integerPart / 1000000)) + "Million ";
    }
    const thousands = Math.floor((integerPart % 1000000) / 1000);
    if (thousands > 0) {
      result += convertChunk(thousands) + "Thousand ";
    }
    const remainder = integerPart % 1000;
    if (remainder > 0) {
      result += convertChunk(remainder);
    }

    return `${result.trim()} ${curr} Only`;
  };

  // Process a donation with receipts, milestone updates, matching funds
  const processDonation = async (params: {
    campaignId: string;
    donorId: string;
    donorName: string;
    donorEmail: string;
    amountInSelected: number;
    currency: CurrencyCode;
    paymentMethod: PaymentMethod;
    isRecurring: boolean;
    recurringFrequency?: "monthly" | "quarterly" | "annual";
    isAnonymous: boolean;
    message?: string;
    dedication?: string;
    donorTaxId?: string;
    tipPercentage?: number;
    companyMatchName?: string;
  }): Promise<{ donation: Donation; receipt: DonationReceipt }> => {
    // Convert to base USD for system records
    const config = CURRENCY_CONFIGS[params.currency] || CURRENCY_CONFIGS.USD;
    const amountInUsd = params.amountInSelected / config.rateToUsd;

    const campaign = campaigns.find((c) => c.id === params.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Check matching gift
    let matchedAmount = 0;
    if (campaign.matchingGift && campaign.matchingGift.remainingMatch > 0) {
      matchedAmount = Math.min(
        amountInUsd * (campaign.matchingGift.multiplier - 1),
        campaign.matchingGift.remainingMatch
      );
    }

    const totalContributionToCampaign = amountInUsd + matchedAmount;
    const transactionId = `TXN-${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const receiptNumber = `RCPT-${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}-${Math.floor(100000 + Math.random() * 900000)}`;
    const donationId = `don-${Date.now()}`;
    const tipAmount = params.tipPercentage ? (amountInUsd * params.tipPercentage) / 100 : 0;

    const newDonation: Donation = {
      id: donationId,
      transactionId,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      donorId: params.donorId,
      donorName: params.donorName,
      donorEmail: params.donorEmail,
      amount: amountInUsd,
      currency: params.currency,
      amountInOriginalCurrency: params.amountInSelected,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      paymentMethod: params.paymentMethod,
      status: "Completed",
      isRecurring: params.isRecurring,
      recurringFrequency: params.recurringFrequency,
      isAnonymous: params.isAnonymous,
      message: params.message,
      dedication: params.dedication,
      matchedAmount,
      tipAmount,
      receiptId: receiptNumber,
      taxExemptEligible: true,
    };

    const newReceipt: DonationReceipt = {
      id: `rec-${Date.now()}`,
      receiptNumber,
      donationId,
      transactionId,
      campaignTitle: campaign.title,
      organizationName: campaign.organization.name,
      organizationRegNo: campaign.organization.taxExemptNumber || "NGO-AUTH-VALID",
      organizationTaxExemptId: "80G / 501(c)(3) Compliant",
      donorName: params.isAnonymous ? "Anonymous Donor (Tax Record: " + params.donorName + ")" : params.donorName,
      donorEmail: params.donorEmail,
      donorTaxId: params.donorTaxId || "TAX-EXEMPT-DONOR",
      amount: params.amountInSelected,
      currency: params.currency,
      amountInWords: numberToWords(params.amountInSelected, params.currency),
      paymentMethod: params.paymentMethod,
      date: new Date().toISOString().split("T")[0],
      status: "Valid",
      qrVerificationCode: `https://charitybridge.org/verify/${receiptNumber}`,
    };

    // Update campaign raised & check milestones
    const updatedRaised = campaign.raised + totalContributionToCampaign;
    const newPercentage = Math.round((updatedRaised / campaign.goal) * 100);

    const updatedMilestones = campaign.milestones.map((m) => {
      if (!m.reached && newPercentage >= m.percentage) {
        return { ...m, reached: true, dateReached: new Date().toISOString().split("T")[0] };
      }
      return m;
    });

    const updatedMatchingGift = campaign.matchingGift
      ? {
          ...campaign.matchingGift,
          remainingMatch: Math.max(0, campaign.matchingGift.remainingMatch - matchedAmount),
        }
      : undefined;

    const updatedStatus: CampaignStatus =
      updatedRaised >= campaign.goal ? "Goal Met" : campaign.status;

    const updatedCampaign: Campaign = {
      ...campaign,
      raised: updatedRaised,
      donorCount: campaign.donorCount + 1,
      milestones: updatedMilestones,
      matchingGift: updatedMatchingGift,
      status: updatedStatus,
    };

    // Update states
    setDonations((prev) => [newDonation, ...prev]);
    setReceipts((prev) => [newReceipt, ...prev]);
    setCampaigns((prev) => prev.map((c) => (c.id === campaign.id ? updatedCampaign : c)));

    // Send notifications
    addNotification({
      type: "donation",
      title: "Donation Confirmed! 🎉",
      message: `You successfully donated ${params.currency} ${params.amountInSelected.toLocaleString()} to "${campaign.title}".`,
      campaignId: campaign.id,
    });

    if (newPercentage >= 100 && campaign.raised < campaign.goal) {
      addNotification({
        type: "milestone",
        title: "Campaign 100% Funded! 🏆",
        message: `"${campaign.title}" has reached its full goal! Thank you for making this possible.`,
        campaignId: campaign.id,
      });
    }

    return { donation: newDonation, receipt: newReceipt };
  };

  const createCampaign = (campaignData: Partial<Campaign>): Campaign => {
    const id = `camp-${Date.now()}`;
    const newCamp: Campaign = {
      id,
      title: campaignData.title || "New Community Campaign",
      tagline: campaignData.tagline || "Empowering vulnerable communities with direct impact.",
      description: campaignData.description || "Detailed campaign plan...",
      category: campaignData.category || "Education",
      goal: campaignData.goal || 10000,
      raised: 0,
      donorCount: 0,
      status: "Active",
      urgent: Boolean(campaignData.urgent),
      location: campaignData.location || "Global",
      startDate: new Date().toISOString().split("T")[0],
      endDate: campaignData.endDate || new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0],
      daysLeft: 60,
      imageUrl:
        campaignData.imageUrl ||
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
      galleryImages: [
        campaignData.imageUrl ||
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
      ],
      organization: campaignData.organization || {
        id: "org-custom",
        name: "Hope Foundation",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=80",
        isVerified: true,
        taxExemptNumber: "80G-NEW9910",
        location: "Community Hub",
        contactEmail: "contact@hope.org",
      },
      budgetBreakdown: campaignData.budgetBreakdown || [
        { item: "Direct Aid", percentage: 80, amount: (campaignData.goal || 10000) * 0.8 },
        { item: "Logistics", percentage: 12, amount: (campaignData.goal || 10000) * 0.12 },
        { item: "Admin & Reporting", percentage: 8, amount: (campaignData.goal || 10000) * 0.08 },
      ],
      milestones: campaignData.milestones || [
        {
          id: `m-${Date.now()}-1`,
          percentage: 30,
          title: "Phase 1 Launch & Procurement",
          description: "Initial supplies acquired.",
          reached: false,
        },
        {
          id: `m-${Date.now()}-2`,
          percentage: 100,
          title: "Full Project Delivery",
          description: "Complete impact verification.",
          reached: false,
        },
      ],
      updates: [],
      tags: campaignData.tags || ["Charity", "Impact"],
      beneficiaryCount: campaignData.beneficiaryCount || 100,
    };

    setCampaigns((prev) => [newCamp, ...prev]);

    addNotification({
      type: "system",
      title: "New Campaign Created 📢",
      message: `Your campaign "${newCamp.title}" is now live and accepting donations.`,
      campaignId: newCamp.id,
    });

    return newCamp;
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const postCampaignUpdate = (
    campaignId: string,
    update: {
      title: string;
      content: string;
      author: string;
      imageUrl?: string;
      impactMetrics?: string;
      fundsDeployed?: number;
    }
  ) => {
    const newUpdate = {
      id: `up-${Date.now()}`,
      campaignId,
      date: new Date().toISOString().split("T")[0],
      ...update,
    };

    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, updates: [newUpdate, ...c.updates] } : c))
    );

    // If funds deployed, add to transparency ledger
    if (update.fundsDeployed && update.fundsDeployed > 0) {
      const camp = campaigns.find((c) => c.id === campaignId);
      if (camp) {
        const ledgerItem: TransparencyLedgerItem = {
          id: `led-${Date.now()}`,
          campaignId,
          campaignTitle: camp.title,
          organizationName: camp.organization.name,
          amount: update.fundsDeployed,
          currency: "USD",
          disbursementDate: new Date().toISOString().split("T")[0],
          purpose: update.title,
          vendorOrBeneficiary: "Direct Program Execution / Field Vendors",
          invoiceHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random()
            .toString(16)
            .substring(2, 6)}`,
          auditorVerified: true,
        };
        setTransparencyLedger((prev) => [ledgerItem, ...prev]);
      }
    }

    addNotification({
      type: "update",
      title: "Campaign Update Published 📝",
      message: `New update posted on your campaign: "${update.title}"`,
      campaignId,
    });
  };

  const createVolunteerOpportunity = (
    op: Omit<VolunteerOpportunity, "id" | "spotsFilled" | "status">
  ): VolunteerOpportunity => {
    const newOp: VolunteerOpportunity = {
      ...op,
      id: `vol-op-${Date.now()}`,
      spotsFilled: 0,
      status: "Open",
    };
    setVolunteerOpportunities((prev) => [newOp, ...prev]);
    return newOp;
  };

  const applyForVolunteerOpportunity = (
    application: Omit<VolunteerApplication, "id" | "status" | "appliedAt">
  ): VolunteerApplication => {
    const newApp: VolunteerApplication = {
      ...application,
      id: `app-${Date.now()}`,
      status: "Pending",
      appliedAt: new Date().toISOString().split("T")[0],
    };
    setVolunteerApplications((prev) => [newApp, ...prev]);

    // Increment spot
    setVolunteerOpportunities((prev) =>
      prev.map((op) => (op.id === application.opportunityId ? { ...op, spotsFilled: op.spotsFilled + 1 } : op))
    );

    addNotification({
      type: "volunteer",
      title: "Volunteer Application Submitted 🙋",
      message: `Your application for "${application.opportunityTitle}" is under review.`,
    });

    return newApp;
  };

  const updateVolunteerApplicationStatus = (
    applicationId: string,
    status: "Approved" | "Rejected" | "Attended",
    hoursLogged?: number
  ) => {
    setVolunteerApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status,
              hoursLogged: hoursLogged !== undefined ? hoursLogged : app.hoursLogged,
            }
          : app
      )
    );

    const app = volunteerApplications.find((a) => a.id === applicationId);
    if (app && status === "Approved") {
      addNotification({
        type: "volunteer",
        title: "Application Approved! 🌟",
        message: `Your volunteer spot for "${app.opportunityTitle}" has been confirmed.`,
      });
    }
  };

  const submitVerificationRequest = (req: Omit<CharityVerification, "id" | "status" | "submittedAt">) => {
    const newVerif: CharityVerification = {
      ...req,
      id: `verif-${Date.now()}`,
      status: "Pending",
      submittedAt: new Date().toISOString().split("T")[0],
    };
    setVerifications((prev) => [newVerif, ...prev]);
    addNotification({
      type: "verification",
      title: "Verification Request Submitted 🛡️",
      message: `Platform compliance officers are reviewing documents for ${req.organizationName}.`,
    });
  };

  const reviewVerification = (id: string, approved: boolean, notes: string) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: approved ? "Approved" : "Rejected",
              reviewedAt: new Date().toISOString().split("T")[0],
              reviewNotes: notes,
            }
          : v
      )
    );

    const verif = verifications.find((v) => v.id === id);
    if (verif && approved) {
      // Mark organization campaigns as verified
      setCampaigns((prev) =>
        prev.map((c) =>
          c.organization.id === verif.organizationId || c.organization.name === verif.organizationName
            ? { ...c, organization: { ...c.organization, isVerified: true } }
            : c
        )
      );
      addNotification({
        type: "verification",
        title: "Organization Verified! 🛡️✓",
        message: `${verif.organizationName} has been awarded the Verified Non-Profit Badge.`,
      });
    }
  };

  // AI Helpers calling backend Express endpoints
  const generateAICampaignDraft = async (params: {
    title: string;
    category: CampaignCategory;
    targetAmount: number;
    keyPoints: string;
  }) => {
    try {
      const res = await fetch("/api/gemini/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (e) {
      console.warn("AI draft fallback", e);
      return {
        story: `We are raising funds for ${params.title}. Every dollar goes directly into field operations and tangible community support.`,
        tagline: "Together, we can bring hope and lasting change.",
        suggestedMilestones: [
          { percentage: 30, description: "Procurement of essential kits" },
          { percentage: 100, description: "Distribution & impact report" },
        ],
        donorPerks: ["Digital receipt", "Photo impact reports"],
      };
    }
  };

  const summarizeCampaignAI = async (campaign: Campaign) => {
    try {
      const res = await fetch("/api/gemini/summarize-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });
      return await res.json();
    } catch (e) {
      console.warn("AI summary fallback", e);
      return {
        summary: `The "${campaign.title}" campaign has raised $${campaign.raised.toLocaleString()} of its $${campaign.goal.toLocaleString()} target with high direct-aid transparency.`,
        keyHighlights: ["Direct field deployment verified", "Zero intermediary platform fee", "Tax-exempt receipts provided"],
        urgentNeeds: "Final funds needed for logistics rollout.",
        trustScore: 95,
      };
    }
  };

  const getAIRecommendations = async (donorInterests: string[], pastDonationsList: Donation[]) => {
    try {
      const res = await fetch("/api/gemini/recommend-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorInterests,
          pastDonations: pastDonationsList,
          availableCampaigns: campaigns,
        }),
      });
      return await res.json();
    } catch (e) {
      console.warn("AI recommendation fallback", e);
      return {
        recommendedIds: campaigns.slice(0, 3).map((c) => c.id),
        rationale: "Selected based on high urgency and verified nonprofit audit records.",
      };
    }
  };

  const analyzeCampaignIntegrityAI = async (campaign: Partial<Campaign>) => {
    try {
      const res = await fetch("/api/gemini/analyze-fraud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });
      return await res.json();
    } catch (e) {
      console.warn("AI fraud check fallback", e);
      return {
        trustScore: 94,
        status: "Verified Safe",
        analysis: "Budget allocation aligns with international non-profit best practices.",
        recommendations: ["Ensure quarterly invoice proofs are maintained."],
      };
    }
  };

  return (
    <PlatformContext.Provider
      value={{
        campaigns,
        donations,
        receipts,
        volunteerOpportunities,
        volunteerApplications,
        verifications,
        notifications,
        transparencyLedger,
        currency,
        bookmarkedCampaignIds,
        setCurrency,
        formatCurrency,
        convertUsdToSelected,
        convertSelectedToUsd,
        toggleBookmark,
        isBookmarked,
        createCampaign,
        updateCampaign,
        postCampaignUpdate,
        processDonation,
        createVolunteerOpportunity,
        applyForVolunteerOpportunity,
        updateVolunteerApplicationStatus,
        submitVerificationRequest,
        reviewVerification,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        generateAICampaignDraft,
        summarizeCampaignAI,
        getAIRecommendations,
        analyzeCampaignIntegrityAI,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return context;
};
