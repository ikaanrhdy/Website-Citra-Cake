import type { AdminRole } from "@/data/adminData";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth } from "@/lib/firebase";
import {
  updateProfile as firebaseUpdateProfile,
  updateEmail as firebaseUpdateEmail,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

export type UserType = "admin" | "customer";
export type Role = AdminRole | "customer";

export interface UserProfileFields {
  phone: string | null;
  gender: string | null;
  birthDate: string | null;
  address: string | null;
}

interface AuthState extends UserProfileFields {
  isAuthenticated: boolean;
  userId: string | null;
  name: string | null;
  email: string | null;
  role: Role | null;
  userType: UserType | null;
  token: string | null;
  tokenExpiresAt: number | null;
  isLoading: boolean;
  error: string | null;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
  address?: string;
}

export interface AuthStore extends AuthState {
  login: (data: {
    userId: string;
    name: string;
    email?: string;
    role: Role;
    userType: UserType;
    token: string;
    expiresIn: number;
  }) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isTokenExpired: () => boolean;
  updateUserProfile: (data: UpdateProfilePayload) => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userId: null,
      name: null,
      email: null,
      role: null,
      userType: null,
      token: null,
      tokenExpiresAt: null,
      isLoading: false,
      error: null,
      phone: null,
      gender: null,
      birthDate: null,
      address: null,

      login: ({ userId, name, email, role, userType, token, expiresIn }) =>
        set({
          isAuthenticated: true,
          userId,
          name,
          email: email ?? null,
          role,
          userType,
          token,
          tokenExpiresAt: Date.now() + expiresIn * 1000,
          error: null,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          userId: null,
          name: null,
          email: null,
          role: null,
          userType: null,
          token: null,
          tokenExpiresAt: null,
          phone: null,
          gender: null,
          birthDate: null,
          address: null,
        }),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      isTokenExpired: () => {
        const { tokenExpiresAt } = get();
        if (!tokenExpiresAt) return true;
        return Date.now() >= tokenExpiresAt;
      },

      // ===== Update profile: sebagian ke Firebase, sebagian ke localStorage =====
      updateUserProfile: async (data) => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("User belum login");

        set({ isLoading: true, error: null });

        try {
          // --- name -> Firebase Auth displayName ---
          if (data.name && data.name !== currentUser.displayName) {
            await firebaseUpdateProfile(currentUser, {
              displayName: data.name,
            });
          }

          // --- email -> Firebase Auth email (butuh recent login) ---
          if (data.email && data.email !== currentUser.email) {
            try {
              await firebaseUpdateEmail(currentUser, data.email);
            } catch (err) {
              if (
                err instanceof FirebaseError &&
                err.code === "auth/requires-recent-login"
              ) {
                throw new Error(
                  "Untuk ganti email, login ulang dulu (reauth) demi keamanan akun",
                );
              }
              throw err;
            }
          }

          // --- sisanya (phone, gender, birthDate, address) cuma di store/localStorage ---
          set({
            name: data.name ?? get().name,
            email: data.email ?? get().email,
            phone: data.phone ?? get().phone,
            gender: data.gender ?? get().gender,
            birthDate: data.birthDate ?? get().birthDate,
            address: data.address ?? get().address,
            isLoading: false,
          });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Gagal update profil";
          set({ isLoading: false, error: message });
          throw err;
        }
      },
    }),
    {
      name: "auth-store",
    },
  ),
);

export default useAuthStore;
