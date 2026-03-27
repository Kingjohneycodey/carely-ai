import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, Clock, Video, MessageCircle, Phone, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  price: string;
  available: string;
  lang: string;
  img: string;
};

const specialties = ["All", "General Practitioner", "Pediatrics", "Dermatology", "Cardiology", "Gynecology", "Orthopedics", "Psychiatry"];

const sortOptions = [
  { value: "rating", label: "Top Rated" },
  { value: "price_asc", label: "Lowest Price" },
  { value: "price_desc", label: "Highest Price" },
];

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (activeTab !== "All") params.append("specialty", activeTab);
        params.append("sort", sortBy);

        const response = await api.get(`/care/doctors?${params.toString()}`);
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to load doctors");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, [debouncedSearch, activeTab, sortBy]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 font-sans pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Find Doctors</h1>
        <p className="text-slate-500 font-medium">Connect with verified healthcare professionals online.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search doctors by name or specialty..."
            className="pl-10 h-11 rounded-lg border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-900"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {specialties.map((s) => (
          <button
            key={s}
            onClick={() => setActiveTab(s)}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === s ? "bg-slate-900 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-8 w-8 text-slate-300 animate-spin" />
          </div>
        ) : doctors.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <User className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900">No doctors found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          doctors.map(doc => (
            <Link key={doc.id} href={`/doctors/${doc.id}`} className="block mb-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer rounded-2xl border-slate-200 group" >
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="h-16 w-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    {doc.img || <User className="h-8 w-8" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">{doc.name}</h3>
                        <p className="text-sm text-slate-500 font-medium">{doc.specialty}</p>
                      </div>
                      <Badge className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shrink-0 border-none ${doc.available === "Online" ? "bg-emerald-100 text-emerald-700" :
                        doc.available === "Scheduled" ? "bg-amber-100 text-amber-700" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                        {doc.available}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />{doc.rating} ({doc.reviews})</span>
                      <span className="text-slate-900">{doc.price} <span className="text-slate-400">/ Session</span></span>
                      <span className="hidden sm:inline-block truncate max-w-[150px]">{doc.lang}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 sm:block hidden group-hover:translate-x-1 group-hover:text-slate-900 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))
        )
        }
      </div >
    </div >
  );
}
