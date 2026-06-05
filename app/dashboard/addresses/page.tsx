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
  const [editId, setEditId] = useState<string | null>(null);

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

  const resetForm = () => {
    setFormData({ label: "বাসা", fullName: "", phone: "", addressLine1: "", postalCode: "", isDefault: false });
    setSelectedDivision("");
    setSelectedDistrict("");
    setSelectedUpazila("");
    setEditId(null);
    setShowForm(false);
  };

  const handleEditClick = (addr: any) => {
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
    setSelectedDistrict(addr.city);
    
    setTimeout(() => {
      setSelectedUpazila(upazila);
    }, 500);

    setEditId(addr._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/user/addresses?id=${editId}` : "/api/user/addresses";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(editId ? "ঠিকানা আপডেট হয়েছে!" : "ঠিকানা সেভ হয়েছে!");
      resetForm();
      fetchAddresses();
    } else {
      alert("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে ঠিকানাটি ডিলিট করতে চান?")) return;
    
    const res = await fetch(`/api/user/addresses?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchAddresses();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">আমার ঠিকানাগুলো</h1>
            <p className="text-slate-500 text-sm mt-1">আপনার সেভ করা ডেলিভারি অ্যাড্রেসগুলো পরিচালনা করুন</p>
          </div>
        </div>
        <Button onClick={() => showForm ? resetForm() : setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          {showForm ? "ক্যানসেল করুন" : <><Plus className="w-4 h-4" /> নতুন ঠিকানা যোগ করুন</>}
        </Button>
      </div>

      {showForm && (
        <Card className="border-slate-800 bg-slate-900 shadow-lg animate-in fade-in slide-in-from-top-4">
          <CardHeader className="border-b border-slate-800 bg-slate-800/50">
            <CardTitle className="text-white">{editId ? "ঠিকানা আপডেট করুন" : "নতুন ঠিকানা যুক্ত করুন"}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmitAddress} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="label" className="text-slate-300">লেবেল (যেমন: বাসা, অফিস)</Label>
                  <Input id="label" placeholder="বাসা" value={formData.label} onChange={handleInputChange} className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-300">সম্পূর্ণ নাম *</Label>
                  <Input id="fullName" required placeholder="আপনার নাম" value={formData.fullName} onChange={handleInputChange} className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">মোবাইল নাম্বার *</Label>
                  <Input id="phone" required placeholder="01XXX-XXXXXX" value={formData.phone} onChange={handleInputChange} className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>

              <div className="p-5 border border-slate-800 rounded-xl bg-slate-800/30 space-y-4">
                <h3 className="font-semibold text-white mb-2">এরিয়া সিলেক্ট করুন *</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs">বিভাগ</Label>
                    <select 
                      required
                      value={selectedDivision} 
                      onChange={(e) => { setSelectedDivision(e.target.value); setSelectedDistrict(""); setSelectedUpazila(""); }}
                      className="w-full text-sm rounded-lg p-2.5 h-10 bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="">বিভাগ নির্বাচন করুন</option>
                      {divisions.map((div) => (
                        <option key={div._id} value={div.division}>{div.division}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs">জেলা</Label>
                    <select 
                      required
                      disabled={!selectedDivision || locLoading}
                      value={selectedDistrict} 
                      onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedUpazila(""); }}
                      className="w-full text-sm rounded-lg p-2.5 h-10 bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
                    >
                      <option value="">জেলা নির্বাচন করুন</option>
                      {districts.map((dist) => (
                        <option key={dist._id} value={dist.district}>{dist.district}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs">উপজেলা</Label>
                    <select 
                      required
                      disabled={!selectedDistrict || locLoading}
                      value={selectedUpazila} 
                      onChange={(e) => setSelectedUpazila(e.target.value)}
                      className="w-full text-sm rounded-lg p-2.5 h-10 bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
                    >
                      <option value="">উপজেলা নির্বাচন করুন</option>
                      {upazilas.map((upz, idx) => (
                        <option key={idx} value={upz}>{upz}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="addressLine1" className="text-slate-300">গ্রাম / রাস্তা / বাসা নং *</Label>
                  <Input id="addressLine1" required placeholder="উদাহরণ: বাড়ি #১০, রোড #৫, শান্তিনগর" value={formData.addressLine1} onChange={handleInputChange} className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-slate-300">পোস্টাল কোড / জিপ কোড *</Label>
                  <Input id="postalCode" required placeholder="১২০০" value={formData.postalCode} onChange={handleInputChange} className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 py-2 border-t border-slate-800 pt-4 mt-4">
                <Switch 
                  id="isDefault" 
                  checked={formData.isDefault} 
                  onCheckedChange={(c) => setFormData({ ...formData, isDefault: c })} 
                />
                <Label htmlFor="isDefault" className="cursor-pointer font-medium text-indigo-400">এটিকে আমার ডিফল্ট ঠিকানা হিসেবে সেট করুন</Label>
              </div>

              <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto px-8 h-11">
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> সেভ হচ্ছে...</> : (editId ? "আপডেট করুন" : "ঠিকানা সেভ করুন")}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {addresses.map((addr) => (
            <Card key={addr._id} className={`relative overflow-hidden bg-slate-900 transition-all ${addr.isDefault ? "border-indigo-500 ring-1 ring-indigo-500" : "border-slate-800"}`}>
              {addr.isDefault && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] uppercase px-3 py-1 font-bold rounded-bl-lg shadow-sm">
                  ডিফল্ট
                </div>
              )}
              <CardContent className="p-5">
                <h3 className="font-bold text-lg text-white flex items-center gap-2 mb-4">
                  <Home className="w-4 h-4 text-slate-500" /> {addr.label || "ঠিকানা"}
                </h3>
                <div className="space-y-3 text-sm text-slate-400 mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                  <p className="flex items-center gap-2 font-bold text-slate-300"><User className="w-4 h-4 text-slate-500" /> {addr.fullName}</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" /> {addr.phone}</p>
                  <div className="flex items-start gap-2 pt-3 border-t border-slate-800">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" /> 
                    <p className="leading-relaxed">
                      <span className="text-slate-300">{addr.addressLine1}</span> <br />
                      <span className="text-xs text-slate-500">{addr.addressLine2}</span> <br />
                      <span className="font-medium text-slate-400">{addr.city} - {addr.postalCode}</span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(addr)} className="text-indigo-400 border-slate-700 hover:text-white hover:bg-slate-800">
                    <Edit className="w-3.5 h-3.5 mr-1.5" /> এডিট
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(addr._id)} className="text-rose-400 border-slate-700 hover:text-rose-300 hover:bg-slate-800">
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> মুছুন
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900 border border-dashed border-slate-800 rounded-2xl">
          <MapPin className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-white text-lg font-bold">আপনার কোনো ঠিকানা সেভ করা নেই!</p>
          <p className="text-slate-500 text-sm mt-1">হার্ডকপি অর্ডার করার জন্য উপরে 'নতুন ঠিকানা যোগ করুন' এ ক্লিক করুন।</p>
        </div>
      )}
    </div>
  );
}