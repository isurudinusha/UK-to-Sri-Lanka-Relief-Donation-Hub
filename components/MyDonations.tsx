import React, { useEffect, useState } from 'react';
import { User, Donation } from '../types';
import { storageService } from '../services/storageService';
import { Package, MapPin, Calendar, CheckCircle, Truck, Clock } from 'lucide-react';

interface MyDonationsProps {
  user: User;
}

export const MyDonations: React.FC<MyDonationsProps> = ({ user }) => {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const data = storageService.getUserDonations(user.id);
    // Sort by date desc
    setDonations(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [user.id]);

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
         <h2 className="text-2xl font-bold text-slate-800">My Contributions</h2>
         <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full">
            {donations.length} {donations.length === 1 ? 'Item' : 'Items'}
         </span>
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

              <div className="flex-shrink-0 flex md:flex-col gap-2">
                 {/* Action buttons could go here (Edit, Cancel) - omitted for scope */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
