"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { BD_LOCATIONS, getDistricts, getUpazilas } from "@/lib/bd-locations";
import {
  MapPin, Home, Briefcase, Loader2, CheckCircle2, ChevronDown,
  Pencil, X, ShoppingBag, Truck, CreditCard, Star, Package, Phone, Mail, User
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface AddressForm {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  division: string;
  district: string;
  upazila: string;
  postalCode: string;
}

const EMPTY_FORM: AddressForm = {
  fullName: "", phone: "", email: "",
  addressLine1: "", division: "", district: "", upazila: "", postalCode: "",
};

// ── Custom Select ───────────────────────────────────────────────────────────
function CustomSelect({
  id, label, value, options, placeholder, onChange, disabled = false,
}: {
  id: string; label: string; value: string; options: string[];
  placeholder: string; onChange: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label} <span className="text-rose-500">*</span>
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required
          className={`w-full h-12 pl-4 pr-10 rounded-xl border-2 appearance-none cursor-pointer text-sm font-medium transition-all duration-200 outline-none
            ${disabled
              ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900"
            }`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ── Field Input ─────────────────────────────────────────────────────────────
function FieldInput({
  id, label, value, onChange, type = "text", required = true, icon: Icon, placeholder = "",
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; type?: string; required?: boolean;
  icon?: React.ElementType; placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        )}
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-medium transition-all duration-200 outline-none hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 ${Icon ? "pl-10 pr-4" : "px-4"}`}
        />
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, clearCart } = useCartStore();

  const [isMounted, setIsMounted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);

  // Cascading dropdown state
  const districts = form.division ? getDistricts(form.division) : [];
  const upazilas = form.division && form.district ? getUpazilas(form.division, form.district) : [];

  const handleFormChange = useCallback((field: keyof AddressForm, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "division") { updated.district = ""; updated.upazila = ""; }
      if (field === "district") { updated.upazila = ""; }
      return updated;
    });
    setSelectedAddressId(null); // unlink from saved address when manually editing
  }, []);

  const applyAddress = useCallback((addr: any) => {
    setSelectedAddressId(addr._id);
    setForm({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      email: session?.user?.email || "",
      addressLine1: addr.addressLine1 || "",
      division: addr.division || "",
      district: addr.district || addr.city || "",
      upazila: addr.upazila || "",
      postalCode: addr.postalCode || "",
    });
  }, [session?.user?.email]);

  useEffect(() => {
    setIsMounted(true);
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/checkout");
      return;
    }
    if (status === "authenticated") {
      setForm((prev) => ({ ...prev, email: session?.user?.email || "" }));
      fetch("/api/user/addresses")
        .then((r) => r.json())
        .then((data) => {
          if (data.addresses?.length) {
            setSavedAddresses(data.addresses);
            const def = data.addresses.find((a: any) => a.isDefault) ?? data.addresses[0];
            if (def) applyAddress(def);
          }
        })
        .catch(console.error);
    }
  }, [status, router, session, applyAddress]);

  if (!isMounted || status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 animate-spin" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  const shippingFee = 60;
  const totalAmount = subtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: form,
          paymentMethod,
          subtotal,
          shippingFee,
          totalAmount,
        }),
      });
      if (res.ok) {
        clearCart();
        router.push("/dashboard/orders");
      } else {
        const data = await res.json();
        alert(data.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে।");
      }
    } catch {
      alert("সার্ভার এরর!");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 py-10">
        {/* decorative blobs */}
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-8 w-44 h-44 bg-white/5 rounded-full blur-2xl" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <p className="text-indigo-200 text-sm font-medium tracking-wide">বই ঘর</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-1">চেকআউট</h1>
          <p className="text-indigo-200 text-sm">{items.length}টি আইটেম · মোট ৳{totalAmount}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* ── Saved Addresses Strip ── */}
        {savedAddresses.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">সেভ করা ঠিকানা</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {savedAddresses.map((addr) => {
                const isActive = selectedAddressId === addr._id;
                return (
                  <button
                    key={addr._id}
                    type="button"
                    onClick={() => applyAddress(addr)}
                    className={`relative flex-shrink-0 w-52 text-left rounded-2xl border-2 p-4 transition-all duration-200 cursor-pointer group
                      ${isActive
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-300 hover:shadow-md"
                      }`}
                  >
                    {/* default badge */}
                    {addr.isDefault && (
                      <span className="absolute top-2 right-2 flex items-center gap-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                        <Star className="w-2.5 h-2.5 fill-current" /> ডিফল্ট
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 mb-2">
                      {addr.label?.toLowerCase().includes("অফিস") || addr.label?.toLowerCase().includes("office")
                        ? <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                        : <Home className="w-3.5 h-3.5 text-indigo-500" />
                      }
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                        {addr.label || "ঠিকানা"}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{addr.fullName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {addr.district || addr.city}{addr.division ? `, ${addr.division}` : ""}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{addr.phone}</p>
                    {isActive && (
                      <div className="absolute bottom-2.5 right-2.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 fill-indigo-100 dark:fill-indigo-900" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── Left Column ── */}
          <div className="lg:col-span-8 space-y-5">

            {/* Delivery Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              {/* card header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white text-sm">ডেলিভারি তথ্য</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">সঠিক ঠিকানা দিন যেখানে বই পৌঁছাবে</p>
                  </div>
                </div>
                {selectedAddressId && (
                  <button
                    type="button"
                    onClick={() => { setSelectedAddressId(null); setForm(EMPTY_FORM); }}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3 h-3" /> সাফ করুন
                  </button>
                )}
              </div>

              <div className="p-6 space-y-5">
                {/* row 1: name + phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FieldInput id="fullName" label="সম্পূর্ণ নাম" value={form.fullName}
                    onChange={(v) => handleFormChange("fullName", v)}
                    icon={User} placeholder="আপনার পুরো নাম" />
                  <FieldInput id="phone" label="মোবাইল নাম্বার" value={form.phone}
                    onChange={(v) => handleFormChange("phone", v)}
                    icon={Phone} placeholder="০১XXXXXXXXX" />
                </div>

                {/* row 2: email */}
                <FieldInput id="email" label="ইমেইল" type="email" value={form.email}
                  onChange={(v) => handleFormChange("email", v)}
                  icon={Mail} placeholder="email@example.com" />

                {/* row 3: division / district / upazila */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <CustomSelect
                    id="division" label="বিভাগ" value={form.division}
                    options={BD_LOCATIONS.map((d) => d.name)}
                    placeholder="বিভাগ বেছে নিন"
                    onChange={(v) => handleFormChange("division", v)}
                  />
                  <CustomSelect
                    id="district" label="জেলা" value={form.district}
                    options={districts.map((d) => d.name)}
                    placeholder={form.division ? "জেলা বেছে নিন" : "আগে বিভাগ বাছুন"}
                    onChange={(v) => handleFormChange("district", v)}
                    disabled={!form.division}
                  />
                  <CustomSelect
                    id="upazila" label="উপজেলা" value={form.upazila}
                    options={upazilas}
                    placeholder={form.district ? "উপজেলা বেছে নিন" : "আগে জেলা বাছুন"}
                    onChange={(v) => handleFormChange("upazila", v)}
                    disabled={!form.district}
                  />
                </div>

                {/* row 4: addressLine1 + postalCode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <FieldInput id="addressLine1" label="বিস্তারিত ঠিকানা (বাসা/রোড/এলাকা)"
                      value={form.addressLine1}
                      onChange={(v) => handleFormChange("addressLine1", v)}
                      icon={MapPin} placeholder="বাসা নং, রোড নং, এলাকার নাম" />
                  </div>
                  <FieldInput id="postalCode" label="পোস্টাল কোড" value={form.postalCode}
                    required={false}
                    onChange={(v) => handleFormChange("postalCode", v)}
                    placeholder="যেমন: 1207" />
                </div>

                {/* Selected address tag */}
                {selectedAddressId && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                      সেভ করা ঠিকানা থেকে অটো-ফিল হয়েছে। সরাসরি এডিট করুন বা উপরে অন্য ঠিকানা বাছুন।
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">পেমেন্ট মেথড</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">কীভাবে পেমেন্ট করবেন বেছে নিন</p>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { value: "cod", label: "ক্যাশ অন ডেলিভারি", sub: "বই পেলে টাকা দিন", emoji: "💵" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPaymentMethod(opt.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left
                      ${paymentMethod === opt.value
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                        : "border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                      }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{opt.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{opt.sub}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${paymentMethod === opt.value
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-slate-300 dark:border-slate-600"
                      }`}>
                      {paymentMethod === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 rounded-3xl overflow-hidden shadow-2xl">
              {/* gradient header */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-indigo-400" />
                  <h2 className="font-bold text-white">অর্ডার সামারি</h2>
                </div>

                {/* items list */}
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1 custom-scrollbar mb-4">
                  {items.map((item) => (
                    <div key={item.bookId} className="flex gap-3 items-start">
                      {item.coverImage && (
                        <img src={item.coverImage} alt={item.title}
                          className="w-9 h-12 object-cover rounded-lg flex-shrink-0 opacity-90" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{item.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.quantity}x · ৳{item.price}</p>
                      </div>
                      <span className="text-sm font-bold text-white whitespace-nowrap">৳{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-700/50 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">সাবটোটাল</span>
                    <span className="font-semibold text-white">৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">শিপিং চার্জ</span>
                    <span className="font-semibold text-white">৳{shippingFee}</span>
                  </div>
                  <div className="border-t border-slate-700/50 pt-3 flex justify-between items-center">
                    <span className="font-bold text-white">সর্বমোট</span>
                    <span className="text-2xl font-black text-indigo-400">৳{totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* CTA button */}
              <div className="bg-slate-900 p-5 pt-0">
                <button
                  type="submit"
                  disabled={placing || items.length === 0}
                  className="w-full relative overflow-hidden h-14 rounded-2xl font-black text-base text-white transition-all duration-300
                    bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500
                    shadow-lg shadow-indigo-900/50 hover:shadow-xl hover:shadow-indigo-900/60
                    disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {placing
                      ? <><Loader2 className="animate-spin w-5 h-5" /> প্রসেস হচ্ছে...</>
                      : <><CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> অর্ডার কনফার্ম করুন</>
                    }
                  </span>
                  {/* shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </button>
                <p className="text-center text-[11px] text-slate-600 mt-3 flex items-center justify-center gap-1">
                  🔒 আপনার তথ্য সম্পূর্ণ নিরাপদ
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}