import { Donation, DonationCategory, User, DashboardStats } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';
const CURRENT_USER_KEY = 'srilanka_relief_current_user';

export const storageService = {
  signup: async (name: string, email: string, password: string, phone: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create account');
    }

    const user = await response.json();
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  login: async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const user = await response.json();
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

  addDonation: async (donation: Donation): Promise<Donation> => {
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donation),
    });

    if (!response.ok) {
      throw new Error('Failed to create donation');
    }

    return await response.json();
  },

  getAllDonations: async (): Promise<Donation[]> => {
    const response = await fetch(`${API_BASE_URL}/donations`);

    if (!response.ok) {
      throw new Error('Failed to fetch donations');
    }

    return await response.json();
  },

  getUserDonations: async (userId: string): Promise<Donation[]> => {
    const response = await fetch(`${API_BASE_URL}/donations/user/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user donations');
    }

    return await response.json();
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_BASE_URL}/donations/stats`);

    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }

    return await response.json();
  },

  updateDonation: async (id: string, donation: Partial<Donation>): Promise<Donation> => {
    const response = await fetch(`${API_BASE_URL}/donations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donation),
    });

    if (!response.ok) {
      throw new Error('Failed to update donation');
    }

    return await response.json();
  },

  deleteDonation: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/donations/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete donation');
    }
  }
};
