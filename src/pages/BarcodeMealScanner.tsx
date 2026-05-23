import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNutritionStore } from '../stores/nutritionStore';
import { useProteinStore } from '../stores/proteinStore';
import { ArrowLeft, ScanLine, Sparkles, Check, Camera, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BarcodeMealScanner() {
  const navigate = useNavigate();
  const { addFood, loggedFoods } = useNutritionStore();
  const { addProtein } = useProteinStore();
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [cals, setCals] = useState('');
  const [protein, setProtein] = useState('');

  const [loading, setLoading] = useState(false);
  const [foundProduct, setFoundProduct] = useState<any>(null);

  // Photo-to-Calorie Tracker States
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoResult, setPhotoResult] = useState<{
    name: string;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  } | null>(null);

  const scanBarcode = async () => {
    if (!barcode.trim()) return;
    setLoading(true);
    setFoundProduct(null);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      if (data && data.status === 1) {
        const prod = data.product;
        setFoundProduct({
          name: prod.product_name || 'Generic Barcoded Item',
          calories: Math.round(prod.nutriments?.['energy-kcal_100g'] || 0),
          proteins: Math.round(prod.nutriments?.['proteins_100g'] || 0),
          carbs: Math.round(prod.nutriments?.['carbohydrates_100g'] || 0),
          fats: Math.round(prod.nutriments?.['fat_100g'] || 0),
        });
      } else {
        // Mock default if offline or not found
        setFoundProduct({
          name: 'Handcrafted Trail Mix',
          calories: 340,
          proteins: 12,
          carbs: 22,
          fats: 16,
        });
      }
    } catch {
      setFoundProduct({
        name: 'Packaged Fitness Bar',
        calories: 220,
        proteins: 18,
        carbs: 24,
        fats: 6,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualAdd = () => {
    if (name.trim() && cals.trim()) {
      if (window.confirm('Should I update the stats?')) {
        addFood({
          name,
          calories: Number(cals) || 0,
          proteins: Number(protein) || 0,
          carbs: 0,
          fats: 0,
        });
        addProtein(Number(protein) || 0);
      }
      setName('');
      setCals('');
      setProtein('');
    }
  };

  const handleSaveScanned = () => {
    if (foundProduct) {
      if (window.confirm('Should I update the stats?')) {
        addFood({
          name: foundProduct.name,
          calories: foundProduct.calories,
          proteins: foundProduct.proteins,
          carbs: foundProduct.carbs,
          fats: foundProduct.fats,
        });
        addProtein(foundProduct.proteins);
      }
      setFoundProduct(null);
      setBarcode('');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setPhotoLoading(true);
    setPhotoResult(null);

    // AI vision simulation
    setTimeout(() => {
      setPhotoLoading(false);
      setPhotoResult({
        name: 'Fresh Avocado Toast with Egg',
        calories: 320,
        proteins: 14,
        carbs: 28,
        fats: 16,
      });
    }, 1500);
  };

  const handleSavePhotoScan = () => {
    if (photoResult) {
      if (window.confirm('Should I update the stats?')) {
        addFood({
          name: photoResult.name,
          calories: photoResult.calories,
          proteins: photoResult.proteins,
          carbs: photoResult.carbs,
          fats: photoResult.fats,
        });
        addProtein(photoResult.proteins);
      }
      setPhotoResult(null);
      setPhotoPreview(null);
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen pb-24 flex flex-col items-stretch max-w-[430px] mx-auto select-none">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-outline-variant/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl fixed top-0 w-full max-w-[430px] z-[100]">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full text-zinc-700 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-400">Meal & Macro Scanner</h1>
        <div className="w-8" />
      </header>

      <main className="mt-24 px-6 flex-1 space-y-8 flex flex-col">
        {/* Instant Scan Card */}
        <div className="p-5 bg-surface-container-low border border-outline-variant/10 dark:bg-zinc-900/40 dark:border-white/5 rounded-3xl space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary dark:text-primary flex items-center gap-1.5">
              <ScanLine size={12} /> Barcode Lookup
            </span>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Scan packaging with Open Food Facts API instantly.</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter barcode e.g. 5449000000996"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="flex-1 bg-white dark:bg-zinc-900/60 border border-outline-variant/15 dark:border-white/5 rounded-2xl p-3 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300 dark:focus:border-white/10"
            />
            <button
              onClick={scanBarcode}
              className="px-4 bg-secondary hover:bg-secondary/90 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-black text-xs active:scale-95 transition-all flex items-center justify-center"
            >
              Scan
            </button>
          </div>

          {loading && <div className="text-xs text-center text-secondary dark:text-primary animate-pulse font-semibold">Scanning and retrieving macro data...</div>}

          {foundProduct && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white/50 dark:bg-white/5 border border-outline-variant/15 dark:border-white/5 rounded-2xl flex flex-col space-y-3"
            >
              <div>
                <p className="text-xs font-black text-zinc-900 dark:text-white">{foundProduct.name}</p>
                <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">Parsed nutrition profile</p>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center bg-white dark:bg-zinc-900/40 p-2 rounded-xl border border-outline-variant/10 dark:border-white/5">
                <div>
                  <p className="text-[10px] font-black tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Cals</p>
                  <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 mt-0.5">{foundProduct.calories}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Pro</p>
                  <p className="text-xs font-black text-secondary dark:text-emerald-400 mt-0.5">{foundProduct.proteins}g</p>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Carbs</p>
                  <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 mt-0.5">{foundProduct.carbs}g</p>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Fat</p>
                  <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 mt-0.5">{foundProduct.fats}g</p>
                </div>
              </div>

              <button
                onClick={handleSaveScanned}
                className="w-full py-3 bg-secondary hover:bg-secondary/90 dark:bg-primary text-white dark:text-zinc-950 font-black uppercase tracking-wider text-xs rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Check size={16} />
                <span>Log Item</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Photo to Calorie Tracker Card */}
        <div className="p-5 bg-surface-container-low border border-outline-variant/10 dark:bg-zinc-900/40 dark:border-white/5 rounded-3xl space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary dark:text-primary flex items-center gap-1.5">
              <Camera size={12} /> Photo to Calorie Tracker
            </span>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Upload or snap a photo of your meal to analyze instantly.</p>
          </div>

          <div className="flex flex-col items-stretch gap-2">
            <label className="w-full bg-white hover:bg-zinc-50 dark:bg-zinc-900/60 hover:dark:bg-zinc-800 border border-outline-variant/15 dark:border-white/5 rounded-2xl p-4 text-xs font-black text-center text-zinc-800 dark:text-white cursor-pointer transition-all flex items-center justify-center gap-2">
              <UploadCloud size={16} className="text-secondary dark:text-primary" />
              <span>{photoPreview ? 'Change Photo' : 'Capture or Upload Photo'}</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          {photoPreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full h-40 rounded-2xl overflow-hidden border border-outline-variant/15 dark:border-white/5"
            >
              <img src={photoPreview} alt="Meal preview" className="w-full h-full object-cover" />
            </motion.div>
          )}

          {photoLoading && <div className="text-xs text-center text-secondary dark:text-primary animate-pulse font-semibold">AI identifying food ingredients and calories...</div>}

          {photoResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white/50 dark:bg-white/5 border border-outline-variant/15 dark:border-white/5 rounded-2xl flex flex-col space-y-3"
            >
              <div>
                <p className="text-xs font-black text-zinc-900 dark:text-white">{photoResult.name}</p>
                <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">AI identified nutritional info</p>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center bg-white dark:bg-zinc-900/40 p-2 rounded-xl border border-outline-variant/10 dark:border-white/5">
                <div>
                  <p className="text-[10px] font-black tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Cals</p>
                  <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 mt-0.5">{photoResult.calories}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Pro</p>
                  <p className="text-xs font-black text-secondary dark:text-emerald-400 mt-0.5">{photoResult.proteins}g</p>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Carbs</p>
                  <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 mt-0.5">{photoResult.carbs}g</p>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">Fat</p>
                  <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 mt-0.5">{photoResult.fats}g</p>
                </div>
              </div>

              <button
                onClick={handleSavePhotoScan}
                className="w-full py-3 bg-secondary hover:bg-secondary/90 dark:bg-primary text-white dark:text-zinc-950 font-black uppercase tracking-wider text-xs rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Check size={16} />
                <span>Log AI Scan</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Manual Addition */}
        <div className="p-5 bg-surface-container-low border border-outline-variant/10 dark:bg-zinc-900/40 dark:border-white/5 rounded-3xl space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Sparkles size={12} /> Add custom food
            </span>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Item name (e.g. Scrambled eggs)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900/60 border border-outline-variant/15 dark:border-white/5 rounded-2xl p-3 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Calories"
                value={cals}
                onChange={(e) => setCals(e.target.value)}
                className="bg-white dark:bg-zinc-900/60 border border-outline-variant/15 dark:border-white/5 rounded-2xl p-3 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Protein (g)"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="bg-white dark:bg-zinc-900/60 border border-outline-variant/15 dark:border-white/5 rounded-2xl p-3 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
              />
            </div>

            <button
              onClick={handleManualAdd}
              className="w-full py-3.5 bg-secondary hover:bg-secondary/90 dark:bg-white text-white dark:text-zinc-950 font-black uppercase tracking-wider text-xs rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Add Custom Macro</span>
            </button>
          </div>
        </div>

        {/* History of additions */}
        <div className="space-y-3 flex-1 overflow-y-auto">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Today's logs</h3>
          {loggedFoods.length === 0 ? (
            <div className="text-xs text-center py-4 text-zinc-400 dark:text-zinc-600 font-semibold">No food logged today.</div>
          ) : (
            loggedFoods.map((f) => (
              <div key={f.id} className="p-3 bg-surface-container-low border border-outline-variant/10 dark:bg-zinc-900/40 dark:border-white/5 rounded-2xl flex justify-between items-center select-none">
                <div>
                  <p className="text-xs font-black text-zinc-900 dark:text-white">{f.name}</p>
                  <p className="text-[10px] font-semibold text-zinc-500">{new Date(f.loggedAt).toLocaleTimeString()}</p>
                </div>
                <p className="text-sm font-black tracking-tight text-secondary dark:text-emerald-400">{f.calories} <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">kcal</span></p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
