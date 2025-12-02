import { Donation, DonationCategory, User, DashboardStats } from '../types';

const USERS_KEY = 'srilanka_relief_users';
const DONATIONS_KEY = 'srilanka_relief_donations';
const CURRENT_USER_KEY = 'srilanka_relief_current_user';

// Seed data
const INITIAL_DONATIONS: Donation[] = [
  {
    id: '1',
    userId: 'user_2',
    donorName: 'Sarah Jenkins',
    location: 'London',
    itemsDescription: '50kg of rice and 20 packs of dried lentils',
    category: DonationCategory.FOOD,
    weightKg: 50,
    quantity: 70,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'Shipped',
    impactMessage: 'Providing essential nutrition to families in need.'
  },
  {
    id: '2',
    userId: 'user_3',
    donorName: 'David Miller',
    location: 'Manchester',
    itemsDescription: 'First aid kits, bandages, and paracetamol',
    category: DonationCategory.MEDICAL,
    weightKg: 15,
    quantity: 30,
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'Collected',
    impactMessage: 'Crucial medical supplies for emergency relief.'
  },
  {
    id: '3',
    userId: 'user_4',
    donorName: 'Colombo Association UK',
    location: 'Birmingham',
    itemsDescription: 'School books, pencils, and backpacks for 50 children',
    category: DonationCategory.EDUCATION,
    weightKg: 120,
    quantity: 150,
    date: new Date().toISOString(),
    status: 'Pending',
    impactMessage: 'Empowering the next generation through education.'
  }
];

export const storageService = {
  login: (name: string, email: string): User => {
    const user: User = {
      id: email.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  addDonation: (donation: Donation) => {
    const donations = storageService.getAllDonations();
    donations.unshift(donation);
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
  },

  getAllDonations: (): Donation[] => {
    const stored = localStorage.getItem(DONATIONS_KEY);
    if (!stored) {
      // Return seed data if empty and save it
      localStorage.setItem(DONATIONS_KEY, JSON.stringify(INITIAL_DONATIONS));
      return INITIAL_DONATIONS;
    }
    return JSON.parse(stored);
  },

  getUserDonations: (userId: string): Donation[] => {
    return storageService.getAllDonations().filter(d => d.userId === userId);
  },

  getStats: (): DashboardStats => {
    const donations = storageService.getAllDonations();
    
    const totalWeight = donations.reduce((acc, curr) => acc + curr.weightKg, 0);
    const totalDonations = donations.length;
    const uniqueDonors = new Set(donations.map(d => d.userId)).size;

    // Calculate category breakdown
    const categoryMap: Record<string, number> = {};
    donations.forEach(d => {
      categoryMap[d.category] = (categoryMap[d.category] || 0) + d.weightKg;
    });

    const categoryBreakdown = Object.keys(categoryMap).map(key => ({
      name: key,
      value: categoryMap[key]
    }));

    return {
      totalWeight,
      totalDonations,
      donorsCount: uniqueDonors,
      categoryBreakdown,
      recentDonations: donations.slice(0, 5)
    };
  }
};
