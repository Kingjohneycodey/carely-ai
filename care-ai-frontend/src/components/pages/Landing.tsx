import { Button } from "@/components/ui/button";
import { Heart, Stethoscope, Wallet, Camera, Shield, Users, Star, ArrowRight, Phone, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const features = [
  {
    icon: Stethoscope,
    title: "AI Symptom Checker",
    desc: "Describe symptoms via text, voice, or body map. Get instant triage with actionable next steps.",
  },
  {
    icon: Camera,
    title: "Image Diagnosis",
    desc: "Snap a photo of skin conditions, lab results, or prescriptions for instant AI analysis.",
  },
  {
    icon: Wallet,
    title: "Health Wallet",
    desc: "Your complete medical history in one place — diagnoses, prescriptions, lab results, and vitals.",
  },
  {
    icon: Users,
    title: "Doctor Marketplace",
    desc: "Connect with verified doctors via chat, voice, or video. AI pre-briefs them on your history.",
  },
  {
    icon: Shield,
    title: "Emergency SOS",
    desc: "One-tap emergency mode alerts contacts, locates nearest hospitals, and activates emergency credit.",
  },
  {
    icon: Phone,
    title: "Teleconsultations",
    desc: "Seamless text, voice, and video consultations with in-session prescriptions and follow-ups.",
  },
];

const plans = [
  { name: "Care Basic", price: "₦0", period: "/month", features: ["5 AI symptom checks/month", "Health tips", "Emergency info", "Health wallet"], popular: false },
  { name: "Care Plus", price: "₦2,500", period: "/month", features: ["Everything in Basic", "Unlimited AI consults", "2 doctor chat sessions", "Lab result analysis",], popular: true },
  { name: "Care Pro", price: "₦5,000", period: "/month", features: ["Everything in Plus", "Unlimited doctor access", "Priority support", "Chronic care tracking"], popular: false },
];

const stats = [
  { value: "250K+", label: "Active Users" },
  { value: "500+", label: "Verified Doctors" },
  { value: "85%+", label: "AI Accuracy" },
  { value: "4.6★", label: "App Store Rating" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Care AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button variant="hero" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Africa's Intelligent Health Companion
              </span>
            </motion.div>
            <motion.h1 {...fadeUp} transition={{ delay: 0.1 }} className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
              Your health,{" "}
              <span className="text-gradient">understood</span>
              <br />and acted upon
            </motion.h1>
            <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
              AI-powered symptom triage, personal health wallet, image diagnosis, and instant doctor access — built for Nigeria, designed for Africa.
            </motion.p>
            <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3">
              <Link href="/signup">
                <Button variant="hero" size="lg" className="h-12 px-8 text-base">
                  Start Free <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  View Demo
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-extrabold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Everything you need for better health</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From AI-powered diagnosis to emergency response — Care AI puts quality healthcare in your pocket.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-card rounded-2xl border border-border p-6 hover:shadow-card hover:border-primary/20 transition-all duration-300"
              >
                <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground text-lg">Healthcare you can actually afford.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-card rounded-2xl border p-6 flex flex-col ${plan.popular ? "border-primary shadow-glow ring-1 ring-primary/20 relative" : "border-border"
                  }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display font-semibold text-lg">{plan.name}</h3>
                <div className="mt-3 mb-5">
                  <span className="font-display text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant={plan.popular ? "hero" : "outline"} className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Ready to take control of your health?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join thousands of Nigerians already using Care AI for smarter, more accessible healthcare.
          </p>
          <Link href="/signup">
            <Button variant="hero" size="lg" className="h-14 px-10 text-base">
              Get Started Free <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Heart className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold">Care AI</span>
              </div>
              <p className="text-sm text-muted-foreground">Africa's intelligent health companion.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                <li><Link href="/doctors" className="hover:text-foreground">Find Doctors</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground">NDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 Care AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
