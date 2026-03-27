import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertTriangle, MapPin, Phone, Navigation, X, Shield, Wallet, Plus, Trash2, Loader2, Hospital } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

type Contact = {
  id: number;
  name: string;
  relation: string;
  phone: string;
};

const hospitals = [
  { name: "Lagos University Teaching Hospital", distance: "2.3 km", time: "8 min", phone: "+234 1 774 0240" },
  { name: "Reddington Hospital", distance: "4.1 km", time: "14 min", phone: "+234 1 271 8888" },
  { name: "Lagoon Hospital", distance: "5.8 km", time: "18 min", phone: "+234 1 460 2000" },
];

export default function EmergencyMode() {
  const [activated, setActivated] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get("/care/emergency-contacts");
      setContacts(response.data);
    } catch (error) {
      toast.error("Failed to load emergency contacts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast.error("Name and Phone are required");
      return;
    }
    try {
      const response = await api.post("/care/emergency-contacts", newContact);
      setContacts([...contacts, response.data]);
      setNewContact({ name: "", relation: "", phone: "" });
      setIsAdding(false);
      toast.success("Emergency contact added");
    } catch (error) {
      toast.error("Failed to add contact");
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm("Remove this emergency contact?")) return;
    try {
      await api.delete(`/care/emergency-contacts/${id}`);
      setContacts(contacts.filter(c => c.id !== id));
      toast.success("Contact removed");
    } catch (error) {
      toast.error("Failed to remove contact");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Emergency & SOS</h1>
        <p className="text-slate-500 font-medium">One-tap SOS alerts, emergency contacts, and instant hospital routing.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - SOS Focus */}
        <div className="space-y-6">
           <Card className="rounded-2xl border-none shadow-sm ring-1 ring-slate-200 overflow-hidden bg-slate-50 relative">
             <CardContent className="p-10 flex flex-col items-center justify-center min-h-[400px]">
               {!activated ? (
                 <div className="text-center space-y-8 relative z-10 w-full">
                    <button
                      onClick={() => setActivated(true)}
                      className="mx-auto h-48 w-48 rounded-full bg-red-500 text-white flex flex-col items-center justify-center shadow-[0_0_60px_rgba(239,68,68,0.4)] hover:bg-red-600 transition-all hover:scale-105 active:scale-95 group"
                    >
                      <AlertTriangle className="h-14 w-14 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-3xl font-black tracking-widest uppercase">SOS</span>
                    </button>
                    <div className="max-w-[260px] mx-auto">
                       <p className="text-sm font-bold text-slate-700">Press to Activate SOS</p>
                       <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Alerts will be sent to your emergency contacts with your live GPS location instantly.</p>
                    </div>
                 </div>
               ) : (
                 <div className="text-center space-y-6 animate-in zoom-in duration-300 relative z-10 w-full">
                    <div className="h-32 w-32 rounded-full border-4 border-red-500 text-red-500 flex items-center justify-center mx-auto bg-white shadow-[0_0_80px_rgba(239,68,68,0.6)] animate-pulse">
                       <AlertTriangle className="h-12 w-12" />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-red-600 uppercase tracking-widest">SOS Active</h2>
                       <p className="text-sm font-medium text-slate-600 mt-2 max-w-[240px] mx-auto leading-relaxed">
                          Location broadcast sent. Help is on the way. Keep phone available.
                       </p>
                    </div>
                    <Button 
                       variant="outline" 
                       onClick={() => setActivated(false)}
                       className="h-12 border-red-200 text-red-600 hover:bg-red-50 w-full mt-4 font-bold"
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel Emergency
                    </Button>
                 </div>
               )}
               {/* Background Danger Pattern */}
               {activated && (
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600 to-transparent animate-pulse pointer-events-none" />
               )}
             </CardContent>
           </Card>
        </div>

        {/* Right Column - Contacts & Hospitals */}
        <div className="space-y-6">
           {/* Emergency Contacts Management */}
           <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader className="pb-4 border-b border-slate-50 flex flex-row items-center justify-between">
                 <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-500" /> Emergency Contacts
                 </CardTitle>
                 <Button 
                   size="sm" 
                   variant="ghost" 
                   className="h-8 text-primary font-bold"
                   onClick={() => setIsAdding(!isAdding)}
                 >
                    {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                 </Button>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                 {isAdding && (
                    <div className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-xl animate-in slide-in-from-top-2">
                       <Input 
                          placeholder="Contact Name" 
                          value={newContact.name} 
                          onChange={(e) => setNewContact({...newContact, name: e.target.value})} 
                          className="bg-white border-slate-200"
                       />
                       <div className="flex gap-2">
                          <Input 
                             placeholder="Relation (e.g. Spouse)" 
                             value={newContact.relation} 
                             onChange={(e) => setNewContact({...newContact, relation: e.target.value})} 
                             className="flex-1 bg-white border-slate-200"
                          />
                          <Input 
                             placeholder="Phone Number" 
                             value={newContact.phone} 
                             onChange={(e) => setNewContact({...newContact, phone: e.target.value})} 
                             className="flex-1 bg-white border-slate-200"
                          />
                       </div>
                       <Button onClick={handleAddContact} className="w-full bg-slate-900 font-bold">Save Contact</Button>
                    </div>
                 )}

                 {isLoading ? (
                    <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 text-slate-300 animate-spin" /></div>
                 ) : contacts.length === 0 ? (
                    <p className="text-center text-sm text-slate-400 py-6 font-medium">No contacts added yet. Add close relatives or family doctors.</p>
                 ) : (
                    <div className="space-y-3">
                       {contacts.map(c => (
                          <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white group hover:border-slate-300 transition-colors">
                             <div>
                                <p className="text-sm font-bold text-slate-900">{c.name}</p>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">{c.relation || "Contact"} • {c.phone}</p>
                             </div>
                             <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => handleDeleteContact(c.id)}>
                                   <Trash2 className="h-4 w-4" />
                                </Button>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </CardContent>
           </Card>

           {/* Nearest Medical Centers */}
           <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader className="pb-4 border-b border-slate-50">
                 <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Hospital className="h-4 w-4 text-primary" /> Nearest ER Hospitals
                 </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                 {hospitals.map((h, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-colors">
                       <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{h.name}</p>
                          <div className="flex gap-3 text-xs font-bold text-slate-500">
                             <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {h.distance}</span>
                             <span className="text-slate-300">•</span>
                             <span className="text-emerald-600">{h.time} ETA</span>
                          </div>
                       </div>
                       <div className="flex gap-2 shrink-0">
                          <Button size="icon" variant="outline" className="h-9 w-9 border-slate-200 text-slate-600"><Phone className="h-4 w-4" /></Button>
                          <Button size="sm" className="h-9 font-bold bg-slate-900 px-4"><Navigation className="h-4 w-4 mr-2" /> Route</Button>
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
