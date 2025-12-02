import React, { useState, useEffect } from 'react';
import { MapPin, Box, Scale, Layers, Send, Loader2, Sparkles } from 'lucide-react';
import { User, Donation, DonationCategory } from '../types';
import { storageService } from '../services/storageService';
import { analyzeDonationItems } from '../services/geminiService';

interface DonationFormProps {
  user: User;
  onSuccess: () => void;
}

export const DonationForm: React.FC<DonationFormProps> = ({ user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Form State
  const [location, setLocation] = useState('');
  const [items, setItems] = useState('');
  const [weight, setWeight] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [category, setCategory] = useState<DonationCategory>(DonationCategory.OTHER);
  const [autoAnalysisDone, setAutoAnalysisDone] = useState(false);

  // Attempt to get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
           // In a real app, reverse geocode here. For now, we will leave it blank or mock.
           // const { latitude, longitude } = position.coords;
           // setLocation("Detected Location (London)"); 
        },
        (error) => console.log("Geolocation blocked or failed")
      );
    }
  }, []);

  const handleSmartAnalyze = async () => {
    if (!items.trim()) return;
    setAnalyzing(true);
    try {
        const analysis = await analyzeDonationItems(items);
        setCategory(analysis.category);
        setAutoAnalysisDone(true);
    } catch (e) {
        console.error(e);
    } finally {
        setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Final check for AI analysis to generate impact message if not done
    let impactMsg = "";
    if (!autoAnalysisDone) {
        const analysis = await analyzeDonationItems(items);
        setCategory(analysis.category); // Fallback update
        impactMsg = analysis.impactMessage;
    } else {
        // Re-run quickly just for the message if we only set category before
        const analysis = await analyzeDonationItems(items);
        impactMsg = analysis.impactMessage;
    }

    const newDonation: Donation = {
      id: Date.now().toString(),
      userId: user.id,
      donorName: user.name,
      location: location,
      itemsDescription: items,
      category: category,
      weightKg: parseFloat(weight),
      quantity: parseInt(quantity),
      date: new Date().toISOString(),
      status: 'Pending',
      impactMessage: impactMsg
    };

    storageService.addDonation(newDonation);
    
    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-emerald-900 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Box className="mr-3" />
            Register Donation
          </h2>
          <p className="text-emerald-200 mt-2">
            Please details the items you are sending. Our AI will help categorize them.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Collection Location (UK)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., 123 Baker St, London"
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
              />
            </div>
          </div>

          {/* Items Description with AI Magic */}
          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Items Description</label>
                {!autoAnalysisDone && items.length > 5 && (
                    <button 
                        type="button" 
                        onClick={handleSmartAnalyze}
                        disabled={analyzing}
                        className="text-xs flex items-center text-purple-600 hover:text-purple-800 font-medium transition"
                    >
                        {analyzing ? <Loader2 className="animate-spin w-3 h-3 mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                        Auto-Categorize
                    </button>
                )}
            </div>
            <textarea
              required
              value={items}
              onChange={(e) => {
                  setItems(e.target.value);
                  setAutoAnalysisDone(false);
              }}
              onBlur={() => { if(items.length > 5 && !autoAnalysisDone) handleSmartAnalyze() }}
              rows={3}
              placeholder="e.g., 100 cans of tuna, 50kg rice bag, 20 blankets"
              className="block w-full p-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Total Weight (kg)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Scale className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-2">Item Quantity (Units)</label>
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Layers className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
               </div>
            </div>
          </div>

          {/* Category Selection (Auto-filled but editable) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {Object.values(DonationCategory).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 text-sm rounded-md border transition-all ${
                    category === cat
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-medium'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg text-white font-bold text-lg shadow-md transition-all
                ${loading ? 'bg-emerald-700 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="-ml-1 mr-3 h-5 w-5" />
                  Submit Donation
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
