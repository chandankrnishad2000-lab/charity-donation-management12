export type UserRole = "donor" | "charity" | "volunteer" | "admin";

export type CampaignCategory =
  | "Education"
  | "Healthcare"
  | "Food"
  | "Housing"
  | "Environment"
  | "Animals"
  | "Disaster Relief"
  | "Clean Water";

export type CampaignStatus = "Active" | "Urgent" | "Goal Met" | "Completed" | "Pending Review";

export type PaymentMethod = "Card" | "UPI" | "PayPal" | "Bank Transfer" | "ApplePay";

export type CurrencyCode = "USD" | "INR" | "EUR" | "GBP";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateToUsd: number; // 1 USD = rate
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  bio?: string;
  location?: string;
  joinedDate: string;
  // Specific for Charity Organization
  organizationName?: string;
  registrationNo?: string;
  taxExemptId?: string;
  isVerified?: boolean;
  website?: string;
  // Specific for Donor
  totalDonated?: number;
  campaignsSupported?: number;
  taxReceiptsCount?: number;
  // Specific for Volunteer
  volunteerHours?: number;
  completedDrives?: number;
  skills?: string[];
}

export interface BudgetAllocation {
  item: string;
  percentage: number;
  amount: number;
}

export interface CampaignMilestone {
  id: string;
  percentage: number;
  title: string;
  description: string;
  reached: boolean;
  dateReached?: string;
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  date: string;
  author: string;
  imageUrl?: string;
  impactMetrics?: string;
  fundsDeployed?: number;
}

export interface MatchingGift {
  sponsor: string;
  multiplier: number;
  remainingMatch: number;
  totalCap: number;
}

export interface OrganizationInfo {
  id: string;
  name: string;
  logo: string;
  isVerified: boolean;
  taxExemptNumber: string;
  location: string;
  contactEmail: string;
  rating?: number;
  mission?: string;
}

export interface Campaign {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: CampaignCategory;
  goal: number; // Stored in USD as base
  raised: number; // Stored in USD as base
  donorCount: number;
  status: CampaignStatus;
  urgent: boolean;
  location: string;
  startDate: string;
  endDate: string;
  daysLeft: number;
  imageUrl: string;
  galleryImages: string[];
  organization: OrganizationInfo;
  budgetBreakdown: BudgetAllocation[];
  milestones: CampaignMilestone[];
  updates: CampaignUpdate[];
  matchingGift?: MatchingGift;
  tags: string[];
  beneficiaryCount?: number;
  featured?: boolean;
}

export interface Donation {
  id: string;
  transactionId: string;
  campaignId: string;
  campaignTitle: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  amount: number; // In base currency (USD)
  currency: CurrencyCode;
  amountInOriginalCurrency: number;
  date: string;
  paymentMethod: PaymentMethod;
  status: "Completed" | "Processing" | "Failed";
  isRecurring: boolean;
  recurringFrequency?: "monthly" | "quarterly" | "annual";
  isAnonymous: boolean;
  message?: string;
  dedication?: string;
  matchedAmount?: number;
  tipAmount?: number;
  receiptId: string;
  taxExemptEligible: boolean;
}

export interface DonationReceipt {
  id: string;
  receiptNumber: string;
  donationId: string;
  transactionId: string;
  campaignTitle: string;
  organizationName: string;
  organizationRegNo: string;
  organizationTaxExemptId: string;
  donorName: string;
  donorEmail: string;
  donorTaxId?: string;
  amount: number;
  currency: CurrencyCode;
  amountInWords: string;
  paymentMethod: PaymentMethod;
  date: string;
  status: "Valid" | "Revoked";
  qrVerificationCode: string;
}

export interface VolunteerOpportunity {
  id: string;
  campaignId: string;
  campaignTitle: string;
  organizationId: string;
  organizationName: string;
  title: string;
  description: string;
  skillsRequired: string[];
  location: string;
  isRemote: boolean;
  date: string;
  timeCommitment: string;
  spotsTotal: number;
  spotsFilled: number;
  status: "Open" | "Filled" | "Completed";
}

export interface VolunteerApplication {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  organizationId: string;
  volunteerId: string;
  volunteerName: string;
  volunteerEmail: string;
  phone: string;
  skills: string[];
  availability: string;
  message: string;
  status: "Pending" | "Approved" | "Rejected" | "Attended";
  appliedAt: string;
  hoursLogged?: number;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  type: "donation" | "milestone" | "update" | "volunteer" | "receipt" | "verification" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  campaignId?: string;
}

export interface CharityVerification {
  id: string;
  organizationId: string;
  organizationName: string;
  registrationNo: string;
  taxExemptionCert: string;
  foundingYear: string;
  officialWebsite: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  documents: { name: string; url: string }[];
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface TransparencyLedgerItem {
  id: string;
  campaignId: string;
  campaignTitle: string;
  organizationName: string;
  amount: number;
  currency: CurrencyCode;
  disbursementDate: string;
  purpose: string;
  vendorOrBeneficiary: string;
  invoiceHash: string;
  auditorVerified: boolean;
}
