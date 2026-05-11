"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MapPin, Phone, Trash2, Plus, Loader2, Home, User, Edit } from "lucide-react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null); // এডিট করার জন্য নতুন স্টেট

  const [formData, setFormData] = useState({
    label: "বাসা",
    fullName: "",
    phone: "",
    addressLine1: "",
    postalCode: "",
    isDefault: false,
  });

  const [divisions, setDivisions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [upazilas, setUpazilas] = useState<string[]>([]);

  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
    fetch("https://bdapis.com/api/v1.1/divisions")
      .then((res) => res.json())
      .then((data) => setDivisions(data.data))
      .catch((err) => console.error("Failed to load divisions", err));
  }, []);

  // বিভাগ পরিবর্তন হলে জেলা আনা
  useEffect(() => {
    if (selectedDivision) {
      setLocLoading(true);
      fetch(`https://bdapis.com/api/v1.1/division/${selectedDivision}`)
        .then((res) => res.json())
        .then((data) => {
          setDistricts(data.data);
          setLocLoading(false);
        });
    } else {
      setDistricts([]);
    }
  }, [selectedDivision]);

  // জেলা পরিবর্তন হলে উপজেলা সেট করা
  useEffect(() => {
    if (selectedDistrict && districts.length > 0) {
      const distData = districts.find((d) => d.district === selectedDistrict);
      setUpazilas(distData ? distData.upazilla : []);
    } else {
      setUpazilas([]);
    }
  }, [selectedDistrict, districts]);

  const fetchAddresses = async () => {
    setLoading(true);
    const res = await fetch("/api/user/addresses");
    if (res.ok) {
      const data = await res.json();
      setAddresses(data.addresses);
    }
    setLoading(false);
  };

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ফর্ম রিসেট করার ফাংশন
  const resetForm = () => {
    setFormData({ label: "বাসা", fullName: "", phone: "", addressLine1: "", postalCode: "", isDefault: false });
    setSelectedDivision("");
    setSelectedDistrict("");
    setSelectedUpazila("");
    setEditId(null);
    setShowForm(false);
  };

  // এডিট বাটনে ক্লিক করার লজিক
  const handleEditClick = (addr: any) => {
    // addressLine2 থেকে বিভাগ এবং উপজেলা আলাদা করা (Regex ব্যবহার করে)
    let division = "";
    let upazila = "";
    const match = addr.addressLine2?.match(/উপজেলা: (.*?), বিভাগ: (.*)/);
    if (match) {
      upazila = match[1];
      division = match[2];
    }

    setFormData({
      label: addr.label || "বাসা",
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
    });

    setSelectedDivision(division);
    setSelectedDistrict(addr.city); // ডাটাবেসে city তেই জেলা সেভ করা আছে
    
    // উপজেলা সেট করতে একটু দেরি করতে হবে কারণ জেলার API থেকে ডেটা আসতে সময় লাগে
    setTimeout(() => {
      setSelectedUpazila(upazila);
    }, 500);

    setEditId(addr._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" }); // ফর্মের কাছে নিয়ে যাবে
  };

  const handleSubmitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDivision || !selectedDistrict || !selectedUpazila) {
      return alert("অনুগ্রহ করে বিভাগ, জেলা এবং উপজেলা সিলেক্ট করুন!");
    }

    setSaving(true);
    const payload = {
      ...formData,
      city: selectedDistrict,
      addressLine2: `উপজেলা: ${selectedUpazila}, বিভাগ: ${selectedDivision}`,
    };

    // এডিট হলে PUT, নতুন হলে POST মেথড
    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/user/addresses?id=${editId}` : "/api/user/addresses";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(editId ? "ঠিকানা আপডেট হয়েছে!" : "ঠিকানা সেভ হয়েছে!");
      resetForm();
      fetchAddresses();
    } else {
      alert("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে ঠিকানাটি ডিলিট করতে চান?")) return;
    
    const res = await fetch(`/api/user/addresses?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchAddresses();
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="text-blue-600" /> আমার ঠিকানাগুলো
          </h1>
          <p className="text-gray-500 mt-1">আপনার সেভ করা ডেলিভারি অ্যাড্রেসগুলো পরিচালনা করুন</p>
        </div>
        <Button onClick={() => showForm ? resetForm() : setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 gap-2">
          {showForm ? "ক্যানসেল করুন" : <><Plus className="w-4 h-4" /> নতুন ঠিকানা যোগ করুন</>}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 border-blue-100 shadow-sm bg-blue-50/30 animate-in fade-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle>{editId ? "ঠিকানা আপডেট করুন" : "নতুন ঠিকানা যুক্ত করুন"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAddress} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="label">লেবেল (যেমন: বাসা, অফিস)</Label>
                  <Input id="label" placeholder="বাসা" value={formData.label} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">সম্পূর্ণ নাম *</Label>
                  <Input id="fullName" required placeholder="আপনার নাম" value={formData.fullName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">মোবাইল নাম্বার *</Label>
                  <Input id="phone" required placeholder="01XXX-XXXXXX" value={formData.phone} onChange={handleInputChange} />
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-700 mb-2">এরিয়া সিলেক্ট করুন *</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>বিভাগ</Label>
                    <select 
                      required
                      value={selectedDivision} 
                      onChange={(e) => { setSelectedDivision(e.target.value); setSelectedDistrict(""); setSelectedUpazila(""); }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">বিভাগ নির্বাচন করুন</option>
                      {divisions.map((div) => (
                        <option key={div._id} value={div.division}>{div.division} (বিভাগ)</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>জেলা</Label>
                    <select 
                      required
                      disabled={!selectedDivision || locLoading}
                      value={selectedDistrict} 
                      onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedUpazila(""); }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">জেলা নির্বাচন করুন</option>
                      {districts.map((dist) => (
                        <option key={dist._id} value={dist.district}>{dist.district}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>উপজেলা</Label>
                    <select 
                      required
                      disabled={!selectedDistrict || locLoading}
                      value={selectedUpazila} 
                      onChange={(e) => setSelectedUpazila(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">উপজেলা নির্বাচন করুন</option>
                      {upazilas.map((upz, idx) => (
                        <option key={idx} value={upz}>{upz}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="addressLine1">গ্রাম / রাস্তা / বাসা নং *</Label>
                  <Input id="addressLine1" required placeholder="উদাহরণ: বাড়ি #১০, রোড #৫, শান্তিনগর" value={formData.addressLine1} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">পোস্টাল কোড / জিপ কোড *</Label>
                  <Input id="postalCode" required placeholder="১২০০" value={formData.postalCode} onChange={handleInputChange} />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 py-2">
                <Switch 
                  id="isDefault" 
                  checked={formData.isDefault} 
                  onCheckedChange={(c) => setFormData({ ...formData, isDefault: c })} 
                />
                <Label htmlFor="isDefault" className="cursor-pointer font-medium text-blue-700">এটিকে আমার ডিফল্ট ঠিকানা হিসেবে সেট করুন</Label>
              </div>

              <Button type="submit" disabled={saving} className="bg-gray-900 text-white w-full md:w-auto px-8 h-12 text-lg">
                {saving ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> সেভ হচ্ছে...</> : (editId ? "আপডেট করুন" : "ঠিকানা সেভ করুন")}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((addr) => (
            <Card key={addr._id} className={`relative overflow-hidden transition-all ${addr.isDefault ? "border-blue-500 ring-2 ring-blue-500 shadow-md bg-blue-50/10" : "border-gray-200"}`}>
              {addr.isDefault && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-4 py-1 font-bold rounded-bl-xl shadow-sm">
                  ডিফল্ট
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
                  <Home className="w-5 h-5 text-gray-500" /> {addr.label || "ঠিকানা"}
                </h3>
                <div className="space-y-3 text-sm text-gray-700 mb-6 bg-gray-50 p-4 rounded-lg">
                  <p className="flex items-center gap-2 font-semibold"><User className="w-4 h-4 text-gray-400" /> {addr.fullName}</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {addr.phone}</p>
                  <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" /> 
                    <p className="leading-relaxed">
                      {addr.addressLine1} <br />
                      <span className="text-gray-500">{addr.addressLine2}</span> <br />
                      <span className="font-medium">{addr.city} - {addr.postalCode}</span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(addr)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200">
                    <Edit className="w-4 h-4 mr-1" /> এডিট
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(addr._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200">
                    <Trash2 className="w-4 h-4 mr-1" /> মুছুন
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg font-medium">আপনার কোনো ঠিকানা সেভ করা নেই!</p>
          <p className="text-gray-400 text-sm mt-1">হার্ডকপি অর্ডার করার জন্য উপরে 'নতুন ঠিকানা যোগ করুন' এ ক্লিক করুন।</p>
        </div>
      )}
    </div>
  );
}