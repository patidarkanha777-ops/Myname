import React, { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  Zap,
  Award,
  Rocket,
  Globe,
  Heart,
  CheckCircle2,
  Flame,
  Crown,
  Lock,
  Star,
  Code2,
  Cpu,
  Layers,
  TrendingUp,
  ShoppingBag,
  ThumbsUp,
  Search,
  Sun,
  Moon,
  Image as ImageIcon,
  X,
  Plus,
} from "lucide-react";
import { type BNode, createNode, uid } from "./types";

interface IconAssetStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: BNode | null;
  onUpdateSelectedNode: (patch: Partial<BNode>) => void;
  onInsertNode: (node: BNode) => void;
}

const ICONS_LIBRARY: { name: string; category: string; icon: React.ElementType; defaultText: string }[] = [
  { name: "ShieldCheck", category: "Trust & Security", icon: ShieldCheck, defaultText: "SOC2 & ISO Verified Security" },
  { name: "Sparkles", category: "AI & Magic", icon: Sparkles, defaultText: "Powered by Gemini AI" },
  { name: "Zap", category: "Speed", icon: Zap, defaultText: "99.9% Ultra-Fast Edge Delivery" },
  { name: "Award", category: "Awards", icon: Award, defaultText: "#1 Rated Product of the Year" },
  { name: "Rocket", category: "Growth", icon: Rocket, defaultText: "10x Faster Launch Workflow" },
  { name: "Globe", category: "Global", icon: Globe, defaultText: "Trusted in 120+ Countries" },
  { name: "Heart", category: "Social", icon: Heart, defaultText: "Loved by 50,000+ Creators" },
  { name: "CheckCircle2", category: "Trust & Security", icon: CheckCircle2, defaultText: "30-Day Money-Back Guarantee" },
  { name: "Flame", category: "Growth", icon: Flame, defaultText: "Trending Bestseller" },
  { name: "Crown", category: "Awards", icon: Crown, defaultText: "Enterprise VIP Support" },
  { name: "Lock", category: "Trust & Security", icon: Lock, defaultText: "256-Bit SSL Encrypted Checkout" },
  { name: "Star", category: "Social", icon: Star, defaultText: "4.9/5 Star Customer Rating" },
  { name: "Code2", category: "Tech", icon: Code2, defaultText: "Clean React & Tailwind Export" },
  { name: "Cpu", category: "AI & Magic", icon: Cpu, defaultText: "Autonomous Neural Engine" },
  { name: "Layers", category: "Tech", icon: Layers, defaultText: "Full-Stack Architecture" },
  { name: "TrendingUp", category: "Growth", icon: TrendingUp, defaultText: "+140% Conversion Lift" },
  { name: "ShoppingBag", category: "E-Commerce", icon: ShoppingBag, defaultText: "Express 1-Click Checkout" },
  { name: "ThumbsUp", category: "Social", icon: ThumbsUp, defaultText: "98% Client Satisfaction" },
];

const IMAGE_STUDIO_PRESETS = [
  {
    name: "Original Clean",
    desc: "Balanced natural colors",
    patch: { imageBrightness: 100, imageContrast: 100, imageBlur: 0, imageGrayscale: 0, imageSepia: 0, imageFrame: "none" as const },
  },
  {
    name: "Cyber Neon Glow",
    desc: "High contrast + glowing neon border",
    patch: { imageBrightness: 112, imageContrast: 135, imageBlur: 0, imageGrayscale: 0, imageSepia: 0, imageFrame: "neon" as const, imageBadge: "FEATURED" },
  },
  {
    name: "Polaroid Studio",
    desc: "Warm vintage film in a white Polaroid frame",
    patch: { imageBrightness: 105, imageContrast: 110, imageBlur: 0, imageGrayscale: 0, imageSepia: 35, imageFrame: "polaroid" as const },
  },
  {
    name: "Editorial Noir B&W",
    desc: "Dramatic monochrome fine-art contrast",
    patch: { imageBrightness: 105, imageContrast: 145, imageBlur: 0, imageGrayscale: 100, imageSepia: 0, imageFrame: "glass" as const },
  },
  {
    name: "Frosted Glass Card",
    desc: "Translucent glass frame with badge",
    patch: { imageBrightness: 108, imageContrast: 115, imageBlur: 0, imageGrayscale: 0, imageSepia: 0, imageFrame: "glass" as const, imageBadge: "NEW RELEASE" },
  },
];

