"use client";

import { useState } from "react";

import type { GeneratedConfig } from "@/types/quiz";

interface InstallCommandProps {
  installCmd: GeneratedConfig["installCmd"];
}

export function InstallCommand({ installCmd }: InstallCommandProps) {
  const [copiedRow, setCopiedRow] = useState<string | null>(null);
  const rows: Array<{ key: keyof GeneratedConfig["installCmd"]; label: string }> = [
    { key: "npm", label: "npm" },
    { key: "pnpm", label: "pnpm" },
    { key: "yarn", label: "yarn" },
  ];

  const handleCopy = async (
    key: keyof GeneratedConfig["installCmd"],
  ): Promise<void> => {
    await navigator.clipboard.writeText(installCmd[key]);
    setCopiedRow(key);

    window.setTimeout(() => {
      setCopiedRow(null);
    }, 1500);
  };

  return (
    <section className="block">
      <div className="block-header">
        <span className="block-title">INSTALL COMMAND</span>
      </div>
      <div>
        {rows.map((row) => (
          <div key={row.key} className="install-row">
            <span className="install-label">{row.label}</span>
            <span className="install-command-text" title={installCmd[row.key]}>
              {installCmd[row.key]}
            </span>
            <button
              type="button"
              className="action-btn"
              onClick={() => handleCopy(row.key)}
            >
              {copiedRow === row.key ? "copied!" : "copy"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
