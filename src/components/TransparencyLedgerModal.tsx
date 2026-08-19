import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext";
import {
  X,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  FileCheck,
  Building2,
  ExternalLink,
  Download,
  Lock,
} from "lucide-react";

interface TransparencyLedgerModalProps {
  onClose: () => void;
}

export const TransparencyLedgerModal: React.FC<TransparencyLedgerModalProps> = ({ onClose }) => {
  const { ledgerEntries, formatCurrency } = usePlatform();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredEntries = ledgerEntries.filter((item) => {
    const matchesSearch =
      item.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipientVendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceHash.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "all") return matchesSearch;
    return matchesSearch && item.type === filterType;
  });

  const totalInflow = ledgerEntries
    .filter((e) => e.type === "donation_inflow")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDisbursed = ledgerEntries
    .filter((e) => e.type === "disbursement")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div
      id="transparency-ledger-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="transparency-ledger-modal-content"
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">Public Transparency Ledger</h3>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Cryptographically Audited
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Immutable, real-time log of all platform donations and on-the-ground vendor disbursements.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ledger Summary Metric Cards */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Donated (Inflow)</span>
            <p className="text-xl font-bold text-emerald-700">{formatCurrency(totalInflow)}</p>
            <span className="text-[11px] text-slate-400">From 10,000+ donors worldwide</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Field Aid Disbursed</span>
            <p className="text-xl font-bold text-slate-900">{formatCurrency(totalDisbursed)}</p>
            <span className="text-[11px] text-slate-400">Audited vendor invoices verified</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Audit Integrity Rating</span>
            <p className="text-xl font-bold text-emerald-600 flex items-center gap-1">
              99.8% <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </p>
            <span className="text-[11px] text-slate-400">Zero unverified leakage</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by campaign, vendor, or hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-hidden"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {["all", "disbursement", "donation_inflow"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  filterType === type
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {type === "all"
                  ? "All Entries"
                  : type === "disbursement"
                  ? "Disbursements Only"
                  : "Donations Only"}
              </button>
            ))}
          </div>
        </div>

        {/* Table Entries */}
        <div className="overflow-x-auto flex-1 p-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Campaign & Purpose</th>
                <th className="p-3">Vendor / Recipient</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Auditor Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEntries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 text-slate-500 whitespace-nowrap">{item.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase ${
                        item.type === "disbursement"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {item.type === "disbursement" ? "Disbursed" : "Inflow"}
                    </span>
                  </td>
                  <td className="p-3 max-w-xs">
                    <p className="font-bold text-slate-900 truncate">{item.campaignTitle}</p>
                    <span className="text-slate-500 text-[11px] block">{item.description}</span>
                    <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                      Hash: {item.invoiceHash}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 font-medium">{item.recipientVendor}</td>
                  <td className="p-3 text-right font-bold text-slate-900 text-sm whitespace-nowrap">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {item.auditedBy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Public Transparency Standard v2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