export function IconAssetStudioModal({
  isOpen,
  onClose,
  selectedNode,
  onUpdateSelectedNode,
  onInsertNode,
}: IconAssetStudioModalProps) {
  const [search, setSearch] = useState("");
  const [badgeStyle, setBadgeStyle] = useState<"pill" | "circle" | "seal">("pill");
  const [iconColor, setIconColor] = useState("#f97316");
  const [customLabel, setCustomLabel] = useState("");

  if (!isOpen) return null;

  const filteredIcons = ICONS_LIBRARY.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.defaultText.toLowerCase().includes(search.toLowerCase())
  );

  const handleInsertIconBadge = (item: (typeof ICONS_LIBRARY)[0]) => {
    const node: BNode = {
      id: uid(),
      type: "iconBadge",
      iconName: item.name,
      iconBadgeStyle: badgeStyle,
      iconColor,
      text: customLabel.trim() || item.defaultText,
      style: { padding: "12px", margin: "8px auto", textAlign: "center" },
    };
    onInsertNode(node);
    onClose();
  };

  const handleInsertThemeToggle = () => {
    const node = createNode("themeToggle");
    onInsertNode(node);
    onClose();
  };

  const handleApplyImagePreset = (preset: (typeof IMAGE_STUDIO_PRESETS)[0]) => {
    if (selectedNode && selectedNode.type === "image") {
      onUpdateSelectedNode(preset.patch);
      onClose();
    } else {
      const img = createNode("image");
      Object.assign(img, preset.patch);
      onInsertNode(img);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#18181b] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-stone-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-[#1c1917]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Advanced Design, Custom SVG Icon Picker & Image Filter Studio
              </h2>
              <p className="text-[11px] text-stone-400">
                Search vector icons & trust badges, apply 1-click photo studio filters, or add a Dark/Light Theme Switcher
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

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Dark / Light Mode Toggle Block Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/30 border border-stone-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sun size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Visitor Dark / Light Mode Toggle Block
                </h3>
                <p className="text-xs text-stone-400">
                  Add a live interactive Dark/Light theme switcher button directly onto your website page
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleInsertThemeToggle}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow"
            >
              <Moon size={14} />
              <span>Insert Dark/Light Switcher Block</span>
            </button>
          </div>

          {/* Custom Icon & SVG Badge Picker */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300">
                Custom Icon & SVG Badge Library (Click any icon to insert)
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={badgeStyle}
                  onChange={(e) => setBadgeStyle(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-stone-200"
                >
                  <option value="pill">Style: Glass Pill Badge</option>
                  <option value="circle">Style: Feature Circle Icon</option>
                  <option value="seal">Style: Trust Seal Box</option>
                </select>
                <input
                  type="color"
                  value={iconColor}
                  onChange={(e) => setIconColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                  title="Pick Icon Color"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search icons (e.g. shield, rocket, star, lock, ai)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white"
                />
              </div>
              <input
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="Optional custom badge text (leave blank for default)..."
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {filteredIcons.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleInsertIconBadge(item)}
                    className="p-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-orange-500/50 transition flex items-center gap-3 text-left group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${iconColor}20`, color: iconColor }}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate group-hover:text-orange-400">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate">{item.defaultText}</div>
                    </div>
                    <Plus size={14} className="text-stone-500 group-hover:text-orange-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Built-in Image Studio Presets */}
          <div className="space-y-3 pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon size={15} className="text-orange-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300">
                  1-Click Image Filter & Frame Studio Presets
                </h3>
              </div>
              <span className="text-[11px] text-stone-400">
                {selectedNode?.type === "image"
                  ? "Applies to currently selected image"
                  : "Inserts a styled studio photo block"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {IMAGE_STUDIO_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyImagePreset(preset)}
                  className="p-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-orange-500/40 text-left space-y-1 transition"
                >
                  <div className="text-xs font-bold text-white">{preset.name}</div>
                  <div className="text-[10px] text-stone-400 leading-snug">{preset.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
