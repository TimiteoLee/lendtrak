"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPeople, deletePerson, getLoansForPerson } from "@/lib/store";
import { Person } from "@/types";
import { Plus, Trash2, History } from "lucide-react";

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPeople();
  }, []);

  async function loadPeople() {
    setPeople(await getPeople());
    setLoading(false);
  }

  const filtered = people.filter((p) => {
    const term = search.toLowerCase().replace(/'/g, "");
    const name = p.name.toLowerCase().replace(/'/g, "");
    return name.includes(term);
  });

  async function handleDelete(id: string) {
    const loans = await getLoansForPerson(id);
    const active = loans.filter((l) => !l.actual_return_date);
    if (active.length > 0) {
      alert("Cannot remove someone who currently has items on loan.");
      return;
    }
    if (confirm("Remove this person from your contacts?")) {
      await deletePerson(id);
      loadPeople();
    }
  }

  if (loading) {
    return <div className="text-center py-12" style={{ color: "var(--fg-faint)" }}>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            {people.length} trusted borrower{people.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/people/new" className="btn-primary flex items-center gap-1">
          <Plus size={16} />
          Add
        </Link>
      </div>

      <input
        type="search"
        placeholder="Search contacts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4"
      />

      {filtered.length === 0 ? (
        <div className="text-center" style={{ border: "1px solid var(--border)", padding: "2rem", borderRadius: "var(--radius)" }}>
          <p style={{ color: "var(--fg-faint)" }} className="italic">
            {people.length === 0
              ? "No contacts yet. Add someone to get started."
              : "No contacts match your search."}
          </p>
        </div>
      ) : (
        <div>
          {filtered.map((person) => (
            <div key={person.id} className="ledger-row py-3 px-2">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{person.name}</div>
                  <div className="text-sm flex items-center gap-2" style={{ color: "var(--fg-faint)" }}>
                    <span className="capitalize">{person.relationship}</span>
                    {person.phone && (
                      <>
                        <span>&middot;</span>
                        <span>{person.phone}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    href={`/people/${person.id}`}
                    className="transition-opacity hover:opacity-70"
                    style={{ color: "var(--fg-faint)" }}
                    title="View history"
                  >
                    <History size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(person.id)}
                    className="transition-opacity hover:opacity-70"
                    style={{ color: "var(--danger)" }}
                    title="Remove contact"
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
