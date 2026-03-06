"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTools, getPeople, saveLoan } from "@/lib/store";
import { Tool, Person } from "@/types";
import Link from "next/link";

const conditions = ["Excellent", "Good", "Fair", "Poor"];

export default function LendPage() {
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [toolId, setToolId] = useState("");
  const [personId, setPersonId] = useState("");
  const [conditionOut, setConditionOut] = useState("Good");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [feeAmount, setFeeAmount] = useState("");

  useEffect(() => {
    setTools(getTools());
    setPeople(getPeople());
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!toolId || !personId) return;

    saveLoan({
      tool_id: toolId,
      person_id: personId,
      borrowed_date: new Date().toISOString(),
      expected_return_date: expectedReturn
        ? new Date(expectedReturn).toISOString()
        : undefined,
      actual_return_date: undefined,
      condition_out: conditionOut,
      condition_in: undefined,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      fee_amount: parseFloat(feeAmount) || 0,
      fee_paid: false,
    });

    router.push("/");
  }

  if (tools.length === 0 || people.length === 0) {
    return (
      <div>
        <h1 className="page-title">Record a Loan</h1>
        <p className="page-subtitle">
          You need both tools and contacts before recording a loan.
        </p>
        <div className="text-center space-y-3" style={{ border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "var(--radius)" }}>
          {tools.length === 0 && (
            <p>
              <Link href="/tools/new" className="btn-primary inline-block">
                Add Your First Tool
              </Link>
            </p>
          )}
          {people.length === 0 && (
            <p>
              <Link href="/people/new" className="btn-primary inline-block">
                Add Your First Contact
              </Link>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Record a Loan</h1>
      <p className="page-subtitle">
        A handshake is good. A record is better.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="section-heading block mb-1">
            What are you lending? *
          </label>
          <select
            value={toolId}
            onChange={(e) => setToolId(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select a tool...</option>
            {tools.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — ${t.value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="section-heading block mb-1">
            Who is borrowing it? *
          </label>
          <select
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select a person...</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.relationship})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="section-heading block mb-1">
            Condition Going Out
          </label>
          <div className="flex gap-3">
            {conditions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setConditionOut(c)}
                className={conditionOut === c ? "toggle-btn-active" : "toggle-btn"}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="section-heading block mb-1">
            Expected Return Date
          </label>
          <input
            type="date"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="section-heading block mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where will it be used?"
            className="input-field"
          />
        </div>

        <div>
          <label className="section-heading block mb-1">
            Fee / Rental Amount ($)
          </label>
          <input
            type="number"
            value={feeAmount}
            onChange={(e) => setFeeAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="input-field"
          />
        </div>

        <div>
          <label className="section-heading block mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any details worth recording..."
            className="input-field min-h-[60px]"
            style={{ border: "1px solid var(--border)", padding: "0.5rem" }}
            rows={2}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary flex-1">
            Record Loan
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
