"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveTool } from "@/lib/store";

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

export default function NewToolPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Hand Tools");
  const [value, setValue] = useState("");
  const [condition, setCondition] = useState("Good");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    saveTool({
      name: name.trim(),
      description: description.trim(),
      category,
      value: parseFloat(value) || 0,
      condition,
    });

    router.push("/tools");
  }

  return (
    <div>
      <h1 className="page-title">Add Tool</h1>
      <p className="page-subtitle">
        Record a new item in your inventory.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="section-heading block mb-1">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. DeWalt Circular Saw"
            className="input-field"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="section-heading block mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details..."
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="section-heading block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="section-heading block mb-1">
              Value ($)
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="section-heading block mb-1">
            Condition
          </label>
          <div className="flex gap-3">
            {conditions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCondition(c)}
                className={condition === c ? "toggle-btn-active" : "toggle-btn"}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary flex-1">
            Add to Inventory
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
