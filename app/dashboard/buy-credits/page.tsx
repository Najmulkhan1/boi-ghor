"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, ShieldCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BuyCreditsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const plans = [
    {
      id: "starter",
      name: "স্টার্টার প্ল্যান",
      credits: 50,
      price: 100,
      description: "নতুন পাঠকদের জন্য সেরা",
      icon: <Zap className="w-6 h-6 text-orange-500" />,
      features: ["৫-১০টি বই পড়া যাবে", "লাইফটাইম মেয়াদ", "বেসিক সাপোর্ট"],
      color: "border-orange-100 bg-orange-50/10",
    },
    {
      id: "popular",
      name: "জনপ্রিয় প্ল্যান",
      credits: 200,
      price: 350,
      description: "বইপ্রেমীদের প্রথম পছন্দ",
      icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      features: ["২০-৩০টি বই পড়া যাবে", "পিডিএফ ডাউনলোড সুবিধা", "প্রায়োরিটি সাপোর্ট", "৳৫০ সেভ হবে"],
      color: "border-blue-200 bg-blue-50/30",
      isPopular: true,
    },
    {
      id: "scholar",
      name: "স্কলার প্ল্যান",
      credits: 500,
      price: 800,
      description: "যারা নিয়মিত পড়াশোনা করেন",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      features: ["আনলিমিটেড রিডিং সুবিধা", "সব পিডিএফ ডাউনলোড", "এক্সক্লুসিভ অফার", "৳২০০ সেভ হবে"],
      color: "border-emerald-200 bg-emerald-50/10",
    },
  ];

  const handlePurchase = async (plan: any) => {
    const confirmBuy = window.confirm(`${plan.name} কিনতে আপনি কি নিশ্চিত? ৳${plan.price} চার্জ করা হবে।`);
    if (!confirmBuy) return;

    setLoading(plan.id);
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: plan.name,
          creditsToAdd: plan.credits,
          price: plan.price
        }),
      });

      if (res.ok) {
        alert(`অভিনন্দন! ${plan.credits} ক্রেডিট আপনার ওয়ালেটে যোগ করা হয়েছে।`);
        router.push("/dashboard");
        router.refresh();
      } else {
        alert("পেমেন্ট সম্পন্ন হয়নি। আবার চেষ্টা করুন।");
      }
    } catch (error) {
      alert("সার্ভার এরর।");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900">ক্রেডিট ওয়ালেট টপ-আপ</h1>
        <p className="text-slate-500">
          আপনার ক্রেডিট ওয়ালেট রিচার্জ করুন এবং বই ঘরের হাজারো ই-বুক ও পিডিএফ এর স্বাদ নিন। যত বেশি ক্রেডিট, তত বেশি সাশ্রয়!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${plan.color} ${plan.isPopular ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                সবচেয়ে জনপ্রিয়
              </div>
            )}

            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                {plan.icon}
              </div>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <p className="text-sm text-slate-500">{plan.description}</p>
            </CardHeader>

            <CardContent className="flex-grow space-y-6">
              <div className="text-center py-4">
                <span className="text-5xl font-black text-slate-900">{plan.credits}</span>
                <span className="text-slate-500 font-bold ml-2">Credits</span>
                <div className="mt-2 text-2xl font-bold text-blue-600">৳{plan.price}</div>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="flex-shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                onClick={() => handlePurchase(plan)}
                disabled={loading !== null}
                className={`w-full h-12 text-lg font-bold transition-all ${
                  plan.isPopular ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200" : "bg-slate-900 hover:bg-slate-800"
                } shadow-lg`}
              >
                {loading === plan.id ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> প্রসেসিং...</>
                ) : (
                  "এখনই কিনুন"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-blue-100 p-4 rounded-full">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">নিরাপদ পেমেন্ট গ্যারান্টি</h4>
          <p className="text-sm text-slate-500">আপনার প্রতিটি ট্রানজেকশন সম্পূর্ণ এনক্রিপ্টেড এবং সুরক্ষিত। যেকোনো সমস্যায় আমাদের সাপোর্ট টিমে যোগাযোগ করুন।</p>
        </div>
      </div>
    </div>
  );
}