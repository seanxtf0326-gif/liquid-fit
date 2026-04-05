import { useState, useEffect } from "react";
import { Key, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import SoftAurora from './SoftAurora';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function LoginPage({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password !== "1111") return;
    
    setIsLoggingIn(true);
    setTimeout(() => {
      onLoginSuccess();
    }, 800);
  };

  const handleForgot = () => {
    setShowHint(true);
    setTimeout(() => setShowHint(false), 2000);
  };

  const handleDragEnd = (event, info) => {
    if (isExpanded && info.offset.x < -50) {
      setIsExpanded(false);
    }
  };

  const currentMonth = monthNames[currentTime.getMonth()];
  const currentYear = currentTime.getFullYear();
  const currentDay = dayNames[currentTime.getDay()];
  const currentDate = currentTime.getDate();
  const currentMonthFull = currentTime.toLocaleString('default', { month: 'long' });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoggingIn ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div 
        className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans"
        style={{ background: '#0a0a0f' }}
      >
        {/* Soft Aurora Background */}
        <div className="absolute inset-0 z-0">
          <SoftAurora
            speed={0.6}
            scale={1.5}
            brightness={1.2}
            color1="#f7f7f7"
            color2="#0071e3"
            noiseFrequency={2.5}
            noiseAmplitude={1}
            bandHeight={0.5}
            bandSpread={1}
            octaveDecay={0.1}
            layerOffset={0}
            colorSpeed={1}
            enableMouseInteraction
            mouseInfluence={0.25}
          />
        </div>

        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-[1]" />

        <div className="max-w-5xl w-full flex flex-col md:flex-row gap-4 md:gap-6 z-10 items-center justify-center px-2 md:px-0">
          
          {/* Left Column - Login Card */}
          <motion.div 
            drag={isExpanded ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scaleX: isExpanded ? (isMobile ? 1.08 : 1.4) : 1,
              scaleY: isExpanded ? (isMobile ? 1.05 : 1.15) : 1,
              x: isExpanded ? (isMobile ? 0 : 280) : 0,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[calc(100vw-2rem)] md:max-w-none md:w-auto rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] relative overflow-hidden cursor-grab active:cursor-grabbing"
          >
            {/* Inner container to counteract scaleX stretch */}
            <motion.div
              animate={{ scaleX: isExpanded ? (isMobile ? 0.926 : 0.92) : 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6 md:mb-10">
              <span className="text-xs md:text-sm font-medium tracking-widest text-white/70">Creative. by Aries</span>
            </div>

            <div className="flex justify-between items-end mb-6 md:mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight">Log in</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 md:space-y-4 relative z-10">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 md:h-5 md:w-5 text-white/70" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsExpanded(true)}
                  disabled={isLoggingIn}
                  className="w-full pl-10 md:pl-12 pr-20 md:pr-24 py-3 md:py-4 text-sm md:text-base bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 backdrop-blur-sm transition-all disabled:opacity-50"
                  placeholder="password"
                />
                <div className="absolute inset-y-0 right-2 flex items-center gap-1 md:gap-2">
                  {showHint && (
                    <span className="text-[10px] md:text-xs text-blue-300 animate-pulse whitespace-nowrap">四位数</span>
                  )}
                  <button type="button" onClick={handleForgot} className="px-2 md:px-4 py-1 md:py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-[10px] md:text-xs font-medium text-white transition-colors backdrop-blur-md disabled:opacity-50" disabled={isLoggingIn}>
                    I forgot
                  </button>
                </div>
              </div>

              <div className="pt-4 md:pt-6 flex justify-between items-end">
                <div className="flex flex-col gap-3 md:gap-4">
                  <p className="text-[10px] md:text-xs text-white/60 max-w-[160px] md:max-w-[200px] leading-relaxed">
                    Not everyone likes a crowd, some of them are comfortable with loneliness.
                  </p>
                  <a href="#" className="text-[10px] md:text-xs font-medium text-white hover:text-blue-300 underline underline-offset-4 decoration-white/30 transition-colors">
                    Click here for more info.
                  </a>
                </div>
                <button 
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-zinc-900 hover:bg-black text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <ArrowRight className={`w-5 h-5 md:w-6 md:h-6 ${isLoggingIn ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </form>
            </motion.div>
          </motion.div>

          {/* Right Column - Info Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              scale: 1,
              x: isExpanded ? (isMobile ? 0 : 500) : 0,
              y: isExpanded ? (isMobile ? 180 : 0) : 0,
              opacity: isExpanded ? (isMobile ? 0.6 : 0) : 1,
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[calc(100vw-2rem)] md:max-w-none md:w-auto rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 lg:p-12 bg-white/90 backdrop-blur-3xl border border-white/30 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[280px] md:min-h-[500px]"
          >
            {/* Decorative Blue Circle inside Right Card */}
            <div className="absolute top-1/2 right-0 translate-x-1/4 -translate-y-1/2 w-40 h-40 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-200 to-blue-500 rounded-full blur-[2px] shadow-2xl opacity-80 mix-blend-multiply" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-zinc-900 leading-none mb-1 md:mb-2 tracking-tight">{currentMonth}</h2>
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-light text-zinc-300 leading-none tracking-tight">{currentYear}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm md:text-base font-medium text-zinc-600">训练计划</p>
                <p className="text-sm md:text-base text-zinc-400">30天蜕变</p>
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-8 mt-16 md:mt-32">
              <div className="space-y-0.5 md:space-y-1">
                <p className="text-xs md:text-sm font-medium text-zinc-800">{currentDay} {currentDate}</p>
                <p className="text-xs md:text-sm text-zinc-500">{currentMonthFull} {currentYear}</p>
                <p className="text-xs md:text-sm text-zinc-500">Liquid Fit</p>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto md:gap-12">
                <div className="flex flex-col items-center gap-0.5 md:gap-1">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-zinc-300 flex items-center justify-center text-[10px] md:text-xs font-bold text-zinc-800 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    A
                  </div>
                  <span className="text-[8px] md:text-[10px] font-semibold tracking-wider text-zinc-800">Creative. by Aries</span>
                </div>
                
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 md:gap-4 bg-zinc-900 text-white rounded-full py-1.5 md:py-2 px-3 md:px-4 hover:bg-black transition-colors"
                >
                  <span className="text-xs md:text-sm font-medium pl-1 md:pl-2">{isExpanded ? 'Back' : 'Click Here'}</span>
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center">
                    {isExpanded ? <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> : <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />}
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </motion.div>
  );
}
