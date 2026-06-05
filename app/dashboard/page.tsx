import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import UserBook from "@/models/UserBook";
import Link from "next/link";
import { Wallet, ShoppingBag, BookOpen, ArrowRight, Coins, Star, Library } from "lucide-react";

export default async function DashboardHomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  await connectToDatabase();

  const [user, totalOrders, totalDigitalBooks] = await Promise.all([
    User.findById(session.user.id).lean(),
    Order.countDocuments({ userId: session.user.id }),
    UserBook.countDocuments({ userId: session.user.id, canRead: true }),
  ]);

  if (!user) redirect("/auth/login");

  const u = user as any;

  const statCards = [
    {
      label: "আমার ক্রেডিট",
      value: u.credits ?? 0,
      suffix: "ক্রেডিট",
      desc: "ডিজিটাল বই পড়তে ব্যবহার করুন",
      icon: Coins,
      gradient: "from-indigo-500 to-violet-600",
      iconBg: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
      border: "border-indigo-500/20",
      href: "/dashboard/buy-credits",
    },
    {
      label: "ডিজিটাল লাইব্রেরি",
      value: totalDigitalBooks,
      suffix: "টি বই",
      desc: "আনলক করা মোট বইয়ের সংখ্যা",
      icon: BookOpen,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      border: "border-emerald-500/20",
      href: "/dashboard/library",
    },
    {
      label: "হার্ডকপি অর্ডার",
      value: totalOrders,
      suffix: "টি অর্ডার",
      desc: "আপনার করা মোট অর্ডার",
      icon: ShoppingBag,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      border: "border-amber-500/20",
      href: "/dashboard/orders",
    },
  ];

  const quickActions = [
    {
      icon: Library,
      iconBg: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
      title: "বই পড়া চালিয়ে যান",
      desc: "আপনার লাইব্রেরিতে থাকা ডিজিটাল বইগুলো পড়ুন",
      href: "/dashboard/library",
      label: "লাইব্রেরি দেখুন",
    },
    {
      icon: ShoppingBag,
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      title: "অর্ডার ট্র্যাক করুন",
      desc: "আপনার হার্ডকপি বইয়ের ডেলিভারি স্ট্যাটাস জানুন",
      href: "/dashboard/orders",
      label: "অর্ডার দেখুন",
    },
    {
      icon: Coins,
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      title: "ক্রেডিট রিচার্জ করুন",
      desc: "আরও ডিজিটাল বই পড়তে ক্রেডিট কিনুন",
      href: "/dashboard/buy-credits",
      label: "ক্রেডিট কিনুন",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-extrabold text-white mb-1">
            স্বাগতম, {u.name}! 👋
          </h1>
          <p className="text-slate-400 text-sm">
            আপনার ড্যাশবোর্ড থেকে বই পড়া, অর্ডার ট্র্যাকিং এবং ক্রেডিট ম্যানেজ করুন।
          </p>
        </div>
        <Star className="absolute right-6 bottom-4 w-24 h-24 text-indigo-400/10" />
      </div>

      {/* Stats Cards */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">আপনার সারসংক্ষেপ</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                href={card.href}
                className={`group bg-slate-900 rounded-2xl border ${card.border} p-6 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 transition-all duration-200`}
              >
                <div className={`w-11 h-11 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white leading-none">{card.value}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">{card.suffix}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-300">{card.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{card.desc}</p>
                </div>
                <div className={`h-0.5 w-full rounded-full bg-gradient-to-r ${card.gradient} opacity-40 group-hover:opacity-80 transition-opacity`} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">কুইক অ্যাকশন</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-slate-700 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${action.iconBg} ${action.iconColor} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{action.title}</h3>
                  <p className="text-slate-500 text-xs">{action.desc}</p>
                </div>
                <Link
                  href={action.href}
                  className="mt-auto flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
                >
                  {action.label}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}