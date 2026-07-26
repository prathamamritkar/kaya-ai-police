"use client";

import { useState } from "react";
import { Bid, FIELD_CONFIDENCE } from "@/lib/mockData";

interface ExtractedField {
  id: string;
  name: string;
  value: string;
  confidence: number; // 0 to 100
  source: string;
  isVerified: boolean;
}

function fieldsForBid(bid: Bid): ExtractedField[] {
  const confidence = FIELD_CONFIDENCE[bid.id] ?? {};
  return [
    {
      id: "power_draw_kw",
      name: "Power draw",
      value: `${bid.power_draw_kw.toLocaleString()} kW`,
      confidence: Math.round((confidence.power_draw_kw ?? 0) * 100),
      source: "Submitted specification table",
      isVerified: (confidence.power_draw_kw ?? 0) >= 0.85,
    },
    {
      id: "carbon_intensity_kgco2e",
      name: "Embodied carbon",
      value: `${bid.carbon_intensity_kgco2e.toLocaleString()} kgCO₂e`,
      confidence: Math.round((confidence.carbon_intensity_kgco2e ?? 0) * 100),
      source: "EPD attachment",
      isVerified: (confidence.carbon_intensity_kgco2e ?? 0) >= 0.85,
    },
    {
      id: "floor_load_kg_m2",
      name: "Floor load",
      value: `${bid.floor_load_kg_m2.toLocaleString()} kg/m²`,
      confidence: Math.round((confidence.floor_load_kg_m2 ?? 0) * 100),
      source: "CAD drawing annotation",
      isVerified: (confidence.floor_load_kg_m2 ?? 0) >= 0.85,
    },
    {
      id: "delivery_weeks",
      name: "Delivery commitment",
      value: `${bid.delivery_weeks} weeks`,
      confidence: Math.round((confidence.delivery_weeks ?? 0) * 100),
      source: "Commercial terms",
      isVerified: (confidence.delivery_weeks ?? 0) >= 0.85,
    },
    {
      id: "has_safety_cert",
      name: "Safety certificate",
      value: bid.has_safety_cert ? "Present" : "Missing",
      confidence: Math.round((confidence.has_safety_cert ?? 0) * 100),
      source: "Compliance annexure",
      isVerified: (confidence.has_safety_cert ?? 0) >= 0.85,
    },
  ];
}

export default function ConfidenceHeatmap({ bid }: { bid: Bid }) {
  const [fields, setFields] = useState<ExtractedField[]>(() => fieldsForBid(bid));

  const verifyField = (id: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isVerified: true, confidence: 100 } : f))
    );
  };

  const unverifiedCount = fields.filter((f) => !f.isVerified).length;

  return (
    <div className="bg-card border border-line rounded-xl p-5 hover:border-cyan/40 transition-colors">
      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-[#38bdf8] mb-0.5">
            EXTRACTION REVIEW
          </div>
          <h3 className="text-base font-bold flex items-center gap-2">
            Extraction confidence
          </h3>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
            unverifiedCount > 0
              ? "bg-[#fbbf24]/15 text-[#fbbf24] border border-[#fbbf24]"
              : "bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]"
          }`}
        >
          {unverifiedCount > 0 ? `${unverifiedCount} fields need review` : "All fields verified"}
        </span>
      </div>

      <p className="text-xs text-[#94a3b8] mb-3">
        Confirm low-confidence fields before using them as evidence. Confirmation records reviewer acknowledgement in this browser session; it never changes the extracted value or deterministic result.
      </p>

      {/* Field List */}
      <div className="space-y-2">
        {fields.map((field) => {
          const isHighConf = field.confidence >= 95;

          return (
            <div
              key={field.id}
              className={`p-3 rounded-lg border flex items-center justify-between text-xs transition-all ${
                !field.isVerified
                  ? "bg-[#fbbf24]/10 border-[#fbbf24] shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                  : "bg-inset border-line"
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{field.name}:</span>
                  <span className="font-mono font-bold text-[#38bdf8]">{field.value}</span>
                </div>
                <div className="text-[10px] text-[#94a3b8] font-mono">
                  Source: {field.source}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Confidence Pill */}
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isHighConf
                      ? "bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]"
                      : "bg-[#fbbf24]/15 text-[#fbbf24] border border-[#fbbf24]"
                  }`}
                >
                  {field.confidence}% confidence
                </span>

                {/* Human Verify Action */}
                {!field.isVerified ? (
                  <button
                    onClick={() => verifyField(field.id)}
                    className="bg-[#fbbf24] hover:bg-[#fbbf24]/90 text-[#090d16] font-bold text-[10px] px-2.5 py-1 rounded transition-colors shadow"
                  >
                    ✓ Confirm
                  </button>
                ) : (
                  <span className="text-[#38bdf8] font-mono text-[10px]">✓ Verified</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
