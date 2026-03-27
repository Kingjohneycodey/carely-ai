import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function SignupPage() {
  const [showPw, setShowPw] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/users/", {
        email,
        password,
        full_name: `${firstName} ${lastName}`,
        role: role,
      });
      toast.success("Account created!", {
        description: `Please log in as a ${role === "DOCTOR" ? "doctor" : "user"} with your new credentials.`,
      });
      router.push("/login");
    } catch (error: any) {
      toast.error("Signup failed", {
        description: error.response?.data?.detail || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-slate-900 relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-primary/20" />
        <div className="relative text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display text-2xl font-bold">Care AI</span>
          </div>
          <h2 className="font-display text-3xl font-bold mb-4">Join Care AI</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Start your journey as a {role === "DOCTOR" ? "healthcare provider" : "patient"} with smarter, AI-powered tools.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900">Care AI</span>
          </div>

          <h1 className="text-2xl font-bold mb-1 text-slate-900">Create account</h1>
          <p className="text-slate-500 text-sm mb-8 font-medium">Join our healthcare community today</p>

          <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
             <button 
                type="button" 
                onClick={() => setRole("USER")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === "USER" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
             >
                Patient
             </button>
             <button 
                type="button" 
                onClick={() => setRole("DOCTOR")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === "DOCTOR" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
             >
                Doctor / Provider
             </button>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold text-[11px] uppercase tracking-wider">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="John" 
                    className="pl-10 border-slate-200 h-11" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold text-[11px] uppercase tracking-wider">Last Name</Label>
                <Input 
                  placeholder="Doe" 
                  className="border-slate-200 h-11"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold text-[11px] uppercase tracking-wider">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  type="email"
                  placeholder="john@example.com" 
                  className="pl-10 border-slate-200 h-11" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold text-[11px] uppercase tracking-wider">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  type={showPw ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pl-10 pr-10 border-slate-200 h-11" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 mt-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-slate-900 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
