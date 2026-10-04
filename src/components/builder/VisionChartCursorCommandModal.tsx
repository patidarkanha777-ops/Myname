import React, { useState } from "react";
import {
  Command,
  Wand2,
  Sparkles,
  BarChart3,
  Globe,
  Image as ImageIcon,
  FileText,
  Code2,
  MousePointerClick,
  Search,
  Upload,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  Languages,
  Menu,
  Maximize2,
} from "lucide-react";
import { type BNode, type NodeType, createNode } from "./types";

interface VisionChartCursorCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertNode: (node: BNode) => void;
  cursorMode: "none" | "neon" | "spotlight";
  onChangeCursorMode: (mode: "none" | "neon" | "spotlight") => void;
  isRtl: boolean;
  onToggleRtl: () => void;
  onApplyHeroBgEffect: (effect: "none" | "aurora" | "starfield" | "cyber-grid") => void;
  onOpenCodeExport: () => void;
}

export function VisionChartCursorCommandModal({
  isOpen,
  onClose,
  onInsertNode,
  cursorMode,
  onChangeCursorMode,
  isRtl,
  onToggleRtl,
  onApplyHeroBgEffect,
  onOpenCodeExport,
}: VisionChartCursorCommandModalProps) {
  const [tab, setTab] = useState<"command" | "vision" | "cursor" | "blocks">("command");
  const [cmdSearch, setCmdSearch] = useState("");

  // AI Wireframe / Screenshot-to-Website State
  const [sketchPreview, setSketchPreview] = useState<string | null>(null);
  const [sketchMime, setSketchMime] = useState<string>("image/png");
  const [sketchPrompt, setSketchPrompt] = useState(
    "Modern SaaS Hero + 3 Feature Cards + Call-To-Action Button"
  );
  const [convertingSketch, setConvertingSketch] = useState(false);
  const [sketchStatus, setSketchStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSketchMime(file.type || "image/png");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSketchPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConvertWireframe = async () => {
    setConvertingSketch(true);
    setSketchStatus(null);
    try {
      const res = await fetch("/api/ai/sketch-to-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: sketchPreview,
          mimeType: sketchMime,
          prompt: sketchPrompt,
        }),
      });
      const data = await res.json();
      if (data.section) {
        onInsertNode(data.section);
        setSketchStatus(data.summary || "Wireframe converted and added to canvas!");
      }
    } catch (err) {
      console.error(err);
      setSketchStatus("Failed to convert wireframe.");
    } finally {
      setConvertingSketch(false);
    }
  };

  const quickInsert = (type: NodeType) => {
    const node = createNode(type);
    onInsertNode(node);
    onClose();
  };

  const COMMAND_ACTIONS = [
    { label: "📊 Insert Visual Data Chart Block (Bar / Line / Donut)", action: () => quickInsert("dataChart"), tag: "Category 5" },
    { label: "🔍 Insert Searchable Directory / Job Board / Real-Estate Grid", action: () => quickInsert("directoryGrid"), tag: "Category 5" },
    { label: "🌐 Insert External REST API JSON Data Table", action: () => quickInsert("apiTable"), tag: "Category 5" },
    { label: "🧭 Insert Smart Sticky Header & Mobile Hamburger Navbar", action: () => quickInsert("smartNavbar"), tag: "Category 6" },
    { label: "🌍 Insert Live Visitor Multi-Language & RTL Switcher Bar", action: () => quickInsert("langSwitcher"), tag: "Category 9" },
    { label: "🖼️ Insert Filterable Masonry Portfolio & Lightbox Zoom Gallery", action: () => quickInsert("masonryGallery"), tag: "Category 15" },
    { label: "📄 Insert Interactive Brochure / Resume PDF Viewer", action: () => quickInsert("pdfViewer"), tag: "Category 15" },
    { label: "🛍️ Insert Interactive Image Hotspot (Shop the Look + Pins)", action: () => quickInsert("imageHotspot"), tag: "Category 15" },
    { label: "💻 Insert Custom HTML / Iframe / Script Embed Block", action: () => quickInsert("customEmbed"), tag: "Category 16" },
    { label: "🪄 Open AI Wireframe / Screenshot-to-Website Converter", action: () => setTab("vision"), tag: "AI Vision" },
    { label: "✨ Enable Neon Glow Magnetic Cursor on Canvas", action: () => onChangeCursorMode("neon"), tag: "Cursor" },
    { label: "🌌 Apply Aurora Mesh Animated Background to Hero", action: () => onApplyHeroBgEffect("aurora"), tag: "Animated BG" },
    { label: "🔄 Toggle Global RTL (Right-to-Left) Layout Mode", action: () => onToggleRtl(), tag: "RTL / LTR" },
    { label: "📦 Export as WordPress Gutenberg, Vue 3 (.vue) or Astro (.astro)", action: () => { onClose(); onOpenCodeExport(); }, tag: "Export" },
  ];

  const filteredCommands = COMMAND_ACTIONS.filter(
    (c) =>
      c.label.toLowerCase().includes(cmdSearch.toLowerCase()) ||
      c.tag.toLowerCase().includes(cmdSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#18181b] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-stone-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-[#1c1917]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Command size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Command Palette (Ctrl+K), AI Wireframe Vision, Charts, RTL & Gallery Hub</span>
              </h2>
              <p className="text-[11px] text-stone-400">
                Categories 2, 5, 6, 9, 15 & 16 • Sketch-to-Site, Live Charts, REST API, Custom Cursor, RTL, Lightbox & Multi-Export
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 border-b border-stone-800 flex flex-wrap gap-2 bg-[#141417]">
          {[
            { id: "command", label: "⌨️ Command Palette (Ctrl+K)" },
            { id: "vision", label: "🪄 AI Wireframe / Screenshot-to-Site" },
            { id: "cursor", label: "✨ Custom Cursor, Animated BG & RTL" },
            { id: "blocks", label: "📊 Charts, API, Gallery, PDF & Embeds" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as any)}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition ${
                tab === t.id
                  ? "border-orange-500 text-orange-400 bg-orange-500/5"
                  : "border-transparent text-stone-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {tab === "command" && (
            <div className="space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
                <input
                  autoFocus
                  value={cmdSearch}
                  onChange={(e) => setCmdSearch(e.target.value)}
                  placeholder="Type a command or block name (e.g. chart, api, navbar, rtl, pdf, hotspot, wordpress, sketch)..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-stone-700 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5 max-h-[48vh] overflow-y-auto pr-1">
                {filteredCommands.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={item.action}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-orange-500/40 flex items-center justify-between text-left transition"
                  >
                    <span className="text-xs font-semibold text-white">{item.label}</span>
                    <span className="text-[10px] font-mono text-orange-400">{item.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === "vision" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
                  <Wand2 size={15} />
                  <span>Upload Wireframe Sketch or Screenshot</span>
                </div>

                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-700 hover:border-orange-500 rounded-2xl bg-black/40 cursor-pointer transition text-center space-y-2">
                  <Upload size={24} className="text-orange-400" />
                  <span className="text-xs font-bold text-white">
                    Click to Upload Hand-Drawn Sketch or Website Screenshot
                  </span>
                  <span className="text-[11px] text-stone-400">Supports PNG, JPG, WEBP</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">
                    Layout Instructions / Wireframe Description
                  </label>
                  <textarea
                    rows={3}
                    value={sketchPrompt}
                    onChange={(e) => setSketchPrompt(e.target.value)}
                    placeholder="Describe the section or let Gemini Vision analyze your uploaded image..."
                    className="w-full p-3 rounded-xl bg-black/50 border border-stone-700 text-xs text-white"
                  />
                </div>

                <button
                  type="button"
                  disabled={convertingSketch}
                  onClick={handleConvertWireframe}
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  {convertingSketch ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                  <span>
                    {convertingSketch
                      ? "Gemini Vision Reconstructing Layout..."
                      : "Convert Wireframe / Screenshot to Live Section"}
                  </span>
                </button>

                {sketchStatus && (
                  <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 size={15} />
                    <span>{sketchStatus}</span>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-black/50 border border-stone-800 flex flex-col items-center justify-center text-center min-h-[260px]">
                {sketchPreview ? (
                  <div className="space-y-3 w-full">
                    <img
                      src={sketchPreview}
                      alt="Uploaded Sketch"
                      className="max-h-56 mx-auto rounded-xl border border-stone-700 object-contain"
                    />
                    <span className="text-[11px] text-emerald-400 font-mono block">
                      ✓ Image Ready for Multimodal Vision Conversion
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2 max-w-xs">
                    <ImageIcon size={32} className="text-stone-600 mx-auto" />
                    <h4 className="text-xs font-bold text-stone-300">No Sketch Uploaded Yet</h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Upload a photo of a paper wireframe sketch or any UI screenshot—or click Convert right now to generate from your text prompt.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "cursor" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Custom Cursor & RTL Controls */}
              <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  1. Custom Magnetic / Neon Glow Mouse Cursor
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "none", label: "Standard" },
                    { id: "neon", label: "🔥 Neon Ring" },
                    { id: "spotlight", label: "✨ Spotlight" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onChangeCursorMode(c.id as any)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                        cursorMode === c.id
                          ? "bg-orange-600 border-orange-500 text-white"
                          : "bg-black/40 border-stone-700 text-stone-300 hover:text-white"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 pt-2">
                  2. Global Multi-Language & Auto RTL Layout Mode
                </h3>
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={onToggleRtl}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border flex items-center justify-between transition ${
                      isRtl
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : "bg-black/40 border-stone-700 text-stone-200 hover:border-orange-500"
                    }`}
                  >
                    <span>Global Layout Direction: {isRtl ? "RTL (Right-to-Left)" : "LTR (Left-to-Right)"}</span>
                    <span className="font-mono text-[10px]">Click to Flip</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickInsert("langSwitcher")}
                    className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Languages size={14} />
                    <span>Insert Live Language Switcher Bar (EN | हिं | ES | FR | AR)</span>
                  </button>
                </div>
              </div>

              {/* Animated Background Generator */}
              <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  3. Animated Section Backgrounds & Smart Navbar
                </h3>
                <p className="text-xs text-stone-400">
                  Apply live Aurora Borealis, Starfield Particles, or Cyber Matrix Grid to your Hero/Selected section:
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "aurora", label: "✨ Aurora Borealis" },
                    { id: "starfield", label: "🌌 Starfield Dots" },
                    { id: "cyber-grid", label: "🕸️ Cyber Matrix Grid" },
                    { id: "none", label: "Reset Background" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => onApplyHeroBgEffect(b.id as any)}
                      className="py-2.5 px-3 rounded-xl bg-black/50 hover:bg-orange-600/20 border border-stone-700 hover:border-orange-500 text-xs font-semibold text-white transition"
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => quickInsert("smartNavbar")}
                    className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs font-bold text-orange-400 flex items-center justify-center gap-2"
                  >
                    <Menu size={14} />
                    <span>Insert Smart Sticky Header & Mobile Hamburger Menu</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "blocks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  type: "dataChart" as NodeType,
                  title: "📊 Visual Data Charts (Bar, Line & Donut)",
                  desc: "Interactive Bar chart, SVG Line graph, and Donut chart block for metrics & growth stats.",
                },
                {
                  type: "directoryGrid" as NodeType,
                  title: "🔍 Searchable Directory / Job Board / Real-Estate Grid",
                  desc: "Live search bar and category filter tabs for job listings, properties, or SaaS directories.",
                },
                {
                  type: "apiTable" as NodeType,
                  title: "🌐 External REST API / JSON Data Table",
                  desc: "Fetch live JSON from any REST API endpoint and render it inside an interactive table.",
                },
                {
                  type: "masonryGallery" as NodeType,
                  title: "🖼️ Filterable Masonry Portfolio & Lightbox Zoom",
                  desc: "Category-filterable photo grid with 1-click fullscreen Lightbox zoom modal.",
                },
                {
                  type: "pdfViewer" as NodeType,
                  title: "📄 Interactive Brochure / Resume PDF Embed Viewer",
                  desc: "In-page PDF catalog & resume reader with zoom controls and direct download.",
                },
                {
                  type: "imageHotspot" as NodeType,
                  title: "🛍️ Interactive Image Hotspot (Shop the Look)",
                  desc: "Interactive + pins on photos that reveal product titles, prices, and Buy buttons.",
                },
                {
                  type: "customEmbed" as NodeType,
                  title: "💻 Custom HTML / Iframe / Script Widget Embed",
                  desc: "Embed Calendly, Typeform, Spotify, YouTube, or custom HTML/JS widgets.",
                },
                {
                  type: "smartNavbar" as NodeType,
                  title: "🧭 Smart Sticky Header & Mobile Hamburger Menu",
                  desc: "Responsive glassmorphic top navigation bar with mobile drawer toggle.",
                },
              ].map((b) => (
                <div
                  key={b.type}
                  className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between gap-3 hover:border-orange-500/40 transition"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{b.title}</h4>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">{b.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => quickInsert(b.type)}
                    className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Insert on Canvas</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
