"use client";

import { useState } from "react";

import type { GeneratedConfig } from "@/types/quiz";

interface ConfigOutputProps {
  config: GeneratedConfig;
}

type ConfigTab = "flat" | "legacy";

export function ConfigOutput({ config }: ConfigOutputProps) {
  const [activeTab, setActiveTab] = useState<ConfigTab>("flat");
  const [copyLabel, setCopyLabel] = useState("copy config");

  const fileName = activeTab === "flat" ? "eslint.config.js" : ".eslintrc.json";
  const fileContent =
    activeTab === "flat" ? config.flatConfig : config.legacyConfig;

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(fileContent);
    setCopyLabel("copied!");

    window.setTimeout(() => {
      setCopyLabel("copy config");
    }, 1500);
  };

  const handleDownload = (): void => {
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = fileName;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="block config-output">
      <div className="block-header config-header">
        <div className="tab-row" role="tablist" aria-label="Config formats">
          <button
            type="button"
            className={`tab${activeTab === "flat" ? " active" : ""}`}
            onClick={() => setActiveTab("flat")}
            role="tab"
            aria-selected={activeTab === "flat"}
          >
            eslint.config.js
          </button>
          <button
            type="button"
            className={`tab${activeTab === "legacy" ? " active" : ""}`}
            onClick={() => setActiveTab("legacy")}
            role="tab"
            aria-selected={activeTab === "legacy"}
          >
            .eslintrc.json
          </button>
        </div>
        <div className="code-actions">
          <button type="button" className="action-btn" onClick={handleDownload}>
            ↓ download
          </button>
          <button
            type="button"
            className="action-btn primary"
            onClick={handleCopy}
          >
            {copyLabel}
          </button>
        </div>
      </div>
      <pre className="code-block">{fileContent}</pre>
    </section>
  );
}
