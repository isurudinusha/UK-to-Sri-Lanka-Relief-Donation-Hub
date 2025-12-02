import React, { useEffect, useState } from 'react';
import { User, Donation, DonationCategory } from '../types';
import { storageService } from '../services/storageService';
import { Package, MapPin, Calendar, CheckCircle, Truck, Clock, Edit, Trash2, X, Save, Plus } from 'lucide-react';

interface MyDonationsProps {
  user: User;
  onNavigateToDonate?: () => void;
}

export const MyDonations: React.FC<MyDonationsProps> = ({ user, onNavigateToDonate }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, [user.id]);

  const fetchDonations = async () => {
    try {
      const data = await storageService.getUserDonations(user.id);
      // Sort by date desc
      setDonations(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handleEdit = (donation: Donation) => {
    setEditingDonation({ ...donation });
  };

  const handleSaveEdit = async () => {
    if (!editingDonation) return;
    setLoading(true);
    try {
      await storageService.updateDonation(editingDonation.id, editingDonation);
      await fetchDonations();
      setEditingDonation(null);
    } catch (error) {
      console.error('Error updating donation:', error);
      alert('Failed to update donation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await storageService.deleteDonation(id);
      await fetchDonations();
      setDeletingId(null);
    } catch (error) {
      console.error('Error deleting donation:', error);
      alert('Failed to delete donation');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="text-green-500" />;
      case 'Shipped': return <Truck className="text-blue-500" />;
      default: return <Clock className="text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  if (donations.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
        <Package className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-2 text-sm font-medium text-slate-900">No donations yet</h3>
        <p className="mt-1 text-sm text-slate-500">Get started by creating a new donation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800">My Contributions</h2>
          <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full">
            {donations.length} {donations.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>
        {onNavigateToDonate && (
          <button
            onClick={onNavigateToDonate}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium shadow-sm"
          >
            <Plus size={20} />
            Add Donation
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {donations.map((donation) => (
          <div key={donation.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(donation.status)} flex items-center gap-1`}>
                    {getStatusIcon(donation.status)}
                    {donation.status}
                  </span>
                  <span className="text-slate-400 text-sm flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {new Date(donation.date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-1">{donation.category} Package</h3>
                <p className="text-slate-600 mb-3">{donation.itemsDescription}</p>

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center bg-slate-50 px-2 py-1 rounded">
                    <Package size={14} className="mr-1" /> {donation.quantity} Units
                  </span>
                  <span className="flex items-center bg-slate-50 px-2 py-1 rounded">
                    <span className="font-bold mr-1">{donation.weightKg}</span> kg
                  </span>
                  <span className="flex items-center bg-slate-50 px-2 py-1 rounded">
                    <MapPin size={14} className="mr-1" /> {donation.location}
                  </span>
                </div>

                {donation.impactMessage && (
                  <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <p className="text-sm text-emerald-800 italic">
                      " {donation.impactMessage} "
                    </p>
                  </div>
                )}
              </div>

              <div className="flex md:flex-col gap-2">
                <button
                  onClick={() => handleEdit(donation)}
                  className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => setDeletingId(donation.id)}
                  className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Edit Donation</h3>
              <button onClick={() => setEditingDonation(null)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editingDonation.location}
                  onChange={(e) => setEditingDonation({ ...editingDonation, location: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Items Description</label>
                <textarea
                  rows={3}
                  value={editingDonation.itemsDescription}
                  onChange={(e) => setEditingDonation({ ...editingDonation, itemsDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingDonation.weightKg}
                    onChange={(e) => setEditingDonation({ ...editingDonation, weightKg: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={editingDonation.quantity}
                    onChange={(e) => setEditingDonation({ ...editingDonation, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {Object.values(DonationCategory).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setEditingDonation({ ...editingDonation, category: cat })}
                      className={`px-3 py-2 text-sm rounded-md border transition-all ${editingDonation.category === cat
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-medium'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
              <button
                onClick={() => setEditingDonation(null)}
                className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Donation?</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this donation? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletingId(null)}
                className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
