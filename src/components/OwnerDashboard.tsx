import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Trash2, Calendar, User, Phone, Scissors, RefreshCw, Camera, Image as ImageIcon } from 'lucide-react';

interface Booking {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
}

export default function OwnerDashboard({ onClose }: { onClose: () => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [salonPhoto, setSalonPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadBookings();
    setSalonPhoto(localStorage.getItem('shabnam_salon_photo'));
  }, []);

  const loadBookings = () => {
    const data = JSON.parse(localStorage.getItem('shabnam_bookings') || '[]');
    setBookings(data);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        localStorage.setItem('shabnam_salon_photo', base64);
        setSalonPhoto(base64);
        window.dispatchEvent(new Event('storage')); // Trigger update in other tabs if any
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteBooking = (id: number) => {
    const updated = bookings.filter(b => b.id !== id);
    localStorage.setItem('shabnam_bookings', JSON.stringify(updated));
    setBookings(updated);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-bg/95 flex items-center justify-center p-6"
    >
      <div className="w-full max-w-2xl bg-surface border border-white/10 rounded-[2.5rem] flex flex-col max-h-[85vh] shadow-[0_0_100px_rgba(197,160,89,0.15)] overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-primary">
              Owner Portal
            </h2>
            <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">Manage Salon Bookings</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={loadBookings}
              className="p-3 text-stone-400 hover:text-white transition-colors hover:bg-white/5 rounded-2xl"
            >
              <RefreshCw size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-3 text-stone-400 hover:text-white transition-colors hover:bg-white/5 rounded-2xl"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Salon Branding Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">Salon Branding</h3>
            <div className="bg-bg border border-white/5 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">Salon Gallery Photo</p>
                  <p className="text-xs text-stone-500">Update the main image customers see on the Visit page.</p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/20 transition-all border border-primary/20"
                >
                  Change Photo
                </button>
              </div>
              
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
                {salonPhoto ? (
                  <img src={salonPhoto} alt="Salon preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center text-stone-600">
                    <ImageIcon size={40} className="mb-2 opacity-20" />
                    <p className="text-xs uppercase tracking-widest">No custom photo uploaded</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                      <Camera size={24} />
                   </button>
                </div>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoUpload} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">Current Appointments</h3>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-stone-600 space-y-4 italic bg-bg rounded-3xl border border-white/5">
                  <Calendar size={48} className="opacity-20" />
                  <p>No appointments booked yet.</p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <motion.div 
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-bg border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-primary/30 transition-all"
                  >
                    <div className="flex gap-6 items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <User size={20} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-lg">{booking.name}</h4>
                          <span className="text-[10px] py-1 px-2 bg-stone-800 rounded-md text-stone-400 font-bold uppercase tracking-wider">
                            {booking.service}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm text-stone-500">
                          <div className="flex items-center gap-1.5">
                            <Phone size={14} />
                            <span>{booking.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => deleteBooking(booking.id)}
                      className="p-3 bg-red-900/10 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-stone-900/30 text-center text-[10px] text-stone-600 font-bold uppercase tracking-widest border-t border-white/5">
          Confidential Portal • Shabnam Men's Salon © 2026
        </div>
      </div>
    </motion.div>
  );
}
