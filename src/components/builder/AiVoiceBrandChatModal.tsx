import React, { useState, useRef } from "react";
import {
  Mic,
  MicOff,
  Bot,
  Palette,
  Sparkles,
  X,
  Loader2,
  CheckCircle2,
  Plus,
  Volume2,
} from "lucide-react";
import { type BNode, createNode, mapTree } from "./types";

interface AiVoiceBrandChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageRoot: BNode;
  onCommitPage: (nextRoot: BNode) => void;
  onInsertNode: (node: BNode) => void;
  onApplyFont: (font: string) => void;
  onApplyPrimaryColor: (color: string) => void;
}

export function AiVoiceBrandChatModal({
  isOpen,
  onClose,
  pageRoot,
  onCommitPage,
  onInsertNode,
  onApplyFont,
  onApplyPrimaryColor,
}: AiVoiceBrandChatModalProps) {
  const [tab, setTab] = useState<"voice" | "brandkit" | "chatbot">("voice");

  // 1. Voice-to-Website Commander State
  const [listening, setListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState("");
  const [voiceLang, setVoiceLang] = useState<"hi-IN" | "en-US">("hi-IN");
  const [executingVoice, setExecutingVoice] = useState(false);
  const [voiceResultMsg, setVoiceResultMsg] = useState("");
  const recognitionRef = useRef<any>(null);

  // 2. AI Brand Kit & Copywriter State
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("AI SaaS & Digital Agency");
  const [generatingKit, setGeneratingKit] = useState(false);
  const [brandKit, setBrandKit] = useState<any | null>(null);
  const [kitApplied, setKitApplied] = useState(false);

  // 3. Embeddable AI Customer Support Chatbot State
  const [botName, setBotName] = useState("Canvas AI Support");
  const [botWelcome, setBotWelcome] = useState(
    "नमस्ते! 👋 मैं आपका AI असिस्टेंट हूँ। हमारे प्रोडक्ट्स, प्राइसिंग या सर्विसेज़ के बारे में कुछ भी पूछें!"
  );
  const [botContext, setBotContext] = useState(
    "Starter plan is $19/mo, Pro Studio is $49/mo, Enterprise is $99/mo. Free 14-day trial and 24/7 customer support."
  );
  const [botColor, setBotColor] = useState("#f97316");

  if (!isOpen) return null;

  const toggleMic = () => {
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (listening) {
      recognitionRef.current?.stop?.();
      setListening(false);
      return;
    }

    if (!SpeechRec) {
      setVoiceCommand("हेरो सेक्शन का बैकग्राउंड डार्क ब्लू करो और नीचे एक प्राइसिंग टेबल जोड़ो");
      return;
    }

    const rec = new SpeechRec();
    rec.lang = voiceLang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) setVoiceCommand(transcript);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const executeVoiceCommand = async (cmdText?: string) => {
    const finalCmd = (cmdText ?? voiceCommand).trim();
    if (!finalCmd) return;
    setExecutingVoice(true);
    setVoiceResultMsg("");

    try {
      const res = await fetch("/api/ai/voice-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: finalCmd, page: pageRoot }),
      });
      const data = await res.json();
      if (data.updatedPage) {
        onCommitPage(data.updatedPage);
        setVoiceResultMsg(data.summary || `Executed: "${finalCmd}"`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExecutingVoice(false);
    }
  };

  const handleGenerateBrandKit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    setGeneratingKit(true);
    setKitApplied(false);
    try {
      const res = await fetch("/api/ai/brand-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName: brandName.trim(), industry }),
      });
      const data = await res.json();
      if (data.brandKit) setBrandKit(data.brandKit);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingKit(false);
    }
  };

  const applyBrandKitToCanvas = () => {
    if (!brandKit) return;
    onApplyFont(brandKit.headingFont || "'Space Grotesk', sans-serif");
    onApplyPrimaryColor(brandKit.primaryColor || "#f97316");

    let h1Updated = false;
    let pUpdated = false;
    let btnUpdated = false;

    const updated = mapTree(pageRoot, (n) => {
      if (n.id === "root") {
        return {
          ...n,
          style: {
            ...n.style,
            background: brandKit.backgroundColor || "#09090b",
            color: brandKit.textColor || "#fafaf9",
            fontFamily: brandKit.bodyFont || "'Inter', sans-serif",
          },
        };
      }
      if (n.type === "heading" && n.level === 1 && !h1Updated) {
        h1Updated = true;
        return {
          ...n,
          text: brandKit.heroHeadline,
          style: { ...n.style, color: brandKit.textColor || "#ffffff" },
        };
      }
      if (n.type === "text" && !pUpdated) {
        pUpdated = true;
        return {
          ...n,
          text: brandKit.heroSubheadline,
        };
      }
      if (n.type === "button" && !btnUpdated) {
        btnUpdated = true;
        return {
          ...n,
          text: brandKit.ctaText,
          style: {
            ...n.style,
            background: brandKit.primaryColor,
            backgroundColor: brandKit.primaryColor,
            color: "#ffffff",
          },
        };
      }
      return n;
    });

    onCommitPage(updated);
    setKitApplied(true);
  };

  const handleInsertAiChatbot = () => {
    const node = createNode("aiChatbot");
    node.botName = botName;
    node.botWelcome = botWelcome;
    node.botContext = botContext;
    node.iconColor = botColor;
    onInsertNode(node);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#18181b] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-stone-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-[#1c1917]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Mic size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                AI Voice Commander, Brand Kit Generator & Embeddable AI Chatbot
              </h2>
              <p className="text-[11px] text-stone-400">
                Control canvas by voice in Hindi/English, generate complete Brand Kits, or embed a 24/7 AI Support Bot
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
        <div className="px-6 pt-3 border-b border-stone-800 flex gap-2 bg-[#141417]">
          {[
            { id: "voice", label: "🎙️ AI Voice-to-Website Commander" },
            { id: "brandkit", label: "🎨 AI Copywriter & Brand Kit Generator" },
            { id: "chatbot", label: "🤖 Embeddable AI Support Chatbot Block" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as any)}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                tab === t.id
                  ? "border-orange-500 text-orange-400 bg-orange-500/5"
                  : "border-transparent text-stone-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {tab === "voice" && (
            <div className="space-y-5">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-orange-950/30 border border-stone-800 text-center space-y-4">
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVoiceLang("hi-IN")}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      voiceLang === "hi-IN" ? "bg-orange-600 text-white" : "bg-stone-800 text-stone-400"
                    }`}
                  >
                    🇮🇳 Hindi / Hinglish Mic
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoiceLang("en-US")}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      voiceLang === "en-US" ? "bg-orange-600 text-white" : "bg-stone-800 text-stone-400"
                    }`}
                  >
                    🇺🇸 English Mic
                  </button>
                </div>

                <button
                  type="button"
                  onClick={toggleMic}
                  className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition shadow-2xl ${
                    listening
                      ? "bg-red-600 text-white animate-pulse ring-8 ring-red-500/20"
                      : "bg-orange-600 hover:bg-orange-500 text-white"
                  }`}
                >
                  {listening ? <MicOff size={32} /> : <Mic size={32} />}
                </button>

                <div>
                  <h3 className="text-base font-bold text-white">
                    {listening
                      ? "Listening... बोलिए आप वेबसाइट में क्या बदलाव चाहते हैं"
                      : "Click the Mic & Speak Your Website Design Command"}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    उदाहरण: “हेरो सेक्शन का बैकग्राउंड डार्क ब्लू करो और नीचे एक प्राइसिंग टेबल जोड़ो”
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto pt-2">
                  <input
                    value={voiceCommand}
                    onChange={(e) => setVoiceCommand(e.target.value)}
                    placeholder="Or type/edit your spoken voice command here..."
                    className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-stone-700 text-xs text-white"
                  />
                  <button
                    type="button"
                    disabled={executingVoice || !voiceCommand.trim()}
                    onClick={() => executeVoiceCommand()}
                    className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shrink-0"
                  >
                    {executingVoice ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Applying to Canvas...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Execute Voice Command</span>
                      </>
                    )}
                  </button>
                </div>

                {voiceResultMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 max-w-xl mx-auto">
                    <Volume2 size={15} />
                    <span>{voiceResultMsg}</span>
                  </div>
                )}
              </div>

              {/* 1-Click Sample Voice Commands */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  1-Click Instant Voice Command Presets:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {[
                    "हेरो सेक्शन का बैकग्राउंड डार्क ब्लू करो और नीचे एक प्राइसिंग टेबल जोड़ो",
                    "पेज के नीचे एक AI Customer Support Chatbot जोड़ो",
                    "Make the hero headline bold modern and add a Contact Form section",
                  ].map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => {
                        setVoiceCommand(sample);
                        executeVoiceCommand(sample);
                      }}
                      className="p-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-orange-500/40 text-left text-xs text-stone-200 transition"
                    >
                      🎙️ “{sample}”
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "brandkit" && (
            <div className="space-y-5">
              <form
                onSubmit={handleGenerateBrandKit}
                className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Your Business / Brand Name</label>
                    <input
                      required
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. NovaPay, KrishiKart, PixelCraft"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-stone-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Industry / Category</label>
                    <input
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. Fintech SaaS, E-Commerce, Portfolio"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-stone-700 text-xs text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={generatingKit || !brandName.trim()}
                      className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2"
                    >
                      {generatingKit ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Generating Brand Identity...</span>
                        </>
                      ) : (
                        <>
                          <Palette size={14} />
                          <span>Generate AI Brand Kit & Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {brandKit && (
                <div className="p-5 rounded-2xl bg-stone-900/90 border border-orange-500/40 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
                    <div>
                      <div className="text-2xl font-extrabold text-white tracking-tight">
                        {brandKit.logoText}
                      </div>
                      <div className="text-xs text-orange-400 font-medium">{brandKit.tagline}</div>
                    </div>
                    <button
                      type="button"
                      onClick={applyBrandKitToCanvas}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg"
                    >
                      <CheckCircle2 size={14} />
                      <span>
                        {kitApplied ? "✓ Brand Kit Applied to Canvas!" : "Apply Colors, Fonts & Copy to Canvas"}
                      </span>
                    </button>
                  </div>

                  {/* Color Swatches */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { label: "Primary Brand", hex: brandKit.primaryColor },
                      { label: "Secondary Accent", hex: brandKit.secondaryColor },
                      { label: "Background", hex: brandKit.backgroundColor },
                      { label: "Surface Card", hex: brandKit.surfaceColor },
                      { label: "Typography", hex: brandKit.textColor },
                    ].map((c) => (
                      <div key={c.label} className="p-3 rounded-xl bg-black/40 border border-stone-800 space-y-2">
                        <div
                          className="w-full h-10 rounded-lg border border-white/15"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="text-[11px] font-bold text-white">{c.label}</div>
                        <div className="text-[10px] font-mono text-stone-400">{c.hex}</div>
                      </div>
                    ))}
                  </div>

                  {/* Generated Website Copy */}
                  <div className="p-4 rounded-xl bg-black/40 border border-stone-800 space-y-2">
                    <div className="text-[10px] font-mono uppercase text-orange-400">
                      AI Generated Homepage Hero Copy & Font Pairing ({brandKit.headingFont})
                    </div>
                    <div className="text-lg font-extrabold text-white">{brandKit.heroHeadline}</div>
                    <div className="text-xs text-stone-300">{brandKit.heroSubheadline}</div>
                    <div className="pt-1">
                      <span
                        className="inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: brandKit.primaryColor }}
                      >
                        {brandKit.ctaText}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "chatbot" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Configure Your Website’s AI Customer Support Bot
                </h3>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">AI Assistant Name</label>
                  <input
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Welcome Greeting</label>
                  <textarea
                    rows={2}
                    value={botWelcome}
                    onChange={(e) => setBotWelcome(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/50 border border-stone-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">
                    Business Knowledge Base (Products, Pricing, FAQs)
                  </label>
                  <textarea
                    rows={3}
                    value={botContext}
                    onChange={(e) => setBotContext(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/50 border border-stone-700 text-xs text-white"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">Brand Color:</span>
                    <input
                      type="color"
                      value={botColor}
                      onChange={(e) => setBotColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleInsertAiChatbot}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg"
                  >
                    <Plus size={14} />
                    <span>Add AI Chatbot Widget to Website</span>
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-center space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Bot size={16} />
                  <span>Live Visitor AI Support + Smart Lead Capture</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  यह AI Chatbot आपकी वेबसाइट के विज़िटर्स के हर सवाल का जवाब हिंदी, हिंग्लिश या इंग्लिश में देता है और चैट के अंदर ही उनका Email (Lead) कैप्चर करके सीधे आपके Backend Inbox में सेव कर देता है।
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
