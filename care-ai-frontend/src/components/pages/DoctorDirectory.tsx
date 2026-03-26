import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, MapPin, Clock, Video, MessageCircle, Phone, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";

const doctors = [
  { id: 1, name: "Dr. Adebayo Adeyemi", specialty: "General Practitioner", rating: 4.8, reviews: 234, price: "₦1,500", available: "Online", lang: "English, Yoruba", img: "AA" },
  { id: 2, name: "Dr. Fatima Hassan", specialty: "Pediatrician", rating: 4.9, reviews: 187, price: "₦2,000", available: "Online", lang: "English, Hausa", img: "FH" },
  { id: 3, name: "Dr. Chinwe Obi", specialty: "Dermatologist", rating: 4.7, reviews: 156, price: "₦2,500", available: "Scheduled", lang: "English, Igbo", img: "CO" },
  { id: 4, name: "Dr. Emmanuel Kalu", specialty: "Cardiologist", rating: 4.6, reviews: 98, price: "₦3,000", available: "Busy", lang: "English", img: "EK" },
  { id: 5, name: "Dr. Amina Yusuf", specialty: "Gynecologist", rating: 4.9, reviews: 312, price: "₦2,000", available: "Online", lang: "English, Hausa", img: "AY" },
];

const specialties = ["All", "General", "Pediatrics", "Dermatology", "Cardiology", "Gynecology", "Psychiatry"];

const availColor: Record<string, string> = {
  Online: "bg-success text-success-foreground",
  Scheduled: "bg-warning text-warning-foreground",
  Busy: "bg-muted text-muted-foreground",
};

export default function DoctorDirectory() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Find Doctors</h1>
        <p className="text-muted-foreground text-sm">Connect with verified healthcare professionals</p>
      </div>

      {/* AI Recommendation */}
      <Card className="bg-accent/50 border-primary/20">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-primary mb-2">AI RECOMMENDED</p>
          <p className="text-sm">Based on your recent fever & headache symptoms, we recommend seeing a <strong>General Practitioner</strong>.</p>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search doctors by name or specialty..." className="pl-10" />
        </div>
        <Button variant="outline"><Filter className="h-4 w-4 mr-1" /> Filters</Button>
      </div>

      {/* Specialty Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {specialties.map((s, i) => (
          <button key={s} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}>
            {s}
          </button>
        ))}
      </div>

      {/* Doctor Cards */}
      <div className="space-y-3">
        {doctors.map(doc => (
          <Link key={doc.id} href={`/doctors/${doc.id}`}>
            <Card className="hover:shadow-card transition-shadow cursor-pointer mb-3">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-lg shrink-0">
                  {doc.img}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.specialty}</p>
                    </div>
                    <Badge className={`text-[10px] shrink-0 ${availColor[doc.available]}`}>{doc.available}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" />{doc.rating} ({doc.reviews})</span>
                    <span>{doc.price}/session</span>
                    <span className="hidden sm:inline">{doc.lang}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="h-7 text-xs"><MessageCircle className="h-3 w-3 mr-1" /> Chat</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs"><Phone className="h-3 w-3 mr-1" /> Voice</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs"><Video className="h-3 w-3 mr-1" /> Video</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
