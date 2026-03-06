"use client";

import { useTheme, Theme } from "@/lib/theme";
import { Check } from "lucide-react";

const themes: { id: Theme; name: string; description: string }[] = [
  {
    id: "classic",
    name: "Classic Ledger",
    description:
      "Old-fashioned bookkeeping. Serif type, parchment tones, ruled lines. Honest and straightforward.",
  },
  {
    id: "modern",
    name: "Modern",
    description:
      "Clean and contemporary. Sans-serif type, cool neutrals, sharp edges. Minimal and efficient.",
  },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Configure your preferences.</p>

      <div className="mt-8">
        <h2 className="section-heading mb-4">Appearance</h2>

        <div className="space-y-3">
          {themes.map((t) => {
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`w-full text-left p-4 border transition-all ${
                  isActive
                    ? "theme-card-active"
                    : "theme-card"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{t.name}</span>
                  {isActive && <Check size={18} />}
                </div>
                <p className="text-sm opacity-70">{t.description}</p>

                {/* Preview swatch */}
                <div className="flex gap-2 mt-3">
                  {t.id === "classic" ? (
                    <>
                      <div className="w-8 h-8 rounded border" style={{ background: "#f5f0e8" }} />
                      <div className="w-8 h-8 rounded border" style={{ background: "#2c2416" }} />
                      <div className="w-8 h-8 rounded border" style={{ background: "#c4a44a" }} />
                      <div className="w-8 h-8 rounded border" style={{ background: "#d4cbb8" }} />
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded border" style={{ background: "#fafafa" }} />
                      <div className="w-8 h-8 rounded border" style={{ background: "#18181b" }} />
                      <div className="w-8 h-8 rounded border" style={{ background: "#2563eb" }} />
                      <div className="w-8 h-8 rounded border" style={{ background: "#e4e4e7" }} />
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-current opacity-20" />

      <div>
        <h2 className="section-heading mb-4">Data</h2>
        <p className="text-sm opacity-70 mb-3">
          All data is stored locally on this device.
        </p>
        <button
          onClick={() => {
            if (
              confirm(
                "This will permanently delete all your tools, contacts, and loan records. Are you sure?"
              )
            ) {
              localStorage.removeItem("lendtrak_tools");
              localStorage.removeItem("lendtrak_people");
              localStorage.removeItem("lendtrak_loans");
              window.location.href = "/";
            }
          }}
          className="btn-secondary text-sm"
        >
          Clear All Data
        </button>
      </div>
    </div>
  );
}
