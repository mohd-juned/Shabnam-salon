import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Scissors, MapPin, LayoutDashboard, Menu, X, ChevronRight, User, Phone, CheckCircle2, Download } from 'lucide-react';
import BookingTab from './components/BookingTab';
import AIGroomingTab from './components/AIGroomingTab';
import VisitTab from './components/VisitTab';
import OwnerDashboard from './components/OwnerDashboard';

type Tab = 'booking' | 'grooming' | 'visit';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('booking');
  const [titleClicks, setTitleClicks] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  const handleTitleClick = () => {
    const nextCount = titleClicks + 1;
    setTitleClicks(nextCount);
    if (nextCount >= 5) {
      setShowDashboard(true);
      setTitleClicks(0);
    }
  };

  return (
    <div className="min-h-screen bg-bg selection:bg-primary/30 selection:text-primary pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 glass px-6 py-4 flex items-center justify-between">
        <motion.h1 
          className="text-2xl font-serif font-bold tracking-tighter text-primary cursor-pointer select-none"
          onClick={handleTitleClick}
          whileTap={{ scale: 0.98 }}
        >
          Shabnam Men's Salon
        </motion.h1>

        {installPrompt && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleInstall}
            className="flex items-center gap-2 bg-primary px-4 py-2 rounded-full text-bg text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Install App</span>
          </motion.button>
        )}
        
        {/* Navigation - Desktop */}
        <nav className="hidden md:flex gap-1 bg-stone-900/50 p-1 rounded-full border border-white/5">
          <TabButton 
            active={activeTab === 'booking'} 
            onClick={() => setActiveTab('booking')}
            icon={<Calendar size={18} />}
            label="Book"
          />
          <TabButton 
            active={activeTab === 'grooming'} 
            onClick={() => setActiveTab('grooming')}
            icon={<Scissors size={18} />}
            label="Groom AI"
          />
          <TabButton 
            active={activeTab === 'visit'} 
            onClick={() => setActiveTab('visit')}
            icon={<MapPin size={18} />}
            label="Visit"
          />
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 md:py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'booking' && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <BookingTab />
            </motion.div>
          )}
          {activeTab === 'grooming' && (
            <motion.div
              key="grooming"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AIGroomingTab />
            </motion.div>
          )}
          {activeTab === 'visit' && (
            <motion.div
              key="visit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <VisitTab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Owner Dashboard Overlay */}
      <AnimatePresence>
        {showDashboard && (
          <OwnerDashboard onClose={() => setShowDashboard(false)} />
        )}
      </AnimatePresence>

      {/* PWA Bottom Navigation (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden glass border-t border-white/5 py-2 px-6 flex justify-around items-center z-40">
        <MobileTabButton 
          active={activeTab === 'booking'} 
          onClick={() => setActiveTab('booking')}
          icon={<Calendar size={20} />}
          label="Booking"
        />
        <MobileTabButton 
          active={activeTab === 'grooming'} 
          onClick={() => setActiveTab('grooming')}
          icon={<Scissors size={20} />}
          label="AI Groom"
        />
        <MobileTabButton 
          active={activeTab === 'visit'} 
          onClick={() => setActiveTab('visit')}
          icon={<MapPin size={20} />}
          label="Visit"
        />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
        active ? 'text-bg font-bold' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
      }`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && (
        <motion.div layoutId="active-pill" className="absolute inset-0 bg-primary rounded-full z-0" />
      )}
    </button>
  );
}

function MobileTabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${
        active ? 'text-primary' : 'text-stone-500'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      {active && (
        <motion.div
          layoutId="mobile-indicator"
          className="w-1 h-1 bg-primary rounded-full"
        />
      )}
    </button>
  );
}
