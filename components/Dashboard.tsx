import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, Users, Weight, TrendingUp, MapPin, Clock } from 'lucide-react';
import { storageService } from '../services/storageService';
import { DashboardStats } from '../types';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await storageService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="p-10 text-center">Loading Hub Data...</div>;

  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#6366F1', '#EC4899'];

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Hero Section with Logo Image */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 p-8 md:p-12 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Relief Aid Progress</h1>
            <p className="text-emerald-50 text-lg mb-6">
              Tracking real-time contributions from the UK to support communities in Sri Lanka.
              Join hundreds of donors making a tangible difference today.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center p-8">
            <img src="/logo.png" alt="Relief Hub Logo" className="max-w-xs w-full h-auto rounded-full shadow-2xl" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center space-x-4">
          <div className="p-4 bg-emerald-50 rounded-full text-emerald-600">
            <Weight size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Aid Collected</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.totalWeight.toLocaleString()} <span className="text-sm text-slate-400">kg</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex items-center space-x-4">
          <div className="p-4 bg-blue-50 rounded-full text-blue-600">
            <Package size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Shipments</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.totalDonations}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 flex items-center space-x-4">
          <div className="p-4 bg-orange-50 rounded-full text-orange-600">
            <Users size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Active Donors</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.donorsCount}</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Bar Chart: Weight by Category */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <TrendingUp className="mr-2 text-emerald-600" size={20} />
              Donation Categories (by Weight)
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryBreakdown}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]}>
                  {stats.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center mb-6">
            <Clock className="mr-2 text-blue-600" size={20} />
            Recent Contributions
          </h3>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {stats.recentDonations.map((donation) => (
              <div key={donation.id} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${donation.status === 'Delivered' ? 'bg-green-500' :
                  donation.status === 'Shipped' ? 'bg-blue-500' : 'bg-orange-500'
                  }`} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-slate-800">{donation.donorName}</p>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{donation.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center mt-1">
                    <MapPin size={10} className="mr-1" /> {donation.location}
                  </p>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-1">{donation.itemsDescription}</p>
                  {donation.impactMessage && (
                    <p className="text-xs text-emerald-600 mt-1 italic font-medium">
                      "{donation.impactMessage}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
