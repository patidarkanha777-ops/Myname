import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  MapPin,
  ShoppingCart,
  CheckCircle2,
  ChevronDown,
  Calculator,
  MessageCircle,
  Sparkles,
  Send,
  Calendar,
  Lock,
  User,
  Mail,
  X,
  Plus,
  Minus,
  CreditCard,
  ShieldCheck,
  Zap,
  Award,
  Rocket,
  Globe,
  Heart,
  Flame,
  Crown,
  Code2,
  Cpu,
  Layers,
  TrendingUp,
  ShoppingBag,
  ThumbsUp,
  Sun,
  Moon,
  BookOpen,
  BarChart3,
  Search,
  RefreshCw,
  Menu,
  Languages,
  Maximize2,
  FileText,
  ExternalLink,
} from "lucide-react";
import type { BNode } from "./types";
import { auth, db, OperationType, handleFirestoreError } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// 1. Video Widget
export function VideoWidget({ node }: { node: BNode }) {
  let embedUrl = node.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ";
  if (embedUrl.includes("watch?v=")) {
    embedUrl = embedUrl.replace("watch?v=", "embed/");
  }

  return (
    <div className="w-full h-full min-h-[320px] bg-black rounded-xl overflow-hidden relative shadow-lg">
      <iframe
        src={embedUrl}
        title="Video player"
        className="w-full h-full min-h-[320px] border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

// 2. Carousel / Image Slider Widget
export function CarouselWidget({ node }: { node: BNode }) {
  const images =
    node.carouselImages && node.carouselImages.length > 0
      ? node.carouselImages
      : [
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
          "https://images.unsplash.com/photo-1517976487507-5b3b4a45a74c?w=1200",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
        ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-full min-h-[340px] rounded-2xl overflow-hidden group select-none shadow-xl bg-stone-900">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full min-h-[340px] object-cover transition-opacity duration-300"
      />

      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition opacity-80 group-hover:opacity-100"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition opacity-80 group-hover:opacity-100"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? "w-5 bg-orange-500" : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// 3. Countdown Timer Widget
export function CountdownWidget({ node }: { node: BNode }) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const target = node.targetDate ? new Date(node.targetDate).getTime() : Date.now() + 7 * 86400000;

    const updateTimer = () => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [node.targetDate]);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-orange-400 uppercase tracking-widest">
        <Clock size={14} />
        <span>Limited Time Special Offer</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col items-center bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl min-w-[62px]">
          <span className="text-2xl font-bold font-mono text-white leading-none">{timeLeft.days}</span>
          <span className="text-[10px] uppercase text-stone-400 font-semibold mt-1">Days</span>
        </div>
        <span className="text-xl font-bold text-stone-500">:</span>
        <div className="flex flex-col items-center bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl min-w-[62px]">
          <span className="text-2xl font-bold font-mono text-white leading-none">{timeLeft.hours}</span>
          <span className="text-[10px] uppercase text-stone-400 font-semibold mt-1">Hours</span>
        </div>
        <span className="text-xl font-bold text-stone-500">:</span>
        <div className="flex flex-col items-center bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl min-w-[62px]">
          <span className="text-2xl font-bold font-mono text-white leading-none">{timeLeft.minutes}</span>
          <span className="text-[10px] uppercase text-stone-400 font-semibold mt-1">Mins</span>
        </div>
        <span className="text-xl font-bold text-stone-500">:</span>
        <div className="flex flex-col items-center bg-orange-600/30 border border-orange-500/40 px-3.5 py-2 rounded-xl min-w-[62px]">
          <span className="text-2xl font-bold font-mono text-orange-400 leading-none">{timeLeft.seconds}</span>
          <span className="text-[10px] uppercase text-orange-300 font-semibold mt-1">Secs</span>
        </div>
      </div>
    </div>
  );
}

// 4. Social Proof & Star Testimonial Widget
export function StarsWidget({ node }: { node: BNode }) {
  const rating = node.rating || 5;

  return (
    <div className="flex flex-col items-center text-center p-6 bg-white/5 border border-white/10 rounded-2xl max-w-lg mx-auto">
      <div className="flex items-center gap-1 text-amber-400 mb-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={18}
            className={i < rating ? "fill-amber-400 text-amber-400" : "text-stone-600"}
          />
        ))}
        <span className="text-xs font-bold text-stone-300 ml-1.5 font-mono">{rating}.0 / 5.0</span>
      </div>

      <p className="text-sm font-medium italic text-stone-200 leading-relaxed mb-4">
        {node.text || "“Canvas transformed our landing page workflow! It saved us over 40 hours of development time and looks stunning.”"}
      </p>

      <div className="flex items-center gap-3">
        <img
          src={node.src || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/40"
        />
        <div className="text-left">
          <div className="text-xs font-bold text-stone-100">{node.author || "Sarah Jenkins"}</div>
          <div className="text-[11px] text-stone-400">Verified Client Review</div>
        </div>
      </div>
    </div>
  );
}

// 5. Interactive Google Map Widget
export function MapWidget({ node }: { node: BNode }) {
  const query = node.mapQuery || "San Francisco, CA";
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden relative shadow-lg bg-stone-900 border border-stone-800">
      <iframe
        src={embedUrl}
        title={`Map of ${query}`}
        className="w-full h-full min-h-[300px] border-0"
        loading="lazy"
      />
      <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm text-stone-200 px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 font-medium">
        <MapPin size={13} className="text-orange-400" />
        <span>{query}</span>
      </div>
    </div>
  );
}

