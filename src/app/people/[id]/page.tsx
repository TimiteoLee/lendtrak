"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPerson, getLoansForPerson } from "@/lib/store";
import { Person, Loan } from "@/types";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const id = params.id as string;
      const [p, l] = await Promise.all([getPerson(id), getLoansForPerson(id)]);
      if (!p) {
        router.push("/people");
        return;
      }
      setPerson(p);
      setLoans(l);
      setLoading(false);
    }
    load();
  }, [params.id, router]);

  if (loading) {
    return <div className="text-center py-12" style={{ color: "var(--fg-faint)" }}>Loading...</div>;
  }

  if (!person) return null;

  const activeLoans = loans.filter((l) => !l.actual_return_date);
  const pastLoans = loans.filter((l) => l.actual_return_date);
  const totalFees = loans.reduce((sum, l) => sum + Number(l.fee_amount), 0);

  return (
    <div>
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm mb-4 transition-colors" style={{ color: "var(--fg-faint)" }}>
        <ArrowLeft size={14} /> Back
      </button>

      <h1 className="page-title">{person.name}</h1>
      <div className="text-sm mb-6" style={{ color: "var(--fg-faint)" }}>
        <span className="capitalize">{person.relationship}</span>
        {person.phone && <><span className="mx-1">&middot;</span><span>{person.phone}</span></>}
        {person.email && <><span className="mx-1">&middot;</span><span>{person.email}</span></>}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="stat-card text-center">
          <div className="section-heading mb-1">Total Loans</div>
          <div className="text-xl" style={{ fontFamily: "var(--font-mono, monospace)" }}>{loans.length}</div>
        </div>
        <div className="stat-card text-center">
          <div className="section-heading mb-1">Active</div>
          <div className="text-xl" style={{ fontFamily: "var(--font-mono, monospace)" }}>{activeLoans.length}</div>
        </div>
        <div className="stat-card text-center">
          <div className="section-heading mb-1">Fees</div>
          <div className="text-xl" style={{ fontFamily: "var(--font-mono, monospace)" }}>${totalFees}</div>
        </div>
      </div>

      <h2 className="section-heading mb-2">Loan History</h2>

      {loans.length === 0 ? (
        <div className="text-center" style={{ border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "var(--radius)" }}>
          <p className="italic text-sm" style={{ color: "var(--fg-faint)" }}>No loan records for this person.</p>
        </div>
      ) : (
        <div>
          {[...activeLoans, ...pastLoans].map((loan) => (
            <div key={loan.id} className="ledger-row py-3 px-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{loan.tool?.name || "Unknown Tool"}</span>
                  <span className={`badge ml-2 ${loan.actual_return_date ? "badge-returned" : "badge-active"}`}>
                    {loan.actual_return_date ? "Returned" : "Active"}
                  </span>
                </div>
                <span className="text-sm" style={{ color: "var(--fg-faint)" }}>{format(new Date(loan.borrowed_date), "MMM d, yyyy")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
