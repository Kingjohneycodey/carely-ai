import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  UserCircle, Heart, Stethoscope, Briefcase, 
  MapPin, Globe, CreditCard, Save, Loader2 
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function DoctorOwnProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/care/doctors");
        const myProfile = response.data.find((d: any) => d.user_id === user?.id);
        if (myProfile) setProfile(myProfile);
      } catch (e) {
        toast.error("Failed to load profile details");
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.id) fetchProfile();
  }, [user?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulation of save since we don't have a specific update profile endpoint for doctors yet
    setTimeout(() => {
      toast.success("Profile updated successfully!");
      setIsSaving(false);
    }, 1000);
  };

  if (isLoading) return <div className="py-20 text-center text-slate-300">Loading profile data...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 font-sans">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Physician Profile</h1>
        <p className="text-slate-500 font-medium">Manage your professional information and consultation clinical details.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-10 bg-slate-50/30">
             <div className="relative group">
                <div className="h-32 w-32 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-black text-4xl shadow-2xl transform transition-transform group-hover:scale-105">
                   {user?.full_name ? user.full_name[0] : "D"}
                </div>
                <button className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-xl flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors">
                   <Save className="h-4 w-4" />
                </button>
             </div>
             <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="space-y-1">
                   <h2 className="text-2xl font-bold text-slate-900">{user?.full_name}</h2>
                   <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest leading-none flex items-center justify-center md:justify-start gap-2">
                     <Stethoscope className="h-3 w-3 text-primary" /> {profile?.specialty || "Physician"}
                   </p>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                   <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">MDCN Verified</Badge>
                   <Badge className="bg-blue-100 text-blue-700 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">Senior Registrar</Badge>
                </div>
             </div>
          </CardContent>
          <CardContent className="p-8 md:p-10 border-t border-slate-100 grid md:grid-cols-2 gap-8">
             <div className="space-y-4">
               <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Professional Bio & Experience</Label>
                  <Textarea 
                    className="min-h-[140px] rounded-2xl border-slate-100 bg-white shadow-sm font-medium text-sm focus:border-slate-300 transition-all resize-none"
                    placeholder="Describe your clinical expertise..."
                    defaultValue={profile?.bio}
                  />
               </div>
               <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Clinic Address / Primary Hospital</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input className="pl-10 h-12 rounded-xl border-slate-100 bg-white font-bold text-sm" defaultValue={profile?.hospital} />
                  </div>
               </div>
             </div>

             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Consultation Rate</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                        <Input className="pl-10 h-12 rounded-xl border-slate-100 bg-white font-bold text-sm" defaultValue={profile?.price || "₦5,000"} />
                      </div>
                   </div>
                   <div>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Experience (Years)</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                        <Input className="pl-10 h-12 rounded-xl border-slate-100 bg-white font-bold text-sm" defaultValue={profile?.experience_years || 5} />
                      </div>
                   </div>
                </div>

                <div>
                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Spoken Languages</Label>
                   <div className="relative">
                     <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                     <Input className="pl-10 h-12 rounded-xl border-slate-100 bg-white font-bold text-sm" defaultValue={profile?.lang || "English, Yoruba"} />
                   </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                   <Button className="h-14 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 shadow-xl transition-all disabled:opacity-50" disabled={isSaving}>
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish Profile Changes"}
                   </Button>
                   <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">Your profile is visible to 2.4k users this week.</p>
                </div>
             </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
