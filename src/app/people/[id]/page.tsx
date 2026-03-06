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

  useEffect(() => {
    const id = params.id as string;
    const p = getPerson(id);
    if (!p) {
      router.push("/people");
      return;
    }
    setPerson(p);
    setLoans(getLoansForPerson(id));
  }, [params.id, router]);

  if (!person) return null;

  const activeLoans = loans.filter((l) => !l.actual_return_date);
  const pastLoans = loans.filter((l) => l.actual_return_date);
  const totalFees = loans.reduce((sum, l) => sum + l.fee_amount, 0);

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-ink-faint hover:text-ink mb-4 transition-colors"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <h1 className="text-2xl tracking-wider uppercase mb-1">{person.name}</h1>
      <div className="text-sm text-ink-faint mb-6">
        <span className="capitalize">{person.relationship}</span>
        {person.phone && (
          <>
            <span className="mx-1">&middot;</span>
            <span>{person.phone}</span>
          </>
        )}
        {person.email && (
          <>
            <span className="mx-1">&middot;</span>
            <span>{person.email}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="border border-ledger-line p-3 text-center">
          <div className="text-xs uppercase tracking-wider text-ink-faint mb-1">
            Total Loans
          </div>
          <div className="text-xl font-mono">{loans.length}</div>
        </div>
        <div className="border border-ledger-line p-3 text-center">
          <div className="text-xs uppercase tracking-wider text-ink-faint mb-1">
            Active
          </div>
          <div className="text-xl font-mono">{activeLoans.length}</div>
        </div>
        <div className="border border-ledger-line p-3 text-center">
          <div className="text-xs uppercase tracking-wider text-ink-faint mb-1">
            Fees
          </div>
          <div className="text-xl font-mono">${totalFees}</div>
        </div>
      </div>

      <h2 className="text-sm uppercase tracking-widest text-ink-faint mb-2">
        Loan History
      </h2>

      {loans.length === 0 ? (
        <div className="border border-ledger-line p-6 text-center">
          <p className="text-ink-faint italic text-sm">
            No loan records for this person.
          </p>
        </div>
      ) : (
        <div>
          {[...activeLoans, ...pastLoans].map((loan) => (
            <div key={loan.id} className="ledger-row py-3 px-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">
                    {loan.tool?.name || "Unknown Tool"}
                  </span>
                  <span
                    className={`badge ml-2 ${
                      loan.actual_return_date
                        ? "badge-returned"
                        : "badge-active"
                    }`}
                  >
                    {loan.actual_return_date ? "Returned" : "Active"}
                  </span>
                </div>
                <span className="text-sm text-ink-faint">
                  {format(new Date(loan.borrowed_date), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
