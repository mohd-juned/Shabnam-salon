import React, { useState } from 'react';
import { User, Phone, Scissors, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SERVICES = [
  "Skin Fade & Style",
  "Classic Haircut",
  "Beard Sculpting",
  "Royale Shave",
  "Shabnam Signature Spa",
  "Hair Color & Detox"
];

export default function BookingTab() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: SERVICES[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate saving
    setTimeout(() => {
      const bookings = JSON.parse(localStorage.getItem('shabnam_bookings') || '[]');
      const newBooking = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString()
      };
      localStorage.setItem('shabnam_bookings', JSON.stringify([newBooking, ...bookings]));
      
      setIsSubmitting(false);
      setIsDone(true);
      setFormData({ name: '', phone: '', service: SERVICES[0] });

      // Reset done state after 3 seconds
      setTimeout(() => setIsDone(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold tracking-tight text-primary">Secure a Spot</h2>
        <p className="text-stone-400 max-w-sm mx-auto">Luxury grooming is just a few taps away. Experience the Shabnam difference.</p>
      </div>

      <motion.form 
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-6 bg-surface p-8 rounded-3xl border border-white/5 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Progress Bar (Decoration) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/10">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: !formData.name || !formData.phone ? '50%' : '100%' }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Client Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={20} />
            <input
              required
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-bg border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all placeholder:text-stone-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={20} />
            <input
              required
              type="tel"
              placeholder="+91 93195 53689"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-bg border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all placeholder:text-stone-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Select Service</label>
          <div className="relative">
            <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={20} />
            <select
              value={formData.service}
              onChange={e => setFormData({ ...formData, service: e.target.value })}
              className="w-full appearance-none bg-bg border border-white/5 rounded-2xl py-4 pl-12 pr-10 focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
            >
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" size={20} />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting || isDone}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 overflow-hidden
            ${isDone ? 'bg-green-600 text-white' : 'bg-primary text-bg hover:bg-primary-dark shadow-xl shadow-primary/10'}`}
        >
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-6 h-6 border-2 border-bg border-t-transparent rounded-full animate-spin"
              />
            ) : isDone ? (
              <motion.div
                key="done"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 size={24} />
                <span>Booked Successfully!</span>
              </motion.div>
            ) : (
              <motion.span 
                key="idle"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Confirm Appointment
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.form>
    </div>
  );
}
