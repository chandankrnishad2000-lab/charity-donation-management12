import React from "react";
import { DonationReceipt } from "../types";
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Building2,
  FileCheck,
  QrCode,
  Share2,
} from "lucide-react";

interface DonationReceiptModalProps {
  receipt: DonationReceipt | null;
  onClose: () => void;
}

export const DonationReceiptModal: React.FC<DonationReceiptModalProps> = ({
  receipt,
  onClose,
}) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="receipt-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="receipt-modal-content"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 print:shadow-none print:border-none print:m-0 print:w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Action Bar (Hidden during print) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Official Tax-Deductible Donation Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-800 bg-white" id="printable-receipt">
          {/* Header & Logo */}
          <div className="border-b-2 border-slate-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">CHARITY BRIDGE</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  VERIFIED RECEIPT
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Global Platform for Transparent Philanthropy & Non-Profit Aid
              </p>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs font-semibold uppercase text-slate-400">Receipt No.</span>
              <p className="text-sm font-mono font-bold text-slate-900">{receipt.receiptNumber}</p>
              <p className="text-xs text-slate-500">Date: {receipt.date}</p>
            </div>
          </div>

          {/* Charity & Exemption Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="font-semibold text-slate-500 block uppercase tracking-wider text-[10px]">
                Beneficiary Organization
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{receipt.organizationName}</p>
              <p className="text-slate-600 mt-0.5">Registration: {receipt.organizationRegNo}</p>
              <p className="text-emerald-700 font-semibold mt-0.5">
                Tax Status: {receipt.organizationTaxExemptId}
              </p>
            </div>
            <div>
              <span className="font-semibold text-slate-500 block uppercase tracking-wider text-[10px]">
                Donor Information
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{receipt.donorName}</p>
              <p className="text-slate-600 mt-0.5">Email: {receipt.donorEmail}</p>
              {receipt.donorTaxId && (
                <p className="text-slate-600 mt-0.5">Donor Tax ID / PAN: {receipt.donorTaxId}</p>
              )}
            </div>
          </div>

          {/* Line Item Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-bold">Description</th>
                  <th className="p-3 font-bold">Payment Method</th>
                  <th className="p-3 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3">
                    <p className="font-semibold text-slate-900">{receipt.campaignTitle}</p>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      Transaction Ref: {receipt.transactionId}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{receipt.paymentMethod}</td>
                  <td className="p-3 text-right font-bold text-slate-900 text-sm">
                    {receipt.currency} {receipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount in Words */}
          <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Amount in Words
            </span>
            <p className="font-semibold text-slate-800 text-sm italic mt-0.5">
              "{receipt.amountInWords}"
            </p>
          </div>

          {/* Legal Compliance & Stamp */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-[11px] text-slate-500 max-w-sm">
              <p className="font-semibold text-slate-700">Tax Exemption Declaration:</p>
              <p>
                This donation qualifies for tax exemption under section 80G of the Income Tax Act / 501(c)(3) of the IRS Code.
                No goods or services were provided in exchange for this voluntary contribution.
              </p>
            </div>

            {/* Official Verification Seal & QR Box */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/70">
              <div className="w-12 h-12 rounded-lg bg-white border border-emerald-300 flex items-center justify-center text-emerald-700">
                <QrCode className="w-9 h-9" />
              </div>
              <div className="text-left text-[10px]">
                <span className="font-bold text-emerald-900 block flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Digitally Verified
                </span>
                <span className="text-slate-500 block mt-0.5">Scan to verify authenticity on</span>
                <span className="font-mono text-emerald-800 font-semibold">charitybridge.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span>Thank you for making a real, lasting impact.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
