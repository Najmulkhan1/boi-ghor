"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["Fiction", "Non-Fiction", "History", "Science", "Religion", "Programming", "Novel"];

export default function BookFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // ফিল্টার চেঞ্জ করলে প্রথম পেজে নিয়ে যাবে
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/books?${params.toString()}`);
  };

  return (
    <div className="space-y-7 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm sticky top-24">
      {/* ক্যাটাগরি */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-blue-700 dark:text-blue-400">ক্যাটাগরি</h3>
        <div className="flex flex-col gap-1">
          <button 
            onClick={() => updateFilter("category", "all")}
            className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${!searchParams.get("category") ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
          >
            সব ক্যাটাগরি
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter("category", cat)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${searchParams.get("category") === cat ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-gray-100 dark:bg-gray-800" />

      {/* বইয়ের ধরন */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-blue-700 dark:text-blue-400">বইয়ের ধরন</h3>
        <RadioGroup 
          defaultValue={searchParams.get("format") || "all"} 
          onValueChange={(val) => updateFilter("format", val)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer font-medium">সব বই</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hardcopy" id="hardcopy" />
            <Label htmlFor="hardcopy" className="cursor-pointer font-medium text-gray-600 dark:text-gray-400">হার্ডকপি</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pdf" id="pdf" />
            <Label htmlFor="pdf" className="cursor-pointer font-medium text-gray-600 dark:text-gray-400">পিডিএফ (PDF)</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator className="bg-gray-100 dark:bg-gray-800" />

      {/* সর্টিং */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-blue-700 dark:text-blue-400">সর্টিং</h3>
        <select 
          className="w-full p-2.5 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
          onChange={(e) => updateFilter("sort", e.target.value)}
          value={searchParams.get("sort") || "newest"}
        >
          <option value="newest">নতুন বই</option>
          <option value="price-low">দাম: কম থেকে বেশি</option>
          <option value="price-high">দাম: বেশি থেকে কম</option>
          <option value="points-low">পয়েন্ট: কম থেকে বেশি</option>
          <option value="points-high">পয়েন্ট: বেশি থেকে কম</option>
        </select>
      </div>

      <Button 
        variant="ghost" 
        className="w-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        onClick={() => router.push("/books")}
      >
        ফিল্টার মুছুন
      </Button>
    </div>
  );
}