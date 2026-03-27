import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Star, Navigation, Hospital, TestTube, Pill, Baby, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const facilityTypes = [
  { id: "all", icon: MapPin, label: "All Facilities" },
  { id: "hospital", icon: Hospital, label: "Hospitals" },
  { id: "clinic", icon: Stethoscope, label: "Clinics" },
  { id: "pharmacy", icon: Pill, label: "Pharmacies" },
  { id: "lab", icon: TestTube, label: "Laboratories" },
];

const facilities = [
  { name: "Lagos University Teaching Hospital (LUTH)", type: "Hospital", distance: "2.3 km", rating: 4.8, hours: "Open 24/7", phone: "+234 1 774 0240" },
  { name: "Reddington Hospital", type: "Hospital", distance: "0.5 km", rating: 4.9, hours: "Open 24/7", phone: "+234 1 271 8888" },
  { name: "Lagoon Hospital", type: "Hospital", distance: "1.2 km", rating: 4.7, hours: "Open 24/7", phone: "+234 1 030 1900" },
  { name: "Evercare Hospital Lekki", type: "Hospital", distance: "3.5 km", rating: 4.9, hours: "Open 24/7", phone: "+234 1 291 4000" },
  { name: "St. Nicholas Hospital", type: "Hospital", distance: "1.8 km", rating: 4.8, hours: "Open 24/7", phone: "+234 1 271 7210" },
];

export default function NearbyFacilities() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredFacilities = activeTab === "all" ? facilities : facilities.filter(f => f.type.toLowerCase() === activeTab || (activeTab === "lab" && f.type === "Laboratory"));

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 font-sans pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Nearby Facilities</h1>
        <p className="text-slate-500 font-medium">Find hospitals, pharmacies, labs, and clinics near your location.</p>
      </div>

      {/* Google Maps Integration */}
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="h-[450px] w-full bg-slate-100 flex items-center justify-center relative">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d126862.66874880597!2d3.268719084712536!3d6.463483492754664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1shospitals!5e0!3m2!1sen!2sng!4v1711574000000!5m2!1sen!2sng"
              className="absolute inset-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Type Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {facilityTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors",
              activeTab === t.id ? "bg-slate-900 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            )}
          >
            <t.icon className={cn("h-4 w-4", activeTab === t.id ? "text-white" : "text-slate-400")} /> {t.label}
          </button>
        ))}
      </div>

      {/* Facility List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredFacilities.map((f, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow rounded-2xl border-slate-200">
            <CardContent className="p-6 flex flex-col h-full justify-between gap-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">{f.name}</h3>
                  <Badge className={cn(
                    "px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shrink-0 border-none",
                    f.type === "Hospital" ? "bg-blue-100 text-blue-700" :
                      f.type === "Pharmacy" ? "bg-emerald-100 text-emerald-700" :
                        "bg-purple-100 text-purple-700"
                  )}>
                    {f.type}
                  </Badge>
                </div>
                <div className="flex flex-col gap-2 mt-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /> {f.distance} away</span>
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" /> {f.hours}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> {f.rating}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" className="h-10 w-10 rounded-xl p-0 border-slate-200 text-slate-600 hover:text-slate-900"><Phone className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
