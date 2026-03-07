"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTools, deleteTool, getLoansForTool } from "@/lib/store";
import { Tool } from "@/types";
import { Plus, Trash2, Pencil, History } from "lucide-react";

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTools();
  }, []);

  async function loadTools() {
    setTools(await getTools());
    setLoading(false);
  }

  const filtered = tools.filter((t) => {
    const term = search.toLowerCase().replace(/'/g, "");
    const name = t.name.toLowerCase().replace(/'/g, "");
    const cat = t.category.toLowerCase().replace(/'/g, "");
    return name.includes(term) || cat.includes(term);
  });

  async function handleDelete(id: string) {
    const loans = await getLoansForTool(id);
    const active = loans.filter((l) => !l.actual_return_date);
    if (active.length > 0) {
      alert("Cannot delete a tool that is currently on loan.");
      return;
    }
    if (confirm("Remove this tool from your inventory?")) {
      await deleteTool(id);
      loadTools();
    }
  }

  if (loading) {
    return <div className="text-center py-12" style={{ color: "var(--fg-faint)" }}>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Tool Inventory</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            {tools.length} item{tools.length !== 1 ? "s" : ""} in your care
          </p>
        </div>
        <Link href="/tools/new" className="btn-primary flex items-center gap-1">
          <Plus size={16} />
          Add
        </Link>
      </div>

      <input
        type="search"
        placeholder="Search tools..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4"
      />

      {filtered.length === 0 ? (
        <div className="text-center" style={{ border: "1px solid var(--border)", padding: "2rem", borderRadius: "var(--radius)" }}>
          <p style={{ color: "var(--fg-faint)" }} className="italic">
            {tools.length === 0
              ? "No tools yet. Add your first tool to get started."
              : "No tools match your search."}
          </p>
        </div>
      ) : (
        <div>
          {filtered.map((tool) => (
            <div key={tool.id} className="ledger-row py-3 px-2">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{tool.name}</div>
                  <div className="text-sm flex items-center gap-2" style={{ color: "var(--fg-faint)" }}>
                    <span>{tool.category}</span>
                    <span>&middot;</span>
                    <span>${Number(tool.value).toLocaleString()}</span>
                    <span>&middot;</span>
                    <span>{tool.condition}</span>
                  </div>
                  {tool.description && (
                    <div className="text-xs mt-0.5 truncate" style={{ color: "var(--fg-faint)" }}>
                      {tool.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-2">
                  <Link
                    href={`/tools/${tool.id}`}
                    className="transition-opacity hover:opacity-70"
                    style={{ color: "var(--fg-faint)" }}
                    title="View history"
                  >
                    <History size={16} />
                  </Link>
                  <Link
                    href={`/tools/${tool.id}?edit=1`}
                    className="transition-opacity hover:opacity-70"
                    style={{ color: "var(--fg-faint)" }}
                    title="Edit tool"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(tool.id)}
                    className="transition-opacity hover:opacity-70"
                    style={{ color: "var(--danger)" }}
                    title="Remove tool"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
