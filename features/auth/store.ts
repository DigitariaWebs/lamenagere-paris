import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import type { User } from "../../lib/types";
import type { AuthActions, AuthState, RegisterPayload } from "./types";
import { loginApi, logoutApi, registerApi } from "./api";
import { AUTH_TOKEN_KEY, USER_KEY } from "../../lib/storage";

type AuthStore = AuthState & AuthActions;

// Mock user for development (no backend yet)
const MOCK_USER: User = {
  id: "1",
  email: "",
  firstName: "Jean",
  lastName: "Laurent",
  phone: "+33 6 12 34 56 78",
  accountType: "particulier",
  addresses: [],
  createdAt: new Date().toISOString(),
};

const MOCK_TOKEN = "dev-mock-token";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await loginApi({ email, password });
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      // Fallback to mock auth for development
      const mockUser = { ...MOCK_USER, email };
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, MOCK_TOKEN);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));
      set({
        user: mockUser,
        token: MOCK_TOKEN,
        isAuthenticated: true,
        isLoading: false,
      });
    }
  },

  register: async (data: RegisterPayload) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await registerApi(data);
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      // Fallback to mock auth for development
      const mockUser: User = {
        ...MOCK_USER,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        accountType: data.accountType,
        company: data.company,
        siret: data.siret,
      };
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, MOCK_TOKEN);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));
      set({
        user: mockUser,
        token: MOCK_TOKEN,
        isAuthenticated: true,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await logoutApi();
    } catch {
      // ignore logout API errors
    }
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  loadSession: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      if (token && userJson) {
        const user: User = JSON.parse(userJson);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  setUser: (user: User) => set({ user }),

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),
}));
