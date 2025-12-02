import React, { useState } from 'react';
import { MapPin, Box, Scale, Layers, Send, Loader2 } from 'lucide-react';
import { User, Donation, DonationCategory } from '../types';
import { storageService } from '../services/storageService';

interface DonationFormProps {
  user: User;
  onSuccess: () => void;
}

export const DonationForm: React.FC<DonationFormProps> = ({ user, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  // Form State
  const [location, setLocation] = useState('');
  const [items, setItems] = useState('');
  const [weight, setWeight] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [category, setCategory] = useState<DonationCategory>(DonationCategory.OTHER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      impactMessage: ''
    };

    try {
      await storageService.addDonation(newDonation);
      setLoading(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating donation:', error);
      setLoading(false);
      alert('Failed to create donation. Please try again.');
    }
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
            Please provide details about the items you are sending.
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

          {/* Items Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Items Description</label>
            <textarea
              required
              value={items}
              onChange={(e) => setItems(e.target.value)}
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

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {Object.values(DonationCategory).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 text-sm rounded-md border transition-all ${category === cat
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