// 6. Visual Form & Database Builder Widget (Contact / Login-Signup / Booking)
export function FormWidget({ node }: { node: BNode }) {
  const formType = node.formType || "contact";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [service, setService] = useState("Full Website Design");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email.trim()) return;

    setSubmitting(true);
    const cleanName = (name.trim() || email.split("@")[0] || "Visitor").slice(0, 120);
    const cleanEmail = email.trim().slice(0, 160);
    const detailMsg =
      formType === "booking"
        ? `[BOOKING] Date: ${date || "Flexible"} | Service: ${service} | Notes: ${message || "None"}`
        : formType === "signup"
        ? `[ACCOUNT SIGNUP] User registered account (${cleanEmail})`
        : message.trim() || "Submitted contact inquiry";

    try {
      // 1. Save to Express Backend API
      await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          message: detailMsg.slice(0, 2000),
          page: formType.toUpperCase(),
        }),
      });

      // 2. If user is authenticated with Firebase, also persist to Cloud Firestore /leads
      if (auth.currentUser && auth.currentUser.emailVerified) {
        const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const path = `leads/${leadId}`;
        try {
          await setDoc(doc(db, "leads", leadId), {
            ownerId: auth.currentUser.uid,
            formType,
            visitorName: cleanName,
            visitorEmail: cleanEmail,
            message: detailMsg.slice(0, 2000),
            pageName: "Canvas Live Form",
            createdAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, path);
        }
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      setPassword("");
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error("Form submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full text-left space-y-4"
    >
      <div className="space-y-1">
        <div className="text-[11px] font-mono uppercase tracking-wider text-orange-400">
          {formType === "booking"
            ? "Appointment & Booking System"
            : formType === "signup"
            ? "Member Authentication & Signup"
            : "Direct Backend & Cloud Database Form"}
        </div>
        <h3 className="text-xl font-bold text-white">
          {node.formTitle ||
            (formType === "booking"
              ? "Book a 1-on-1 Consultation"
              : formType === "signup"
              ? "Create Your Member Account"
              : "Get in Touch with Our Team")}
        </h3>
        <p className="text-xs text-stone-400 leading-relaxed">
          {node.text || "Submissions are automatically stored in the Backend API & Firebase Cloud Database."}
        </p>
      </div>

      {submitted ? (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-emerald-300">Saved to Backend & Cloud Database!</p>
            <p className="mt-0.5 text-stone-300">Open the Form Leads Inbox in the top toolbar to view this submission.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {formType === "signup" && (
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Create Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {formType === "booking" && (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Preferred Date</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Service Package</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Full Website Design">Full Website Design</option>
                  <option value="AI Automation Setup">AI Automation Setup</option>
                  <option value="E-Commerce Store">E-Commerce Store</option>
                </select>
              </div>
            </div>
          )}

          {formType !== "signup" && (
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                {formType === "booking" ? "Booking Notes" : "Your Message"}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your project goals..."
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50"
          >
            <Send size={14} />
            <span>
              {submitting
                ? "Saving to Database..."
                : node.formButtonText ||
                  (formType === "booking"
                    ? "Confirm Booking →"
                    : formType === "signup"
                    ? "Create Account →"
                    : "Send Message →")}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}

// 7. E-Commerce Product Card + Add-to-Cart Drawer & Checkout Modal
export function ProductWidget({ node }: { node: BNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "success">("cart");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");

  const price = node.productPrice ?? 249;
  const title = node.productTitle || "Pro Wireless Studio Headphones";

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName || "Store Customer",
          email: customerEmail || "buyer@store.com",
          message: `[E-COMMERCE ORDER] ${qty}x ${title} — Total: $${price * qty}`,
          page: "E-Commerce Checkout",
        }),
      });
      setCheckoutStep("success");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full text-left">
      <div className="relative rounded-xl overflow-hidden mb-3 bg-stone-900">
        <img
          src={node.src || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"}
          alt={title}
          className="w-full h-52 object-cover"
        />
        {node.productBadge && (
          <span className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
            {node.productBadge}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-amber-400">
          <span>★★★★★ (4.9)</span>
          <span className="text-emerald-400 font-medium">● In Stock</span>
        </div>
        <h3 className="text-lg font-bold text-white leading-snug">{title}</h3>
        <p className="text-xs text-stone-400 leading-relaxed">
          {node.text || "Active noise cancellation, 40-hour battery life, and spatial studio acoustics."}
        </p>

        <div className="pt-3 flex items-center justify-between border-t border-white/10">
          <div>
            <span className="text-xs text-stone-400 block">Price</span>
            <span className="text-2xl font-extrabold text-white">${price}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setCheckoutStep("cart");
              setCartOpen(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-orange-950/50"
          >
            <ShoppingCart size={14} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Slide-over Cart & Checkout Modal */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-end p-4">
          <div className="w-full max-w-md bg-[#1c1917] border border-stone-700 rounded-2xl p-6 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-orange-400" />
                <h4 className="text-sm font-bold">
                  {checkoutStep === "cart"
                    ? "Your Shopping Cart"
                    : checkoutStep === "checkout"
                    ? "Express Checkout"
                    : "Order Confirmed"}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="p-1 text-stone-400 hover:text-white rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {checkoutStep === "cart" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <img
                    src={node.src || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"}
                    alt={title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{title}</div>
                    <div className="text-xs text-orange-400 font-bold mt-0.5">${price} each</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-mono">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(qty + 1)}
                        className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-stone-800">
                  <span>Subtotal</span>
                  <span className="text-lg text-orange-400">${price * qty}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutStep("checkout")}
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <CreditCard size={14} />
                  <span>Proceed to Checkout (${price * qty})</span>
                </button>
              </div>
            )}

            {checkoutStep === "checkout" && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-stone-300 mb-1">Full Name</label>
                  <input
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-300 mb-1">Email for Receipt</label>
                  <input
                    required
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
                  />
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs flex justify-between">
                  <span>Total Due ({qty} item)</span>
                  <span className="font-bold text-orange-400">${price * qty}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("cart")}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Complete Order
                  </button>
                </div>
              </form>
            )}

            {checkoutStep === "success" && (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h5 className="text-base font-bold">Order Placed Successfully!</h5>
                <p className="text-xs text-stone-400">
                  Order for {qty}x {title} (${price * qty}) has been recorded in your Backend Inbox.
                </p>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="px-5 py-2 rounded-xl bg-stone-800 text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 8. Interactive Pricing Toggle Widget (Monthly / Yearly)
export function PricingWidget({ node }: { node: BNode }) {
  const [yearly, setYearly] = useState(true);

  const plans = [
    { name: "Starter", monthly: 19, desc: "For personal portfolios & creators", features: ["3 Cloud Projects", "HTML & ZIP Export", "Basic AI Studio"] },
    { name: "Pro Studio", monthly: 49, popular: true, desc: "For agencies & full-stack builders", features: ["Unlimited Projects", "React & Next.js Export", "Full-Stack Backend Sync", "Custom Live Links"] },
    { name: "Enterprise", monthly: 99, desc: "For scaling product teams", features: ["Dedicated Cloud DB", "Custom Domains", "Priority Gemini AI"] },
  ];

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-6 text-center">
      <div className="space-y-2">
        <h3 className="text-2xl font-extrabold text-white">{node.text || "Simple, Transparent Pricing"}</h3>
        <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-black/50 border border-white/10">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              !yearly ? "bg-orange-600 text-white" : "text-stone-400 hover:text-white"
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              yearly ? "bg-orange-600 text-white" : "text-stone-400 hover:text-white"
            }`}
          >
            Yearly (Save 20%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        {plans.map((p) => {
          const price = yearly ? Math.round(p.monthly * 0.8) : p.monthly;
          return (
            <div
              key={p.name}
              className={`p-5 rounded-2xl border flex flex-col justify-between ${
                p.popular
                  ? "bg-orange-600/10 border-orange-500/60 shadow-xl"
                  : "bg-black/40 border-white/10"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{p.name}</span>
                  {p.popular && (
                    <span className="text-[10px] font-bold uppercase text-orange-400">Most Popular</span>
                  )}
                </div>
                <p className="text-xs text-stone-400">{p.desc}</p>
                <div className="pt-1">
                  <span className="text-3xl font-extrabold text-white">${price}</span>
                  <span className="text-xs text-stone-400"> / month</span>
                </div>
                <ul className="space-y-1.5 pt-2 text-xs text-stone-300">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-orange-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className={`mt-5 w-full py-2.5 rounded-xl text-xs font-bold transition ${
                  p.popular
                    ? "bg-orange-600 hover:bg-orange-500 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                Choose {p.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 9. Interactive FAQ Accordion Widget
export function FaqWidget({ node }: { node: BNode }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const items = node.faqItems || [
    { q: "Can I upload my own ZIP file with HTML, CSS & Backend?", a: "Yes! Upload any .zip archive and Canvas preserves all your backend files while letting you visually edit HTML & CSS." },
    { q: "Does it export clean React & Tailwind code?", a: "Absolutely. Open the Code Inspector to copy or download production-ready React (.tsx), Next.js, or standalone HTML." },
    { q: "Where do form submissions get saved?", a: "All form submissions are automatically saved to both the Node/Express backend and your Firebase Cloud Firestore database." },
  ];

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-3 text-left">
      <h3 className="text-xl font-bold text-white mb-4">{node.text || "Frequently Asked Questions"}</h3>
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className="rounded-xl bg-black/40 border border-white/10 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full px-4 py-3.5 text-left flex items-center justify-between text-xs font-bold text-white hover:bg-white/5 transition"
            >
              <span>{item.q}</span>
              <ChevronDown
                size={15}
                className={`text-orange-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-3.5 text-xs text-stone-300 leading-relaxed border-t border-white/5 pt-2.5">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// 10. Interactive Price / Quote Calculator Widget
export function CalculatorWidget({ node }: { node: BNode }) {
  const [pagesCount, setPagesCount] = useState(5);
  const [includeEcommerce, setIncludeEcommerce] = useState(true);
  const [includeAiSeo, setIncludeAiSeo] = useState(true);

  const total = pagesCount * 80 + (includeEcommerce ? 350 : 0) + (includeAiSeo ? 200 : 0);

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-4 text-left">
      <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
        <Calculator size={14} />
        <span>Instant Quote Estimator</span>
      </div>
      <h3 className="text-xl font-bold text-white">{node.text || "Interactive Project Cost Calculator"}</h3>

      <div className="space-y-3 pt-2">
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-stone-300">Number of Website Pages</span>
            <span className="text-orange-400 font-mono">{pagesCount} Pages (${pagesCount * 80})</span>
          </div>
          <input
            type="range"
            min={1}
            max={25}
            value={pagesCount}
            onChange={(e) => setPagesCount(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
          <span className="text-xs font-medium text-stone-200">E-Commerce Store & Checkout (+$350)</span>
          <input
            type="checkbox"
            checked={includeEcommerce}
            onChange={(e) => setIncludeEcommerce(e.target.checked)}
            className="accent-orange-500 w-4 h-4"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
          <span className="text-xs font-medium text-stone-200">AI SEO & Speed Optimization (+$200)</span>
          <input
            type="checkbox"
            checked={includeAiSeo}
            onChange={(e) => setIncludeAiSeo(e.target.checked)}
            className="accent-orange-500 w-4 h-4"
          />
        </label>
      </div>

      <div className="p-4 rounded-xl bg-orange-600/15 border border-orange-500/40 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-stone-300 block">Estimated Project Investment</span>
          <span className="text-2xl font-extrabold text-white">${total}</span>
        </div>
        <span className="text-xs font-semibold text-orange-400">Instant Estimate</span>
      </div>
    </div>
  );
}

// 11. Interactive Tabs Widget
export function TabsWidget({ node }: { node: BNode }) {
  const [active, setActive] = useState(0);
  const tabs = node.tabItems || [
    { label: "Visual Builder", title: "Real-Time Drag & Drop Canvas", content: "Click any element to customize typography, gradients, glassmorphism, animations, and responsive breakpoints in real time." },
    { label: "Full-Stack ZIP", title: "Built-In ZIP File Explorer & Backend Sync", content: "Inspect and edit index.html, style.css, and server.ts directly inside the built-in IDE sidebar and sync backend routes with AI." },
    { label: "Cloud & Export", title: "1-Click Live Link & React/Next.js Export", content: "Save projects to Firebase Cloud, share a live URL with clients, or export clean React + Tailwind (.tsx) components." },
  ];

  const current = tabs[active] || tabs[0];

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-4 text-left">
      <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
        {tabs.map((t, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition ${
              active === i ? "bg-orange-600 text-white" : "text-stone-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-5 rounded-xl bg-black/30 border border-white/10 space-y-2">
        <h4 className="text-base font-bold text-white">{current.title}</h4>
        <p className="text-xs text-stone-300 leading-relaxed">{current.content}</p>
      </div>
    </div>
  );
}

// 12. Interactive Popup Modal Trigger Widget (Supports Click, Timed & Exit-Intent)
export function PopupWidget({ node }: { node: BNode }) {
  const [open, setOpen] = useState(false);
  const trigger = node.popupTrigger || "click";
  const delaySec = node.popupDelaySeconds ?? 5;

  useEffect(() => {
    if (trigger === "timed") {
      const t = setTimeout(() => setOpen(true), delaySec * 1000);
      return () => clearTimeout(t);
    }
    if (trigger === "exit") {
      const onMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 12) {
          setOpen(true);
        }
      };
      document.addEventListener("mouseleave", onMouseLeave);
      return () => document.removeEventListener("mouseleave", onMouseLeave);
    }
  }, [trigger, delaySec]);

  return (
    <div onClick={(e) => e.stopPropagation()} className="inline-block">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="py-3 px-6 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-950/50 flex items-center gap-2 mx-auto"
      >
        <Sparkles size={14} />
        <span>{node.text || "🎁 Claim 30% Launch Discount"}</span>
        {trigger !== "click" && (
          <span className="px-1.5 py-0.5 rounded bg-black/30 text-[9px] uppercase font-mono">
            {trigger === "exit" ? "Exit-Intent" : `${delaySec}s Timed`}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1c1917] border border-orange-500/40 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <h4 className="text-lg font-extrabold text-white">
              {node.popupTitle || "Unlock 30% Off Your First Year!"}
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              {node.popupText || "Use code CANVAS30 at checkout or enter your email below to claim your instant discount."}
            </p>
            <div className="p-2.5 rounded-lg bg-black/50 border border-orange-500/30 font-mono text-sm font-bold text-orange-400">
              PROMO CODE: CANVAS30
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
            >
              Apply Discount Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 13. Floating WhatsApp / Quick Contact Button Widget
export function WhatsAppWidget({ node }: { node: BNode }) {
  const phone = (node.whatsappNumber || "919876543210").replace(/[^0-9]/g, "");
  const msg = node.whatsappMessage || "Hi! I visited your website and would like to know more.";
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  return (
    <div onClick={(e) => e.stopPropagation()} className="inline-flex items-center justify-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="py-3 px-5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 inline-flex items-center gap-2 transition"
      >
        <MessageCircle size={16} />
        <span>{node.text || "Chat with Us on WhatsApp"}</span>
      </a>
    </div>
  );
}

// 14. Dynamic Blog & CMS Collections Grid Widget
export function BlogCmsWidget({ node }: { node: BNode }) {
  const collection = node.cmsCollection || "blog";
  const [items, setItems] = useState<any[]>([]);
  const [activeArticle, setActiveArticle] = useState<any | null>(null);

  useEffect(() => {
    fetch(`/api/cms/items?collection=${collection}`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.items)) setItems(d.items);
      })
      .catch(() => {});
  }, [collection]);

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-6 text-left">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400">
            Dynamic CMS Collection • {collection.toUpperCase()}
          </span>
          <h3 className="text-2xl font-extrabold text-white mt-0.5">
            {node.text ||
              (collection === "portfolio"
                ? "Featured Client Case Studies"
                : collection === "team"
                ? "Meet Our Leadership Team"
                : "Latest Insights & Articles")}
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-stone-300 font-medium">
          {items.length} Published Entries
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-orange-500/40 transition group"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-stone-900">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-sm text-orange-400 text-[10px] font-bold uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <span>{item.author}</span>
                  <span>•</span>
                  <span>{item.readTime}</span>
                </div>
                <h4 className="text-base font-bold text-white leading-snug">{item.title}</h4>
                <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">{item.excerpt}</p>
              </div>
            </div>

            <div className="px-5 pb-4 pt-2 flex items-center justify-between border-t border-white/5">
              <div className="flex flex-wrap gap-1">
                {(item.tags || []).slice(0, 3).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-stone-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(item)}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <BookOpen size={13} />
                <span>Read Full →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#18181b] border border-stone-700 rounded-2xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col">
            <div className="relative h-56 bg-stone-900 shrink-0">
              <img
                src={activeArticle.coverImage}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase">
                <span>{activeArticle.category}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">{activeArticle.title}</h3>
              <p className="text-xs text-stone-400">
                By {activeArticle.author} • Published {activeArticle.publishedAt}
              </p>
              <div className="text-sm text-stone-200 leading-relaxed whitespace-pre-line pt-2 border-t border-stone-800">
                {activeArticle.content || activeArticle.excerpt}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 15. Live Dark / Light Mode Toggle Block for Website Visitors
export function ThemeToggleWidget({ node }: { node: BNode }) {
  const [isDark, setIsDark] = useState(true);

  const toggleVisitorTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const frame = document.querySelector(".bld-frame") as HTMLElement | null;
    const rootSec = frame?.querySelector('[data-builder-node="root"]') as HTMLElement | null;
    if (rootSec) {
      rootSec.style.transition = "background 0.3s ease, color 0.3s ease, filter 0.3s ease";
      if (!nextDark) {
        rootSec.style.filter = "invert(0.92) hue-rotate(180deg)";
      } else {
        rootSec.style.filter = "none";
      }
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="inline-flex items-center justify-center">
      <button
        type="button"
        onClick={toggleVisitorTheme}
        className="px-4 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs font-bold text-stone-100 flex items-center gap-2.5 shadow-lg transition"
      >
        {isDark ? (
          <>
            <Sun size={15} className="text-amber-400" />
            <span>{node.text || "Switch to Light Mode"}</span>
          </>
        ) : (
          <>
            <Moon size={15} className="text-sky-400" />
            <span>Switch to Dark Mode</span>
          </>
        )}
      </button>
    </div>
  );
}

// 16. Custom Icon & SVG Badge Widget
const ICON_MAP: Record<string, React.ElementType> = {
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
};

export function IconBadgeWidget({ node }: { node: BNode }) {
  const IconComp = ICON_MAP[node.iconName || "ShieldCheck"] || ShieldCheck;
  const accent = node.iconColor || "#f97316";
  const badgeStyle = node.iconBadgeStyle || "pill";

  if (badgeStyle === "circle") {
    return (
      <div className="inline-flex flex-col items-center gap-2">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/10"
          style={{ backgroundColor: `${accent}22`, color: accent }}
        >
          <IconComp size={28} />
        </div>
        {node.text && <span className="text-xs font-bold text-stone-200">{node.text}</span>}
      </div>
    );
  }

  if (badgeStyle === "seal") {
    return (
      <div
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border-2 shadow-lg"
        style={{ borderColor: accent, backgroundColor: `${accent}15` }}
      >
        <IconComp size={18} style={{ color: accent }} />
        <span className="text-xs font-extrabold uppercase tracking-wider text-white">
          {node.text || "100% Verified Badge"}
        </span>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-black/50 backdrop-blur-md shadow"
    >
      <IconComp size={15} style={{ color: accent }} />
      <span className="text-xs font-semibold text-white">
        {node.text || "Verified Enterprise Security"}
      </span>
    </div>
  );
}

// 17. Embeddable AI Customer Support Chatbot & Smart Lead Capture Widget
export function AiChatbotWidget({ node }: { node: BNode }) {
  const botName = node.botName || "Canvas AI Support";
  const welcome =
    node.botWelcome ||
    "नमस्ते! 👋 मैं आपका AI असिस्टेंट हूँ। हमारे प्रोडक्ट्स, प्राइसिंग या सर्विसेज़ के बारे में कुछ भी पूछें!";
  const accent = node.iconColor || "#f97316";

  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: welcome },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);

  const sendMessage = async (customText?: string) => {
    const q = (customText ?? input).trim();
    if (!q || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/visitor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          botName,
          botContext: node.botContext,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            data.reply ||
            "धन्यवाद! हमारी टीम आपकी पूरी सहायता करेगी। आप नीचे अपना ईमेल भी छोड़ सकते हैं।",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Thanks for reaching out! Please share your email below for priority assistance." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;
    await fetch("/api/forms/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: leadEmail.split("@")[0] || "Chat Visitor",
        email: leadEmail.trim(),
        message: `[AI CHATBOT LEAD] Last inquiry: ${messages[messages.length - 1]?.text || "General Support"}`,
        page: "AI Support Chatbot",
      }),
    });
    setLeadSaved(true);
    setLeadEmail("");
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "✅ आपका ईमेल सेव हो गया है! हमारी टीम जल्द ही आपसे संपर्क करेगी।" },
    ]);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full rounded-2xl bg-[#141417] border border-white/15 shadow-2xl overflow-hidden text-left"
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between text-white"
        style={{ background: `linear-gradient(135deg, ${accent} 0%, #9a3412 100%)` }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-black/25 flex items-center justify-center">
            <Sparkles size={15} />
          </div>
          <div>
            <div className="text-xs font-extrabold leading-none">{botName}</div>
            <div className="text-[10px] text-white/80 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" /> Online • Instant AI Reply
            </div>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-black/25 text-[10px] font-mono">24/7 AI</span>
      </div>

      {/* Chat Messages */}
      <div className="p-4 space-y-2.5 max-h-60 overflow-y-auto bg-[#0c0c0e]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-orange-600 text-white rounded-br-xs"
                  : "bg-stone-800/90 text-stone-100 border border-white/10 rounded-bl-xs"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-[11px] text-stone-400 italic px-2">AI is typing...</div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-[#141417] border-t border-white/5 flex flex-wrap gap-1.5">
        {["Pricing & Plans?", "Book a Free Demo", "क्या सर्विसेज़ मिलती हैं?"].map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => sendMessage(q)}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-stone-300 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Smart Lead Capture Bar inside Chatbot */}
      {!leadSaved && (
        <form
          onSubmit={handleCaptureLead}
          className="px-3 py-2 bg-stone-900/90 border-t border-white/10 flex items-center gap-2"
        >
          <input
            type="email"
            value={leadEmail}
            onChange={(e) => setLeadEmail(e.target.value)}
            placeholder="Drop email for instant quote / callback..."
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder:text-stone-500"
          />
          <button
            type="submit"
            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shrink-0"
          >
            Save Lead
          </button>
        </form>
      )}

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-2.5 bg-[#18181b] border-t border-white/10 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about our products or pricing..."
          className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 rounded-xl text-white transition shrink-0"
          style={{ backgroundColor: accent }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}

// 18. Interactive Before / After Image Comparison Slider Widget
export function BeforeAfterWidget({ node }: { node: BNode }) {
  const [sliderPos, setSliderPos] = useState(50);
  const beforeImg =
    node.beforeImage ||
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80";
  const afterImg =
    node.afterImage ||
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80";

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-3 text-left select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">
          {node.text || "Drag Slider to Compare: Before vs After Redesign"}
        </h3>
        <span className="text-xs font-mono text-orange-400">{sliderPos}% Split</span>
      </div>

      <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-white/15 bg-stone-950 shadow-2xl">
        {/* After Image (Full background) */}
        <img
          src={afterImg}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-orange-600/90 text-white text-[10px] font-bold uppercase tracking-wider shadow">
          {node.afterLabel || "AFTER (Canvas Pro)"}
        </span>

        {/* Before Image (Clipped by sliderPos) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={beforeImg}
            alt="Before"
            className="w-full h-full object-cover filter grayscale contrast-75"
          />
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-black/80 text-stone-200 text-[10px] font-bold uppercase tracking-wider border border-white/15">
            {node.beforeLabel || "BEFORE (Old Layout)"}
          </span>
        </div>

        {/* Vertical Divider Line & Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-orange-500 shadow-[0_0_15px_#f97316] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-9 h-9 rounded-full bg-orange-600 border-2 border-white text-white flex items-center justify-center shadow-xl absolute top-1/2 -translate-y-1/2 -translate-x-1/2">
            <ChevronLeft size={13} />
            <ChevronRight size={13} />
          </div>
        </div>

        {/* Interactive Range Input Overlay */}
        <input
          type="range"
          min={5}
          max={95}
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />
      </div>
    </div>
  );
}

// 19. Infinite Logo / Testimonial Marquee Ticker Widget
export function MarqueeWidget({ node }: { node: BNode }) {
  const items =
    node.marqueeItems && node.marqueeItems.length > 0
      ? node.marqueeItems
      : [
          "⚡ STRIPE STUDIO",
          "🚀 VERCEL CLOUD",
          "💎 LINEAR DESIGN",
          "🔥 SHOPIFY PLUS",
          "✨ FRAMER PRO",
          "🌐 CLOUDFLARE EDGE",
        ];

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full overflow-hidden py-3">
      {node.text && (
        <div className="text-[11px] font-mono uppercase tracking-widest text-stone-400 text-center mb-3">
          {node.text}
        </div>
      )}
      <div className="flex items-center justify-around gap-4 flex-wrap">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-extrabold tracking-wider text-stone-200 flex items-center gap-2 shadow-sm hover:border-orange-500/50 hover:text-orange-400 transition"
          >
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 20. 3D Perspective Tilt Card & Interactive Spotlight Hero Widget
export function TiltCardWidget({ node }: { node: BNode }) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, spotX: 50, spotY: 50 });
  const accent = node.iconColor || "#f97316";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setTilt({
      rotateX,
      rotateY,
      spotX: Math.round((x / rect.width) * 100),
      spotY: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, spotX: 50, spotY: 50 });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: "transform 0.15s ease-out",
        background: `radial-gradient(circle at ${tilt.spotX}% ${tilt.spotY}%, ${accent}35 0%, #141417 70%)`,
      }}
      className="w-full p-7 rounded-3xl border border-white/15 shadow-2xl text-left space-y-4 relative overflow-hidden cursor-pointer"
    >
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white"
        style={{ backgroundColor: accent }}
      >
        <Sparkles size={12} />
        <span>{node.productBadge || "3D INTERACTIVE SPOTLIGHT"}</span>
      </span>

      <h3 className="text-2xl font-extrabold text-white leading-tight">
        {node.productTitle || "Holographic 3D Spatial Card"}
      </h3>

      <p className="text-xs text-stone-300 leading-relaxed">
        {node.text ||
          "Move your cursor across this card to experience real-time 3D perspective tilt and dynamic radial spotlight tracking."}
      </p>

      <div className="pt-2">
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white border border-white/20 bg-white/10 hover:bg-white/20 transition"
        >
          {node.formButtonText || "Explore 3D Experience →"}
        </span>
      </div>
    </div>
  );
}

// 21. Multi-Step Appointment Calendar & Time-Slot Picker Widget
export function BookingCalendarWidget({ node }: { node: BNode }) {
  const slots =
    node.bookingSlots && node.bookingSlots.length > 0
      ? node.bookingSlots
      : ["10:00 AM", "11:30 AM", "02:30 PM", "04:00 PM", "05:30 PM"];

  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [selectedSlot, setSelectedSlot] = useState(slots[0]);
  const [pkg, setPkg] = useState("1-on-1 Strategy Call ($250)");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [booked, setBooked] = useState(false);

  const handleConfirmSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail.trim()) return;
    await fetch("/api/forms/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: clientName.trim() || "Calendar Client",
        email: clientEmail.trim(),
        message: `[APPOINTMENT BOOKED] Date: ${selectedDate} at ${selectedSlot} | Package: ${pkg}`,
        page: "Booking Calendar",
        dealValue: 1200,
      }),
    });
    setBooked(true);
    setTimeout(() => setBooked(false), 4500);
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400">
            Multi-Step Appointment & Time-Slot Picker
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">
            {node.formTitle || "Schedule a 1-on-1 Strategy Session"}
          </h3>
        </div>
        <Calendar size={20} className="text-orange-400" />
      </div>

      {booked ? (
        <div className="p-5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-2">
          <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">
            Appointment Confirmed for {selectedDate} at {selectedSlot}!
          </h4>
          <p className="text-xs text-stone-300">
            Added directly to your Visual CRM Kanban Board under New Leads.
          </p>
        </div>
      ) : (
        <form onSubmit={handleConfirmSlot} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-300 mb-1">1. Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-300 mb-1">2. Consultation Type</label>
              <select
                value={pkg}
                onChange={(e) => setPkg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
              >
                <option value="1-on-1 Strategy Call ($250)">1-on-1 Strategy Call ($250)</option>
                <option value="Full-Stack Website Architecture ($950)">Full-Stack Website Architecture ($950)</option>
                <option value="Enterprise Custom Demo (Free)">Enterprise Custom Demo (Free)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-stone-300 mb-1.5">
              3. Pick Available Time Slot ({selectedDate})
            </label>
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                    selectedSlot === slot
                      ? "bg-orange-600 border-orange-500 text-white shadow-lg"
                      : "bg-black/40 border-white/10 text-stone-300 hover:border-orange-500/40"
                  }`}
                >
                  🕒 {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <input
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Your Full Name"
              className="px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
            />
            <input
              required
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="Your Email for Calendar Invite"
              className="px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg transition"
          >
            Confirm Booking ({selectedDate} • {selectedSlot}) →
          </button>
        </form>
      )}
    </div>
  );
}

// 22. Visual Data Charts Block (Bar, Line & Donut Chart)
export function DataChartWidget({ node }: { node: BNode }) {
  const [activeChart, setActiveChart] = useState<"bar" | "line" | "donut">(node.chartType || "bar");
  const data =
    node.chartData && node.chartData.length > 0
      ? node.chartData
      : [
          { label: "Jan", value: 42 },
          { label: "Feb", value: 58 },
          { label: "Mar", value: 74 },
          { label: "Apr", value: 65 },
          { label: "May", value: 89 },
          { label: "Jun", value: 96 },
        ];

  useEffect(() => {
    if (node.chartType) setActiveChart(node.chartType);
  }, [node.chartType]);

  const maxVal = Math.max(...data.map((d) => d.value), 100);
  const totalVal = data.reduce((s, d) => s + d.value, 0);

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-5 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400">
            Interactive Visual Data Analytics Block
          </span>
          <h3 className="text-xl font-extrabold text-white mt-0.5">
            {node.text || "Annual Revenue & Conversion Growth"}
          </h3>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/50 border border-white/10">
          {(["bar", "line", "donut"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveChart(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                activeChart === t
                  ? "bg-orange-600 text-white shadow"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {activeChart === "bar" && (
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
          <div className="grid grid-cols-6 gap-3 items-end h-48 pt-6">
            {data.map((item, i) => {
              const pct = Math.max(12, Math.round((item.value / maxVal) * 100));
              return (
                <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-mono font-bold text-orange-400">
                    {item.value}%
                  </span>
                  <div
                    className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-orange-600 to-amber-400 group-hover:from-orange-500 group-hover:to-amber-300 transition-all duration-300 shadow-lg"
                    style={{ height: `${pct}%` }}
                  />
                  <span className="text-xs font-semibold text-stone-300">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeChart === "line" && (
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <svg viewBox="0 0 600 180" className="w-full h-44 overflow-visible">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {(() => {
              const pts = data.map((d, idx) => {
                const x = (idx / Math.max(1, data.length - 1)) * 540 + 30;
                const y = 155 - (d.value / maxVal) * 125;
                return { x, y, ...d };
              });
              const polyPoints = pts.map((p) => `${p.x},${p.y}`).join(" ");
              const areaPoints = `30,165 ${polyPoints} 570,165`;
              return (
                <>
                  <polygon points={areaPoints} fill="url(#lineGrad)" />
                  <polyline
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3.5"
                    points={polyPoints}
                  />
                  {pts.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#ea580c" strokeWidth="3" />
                      <text x={p.x} y={p.y - 12} textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="bold">
                        {p.value}
                      </text>
                      <text x={p.x} y={175} textAnchor="middle" fill="#a8a29e" fontSize="11">
                        {p.label}
                      </text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>
      )}

      {activeChart === "donut" && (
        <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-around gap-6">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#27272a" strokeWidth="3.8" />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="#f97316"
                strokeWidth="3.8"
                strokeDasharray="68 32"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3.8"
                strokeDasharray="22 78"
                strokeDashoffset="-68"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-white">{totalVal}</span>
              <span className="text-[10px] text-stone-400 uppercase">Total Score</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {data.map((d, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                <span className="text-stone-300 font-medium">{d.label}</span>
                <span className="font-mono font-bold text-orange-400">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 23. Searchable Directory / Job Board / Real-Estate Grid Block
const DIRECTORY_ITEMS = [
  { id: 1, title: "Senior Full-Stack AI Engineer", cat: "Remote Jobs", location: "San Francisco / Remote", price: "$165k – $210k", tag: "Hiring Now" },
  { id: 2, title: "Lead Product Designer (Design Systems)", cat: "Remote Jobs", location: "London / Remote", price: "$130k – $160k", tag: "Featured" },
  { id: 3, title: "Luxury Sea-View Penthouse Suite", cat: "Real Estate", location: "Mumbai • Bandra West", price: "₹8.5 Cr", tag: "Verified Property" },
  { id: 4, title: "Modern Smart Villa with Private Pool", cat: "Real Estate", location: "Bengaluru • Whitefield", price: "₹4.2 Cr", tag: "Ready to Move" },
  { id: 5, title: "Canvas Cloud Enterprise Analytics", cat: "SaaS Tools", location: "Cloud SaaS Platform", price: "$49 / month", tag: "Top Rated" },
  { id: 6, title: "Automated CRM & Webhook Engine", cat: "SaaS Tools", location: "API & Automation", price: "$29 / month", tag: "Popular" },
];

export function DirectoryGridWidget({ node }: { node: BNode }) {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const categories = ["All", "Remote Jobs", "Real Estate", "SaaS Tools"];
  const filtered = DIRECTORY_ITEMS.filter((item) => {
    const matchesCat = activeCat === "All" || item.cat === activeCat;
    const matchesQuery =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-5 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400">
            Searchable Directory • Job Board • Real-Estate Grid
          </span>
          <h3 className="text-2xl font-extrabold text-white mt-0.5">
            {node.text || "Explore Curated Opportunities & Listings"}
          </h3>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings or city..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-stone-500"
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCat(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeCat === cat
                ? "bg-orange-600 text-white shadow"
                : "bg-white/5 text-stone-300 hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-orange-500/40 transition flex flex-col justify-between gap-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>{item.cat} · {item.location}</span>
                <span className="text-orange-400 font-semibold">{item.tag}</span>
              </div>
              <h4 className="text-base font-bold text-white">{item.title}</h4>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-sm font-extrabold text-emerald-400 font-mono">{item.price}</span>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-orange-600 text-white text-xs font-bold transition"
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 24. External REST API Data Table Block
export function ApiTableWidget({ node }: { node: BNode }) {
  const [endpoint, setEndpoint] = useState(node.apiUrl || "/api/cms/items");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApiData = async (targetUrl?: string) => {
    const urlToFetch = targetUrl || endpoint;
    setLoading(true);
    try {
      const res = await fetch(urlToFetch);
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.leads)
        ? data.leads
        : [data];
      setRows(list.slice(0, 8));
    } catch {
      setRows([
        { id: "api_1", name: "Stripe Webhook Feed", status: "200 OK", latency: "42ms" },
        { id: "api_2", name: "Inventory Sync Engine", status: "200 OK", latency: "58ms" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiData(node.apiUrl || "/api/cms/items");
  }, [node.apiUrl]);

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-4 text-left">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
            Live External REST API / JSON Data Table
          </span>
          <h3 className="text-lg font-extrabold text-white">
            {node.text || "Live External REST API Data Explorer"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="/api/cms/items"
            className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs font-mono text-sky-300 w-48"
          />
          <button
            type="button"
            onClick={() => fetchApiData()}
            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Fetch JSON</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-stone-300">
              <th className="py-2.5 px-4 font-bold">ID / Key</th>
              <th className="py-2.5 px-4 font-bold">Title / Name</th>
              <th className="py-2.5 px-4 font-bold">Category / Email</th>
              <th className="py-2.5 px-4 font-bold">Status / Meta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2.5 px-4 font-mono text-orange-400">{String(r.id || `#${i + 1}`)}</td>
                <td className="py-2.5 px-4 font-semibold text-white">{String(r.title || r.name || "API Record")}</td>
                <td className="py-2.5 px-4 text-stone-300">{String(r.category || r.email || r.collection || "JSON")}</td>
                <td className="py-2.5 px-4 text-emerald-400 font-mono">{String(r.readTime || r.stage || r.status || "Synced")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 25. Smart Sticky Header & Mobile Hamburger Menu Block
export function SmartNavbarWidget({ node }: { node: BNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const brand = node.navBrand || "CANVAS.PRO";
  const links = node.navLinks && node.navLinks.length > 0 ? node.navLinks : ["Features", "Pricing", "Case Studies", "Docs"];
  const cta = node.navCta || "Start Free Trial →";

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center shadow">
            ✦
          </div>
          <span className="text-base font-extrabold tracking-tight text-white">{brand}</span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l, idx) => (
            <a
              key={idx}
              href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={(e) => e.preventDefault()}
              className="text-xs font-medium text-stone-300 hover:text-white hover:underline underline-offset-4 transition"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition shadow"
          >
            {cta}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
            title="Toggle Mobile Hamburger Menu"
          >
            <Menu size={16} />
          </button>
        </div>
      </div>

      {/* Responsive Hamburger Drawer Preview */}
      {mobileMenuOpen && (
        <div className="mt-3 p-4 rounded-2xl bg-stone-900/95 border border-white/15 flex flex-col gap-2.5 text-left">
          {links.map((l, idx) => (
            <a
              key={idx}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="py-1.5 px-2 rounded-lg text-xs font-semibold text-stone-200 hover:bg-white/10"
            >
              {l}
            </a>
          ))}
          <button
            type="button"
            className="w-full py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold mt-1"
          >
            {cta}
          </button>
        </div>
      )}
    </div>
  );
}

// 26. Live Visitor Language Switcher Bar (EN | हिं | ES | FR | AR) & Auto RTL Support
const LANG_DICT: Record<string, { code: string; label: string; dir: "ltr" | "rtl"; sampleNotice: string }> = {
  en: { code: "EN", label: "English", dir: "ltr", sampleNotice: "🌐 Viewing site in English (LTR Layout)" },
  hi: { code: "हिं", label: "हिंदी", dir: "ltr", sampleNotice: "🇮🇳 वेबसाइट अब हिंदी भाषा में दिख रही है (LTR)" },
  es: { code: "ES", label: "Español", dir: "ltr", sampleNotice: "🇪🇸 Viendo el sitio web en Español (LTR)" },
  fr: { code: "FR", label: "Français", dir: "ltr", sampleNotice: "🇫🇷 Affichage du site en Français (LTR)" },
  ar: { code: "AR", label: "العربية (RTL)", dir: "rtl", sampleNotice: "🇸🇦 تم تفعيل وضع اللغة العربية (Right-to-Left RTL Layout)" },
};

export function LangSwitcherWidget({ node }: { node: BNode }) {
  const [activeLang, setActiveLang] = useState<string>("en");

  const applyVisitorLanguage = (langKey: string) => {
    setActiveLang(langKey);
    const info = LANG_DICT[langKey] || LANG_DICT.en;
    const frame = document.querySelector(".bld-frame") as HTMLElement | null;
    const rootSec = frame?.querySelector('[data-builder-node="root"]') as HTMLElement | null;
    if (rootSec) {
      rootSec.dir = info.dir;
    }
  };

  const current = LANG_DICT[activeLang] || LANG_DICT.en;

  return (
    <div onClick={(e) => e.stopPropagation()} className="inline-flex flex-col items-center gap-2">
      <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-stone-900/95 border border-stone-700 shadow-lg">
        <Languages size={15} className="text-orange-400 ml-2 mr-1" />
        {Object.entries(LANG_DICT).map(([k, item]) => (
          <button
            key={k}
            type="button"
            onClick={() => applyVisitorLanguage(k)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeLang === k
                ? "bg-orange-600 text-white shadow"
                : "text-stone-300 hover:text-white hover:bg-stone-800"
            }`}
          >
            {item.code} · {item.label}
          </button>
        ))}
      </div>
      <span className="text-[11px] text-stone-400">{node.text || current.sampleNotice}</span>
    </div>
  );
}

// 27. Filterable Masonry Portfolio & Lightbox Zoom Gallery
const MASONRY_PHOTOS = [
  { id: 1, title: "Spatial OS Interface", cat: "UI/UX", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80" },
  { id: 2, title: "Minimalist Luxury Packaging", cat: "Branding", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80" },
  { id: 3, title: "Architectural Light Study", cat: "Photography", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&auto=format&fit=crop&q=80" },
  { id: 4, title: "Fintech Mobile Banking App", cat: "UI/UX", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80" },
  { id: 5, title: "Artisan Coffee Identity", cat: "Branding", url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80" },
  { id: 6, title: "Editorial Portrait Series", cat: "Photography", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80" },
];

export function MasonryGalleryWidget({ node }: { node: BNode }) {
  const [cat, setCat] = useState("All");
  const [lightboxImg, setLightboxImg] = useState<typeof MASONRY_PHOTOS[0] | null>(null);

  const items = MASONRY_PHOTOS.filter((p) => cat === "All" || p.cat === cat);

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-5 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400">
            Filterable Masonry Gallery • Click Photo for Fullscreen Lightbox
          </span>
          <h3 className="text-xl font-extrabold text-white">
            {node.text || "Creative Portfolio & Visual Showcase"}
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["All", "UI/UX", "Branding", "Photography"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                cat === c ? "bg-orange-600 text-white" : "bg-white/5 text-stone-300 hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((img) => (
          <div
            key={img.id}
            onClick={() => setLightboxImg(img)}
            className="group relative h-52 rounded-2xl overflow-hidden bg-stone-900 border border-white/10 cursor-pointer"
          >
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
              <span className="text-[10px] text-orange-400 font-mono uppercase">{img.cat}</span>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{img.title}</h4>
                <Maximize2 size={14} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full bg-[#18181b] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="relative h-[60vh] bg-black">
              <img src={lightboxImg.url} alt={lightboxImg.title} className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => setLightboxImg(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-orange-400 font-mono">{lightboxImg.cat}</span>
                <h4 className="text-base font-bold text-white">{lightboxImg.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImg(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-xs font-bold text-white"
              >
                Close Lightbox
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 28. Interactive Brochure / Resume PDF Embed Viewer Block
export function PdfViewerWidget({ node }: { node: BNode }) {
  const [zoom, setZoom] = useState(100);
  const pdfUrl = node.pdfUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-3 text-left">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-black/40 p-3.5 rounded-xl border border-white/10">
        <div className="flex items-center gap-2.5">
          <FileText size={18} className="text-orange-400" />
          <div>
            <h4 className="text-sm font-bold text-white">
              {node.text || "Interactive Product Brochure & Resume PDF Viewer"}
            </h4>
            <p className="text-[10px] text-stone-400 font-mono truncate max-w-xs">{pdfUrl}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(75, z - 15))}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white"
          >
            -
          </button>
          <span className="text-xs font-mono text-stone-300">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(150, z + 15))}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white"
          >
            +
          </button>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1"
          >
            <ExternalLink size={12} />
            <span>Open / Download PDF</span>
          </a>
        </div>
      </div>

      <div className="w-full h-96 rounded-2xl overflow-hidden border border-white/15 bg-stone-950">
        <iframe
          src={pdfUrl}
          title="PDF Document Viewer"
          style={{ width: "100%", height: "100%", transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          className="border-none"
        />
      </div>
    </div>
  );
}

// 29. Interactive Image Hotspot ("Shop the Look") Block
const HOTSPOTS = [
  { id: "hs1", x: 32, y: 42, title: "Studio Pro Display 5K", price: "$1,299", desc: "Anti-reflective nano-texture glass." },
  { id: "hs2", x: 58, y: 68, title: "Wireless Mechanical Keyboard", price: "$189", desc: "Tactile switches with aluminum frame." },
  { id: "hs3", x: 76, y: 48, title: "Acoustic Desk Lamp", price: "$129", desc: "Warm ambient LED with Qi charger." },
];

export function ImageHotspotWidget({ node }: { node: BNode }) {
  const [activeSpot, setActiveSpot] = useState<string>("hs1");
  const imgUrl =
    node.src || "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&auto=format&fit=crop&q=80";

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-3 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">
          {node.text || "Interactive Shop-the-Look Studio Setup (Click + Pins)"}
        </h3>
        <span className="text-xs text-orange-400 font-mono">3 Interactive Hotspots</span>
      </div>

      <div className="relative w-full h-96 rounded-2xl overflow-hidden border border-white/15 bg-stone-950">
        <img src={imgUrl} alt="Shop the Look" className="w-full h-full object-cover" />

        {HOTSPOTS.map((spot) => {
          const isOpen = activeSpot === spot.id;
          return (
            <div
              key={spot.id}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <button
                type="button"
                onClick={() => setActiveSpot(spot.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xl transition ${
                  isOpen
                    ? "bg-orange-600 text-white ring-4 ring-orange-500/40 scale-110"
                    : "bg-white text-stone-900 hover:scale-110"
                }`}
              >
                <Plus size={15} />
              </button>

              {isOpen && (
                <div className="mt-2 w-56 p-3.5 rounded-2xl bg-[#18181b]/95 backdrop-blur-md border border-orange-500/50 shadow-2xl text-left space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">{spot.title}</span>
                    <span className="text-xs font-mono font-bold text-orange-400">{spot.price}</span>
                  </div>
                  <p className="text-[11px] text-stone-300 leading-snug">{spot.desc}</p>
                  <button
                    type="button"
                    className="w-full py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold mt-1"
                  >
                    Shop Item →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 30. Custom HTML / Iframe / Third-Party Script Embed Block
export function CustomEmbedWidget({ node }: { node: BNode }) {
  const html =
    node.embedCode ||
    `<div style="padding:24px;border-radius:16px;background:linear-gradient(135deg,#1e1b4b,#311042);color:#fff;text-align:center;font-family:sans-serif;"><h3 style="margin:0 0 8px;">⚡ Live Custom HTML / Script Embed</h3><p style="margin:0;font-size:13px;opacity:0.85;">Paste Calendly, Typeform, Spotify, YouTube, or custom HTML/JS in the Inspector panel.</p></div>`;

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full space-y-2 text-left">
      <div className="flex items-center justify-between text-xs text-stone-400">
        <span className="font-semibold text-white">{node.text || "Custom HTML / Widget Embed"}</span>
        <span className="font-mono text-[10px] text-orange-400">&lt;embed /&gt;</span>
      </div>
      <div
        className="w-full rounded-2xl overflow-hidden border border-white/10"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

