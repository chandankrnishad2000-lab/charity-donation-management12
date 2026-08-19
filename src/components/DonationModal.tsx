import React, { useState } from "react";
import { Campaign, PaymentMethod, DonationReceipt } from "../types";
import { usePlatform } from "../context/PlatformContext";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";
import {
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  Heart,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Gift,
  Building2,
  FileCheck,
  Loader2,
  Receipt,
} from "lucide-react";

interface DonationModalProps {
  campaign: Campaign | null;
  onClose: () => void;
  onReceiptGenerated?: (receipt: DonationReceipt) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  campaign,
  onClose,
  onReceiptGenerated,
}) => {
  const { currency, formatCurrency, processDonation } = usePlatform();
  const { currentUser } = useAuth();

  // Preset amounts adapted for currency
  const getPresetAmounts = () => {
    switch (currency) {
      case "INR":
        return [500, 1000, 2500, 5000, 10000];
      case "EUR":
        return [20, 50, 100, 250, 500];
      case "GBP":
        return [15, 30, 75, 200, 400];
      default:
        return [25, 50, 100, 250, 500];
    }
  };

  const presetAmounts = getPresetAmounts();
  const [selectedAmount, setSelectedAmount] = useState<number>(presetAmounts[1]);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringFreq, setRecurringFreq] = useState<"monthly" | "quarterly" | "annual">("monthly");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [dedication, setDedication] = useState<string>("");
  const [enableCompanyMatch, setEnableCompanyMatch] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>("");
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Card");

  // Donor Tax Info
  const [donorName, setDonorName] = useState<string>(currentUser.name || "Sarah Chen");
  const [donorEmail, setDonorEmail] = useState<string>(currentUser.email || "sarah.chen@example.com");
  const [donorTaxId, setDonorTaxId] = useState<string>("");

  // Card Inputs (Simulated)
  const [cardNumber, setCardNumber] = useState<string>("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState<string>("12/28");
  const [cardCvc, setCardCvc] = useState<string>("888");
  const [upiId, setUpiId] = useState<string>("user@oksbi");

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedReceipt, setCompletedReceipt] = useState<DonationReceipt | null>(null);

  if (!campaign) return null;

  const actualAmount = isCustom ? parseFloat(customAmount) || 0 : selectedAmount;
  const tipAmount = (actualAmount * tipPercent) / 100;
  const totalAmountToCharge = actualAmount + tipAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actualAmount <= 0) return;

    setIsSubmitting(true);

    try {
      // Simulate network latency for payment gateway
      await new Promise((r) => setTimeout(r, 1200));

      const { receipt } = await processDonation({
        campaignId: campaign.id,
        donorId: currentUser.id,
        donorName: donorName.trim() || currentUser.name,
        donorEmail: donorEmail.trim() || currentUser.email,
        amountInSelected: actualAmount,
        currency,
        paymentMethod,
        isRecurring,
        recurringFrequency: isRecurring ? recurringFreq : undefined,
        isAnonymous,
        message: message.trim() || undefined,
        dedication: dedication.trim() || undefined,
        donorTaxId: donorTaxId.trim() || undefined,
        tipPercentage: tipPercent,
        companyMatchName: enableCompanyMatch ? companyName : undefined,
      });

      // Trigger Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899"],
      });

      setCompletedReceipt(receipt);
      if (onReceiptGenerated) {
        onReceiptGenerated(receipt);
      }
    } catch (err) {
      console.error(err);
      alert("Payment simulation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="donation-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="donation-modal-content"
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Philanthropy Checkout
            </span>
            <h2 className="text-lg font-bold text-white line-clamp-1">{campaign.title}</h2>
            <p className="text-xs text-slate-300">
              Beneficiary: <strong className="text-white">{campaign.organization.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {completedReceipt ? (
            /* Success View */
            <div className="text-center py-6 space-y-5" id="donation-success-view">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900">Thank You for Your Generosity!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your donation of{" "}
                  <strong className="text-emerald-700 font-bold">
                    {currency} {completedReceipt.amount.toLocaleString()}
                  </strong>{" "}
                  has been verified and securely routed to {completedReceipt.organizationName}.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Receipt Serial #</span>
                  <span className="font-mono font-bold text-slate-900">{completedReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Transaction ID</span>
                  <span className="font-mono text-slate-700">{completedReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Tax Deduction Status</span>
                  <span className="font-semibold text-emerald-700">80G / 501(c)(3) Eligible ✓</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 font-medium">Payment Method</span>
                  <span className="text-slate-800 font-semibold">{completedReceipt.paymentMethod}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  id="view-receipt-now-btn"
                  onClick={() => {
                    if (onReceiptGenerated) onReceiptGenerated(completedReceipt);
                  }}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  View & Download Official Receipt
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Donation Form */
            <form onSubmit={handleSubmit} className="space-y-6" id="donation-active-form">
              {/* Frequency Selector */}
              <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRecurring(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    !isRecurring
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  One-Time Gift
                </button>
                <button
                  type="button"
                  onClick={() => setIsRecurring(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    isRecurring
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Monthly Recurring (3x Impact)
                </button>
              </div>

              {/* Amount Selection Grid */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Donation Amount ({currency})
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {presetAmounts.map((amt) => {
                    const isSelected = !isCustom && selectedAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt);
                          setIsCustom(false);
                        }}
                        className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {currency} {amt.toLocaleString()}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Field */}
                <div className="pt-1">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      {currency}
                    </span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Or enter custom amount..."
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setIsCustom(true);
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                        isCustom
                          ? "border-emerald-600 bg-emerald-50/40 text-slate-900"
                          : "border-slate-200 text-slate-700"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Matching Gift Banner if applicable */}
              {campaign.matchingGift && campaign.matchingGift.remainingMatch > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Your <strong>{currency} {actualAmount}</strong> donation triggers an additional{" "}
                    <strong>
                      {currency} {(actualAmount * (campaign.matchingGift.multiplier - 1)).toLocaleString()}
                    </strong>{" "}
                    match!
                  </span>
                </div>
              )}

              {/* Donor Tax Information */}
              <div className="space-y-3 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Tax Receipt Details (80G / 501(c)(3))
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">Donor Full Name</label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">Receipt Email</label>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">
                    Tax Identification / PAN / SSN (Optional for Tax Rebate)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ABCDE1234F / XXX-XX-9912"
                    value={donorTaxId}
                    onChange={(e) => setDonorTaxId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden uppercase"
                  />
                </div>
              </div>

              {/* Dedication & Message */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    Make donation anonymous on public board
                  </label>
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">
                    Heartfelt Message / Word of Encouragement (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Keep up the amazing work! Inspired by your team."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">
                    Dedicate this gift in honor or memory of someone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. In loving memory of Grandmother Elena"
                    value={dedication}
                    onChange={(e) => setDedication(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              {/* Platform Support Tip */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Support 0% platform fee for charities:</span>
                  <span className="text-slate-500">{tipPercent}% ({currency} {tipAmount.toFixed(1)})</span>
                </div>
                <div className="flex gap-2">
                  {[0, 5, 10, 15].map((tip) => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setTipPercent(tip)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        tipPercent === tip
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {tip === 0 ? "0%" : `${tip}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Payment Method
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { method: "Card" as PaymentMethod, icon: CreditCard, label: "Credit Card / Debit" },
                    { method: "UPI" as PaymentMethod, icon: QrCode, label: "UPI / Razorpay" },
                    { method: "PayPal" as PaymentMethod, icon: ShieldCheck, label: "PayPal" },
                  ].map(({ method, icon: Icon, label }) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === method
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Simulated Method Inputs */}
                {paymentMethod === "Card" && (
                  <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1">Card Number (Simulated 256-bit SSL)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-500 block mb-1">Expires</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "UPI" && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <label className="text-slate-500 block">Virtual Payment Address (VPA / UPI ID)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono bg-white"
                    />
                    <p className="text-[11px] text-slate-400">Supports Google Pay, PhonePe, Paytm, and BHIM.</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || actualAmount <= 0}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Secure Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Confirm & Donate {currency} {totalAmountToCharge.toFixed(0)}
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-400">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>256-bit Encrypted • 100% Tax Deductible • Instant Receipt</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
