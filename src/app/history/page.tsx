"use client";

import { useEffect, useState } from "react";
import { getLoans } from "@/lib/store";
import { Loan } from "@/types";
import { format } from "date-fns";

export default function HistoryPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "returned">("all");

  useEffect(() => {
    setLoans(getLoans());
  }, []);

  const filtered = loans
    .filter((l) => {
      if (filter === "active") return !l.actual_return_date;
      if (filter === "returned") return !!l.actual_return_date;
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.borrowed_date).getTime() -
        new Date(a.borrowed_date).getTime()
    );

  return (
    <div>
      <h1 className="page-title">Loan History</h1>
      <p className="page-subtitle">
        A complete record of all transactions.
      </p>

      <div className="flex gap-2 mb-4">
        {(["all", "active", "returned"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`capitalize ${filter === f ? "toggle-btn-active" : "toggle-btn"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center" style={{ border: "1px solid var(--border)", padding: "2rem", borderRadius: "var(--radius)" }}>
          <p style={{ color: "var(--fg-faint)" }} className="italic">
            No loan records found.
          </p>
        </div>
      ) : (
        <div>
          {filtered.map((loan) => {
            const isReturned = !!loan.actual_return_date;
            return (
              <div key={loan.id} className="ledger-row py-3 px-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium truncate">
                        {loan.tool?.name || "Unknown"}
                      </span>
                      <span
                        className={`badge ${
                          isReturned ? "badge-returned" : "badge-active"
                        }`}
                      >
                        {isReturned ? "Returned" : "Active"}
                      </span>
                    </div>
                    <div className="text-sm" style={{ color: "var(--fg-faint)" }}>
                      {loan.person?.name || "Unknown"} &middot;{" "}
                      {format(new Date(loan.borrowed_date), "MMM d, yyyy")}
                      {isReturned && (
                        <>
                          {" "}
                          &rarr;{" "}
                          {format(
                            new Date(loan.actual_return_date!),
                            "MMM d, yyyy"
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--fg-faint)" }}>
                      Out: {loan.condition_out}
                      {loan.condition_in && <> &rarr; In: {loan.condition_in}</>}
                      {loan.location && <> &middot; {loan.location}</>}
                      {loan.fee_amount > 0 && (
                        <>
                          {" "}
                          &middot; ${loan.fee_amount}
                          {loan.fee_paid ? " (paid)" : " (unpaid)"}
                        </>
                      )}
                    </div>
                    {loan.notes && (
                      <div className="text-xs mt-0.5 italic" style={{ color: "var(--fg-faint)" }}>
                        {loan.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
