import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Navigation, Instagram, User, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function VisitTab() {
  const [salonPhoto, setSalonPhoto] = useState<string | null>(null);

  useEffect(() => {
    setSalonPhoto(localStorage.getItem('shabnam_salon_photo'));
    
    // Listen for storage changes (from OwnerDashboard)
    const handleStorage = () => {
      setSalonPhoto(localStorage.getItem('shabnam_salon_photo'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const defaultPhoto = "https://images.unsplash.com/photo-1512690196222-7c7d474ca0d1?auto=format&fit=crop&q=80&w=1000";

  return (
    <div className="space-y-12 pb-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold tracking-tight">Locate Excellence</h2>
        <p className="text-stone-400 max-w-sm mx-auto">Situated in the heart of the bazar, where tradition meets modern refinement.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact info cards */}
        <div className="space-y-4">
          <Card 
            icon={<MapPin className="text-primary" />} 
            label="Location" 
            value="Mein Bazar Pahasu, UP 203396"
            action={{ label: "Get Directions", href: "https://www.google.com/maps/search/?api=1&query=Pahasu+Bazar" }}
          />
          <Card 
            icon={<Clock className="text-primary" />} 
            label="Timing" 
            value="Mon - Sun: 08:00 AM - 09:00 PM"
          />
          <Card 
            icon={<Phone className="text-primary" />} 
            label="Phone" 
            value="+91 93195 53689"
            action={{ label: "Call Now", href: "tel:+919319553689" }}
          />
        </div>

        {/* Map Preview Placeholder */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square md:aspect-auto rounded-3xl overflow-hidden border border-white/5 group shadow-2xl shadow-primary/5"
        >
          <img 
            src={salonPhoto || defaultPhoto} 
            alt="Salon Interior" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-8 left-8 right-8 space-y-2">
            <h3 className="text-2xl font-bold">The Shabnam Experience</h3>
            <p className="text-sm text-stone-300">Experience premium care in a space designed for the modern man.</p>
          </div>
        </motion.div>
      </div>

      {/* Social Links */}
      <div className="pt-8 border-t border-white/5 flex flex-wrap justify-center gap-6">
        <SocialLink icon={<Instagram size={20} />} label="Instagram" />
        <SocialLink icon={<User size={20} />} label="Portfolio" />
      </div>
    </div>
  );
}

function Card({ icon, label, value, action }: { icon: React.ReactNode, label: string, value: string, action?: { label: string, href: string } }) {
  return (
    <div className="glass p-6 rounded-3xl space-y-4 hover:border-primary/20 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-stone-500 text-[10px] font-bold uppercase tracking-[0.2em]">
            {icon}
            <span>{label}</span>
          </div>
          <p className="text-xl font-bold tracking-tight text-stone-100">{value}</p>
        </div>
        {action && (
          <a 
            href={action.href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 bg-stone-800 rounded-full text-stone-400 hover:text-primary transition-colors"
          >
            <ArrowUpRight size={18} />
          </a>
        )}
      </div>
    </div>
  );
}

function SocialLink({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <a href="#" className="flex items-center gap-2 text-stone-500 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest">
      {icon}
      <span>{label}</span>
    </a>
  );
}
