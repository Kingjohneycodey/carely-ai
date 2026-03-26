import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Star, Navigation, Filter, Hospital, TestTube, Pill, Baby } from "lucide-react";

const facilityTypes = [
  { id: "all", icon: MapPin, label: "All" },
  { id: "hospital", icon: Hospital, label: "Hospitals" },
  { id: "clinic", icon: Hospital, label: "Clinics" },
  { id: "pharmacy", icon: Pill, label: "Pharmacies" },
  { id: "lab", icon: TestTube, label: "Labs" },
  { id: "maternal", icon: Baby, label: "Maternal" },
];

const facilities = [
  { name: "Lagos University Teaching Hospital", type: "Hospital", distance: "2.3 km", rating: 4.5, hours: "24/7", phone: "+234 1 774 0240" },
  { name: "Reddington Hospital", type: "Hospital", distance: "4.1 km", rating: 4.7, hours: "24/7", phone: "+234 1 271 8888" },
  { name: "MedLab Diagnostics", type: "Lab", distance: "1.2 km", rating: 4.3, hours: "8AM-6PM", phone: "+234 1 452 1100" },
  { name: "HealthPlus Pharmacy", type: "Pharmacy", distance: "0.8 km", rating: 4.6, hours: "7AM-10PM", phone: "+234 1 891 0000" },
  { name: "Evercare Hospital", type: "Hospital", distance: "6.2 km", rating: 4.8, hours: "24/7", phone: "+234 1 291 4000" },
];

export default function NearbyFacilities() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Nearby Facilities</h1>
        <p className="text-muted-foreground text-sm">Find hospitals, pharmacies, labs, and clinics near you</p>
      </div>

      {/* Map Placeholder */}
      <Card>
        <CardContent className="p-0">
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Interactive map view</p>
              <p className="text-xs">Showing facilities near Victoria Island, Lagos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {facilityTypes.map((t, i) => (
          <button key={t.id} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Facility List */}
      <div className="space-y-3">
        {facilities.map((f, i) => (
          <Card key={i} className="hover:shadow-card transition-shadow">
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm">{f.name}</h3>
                  <Badge variant="outline" className="text-[10px]">{f.type}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {f.distance}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" /> {f.rating}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {f.hours}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="icon" variant="outline" className="h-8 w-8"><Phone className="h-4 w-4" /></Button>
                <Button size="icon" variant="hero" className="h-8 w-8"><Navigation className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
