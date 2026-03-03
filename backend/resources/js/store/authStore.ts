import { create } from 'zustand';
import api from '../lib/axios';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    shop_name?: string;
    shop_address?: string;
    pan_number?: string;
    registration_number?: string;
    logo_path?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User) => void;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: !!localStorage.getItem('auth_token'),
    isLoading: true,
    setUser: (user) => set({ user }),
    setAuth: (user, token) => {
        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
    },
    checkAuth: async () => {
        try {
            const { data } = await api.get('/auth/user');
            set({ user: data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            localStorage.removeItem('auth_token');
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
    }
}));
