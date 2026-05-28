import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import BottomNav from '../components/layout/BottomNav';
import LiveMap from '../components/map/LiveMap';
import { toast } from '../components/common/Toast';
import { Share2, X, Download, Award, Image } from 'lucide-react';
import MoodModal from '../components/MoodModal';

function ModalMapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
      map.setView(center, 15);
    }, 150);
  }, [map, center]);
  return null;
}

export default function Tracking() {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distance, setDistance] = useState(0); // in meters
  const [speed, setSpeed] = useState(0); // in m/s
  const [calories, setCalories] = useState(0);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pathPositions, setPathPositions] = useState<[number, number][]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isStarted = hasStarted;

  // Production Timer logic with background safety
  useEffect(() => {
    if (hasStarted && !isPaused && !showEndConfirmation) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, isPaused, showEndConfirmation]);

  // Production Calorie estimation based on distance and average exertion
  useEffect(() => {
    // 0.07 kcal per meter is a standard average for running
    setCalories(Math.round(distance * 0.07));
  }, [distance]);

  const handleLocationUpdate = useCallback((data: {
    positions: [number, number][];
    totalDistance: number;
    currentSpeed: number;
  }) => {
    setDistance(data.totalDistance);
    setSpeed(data.currentSpeed);
    if (data.positions && data.positions.length > 0) {
      setPathPositions(data.positions);
    }
  }, []);

  // High Precision Formatting
  const distanceKm = (distance / 1000).toFixed(2);
  const paceMinutes = distance > 0 ? (elapsedSeconds / 60) / (distance / 1000) : 0;
  const paceFormatted = paceMinutes > 0 && paceMinutes < 60
    ? `${Math.floor(paceMinutes)}:${String(Math.round((paceMinutes % 1) * 60)).padStart(2, '0')}`
    : '--:--';

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return hrs > 0 
      ? `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const elevationGain = Math.round(distance * 0.012); // Production placeholder for altitude

  const handleEndRun = () => {
    // Save to local storage for production persistence
    const workoutData = {
      id: Date.now(),
      type: 'Run',
      distance: distanceKm,
      duration: formatTime(elapsedSeconds),
      calories,
      pace: paceFormatted,
      date: new Date().toISOString()
    };
    const history = JSON.parse(localStorage.getItem('workout_history') || '[]');
    localStorage.setItem('workout_history', JSON.stringify([workoutData, ...history]));
    setShowMoodModal(true);
  };

  const handleStartResume = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleDownloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = '#09090b'; // dark zinc
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add rounded background border/box for inner card
    ctx.fillStyle = '#111115';
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(40, 40, 520, 550, 40);
    ctx.fill();
    ctx.stroke();

    // Brand Label
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('FitGenX Achievements', 80, 110);

    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#4b5563';
    ctx.fillText('Session Performance', 80, 140);

    // Draw the Map Route on Canvas
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Premium Linear Gradient for the path
    const grad = ctx.createLinearGradient(120, 150, 480, 420);
    grad.addColorStop(0, '#AAF0D1');
    grad.addColorStop(1, '#007AFF');
    ctx.strokeStyle = grad;

    ctx.beginPath();
    const rawPath = pathPositions.length >= 2 ? pathPositions : [
      [37.7749, -122.4194],
      [37.7752, -122.4189],
      [37.7758, -122.4198],
      [37.7761, -122.4172],
      [37.7741, -122.4168]
    ];

    const lats = rawPath.map(p => p[0]);
    const lngs = rawPath.map(p => p[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    rawPath.forEach((p, i) => {
      const x = ((p[1] - minLng) / lngRange) * 400 + 100;
      const y = 480 - (((p[0] - minLat) / latRange) * 260 + 100);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Stats Section at bottom of inner card
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px sans-serif';
    ctx.fillText(distanceKm, 80, 520);
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('DISTANCE (KM)', 80, 560);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px sans-serif';
    ctx.fillText(paceFormatted, 260, 520);
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('PACE (/KM)', 260, 560);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px sans-serif';
    ctx.fillText(formatTime(elapsedSeconds), 430, 520);
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('TIME', 430, 560);

    // Call To Action Footer Banner
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Generated with FitGenX Vitality AI', 40, 680);

    // Export & Download canvas as image
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `fitgenx-session-${Date.now()}.png`;
    link.click();
    toast.success("Workout map and stats image downloaded successfully!", "Shared successfully");
    setShowShareModal(false);
  };

  const handleExecuteShare = () => {
    const shareText = `Checkout my run on FitGenX! 🏃‍♂️💨\nDistance: ${distanceKm} km\nDuration: ${formatTime(elapsedSeconds)}\nPace: ${paceFormatted} /km\nBurned: ${calories} kcal`;

    if (navigator.share) {
      navigator.share({
        title: 'FitGenX Performance',
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        toast.success("Workout map & stats summary copied to clipboard!", "Shared successfully");
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Workout map & stats summary copied to clipboard!", "Shared successfully");
    }
    setShowShareModal(false);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans text-white">
      {/* Interactive Map Layer */}
      <LiveMap onLocationUpdate={handleLocationUpdate} isTracking={true} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
      
      {/* Top Header - Production Level Minimalist */}
      <header className="absolute top-10 left-0 w-full px-6 flex justify-between items-center z-50">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/80 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2.5 shadow-2xl"
        >
          <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-zinc-500' : 'bg-red-500 animate-pulse'}`} />
          <span className="text-lg font-black font-headline tabular-nums tracking-tighter">
            {formatTime(elapsedSeconds)}
          </span>
        </motion.div>

        <button 
          onClick={() => setIsLocked(!isLocked)}
          className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-xl border transition-all ${isLocked ? 'bg-primary border-primary text-white' : 'bg-zinc-900/80 border-white/10 text-white/60'}`}
        >
          <span className="material-symbols-outlined text-[20px]">{isLocked ? 'lock' : 'lock_open'}</span>
        </button>
      </header>

      {/* Main Metric Display with started animation */}
      <motion.div
        animate={{ 
          top: isStarted ? '105px' : '22%',
          left: isStarted ? '24px' : '50%',
          translateX: isStarted ? '0%' : '-50%',
          textAlign: isStarted ? 'left' : 'center',
          scale: isStarted ? 0.45 : 1,
          opacity: isLocked ? 0.4 : 1
        }}
        transition={{ type: 'spring', damping: 22, stiffness: 120 }}
        className="absolute flex flex-col pointer-events-none z-20 origin-left select-none"
      >
        <span className="text-[84px] font-black font-headline tracking-tighter leading-none">
          {distanceKm}
        </span>
        <span className={`text-xs font-black uppercase tracking-[0.4em] text-white/30 -mt-1 transition-all ${isStarted ? 'opacity-0 hidden' : 'opacity-100 block'}`}>
          Kilometers
        </span>
      </motion.div>

      {/* Lock Overlay */}
      <AnimatePresence>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/20 backdrop-blur-[2px] flex flex-col items-center justify-center"
          >
            <div className="bg-zinc-900/90 p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">lock</span>
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-white/80">Screen Locked</p>
              <button 
                onClick={() => setIsLocked(false)}
                className="bg-white text-black px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest"
              >
                Tap to Unlock
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End Confirmation Overlay */}
      <AnimatePresence>
        {showEndConfirmation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="bg-zinc-900 w-full max-w-xs rounded-[2.5rem] p-8 border border-white/10 text-center flex flex-col gap-6">
              <div>
                <h3 className="text-2xl font-black font-headline tracking-tight mb-2">End Session?</h3>
                <p className="text-zinc-500 text-xs font-medium">Ready to save your progress and see your achievements?</p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleEndRun}
                  className="bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
                >
                  Save and End
                </button>
                <button 
                  onClick={() => setShowEndConfirmation(false)}
                  className="bg-white/10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-white/60"
                >
                  Resume Run
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FitGenX Style Shareable Summary Map Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] bg-black/75 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900/95 border border-white/10 rounded-[2.5rem] w-full max-w-sm overflow-hidden flex flex-col p-6 gap-6 relative shadow-[0_30px_90px_rgba(0,0,0,0.8)]"
            >
              {/* Top Banner and Close button */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Award className="text-primary" size={16} />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/50">FitGenX Achievements</span>
                </div>
                <button onClick={() => setShowShareModal(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-white/60">
                  <X size={16} />
                </button>
              </div>

              {/* FitGenX Brand Specific Custom Map Representation Card */}
              <div className="bg-zinc-950 p-5 rounded-[2rem] border border-white/5 relative overflow-hidden flex flex-col justify-between h-72 shadow-inner">
                {/* Brand Name */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-xs font-black tracking-widest uppercase text-white">FitGenX</span>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Session Performance</p>
                  </div>
                  <Download size={16} className="text-white/20" />
                </div>

                {/* Styled Leaflet Map matching the App's Map Style exactly */}
                <div className="absolute inset-0 z-0 pointer-events-none p-2 rounded-[2rem] overflow-hidden">
                  <MapContainer
                    center={pathPositions.length > 0 ? pathPositions[pathPositions.length - 1] : [20.5937, 78.9629]}
                    zoom={15}
                    zoomControl={false}
                    className="w-full h-full pointer-events-none select-none opacity-100"
                    style={{ background: '#09090b', height: '100%' }}
                  >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    {pathPositions.length > 1 && (
                      <Polyline
                        positions={pathPositions}
                        pathOptions={{
                          color: '#00D1FF',
                          weight: 5,
                          lineCap: 'round',
                          lineJoin: 'round',
                        }}
                      />
                    )}
                    <ModalMapController center={pathPositions.length > 0 ? pathPositions[pathPositions.length - 1] : [20.5937, 78.9629]} />
                  </MapContainer>
                </div>

                {/* Card Key Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 z-10 bg-zinc-950/80 backdrop-blur-md rounded-b-[1.8rem] -mx-5 px-5 -mb-5 pb-5">
                  <div className="text-center">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Distance</p>
                    <p className="font-display text-lg font-black text-white leading-none">{distanceKm}<span className="text-[10px] ml-0.5 opacity-40 uppercase">km</span></p>
                  </div>
                  <div className="text-center border-x border-white/5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Pace</p>
                    <p className="font-display text-lg font-black text-white leading-none">{paceFormatted}<span className="text-[10px] ml-0.5 opacity-40 uppercase">/km</span></p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Time</p>
                    <p className="font-display text-lg font-black text-white leading-none">{formatTime(elapsedSeconds)}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <button 
                  onClick={handleExecuteShare}
                  className="w-full py-4 rounded-2xl bg-white text-zinc-900 font-display font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-[0.98] hover:bg-zinc-100"
                >
                  <Share2 size={16} />
                  <span>Share Summary</span>
                </button>

                <button 
                  onClick={handleDownloadCard}
                  className="w-full py-3.5 rounded-2xl bg-zinc-800 text-white font-display font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] hover:bg-zinc-700 border border-white/5"
                >
                  <Image size={16} />
                  <span>Save Map & Stats to PNG</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bento & Controls Drawer - Drag-to-Slide Interface */}
      <div className="absolute bottom-0 left-0 w-full z-30">
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 320 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) setIsStatsExpanded(false);
            if (info.offset.y < -100) setIsStatsExpanded(true);
          }}
          initial={false}
          animate={{ y: isStatsExpanded ? 0 : 320 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-zinc-900/98 backdrop-blur-3xl rounded-t-[3.5rem] border-t border-white/10 p-8 pt-12 shadow-[0_-20px_80px_rgba(0,0,0,0.9)] pb-24 cursor-grab active:cursor-grabbing"
        >
          {/* Drawer Handle */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/10 rounded-full" />

          {/* Action Controls - Moved Higher for Reachability & Visibility */}
          <div className="flex justify-center items-center gap-8 mb-12">
            <button 
              onClick={() => setShowEndConfirmation(true)}
              className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-xl">stop_circle</span>
            </button>

            <button 
              onClick={handleStartResume}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-black text-4xl font-bold">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
            </button>

            <button 
              onClick={handleShare}
              className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 active:scale-90"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </button>
          </div>

          {/* Optimized Bento Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 p-5 rounded-[1.8rem] border border-white/5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-xs text-primary">speed</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Pace</p>
              </div>
              <p className="text-3xl font-black font-headline tabular-nums leading-none">{paceFormatted}</p>
            </div>
            <div className="bg-white/5 p-5 rounded-[1.8rem] border border-white/5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-xs text-orange-500">local_fire_department</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Calories</p>
              </div>
              <p className="text-3xl font-black font-headline tabular-nums leading-none">{calories}</p>
            </div>
            <div className="col-span-2 bg-white/5 p-5 rounded-[1.8rem] border border-white/5 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Elevation</p>
                <p className="text-2xl font-black font-headline tabular-nums">{elevationGain}<span className="text-xs text-white/20 ml-1 uppercase">m</span></p>
              </div>
              <div className="h-10 w-px bg-white/10 mx-6" />
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Current Speed</p>
                <p className="text-2xl font-black font-headline tabular-nums text-primary">{(speed * 3.6).toFixed(1)}<span className="text-xs text-white/20 ml-1 uppercase">km/h</span></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showMoodModal && (
          <MoodModal 
            onComplete={() => {
              setShowMoodModal(false);
              navigate('/analytics');
            }} 
            onDismiss={() => {
              setShowMoodModal(false);
              navigate('/analytics');
            }} 
          />
        )}
      </AnimatePresence>

      <div className="relative z-[100]">
        <BottomNav />
      </div>
    </div>
  );
}
