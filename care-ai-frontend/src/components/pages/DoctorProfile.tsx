import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star, Shield, GraduationCap, Building,
  MessageCircle, Phone, Video, Calendar,
  ChevronLeft, Languages, Clock, User, CheckCircle2,
  Loader2, CreditCard
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

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
  bio: string;
  experience_years: number;
  hospital: string;
};

export default function DoctorProfile() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [shareSummary, setShareSummary] = useState(true);

  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:30 PM", "06:00 PM"];
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await api.get(`/care/doctors/${id}`);
        setDoctor(response.data);
      } catch (error) {
        toast.error("Failed to load doctor profile");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchDoctor();
  }, [id]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://newwebpay.qa.interswitchng.com/inline-checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    if (!user) {
      toast.error("Please login to book an appointment");
      router.push("/login");
      return;
    }

    setIsBooking(true);
    try {
      // 1. Create appointment in backend
      const response = await api.post("/care/appointments", {
        doctor_id: parseInt(id as string),
        date: new Date().toLocaleDateString(),
        time: selectedSlot
      });

      const appointment = response.data;

      // 2. Trigger Checkout (Already loaded via useEffect)
      // @ts-ignore
      if (window.webpayCheckout) {
        // @ts-ignore
        window.webpayCheckout({
          merchant_code: "MX6072",
          pay_item_id: "9405967",
          txn_ref: appointment.txn_ref,
          amount: 10000, 
          currency: 566,
          cust_email: user.email,
          mode: 'TEST',
          site_redirect_url: window.location.origin + "/appointments",
          onComplete: (res: any) => {
            console.log("Interswitch onComplete:", res);
            if (res.resp === "00" || res.resp === "000") {
              toast.success("Payment successful! Booking confirmed.");
              router.push("/appointments?success=true");
            } else {
              toast.error("Payment not completed. Status: " + (res.desc || "Interrupted"));
            }
          }
        });
      } else {
        toast.error("Payment system is still loading. Please try again in a few seconds.");
      }

    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error("Booking failed", { description: error.response?.data?.detail || "Could not initiate appointment." });
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-32 flex justify-center">
        <Loader2 className="h-10 w-10 text-slate-300 animate-spin" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 font-medium">Doctor not found.</p>
        <Button variant="link" className="mt-2" asChild><Link href="/doctors">Back to directory</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans pb-20">
      <Link href="/doctors" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to directory
      </Link>

      {/* Profile Header */}
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-slate-100 bg-slate-50/50">
            <div className="h-28 w-28 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-3xl shrink-0 shadow-lg capitalize">
              {doctor.img || (doctor.name ? doctor.name[0] : <User className="h-12 w-12" />)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 mb-3">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">{doctor.name}</h1>
                  <p className="text-slate-500 font-medium text-lg">{doctor.specialty}</p>
                </div>
                <Badge className={cn(
                  "px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-none shrink-0",
                  doctor.available === "Online" ? "bg-emerald-100 text-emerald-700" :
                    doctor.available === "Scheduled" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                )}>
                  {doctor.available}
                </Badge>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-y-3 gap-x-6 mt-4 text-sm font-bold text-slate-600">
                <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-slate-900">{doctor.rating}</span>
                  <span className="text-slate-400">({doctor.reviews} reviews)</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold"><Shield className="h-4 w-4" /> Verified</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 text-xs uppercase tracking-widest">
                <GraduationCap className="h-5 w-5 text-slate-400" /> Professional Background
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm font-medium">
                {doctor.bio || `${doctor.name} is a highly qualified ${doctor.specialty.toLowerCase()} with extensive clinical experience.`}
              </p>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                  <Building className="h-5 w-5 text-slate-400 shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Affiliation</p>
                    <p className="font-bold text-sm text-slate-900">{doctor.hospital || "Independent Clinical Practice"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                  <Clock className="h-5 w-5 text-slate-400 shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Experience</p>
                    <p className="font-bold text-sm text-slate-900">{doctor.experience_years} Years Professional Experience</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                  <Languages className="h-5 w-5 text-slate-400 shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Spoken Languages</p>
                    <p className="font-bold text-sm text-slate-900">{doctor.lang}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 text-xs uppercase tracking-widest">
                <Calendar className="h-5 w-5 text-slate-400" /> Book an Appointment
              </h3>

              <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between cursor-pointer group" onClick={() => setShareSummary(!shareSummary)}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Share AI Health Profile</p>
                    <p className="text-[11px] text-slate-500 font-bold mt-0.5">Allow doctor to see your vitals & history</p>
                  </div>
                </div>
                <div className={cn("h-6 w-11 rounded-full relative transition-colors", shareSummary ? "bg-emerald-500" : "bg-slate-300")}>
                  <div className={cn("absolute top-1 h-4 w-4 bg-white rounded-full transition-transform shadow-sm", shareSummary ? "right-1" : "left-1")} />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Select Available Time Slot</p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedSlot(t)}
                      className={cn(
                        "py-3 rounded-xl border text-[11px] font-bold transition-all uppercase tracking-widest",
                        selectedSlot === t ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-105" : "bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="h-14 w-full bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
                >
                  {isBooking ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <>
                      <CreditCard className="h-5 w-5 mr-3" />
                      Book Session — {doctor.price}
                    </>
                  )}
                </Button>
                <p className="text-[10px] text-center text-slate-400 font-bold mt-4 uppercase tracking-tighter">Secure Payment Powered by Interswitch</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardContent className="p-8 md:p-10">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Patient Satisfaction</h3>
          <div className="space-y-8">
            {/* No reviews for now, showing empty state or placeholder */}
            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 className="h-8 w-8 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-400">Verified doctor with high patient ratings.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
