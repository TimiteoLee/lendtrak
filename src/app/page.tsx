"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getActiveLoans, getStats, returnLoan } from "@/lib/store";
import { Loan } from "@/types";
import { formatDistanceToNow, format, isPast } from "date-fns";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [stats, setStats] = useState({
    totalTools: 0,
    activeLoans: 0,
    totalValue: 0,
    lentOutValue: 0,
    totalFees: 0,
    overdueCount: 0,
  });
  const [returningId, setReturningId] = useState<string | null>(null);
  const [returnCondition, setReturnCondition] = useState("Good");

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setActiveLoans(getActiveLoans());
    setStats(getStats());
  }

  function handleReturn(id: string) {
    returnLoan(id, returnCondition);
    setReturningId(null);
    setReturnCondition("Good");
    refresh();
  }

  function getLoanStatus(loan: Loan): "overdue" | "active" {
    if (
      loan.expected_return_date &&
      isPast(new Date(loan.expected_return_date))
    ) {
      return "overdue";
    }
    return "active";
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">The Ledger</h1>
        <p className="page-subtitle">
          An honest accounting of goods lent in good faith.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="stat-card">
          <div className="section-heading mb-1">Items Owned</div>
          <div className="text-2xl" style={{ fontFamily: "var(--font-mono, monospace)" }}>
            {stats.totalTools}
          </div>
        </div>
        <div className="stat-card">
          <div className="section-heading mb-1">Currently Lent</div>
          <div className="text-2xl" style={{ fontFamily: "var(--font-mono, monospace)" }}>
            {stats.activeLoans}
          </div>
        </div>
        <div className="stat-card">
          <div className="section-heading mb-1">Total Value</div>
          <div className="text-2xl" style={{ fontFamily: "var(--font-mono, monospace)" }}>
            ${stats.totalValue.toLocaleString()}
          </div>
        </div>
        <div className="stat-card">
          <div className="section-heading mb-1">Value Out</div>
          <div className="text-2xl" style={{ fontFamily: "var(--font-mono, monospace)" }}>
            ${stats.lentOutValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Active Loans */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="section-heading">Outstanding Loans</h2>
        {stats.overdueCount > 0 && (
          <span className="badge badge-overdue">
            {stats.overdueCount} overdue
          </span>
        )}
      </div>

      {activeLoans.length === 0 ? (
        <div className="empty-state text-center" style={{ border: "1px solid var(--border)", padding: "2rem", borderRadius: "var(--radius)" }}>
          <p style={{ color: "var(--fg-faint)" }} className="italic mb-4">
            No items currently on loan.
          </p>
          <Link href="/lend" className="btn-primary inline-block">
            Record a Loan
          </Link>
        </div>
      ) : (
        <div>
          {activeLoans.map((loan) => {
            const status = getLoanStatus(loan);
            return (
              <div key={loan.id} className="ledger-row py-3 px-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">
                        {loan.tool?.name || "Unknown Tool"}
                      </span>
                      <span
                        className={`badge ${
                          status === "overdue"
                            ? "badge-overdue"
                            : "badge-active"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <div className="text-sm" style={{ color: "var(--fg-faint)" }}>
                      <span>
                        Lent to{" "}
                        <strong style={{ color: "var(--fg-muted)" }}>
                          {loan.person?.name || "Unknown"}
                        </strong>
                      </span>
                      <span className="mx-1">&middot;</span>
                      <span>
                        {formatDistanceToNow(new Date(loan.borrowed_date), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    {loan.expected_return_date && (
                      <div className="text-xs mt-0.5" style={{ color: "var(--fg-faint)" }}>
                        Due{" "}
                        {format(
                          new Date(loan.expected_return_date),
                          "MMM d, yyyy"
                        )}
                      </div>
                    )}
                    {loan.location && (
                      <div className="text-xs mt-0.5" style={{ color: "var(--fg-faint)" }}>
                        Location: {loan.location}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {returningId === loan.id ? (
                      <div className="flex flex-col gap-1">
                        <select
                          value={returnCondition}
                          onChange={(e) => setReturnCondition(e.target.value)}
                          className="input-field text-xs !py-1"
                        >
                          <option>Excellent</option>
                          <option>Good</option>
                          <option>Fair</option>
                          <option>Poor</option>
                          <option>Damaged</option>
                        </select>
                        <button
                          onClick={() => handleReturn(loan.id)}
                          className="btn-primary text-xs !py-1"
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReturningId(loan.id)}
                        className="btn-secondary text-xs !py-1 flex items-center gap-1"
                        title="Mark as returned"
                      >
                        <CheckCircle size={14} />
                        Return
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick links */}
      <div className="mt-8 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex flex-col gap-2">
          {[
            { href: "/tools", label: "View Tool Inventory" },
            { href: "/people", label: "View Contacts" },
            { href: "/history", label: "Full Loan History" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between py-2 text-sm transition-colors"
              style={{ color: "var(--fg-muted)" }}
            >
              <span>{link.label}</span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
