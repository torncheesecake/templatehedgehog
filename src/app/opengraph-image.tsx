import { ImageResponse } from "next/og";
import { TEMPLATE_CONFIG } from "@/config/template";

const black = "#050505";
const white = "#ffffff";
const snow = "#f8fafc";
const muted = "#d7d7d7";
const line = "#2b2b2b";

export const alt = "Template Hedgehog source-to-handoff email production workflow preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const dynamic = "force-static";

function WindowDot({ colour }: { colour: string }) {
  return (
    <div
      style={{
        width: 13,
        height: 13,
        borderRadius: 999,
        background: colour,
      }}
    />
  );
}

function Step({ number, label }: { number: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        gap: 9,
        borderTop: `1px solid ${line}`,
        paddingTop: 14,
      }}
    >
      <span style={{ color: muted, fontSize: 18, fontWeight: 700 }}>{number}</span>
      <span style={{ color: white, fontSize: 24, fontWeight: 700 }}>{label}</span>
    </div>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: snow,
          color: black,
          fontFamily: "Arial, sans-serif",
          padding: "56px 64px",
          gap: 46,
        }}
      >
        <div
          style={{
            width: 445,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div
              style={{
                width: 34,
                height: 20,
                borderRadius: "55% 55% 45% 45%",
                background: black,
              }}
            />
            <span style={{ fontSize: 28, fontWeight: 700 }}>{TEMPLATE_CONFIG.brandName}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 77,
                lineHeight: 0.9,
                letterSpacing: 0,
                fontWeight: 800,
              }}
            >
              Modern email production is a workflow.
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 27,
                lineHeight: 1.32,
                color: "#242424",
              }}
            >
              Editable MJML, compiled HTML, rendered previews, QA notes, and handoff guidance.
            </p>
          </div>

          <div style={{ display: "flex", gap: 18, fontSize: 21, fontWeight: 700 }}>
            <span>Author</span>
            <span>Review</span>
            <span>Compile</span>
            <span>QA</span>
            <span>Ship</span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: `2px solid ${black}`,
            borderRadius: 22,
            background: black,
            boxShadow: "0 34px 70px rgba(0,0,0,0.18)",
          }}
        >
          <div
            style={{
              height: 74,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 26px",
              borderBottom: `1px solid ${line}`,
            }}
          >
            <WindowDot colour="#ff5f57" />
            <WindowDot colour="#febc2e" />
            <WindowDot colour="#28c840" />
            <div style={{ marginLeft: 16, color: white, fontSize: 22, fontWeight: 800 }}>
              Production workflow
            </div>
          </div>

          <div style={{ display: "flex", flex: 1 }}>
            <div
              style={{
                width: "48%",
                display: "flex",
                flexDirection: "column",
                padding: 28,
                gap: 18,
                borderRight: `1px solid ${line}`,
              }}
            >
              <div style={{ color: muted, fontSize: 18, fontWeight: 800 }}>MJML SOURCE</div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 12,
                  color: snow,
                  fontFamily: "Menlo, Consolas, monospace",
                  fontSize: 21,
                  lineHeight: 1.36,
                }}
              >
                <span style={{ color: "#7dd3fc" }}>&lt;mjml&gt;</span>
                <span>&nbsp;&nbsp;&lt;mj-body&gt;</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&lt;mj-section&gt;</span>
                <span style={{ color: "#facc15" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Launch email updates</span>
                <span style={{ color: "#c4b5fd" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Review workflow</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&lt;/mj-section&gt;</span>
                <span style={{ color: "#7dd3fc" }}>&lt;/mjml&gt;</span>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                background: white,
                color: black,
                padding: 20,
                gap: 13,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800 }}>
                <span>RENDERED PREVIEW</span>
                <span>ready</span>
              </div>
              <div
                style={{
                  height: 135,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 15,
                  border: "1px solid #d9d9d9",
                  background: "#f7f7f7",
                }}
              >
                <div style={{ width: 250, height: 12, background: black }} />
                <div style={{ width: 185, height: 12, background: "#555" }} />
                <div style={{ width: 220, height: 58, background: "#d8d8d8", border: "1px solid #bcbcbc" }} />
              </div>
              <div style={{ display: "flex", gap: 18, fontSize: 17, lineHeight: 1.32 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <strong>QA</strong>
                  <span>Mobile stack</span>
                  <span>Fallback copy</span>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <strong>HANDOFF</strong>
                  <span>source.mjml</span>
                  <span>compiled.html</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              padding: "18px 26px 22px",
              background: black,
            }}
          >
            <Step number="01" label="Author" />
            <Step number="02" label="Review" />
            <Step number="03" label="Compile" />
            <Step number="04" label="QA" />
            <Step number="05" label="Ship" />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
