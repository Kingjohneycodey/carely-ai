import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Shield, GraduationCap, Building, MessageCircle, Phone, Video, Calendar, ChevronLeft, Languages, Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const reviews = [
  { name: "Olumide A.", rating: 5, text: "Very thorough consultation. Doctor took time to explain everything clearly.", date: "2 days ago" },
  { name: "Blessing O.", rating: 4, text: "Professional and knowledgeable. The AI pre-summary saved a lot of time.", date: "1 week ago" },
  { name: "Ibrahim M.", rating: 5, text: "Best doctor experience I've had. Follow-up was prompt.", date: "2 weeks ago" },
];

export default function DoctorProfile() {
  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/doctors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to directory
      </Link>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-2xl shrink-0">
              AA
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-display text-xl font-bold">Dr. Adebayo Adeyemi</h1>
                  <p className="text-muted-foreground">General Practitioner</p>
                </div>
                <Badge className="bg-success text-success-foreground">Online</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-warning fill-warning" /> 4.8 (234 reviews)</span>
                <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-success" /> MDCN Verified</span>
                <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" /> University of Lagos</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Building className="h-4 w-4" /> Lagos University Teaching Hospital</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 12 years experience</span>
                <span className="flex items-center gap-1"><Languages className="h-4 w-4" /> English, Yoruba</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Button variant="hero"><MessageCircle className="h-4 w-4 mr-1" /> Chat — ₦1,500</Button>
            <Button variant="outline"><Phone className="h-4 w-4 mr-1" /> Voice Call</Button>
            <Button variant="outline"><Video className="h-4 w-4 mr-1" /> Video</Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Pre-summary Toggle */}
      <Card className="bg-accent/50 border-primary/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Share AI Health Summary</p>
            <p className="text-xs text-muted-foreground">Send your health wallet summary to the doctor before the session</p>
          </div>
          <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
            <div className="h-5 w-5 bg-primary-foreground rounded-full absolute right-0.5 top-0.5 shadow-sm" />
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Available Slots
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {["9:00 AM", "10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "4:00 PM", "5:00 PM", "6:00 PM"].map(t => (
              <button key={t} className="py-2.5 rounded-lg border border-border text-sm hover:bg-accent hover:border-primary/30 transition-colors">
                {t}
              </button>
            ))}
          </div>
          <Button variant="hero" className="w-full mt-4">Book Appointment</Button>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-4">Patient Reviews</h3>
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{r.name}</span>
                    <div className="flex">
                      {Array.from({ length: r.rating }).map((_, j) => (
                        <Star key={j} className="h-3 w-3 text-warning fill-warning" />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
