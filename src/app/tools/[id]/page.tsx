"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getTool, getLoansForTool, updateTool } from "@/lib/store";
import { Tool, Loan } from "@/types";
import { format } from "date-fns";
import { ArrowLeft, Pencil, X } from "lucide-react";
import Link from "next/link";

const categories = [
  "Power Tools",
  "Hand Tools",
  "Garden",
  "Automotive",
  "Kitchen",
  "Electronics",
  "Outdoor",
  "Other",
];

const conditions = ["Excellent", "Good", "Fair", "Poor"];

export default function ToolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [editing, setEditing] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editCondition, setEditCondition] = useState("");

  useEffect(() => {
    const id = params.id as string;
    const t = getTool(id);
    if (!t) {
      router.push("/tools");
      return;
    }
    setTool(t);
    setLoans(getLoansForTool(id));
    if (searchParams.get("edit") === "1") {
      setEditName(t.name);
      setEditDescription(t.description || "");
      setEditCategory(t.category);
      setEditValue(String(t.value));
      setEditCondition(t.condition);
      setEditing(true);
    }
  }, [params.id, router, searchParams]);

  function startEditing() {
    if (!tool) return;
    setEditName(tool.name);
    setEditDescription(tool.description || "");
    setEditCategory(tool.category);
    setEditValue(String(tool.value));
    setEditCondition(tool.condition);
    setEditing(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!tool || !editName.trim()) return;

    const updated = updateTool(tool.id, {
      name: editName.trim(),
      description: editDescription.trim(),
      category: editCategory,
      value: parseFloat(editValue) || 0,
      condition: editCondition,
    });

    if (updated) {
      setTool(updated);
    }
    setEditing(false);
  }

  if (!tool) return null;

  const activeLoans = loans.filter((l) => !l.actual_return_date);
  const pastLoans = loans.filter((l) => l.actual_return_date);

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm mb-4 transition-colors"
        style={{ color: "var(--fg-faint)" }}
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {editing ? (
        <form onSubmit={handleSave} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="page-title" style={{ marginBottom: 0 }}>Edit Tool</h1>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="btn-secondary !py-1 text-xs flex items-center gap-1"
            >
              <X size={14} />
              Cancel
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="section-heading block mb-1">Name *</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input-field"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="section-heading block mb-1">Description</label>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Optional details..."
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="section-heading block mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="input-field"
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="section-heading block mb-1">Value ($)</label>
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="section-heading block mb-1">Condition</label>
              <div className="flex gap-3">
                {conditions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setEditCondition(c)}
                    className={editCondition === c ? "toggle-btn-active" : "toggle-btn"}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start justify-between mb-1">
            <h1 className="page-title">{tool.name}</h1>
            <button
              onClick={startEditing}
              className="btn-secondary !py-1 text-xs flex items-center gap-1"
            >
              <Pencil size={14} />
              Edit
            </button>
          </div>
          <div className="text-sm mb-6" style={{ color: "var(--fg-faint)" }}>
            <span>{tool.category}</span>
            <span className="mx-1">&middot;</span>
            <span>${tool.value.toLocaleString()}</span>
            <span className="mx-1">&middot;</span>
            <span>{tool.condition}</span>
          </div>

          {tool.description && (
            <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
              {tool.description}
            </p>
          )}
        </>
      )}

      <div className="mb-2 flex items-center justify-between">
        <h2 className="section-heading">Loan History</h2>
        <span className="text-xs" style={{ color: "var(--fg-faint)" }}>
          {loans.length} record{loans.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loans.length === 0 ? (
        <div className="text-center" style={{ border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "var(--radius)" }}>
          <p className="italic text-sm" style={{ color: "var(--fg-faint)" }}>
            This tool has never been lent out.
          </p>
          <Link href="/lend" className="btn-primary inline-block mt-3 text-sm">
            Lend It
          </Link>
        </div>
      ) : (
        <div>
          {activeLoans.map((loan) => (
            <div key={loan.id} className="ledger-row py-3 px-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">
                    {loan.person?.name || "Unknown"}
                  </span>
                  <span className="badge badge-active ml-2">Active</span>
                </div>
                <span className="text-sm" style={{ color: "var(--fg-faint)" }}>
                  {format(new Date(loan.borrowed_date), "MMM d, yyyy")}
                </span>
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--fg-faint)" }}>
                Condition out: {loan.condition_out}
                {loan.location && <span> &middot; {loan.location}</span>}
              </div>
            </div>
          ))}
          {pastLoans.map((loan) => (
            <div key={loan.id} className="ledger-row py-3 px-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">
                    {loan.person?.name || "Unknown"}
                  </span>
                  <span className="badge badge-returned ml-2">Returned</span>
                </div>
                <span className="text-sm" style={{ color: "var(--fg-faint)" }}>
                  {format(new Date(loan.borrowed_date), "MMM d")} &rarr;{" "}
                  {format(new Date(loan.actual_return_date!), "MMM d, yyyy")}
                </span>
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--fg-faint)" }}>
                Out: {loan.condition_out} &rarr; In: {loan.condition_in}
                {loan.fee_amount > 0 && (
                  <span>
                    {" "}
                    &middot; Fee: ${loan.fee_amount}
                    {loan.fee_paid ? " (paid)" : " (unpaid)"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
