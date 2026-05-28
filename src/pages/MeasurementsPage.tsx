import { useState } from 'react';
import { useMeasurementStore } from '../stores/measurementStore';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MeasurementsPage() {
  const navigate = useNavigate();
  const { measurementLogs, addMeasurementEntry } = useMeasurementStore();

  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [hips, setHips] = useState('');
  const [weight, setWeight] = useState('');

  const handleSave = () => {
    if (waist.trim() || weight.trim()) {
      addMeasurementEntry({
        waist: Number(waist) || undefined,
        chest: Number(chest) || undefined,
        hips: Number(hips) || undefined,
        weight: Number(weight) || undefined,
        unit: 'cm',
      });
      setWaist('');
      setChest('');
      setHips('');
      setWeight('');
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen text-white pb-24 flex flex-col items-stretch max-w-[430px] mx-auto select-none">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl fixed top-0 w-full max-w-[430px] z-[100]">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest text-zinc-400">Dimension Tracker</h1>
        <div className="w-8" />
      </header>

      <main className="mt-24 px-6 flex-1 space-y-8 flex flex-col">
        <div className="p-5 bg-zinc-900/40 border border-white/5 rounded-3xl space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-1.5">
              <Sparkles size={12} /> Log Measurements
            </span>
            <p className="text-xs font-semibold text-zinc-400">Track body dimension changes over time without any guilt.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Waist (cm)"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="bg-zinc-900/60 border border-white/5 rounded-2xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Chest (cm)"
              value={chest}
              onChange={(e) => setChest(e.target.value)}
              className="bg-zinc-900/60 border border-white/5 rounded-2xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Hips (cm)"
              value={hips}
              onChange={(e) => setHips(e.target.value)}
              className="bg-zinc-900/60 border border-white/5 rounded-2xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="bg-zinc-900/60 border border-white/5 rounded-2xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3.5 bg-white text-zinc-950 font-black uppercase tracking-wider text-xs rounded-2xl hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Check size={16} />
            <span>Save Entry</span>
          </button>
        </div>

        {/* History of additions */}
        <div className="space-y-3 flex-1 overflow-y-auto">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Measurement timeline</h3>
          {measurementLogs.length === 0 ? (
            <div className="text-xs text-center py-4 text-zinc-600 font-semibold">No measurements logged yet.</div>
          ) : (
            measurementLogs.map((entry) => (
              <div key={entry.id} className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl space-y-3 select-none">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-black text-white">{new Date(entry.date).toLocaleDateString()}</p>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 text-zinc-500">
                    cm / kg
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1 text-center border-t border-white/5 pt-2">
                  {entry.waist && (
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Waist</p>
                      <p className="text-xs font-black text-white mt-0.5">{entry.waist}</p>
                    </div>
                  )}
                  {entry.chest && (
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Chest</p>
                      <p className="text-xs font-black text-white mt-0.5">{entry.chest}</p>
                    </div>
                  )}
                  {entry.hips && (
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Hips</p>
                      <p className="text-xs font-black text-white mt-0.5">{entry.hips}</p>
                    </div>
                  )}
                  {entry.weight && (
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Weight</p>
                      <p className="text-xs font-black text-white mt-0.5">{entry.weight}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
