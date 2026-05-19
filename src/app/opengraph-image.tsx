import { ImageResponse } from "next/og";
import { TEMPLATE_CONFIG } from "@/config/template";

const canvas = "#070b14";
const text = "#f8fafc";
const accent = "#8b98ff";

export const alt = "Template Hedgehog production email system";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: canvas,
          color: text,
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: accent,
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          <span>{TEMPLATE_CONFIG.brandName}</span>
          <span>{`An ${TEMPLATE_CONFIG.owner.name} product`}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <h1
            style={{
              margin: 0,
              maxWidth: 880,
              fontSize: 82,
              lineHeight: 0.92,
              letterSpacing: 0,
              fontWeight: 700,
            }}
          >
            Production-ready email systems
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 820,
              color: text,
              fontSize: 34,
              lineHeight: 1.25,
            }}
          >
            MJML source, compiled HTML, lifecycle workflows, transactional systems, and implementation guidance.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 18,
            color: text,
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          <span style={{ color: accent }}>Starter £59</span>
          <span>Pro £179</span>
          <span>Enterprise £349</span>
        </div>
      </div>
    ),
    size,
  );
}
