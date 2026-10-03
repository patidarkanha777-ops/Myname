import React from "react";
import { Sparkles } from "lucide-react";
import type { BNode } from "./types";
import { isContainer } from "./types";

interface Props {
  node: BNode;
  onChange: (patch: Partial<BNode>) => void;
  onStyle: (key: string, value: string) => void;
  onOpenAi?: () => void;
  onOpenIconStudio?: () => void;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="insp-field"><span>{label}</span>{children}</label>
);

function toHex(v = "") { return /^#[0-9a-f]{6}$/i.test(v) ? v : "#000000"; }

const GRADIENT_PRESETS = [
  { label: "Midnight Indigo", val: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" },
  { label: "Sunset Flame", val: "linear-gradient(135deg, #ea580c 0%, #9a3412 100%)" },
  { label: "Cyber Emerald", val: "linear-gradient(135deg, #064e3b 0%, #0f172a 100%)" },
  { label: "Warm Alabaster", val: "linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%)" },
  { label: "Radial Spotlight", val: "radial-gradient(circle at 50% 0%, #312e81 0%, #09090b 75%)" },
  { label: "Mesh Aurora", val: "linear-gradient(135deg, #1e1b4b 0%, #31102f 50%, #09090b 100%)" },
];

export function Inspector({ node, onChange, onStyle, onOpenAi, onOpenIconStudio }: Props) {
  const s = node.style;
  const txt = (key: string, label: string, ph = "") => (
    <Field label={label}>
      <input className="insp-input" value={s[key] ?? ""} placeholder={ph} onChange={(e) => onStyle(key, e.target.value)} />
    </Field>
  );
  const color = (key: string, label: string) => (
    <Field label={label}>
      <div className="insp-color">
        <input type="color" value={toHex(s[key])} onChange={(e) => onStyle(key, e.target.value)} />
        <input className="insp-input" value={s[key] ?? ""} placeholder="none" onChange={(e) => onStyle(key, e.target.value)} />
      </div>
    </Field>
  );
  const select = (key: string, label: string, opts: string[]) => (
    <Field label={label}>
      <select className="insp-input" value={s[key] ?? ""} onChange={(e) => onStyle(key, e.target.value)}>
        <option value="">—</option>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );

  const applyGlassmorphism = (mode: "dark" | "light") => {
    if (mode === "dark") {
      onStyle("background", "rgba(24, 24, 27, 0.68)");
      onStyle("backdropFilter", "blur(16px)");
      onStyle("border", "1px solid rgba(255, 255, 255, 0.14)");
      onStyle("boxShadow", "0 12px 32px rgba(0, 0, 0, 0.35)");
    } else {
      onStyle("background", "rgba(255, 255, 255, 0.72)");
      onStyle("backdropFilter", "blur(16px)");
      onStyle("border", "1px solid rgba(255, 255, 255, 0.6)");
      onStyle("boxShadow", "0 12px 32px rgba(0, 0, 0, 0.08)");
    }
  };

  return (
    <div className="insp">
      {onOpenAi && (
        <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--chrome-3)", background: "var(--chrome)" }}>
          <button
            type="button"
            onClick={onOpenAi}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #ea580c 0%, #d97706 100%)",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(234, 88, 12, 0.3)",
            }}
          >
            <Sparkles size={14} />
            <span>Ask AI to Redesign This</span>
          </button>
        </div>
      )}
      <div className="insp-group">
        <h4>Content</h4>
        {(node.type === "heading" || node.type === "text" || node.type === "button" || node.type === "pricing" || node.type === "faq" || node.type === "calculator" || node.type === "tabs") && (
          <Field label="Text"><textarea className="insp-input" rows={2} value={node.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></Field>
        )}
        {node.type === "heading" && (
          <Field label="Heading level">
            <select className="insp-input" value={String(node.level ?? 2)} onChange={(e) => onChange({ level: Number(e.target.value) })}>
              {[1, 2, 3, 4, 5, 6].map((l) => <option key={l} value={l}>H{l}</option>)}
            </select>
          </Field>
        )}
        {node.type === "button" && (
          <Field label="Link"><input className="insp-input" value={node.href || ""} onChange={(e) => onChange({ href: e.target.value })} /></Field>
        )}
        {node.type === "image" && (
          <Field label="Image URL"><input className="insp-input" value={node.src || ""} onChange={(e) => onChange({ src: e.target.value })} /></Field>
        )}
        {node.type === "video" && (
          <Field label="Video Embed URL"><input className="insp-input" value={node.videoUrl || ""} placeholder="https://www.youtube.com/embed/..." onChange={(e) => onChange({ videoUrl: e.target.value })} /></Field>
        )}
        {node.type === "countdown" && (
          <Field label="Target Date"><input type="datetime-local" className="insp-input" value={node.targetDate || ""} onChange={(e) => onChange({ targetDate: e.target.value })} /></Field>
        )}
        {node.type === "stars" && (
          <>
            <Field label="Rating (1-5)"><input type="number" min={1} max={5} className="insp-input" value={node.rating ?? 5} onChange={(e) => onChange({ rating: Number(e.target.value) })} /></Field>
            <Field label="Author"><input className="insp-input" value={node.author || ""} placeholder="e.g. John Doe, CEO" onChange={(e) => onChange({ author: e.target.value })} /></Field>
            <Field label="Quote Text"><textarea rows={2} className="insp-input" value={node.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></Field>
          </>
        )}
        {node.type === "map" && (
          <Field label="Map Location"><input className="insp-input" value={node.mapQuery || ""} placeholder="e.g. Times Square, New York" onChange={(e) => onChange({ mapQuery: e.target.value })} /></Field>
        )}
        {node.type === "form" && (
          <>
            <Field label="Form Mode">
              <select
                className="insp-input"
                value={node.formType || "contact"}
                onChange={(e) => onChange({ formType: e.target.value as any })}
              >
                <option value="contact">Contact Form</option>
                <option value="signup">Login / Signup Form</option>
                <option value="booking">Appointment Booking Form</option>
              </select>
            </Field>
            <Field label="Form Title"><input className="insp-input" value={node.formTitle || ""} onChange={(e) => onChange({ formTitle: e.target.value })} /></Field>
            <Field label="Subtitle"><textarea rows={2} className="insp-input" value={node.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></Field>
            <Field label="Button Label"><input className="insp-input" value={node.formButtonText || ""} onChange={(e) => onChange({ formButtonText: e.target.value })} /></Field>
          </>
        )}
        {node.type === "product" && (
          <>
            <Field label="Product Title"><input className="insp-input" value={node.productTitle || ""} onChange={(e) => onChange({ productTitle: e.target.value })} /></Field>
            <Field label="Price ($)"><input type="number" className="insp-input" value={node.productPrice ?? 249} onChange={(e) => onChange({ productPrice: Number(e.target.value) })} /></Field>
            <Field label="Badge"><input className="insp-input" value={node.productBadge || ""} onChange={(e) => onChange({ productBadge: e.target.value })} /></Field>
            <Field label="Image URL"><input className="insp-input" value={node.src || ""} onChange={(e) => onChange({ src: e.target.value })} /></Field>
            <Field label="Description"><textarea rows={2} className="insp-input" value={node.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></Field>
          </>
        )}
        {node.type === "popup" && (
          <>
            <Field label="Button Text"><input className="insp-input" value={node.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></Field>
            <Field label="Modal Title"><input className="insp-input" value={node.popupTitle || ""} onChange={(e) => onChange({ popupTitle: e.target.value })} /></Field>
            <Field label="Modal Copy"><textarea rows={2} className="insp-input" value={node.popupText || ""} onChange={(e) => onChange({ popupText: e.target.value })} /></Field>
            <Field label="Trigger Mode">
              <select
                className="insp-input"
                value={node.popupTrigger || "click"}
                onChange={(e) => onChange({ popupTrigger: e.target.value as any })}
              >
                <option value="click">Button Click Only</option>
                <option value="timed">Timed Auto-Popup (After N Secs)</option>
                <option value="exit">Exit-Intent (When Leaving Page)</option>
              </select>
            </Field>
            {node.popupTrigger === "timed" && (
              <Field label="Delay (Secs)">
                <input
                  type="number"
                  min={1}
                  max={60}
                  className="insp-input"
                  value={node.popupDelaySeconds ?? 5}
                  onChange={(e) => onChange({ popupDelaySeconds: Number(e.target.value) })}
                />
              </Field>
            )}
          </>
        )}
        {node.type === "beforeAfter" && (
          <>
            <Field label="Headline"><input className="insp-input" value={node.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></Field>
            <Field label="Before Label"><input className="insp-input" value={node.beforeLabel || ""} onChange={(e) => onChange({ beforeLabel: e.target.value })} /></Field>
            <Field label="After Label"><input className="insp-input" value={node.afterLabel || ""} onChange={(e) => onChange({ afterLabel: e.target.value })} /></Field>
            <Field label="Before Photo"><input className="insp-input" value={node.beforeImage || ""} onChange={(e) => onChange({ beforeImage: e.target.value })} /></Field>
            <Field label="After Photo"><input className="insp-input" value={node.afterImage || ""} onChange={(e) => onChange({ afterImage: e.target.value })} /></Field>
          </>
        )}
        {node.type === "marquee" && (
          <>
            <Field label="Header Label"><input className="insp-input" value={node.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></Field>
            <Field label="Ticker Items (comma-sep)">
              <textarea
                rows={3}
                className="insp-input"
                value={(node.marqueeItems || []).join(", ")}
                onChange={(e) =>
                  onChange({
                    marqueeItems: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
          </>
        )}
        {node.type === "tiltCard" && (
          <>
            <Field label="Badge"><input className="insp-input" value={node.productBadge || ""} onChange={(e) => onChange({ productBadge: e.target.value })} /></Field>
            <Field label="Card Title"><input className="insp-input" value={node.productTitle || ""} onChange={(e) => onChange({ productTitle: e.target.value })} /></Field>
            <Field label="Description"><textarea rows={2} className="insp-input" value={node.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></Field>
            <Field label="CTA Text"><input className="insp-input" value={node.formButtonText || ""} onChange={(e) => onChange({ formButtonText: e.target.value })} /></Field>
            <Field label="Glow Color"><input type="color" value={toHex(node.iconColor || "#f97316")} onChange={(e) => onChange({ iconColor: e.target.value })} /></Field>
          </>
        )}
        {node.type === "bookingCalendar" && (
          <>
            <Field label="Calendar Title"><input className="insp-input" value={node.formTitle || ""} onChange={(e) => onChange({ formTitle: e.target.value })} /></Field>
            <Field label="Time Slots (comma-sep)">
              <input
                className="insp-input"
                value={(node.bookingSlots || ["10:00 AM", "11:30 AM", "02:30 PM", "04:00 PM", "05:30 PM"]).join(", ")}
                onChange={(e) =>
                  onChange({
                    bookingSlots: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
          </>
        )}
        {node.type === "whatsapp" && (
          <>
            <Field label="Button Text"><input className="insp-input" value={node.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></Field>
            <Field label="Phone Number"><input className="insp-input" value={node.whatsappNumber || ""} placeholder="919876543210" onChange={(e) => onChange({ whatsappNumber: e.target.value })} /></Field>
            <Field label="Pre-filled Msg"><input className="insp-input" value={node.whatsappMessage || ""} onChange={(e) => onChange({ whatsappMessage: e.target.value })} /></Field>
          </>
        )}
        {node.type === "blog" && (
          <>
            <Field label="Section Title"><input className="insp-input" value={node.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></Field>
            <Field label="CMS Collection">
              <select
                className="insp-input"
                value={node.cmsCollection || "blog"}
                onChange={(e) => onChange({ cmsCollection: e.target.value as any })}
              >
                <option value="blog">Blog Posts & Articles</option>
                <option value="portfolio">Portfolio Case Studies</option>
                <option value="team">Team Members</option>
              </select>
            </Field>
          </>
        )}
        {node.type === "themeToggle" && (
          <Field label="Toggle Label"><input className="insp-input" value={node.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></Field>
        )}
        {node.type === "aiChatbot" && (
          <>
            <Field label="Chatbot Name">
              <input className="insp-input" value={node.botName || ""} onChange={(e) => onChange({ botName: e.target.value })} />
            </Field>
            <Field label="Welcome Msg">
              <textarea rows={2} className="insp-input" value={node.botWelcome || ""} onChange={(e) => onChange({ botWelcome: e.target.value })} />
            </Field>
            <Field label="Bot Knowledge">
              <textarea rows={3} className="insp-input" placeholder="Pricing, services, FAQs..." value={node.botContext || ""} onChange={(e) => onChange({ botContext: e.target.value })} />
            </Field>
            <Field label="Accent Color">
              <input type="color" value={toHex(node.iconColor || "#f97316")} onChange={(e) => onChange({ iconColor: e.target.value })} />
            </Field>
          </>
        )}
        {node.type === "iconBadge" && (
          <>
            <Field label="Badge Label"><input className="insp-input" value={node.text || ""} onChange={(e) => onChange({ text: e.target.value })} /></Field>
            <Field label="Icon Name">
              <select
                className="insp-input"
                value={node.iconName || "ShieldCheck"}
                onChange={(e) => onChange({ iconName: e.target.value })}
              >
                {["ShieldCheck", "Sparkles", "Zap", "Award", "Rocket", "Globe", "Heart", "CheckCircle2", "Flame", "Crown", "Lock", "Star", "Code2", "Cpu", "Layers", "TrendingUp", "ShoppingBag", "ThumbsUp"].map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </Field>
            <Field label="Badge Style">
              <select
                className="insp-input"
                value={node.iconBadgeStyle || "pill"}
                onChange={(e) => onChange({ iconBadgeStyle: e.target.value as any })}
              >
                <option value="pill">Glass Pill Badge</option>
                <option value="circle">Large Feature Icon</option>
                <option value="seal">Verified Trust Seal</option>
              </select>
            </Field>
            <Field label="Icon Color">
              <input type="color" value={toHex(node.iconColor || "#f97316")} onChange={(e) => onChange({ iconColor: e.target.value })} />
            </Field>
          </>
        )}
        {onOpenIconStudio && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenIconStudio}
              className="w-full py-1.5 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-[11px] font-semibold text-orange-400 border border-stone-700 transition"
            >
              ✦ Open Icon, SVG & Image Asset Studio
            </button>
          </div>
        )}
        {isContainer(node.type) && <p className="insp-hint">Containers hold other elements.</p>}
      </div>

      {/* Built-in Image Editor & Filter Studio */}
      {node.type === "image" && (
        <div className="insp-group">
          <h4>Image Editor & Filter Studio</h4>
          <Field label={`Brightness (${node.imageBrightness ?? 100}%)`}>
            <input
              type="range"
              min={40}
              max={180}
              value={node.imageBrightness ?? 100}
              onChange={(e) => onChange({ imageBrightness: Number(e.target.value) })}
              className="w-full accent-orange-500"
            />
          </Field>
          <Field label={`Contrast (${node.imageContrast ?? 100}%)`}>
            <input
              type="range"
              min={50}
              max={200}
              value={node.imageContrast ?? 100}
              onChange={(e) => onChange({ imageContrast: Number(e.target.value) })}
              className="w-full accent-orange-500"
            />
          </Field>
          <Field label={`Blur (${node.imageBlur ?? 0}px)`}>
            <input
              type="range"
              min={0}
              max={20}
              value={node.imageBlur ?? 0}
              onChange={(e) => onChange({ imageBlur: Number(e.target.value) })}
              className="w-full accent-orange-500"
            />
          </Field>
          <Field label={`Grayscale (${node.imageGrayscale ?? 0}%)`}>
            <input
              type="range"
              min={0}
              max={100}
              value={node.imageGrayscale ?? 0}
              onChange={(e) => onChange({ imageGrayscale: Number(e.target.value) })}
              className="w-full accent-orange-500"
            />
          </Field>
          <Field label={`Sepia (${node.imageSepia ?? 0}%)`}>
            <input
              type="range"
              min={0}
              max={100}
              value={node.imageSepia ?? 0}
              onChange={(e) => onChange({ imageSepia: Number(e.target.value) })}
              className="w-full accent-orange-500"
            />
          </Field>
          <Field label="Frame Style">
            <select
              className="insp-input"
              value={node.imageFrame || "none"}
              onChange={(e) => onChange({ imageFrame: e.target.value as any })}
            >
              <option value="none">None</option>
              <option value="polaroid">Polaroid Photo Card</option>
              <option value="neon">Neon Glow Border</option>
              <option value="glass">Frosted Glass Frame</option>
            </select>
          </Field>
          <Field label="Badge Overlay">
            <input
              className="insp-input"
              placeholder="e.g. NEW ARRIVAL / 40% OFF"
              value={node.imageBadge || ""}
              onChange={(e) => onChange({ imageBadge: e.target.value })}
            />
          </Field>
          <div className="pt-1 flex gap-1.5">
            <button
              type="button"
              onClick={() =>
                onChange({
                  imageBrightness: 100,
                  imageContrast: 100,
                  imageBlur: 0,
                  imageGrayscale: 0,
                  imageSepia: 0,
                  imageFrame: "none",
                  imageBadge: "",
                })
              }
              className="w-full py-1 rounded bg-stone-800 hover:bg-stone-700 text-[11px] text-stone-300 border border-stone-700"
            >
              Reset Image Filters
            </button>
          </div>
        </div>
      )}

      {/* A/B Testing Mode (Variant A vs Variant B) */}
      {(node.type === "button" || node.type === "heading" || node.type === "section") && (
        <div className="insp-group">
          <h4>A/B Testing (Variant A vs B)</h4>
          <Field label="Active Variant">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onChange({ abActiveVariant: "A" })}
                className={`flex-1 py-1.5 px-2 rounded text-[11px] font-bold border ${
                  (node.abActiveVariant || "A") === "A"
                    ? "bg-orange-600 text-white border-orange-500"
                    : "bg-stone-800 text-stone-300 border-stone-700"
                }`}
              >
                Variant A
              </button>
              <button
                type="button"
                onClick={() => onChange({ abActiveVariant: "B" })}
                className={`flex-1 py-1.5 px-2 rounded text-[11px] font-bold border ${
                  node.abActiveVariant === "B"
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-stone-800 text-stone-300 border-stone-700"
                }`}
              >
                Variant B
              </button>
            </div>
          </Field>
          {node.type !== "section" && (
            <Field label="Variant B Text">
              <input
                className="insp-input"
                placeholder="Alternative headline or CTA..."
                value={node.abVariantBText || ""}
                onChange={(e) => onChange({ abVariantBText: e.target.value })}
              />
            </Field>
          )}
          <Field label="Variant B Color">
            <div className="insp-color">
              <input
                type="color"
                value={toHex(node.abVariantBBg || "#10b981")}
                onChange={(e) => onChange({ abVariantBBg: e.target.value })}
              />
              <input
                className="insp-input"
                placeholder="#10b981"
                value={node.abVariantBBg || ""}
                onChange={(e) => onChange({ abVariantBBg: e.target.value })}
              />
            </div>
          </Field>
        </div>
      )}

      {/* Motion, Scroll Animations & Glassmorphism */}
      <div className="insp-group">
        <h4>Animations & Glassmorphism</h4>
        <Field label="Scroll Effect">
          <select
            className="insp-input"
            value={node.animation || "none"}
            onChange={(e) => onChange({ animation: e.target.value as any })}
          >
            <option value="none">None</option>
            <option value="fade-up">Fade Up</option>
            <option value="slide-left">Slide In Left</option>
            <option value="slide-right">Slide In Right</option>
            <option value="zoom-in">Zoom In</option>
            <option value="bounce">Bounce In</option>
            <option value="flip-up">3D Flip Up</option>
            <option value="blur-in">Smooth Blur In</option>
          </select>
        </Field>
        <Field label="Hover Effect">
          <select
            className="insp-input"
            value={node.hoverEffect || "none"}
            onChange={(e) => onChange({ hoverEffect: e.target.value as any })}
          >
            <option value="none">None</option>
            <option value="lift">Lift Shadow</option>
            <option value="glow">Neon Glow</option>
            <option value="scale">Scale 3D</option>
            <option value="tilt">Tilt Highlight</option>
          </select>
        </Field>
        <Field label="Glass Effect">
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => applyGlassmorphism("dark")}
              className="flex-1 py-1.5 px-2 rounded bg-stone-800 hover:bg-stone-700 text-[11px] text-stone-200 font-semibold border border-stone-700"
            >
              Dark Glass
            </button>
            <button
              type="button"
              onClick={() => applyGlassmorphism("light")}
              className="flex-1 py-1.5 px-2 rounded bg-stone-800 hover:bg-stone-700 text-[11px] text-stone-200 font-semibold border border-stone-700"
            >
              Frosted Light
            </button>
          </div>
        </Field>
      </div>

      {/* Colors & Gradient Generator */}
      <div className="insp-group">
        <h4>Colors & Gradients</h4>
        {node.type !== "image" && color("color", "Text color")}
        {color("background", "Background")}
        <div className="pt-1">
          <span className="text-[11px] text-stone-400 block mb-1.5">1-Click Gradient Generator:</span>
          <div className="grid grid-cols-2 gap-1.5">
            {GRADIENT_PRESETS.map((g) => (
              <button
                key={g.label}
                type="button"
                onClick={() => onStyle("background", g.val)}
                className="py-1.5 px-2 rounded text-[10px] font-semibold text-white border border-white/10 text-left truncate"
                style={{ background: g.val }}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {node.type !== "image" && node.type !== "divider" && (
        <div className="insp-group">
          <h4>Typography</h4>
          {txt("fontSize", "Size", "16px")}
          {select("fontWeight", "Weight", ["300", "400", "500", "600", "700", "800"])}
          {select("textAlign", "Align", ["left", "center", "right"])}
          {txt("lineHeight", "Line height", "1.5")}
          {select("fontFamily", "Font", ["inherit", "Georgia, serif", "'Space Grotesk', sans-serif", "'DM Sans', sans-serif", "monospace"])}
        </div>
      )}

      {isContainer(node.type) && (
        <div className="insp-group">
          <h4>Layout</h4>
          {select("flexDirection", "Direction", ["row", "column"])}
          {select("alignItems", "Align items", ["flex-start", "center", "flex-end", "stretch"])}
          {select("justifyContent", "Justify", ["flex-start", "center", "flex-end", "space-between"])}
          {txt("gap", "Gap", "16px")}
          {select("flexWrap", "Wrap", ["nowrap", "wrap"])}
        </div>
      )}

      <div className="insp-group">
        <h4>Box</h4>
        {txt("width", "Width", "auto")}
        {txt("maxWidth", "Max width")}
        {txt("padding", "Padding", "0px")}
        {txt("margin", "Margin", "0px")}
        {txt("borderRadius", "Radius", "0px")}
        {txt("border", "Border", "1px solid #ccc")}
        {txt("boxShadow", "Shadow")}
        {txt("backdropFilter", "Backdrop Blur", "blur(12px)")}
        {txt("opacity", "Opacity", "1")}
      </div>
    </div>
  );
}
