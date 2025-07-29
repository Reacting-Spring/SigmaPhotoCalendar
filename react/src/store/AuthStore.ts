import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  access_token: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access_token: null,
      setAccessToken: (token: string) => set({ access_token: token }),
      clearAccessToken: () => set({ access_token: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
