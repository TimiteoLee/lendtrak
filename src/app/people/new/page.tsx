"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePerson } from "@/lib/store";
import { Person } from "@/types";

const relationships: Person["relationship"][] = [
  "friend",
  "family",
  "coworker",
  "neighbor",
  "other",
];

export default function NewPersonPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [relationship, setRelationship] =
    useState<Person["relationship"]>("friend");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    savePerson({
      name: name.trim(),
      relationship,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
    });

    router.push("/people");
  }

  return (
    <div>
      <h1 className="page-title">Add Contact</h1>
      <p className="page-subtitle">Register a trusted borrower.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="section-heading block mb-1">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="input-field"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="section-heading block mb-1">
            Relationship
          </label>
          <div className="flex flex-wrap gap-2">
            {relationships.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRelationship(r)}
                className={`capitalize ${relationship === r ? "toggle-btn-active" : "toggle-btn"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="section-heading block mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Optional"
            className="input-field"
          />
        </div>

        <div>
          <label className="section-heading block mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Optional"
            className="input-field"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary flex-1">
            Add Contact
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
