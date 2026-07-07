import { type Profile } from "@/types/data";
import { create } from "zustand";

const initialProfile = {
  name: "Ika Nur Hidayati",
  email: "ihidayatiikanur58@gmail.com",
  birthdate: "2004-01-01",
  gender: "perempuan",
  phone: "082123456789",
  avatar: "/avatar/1.avif",
};

export const useProfileStore = create<Profile>()((set) => ({
  ...initialProfile,

  updateField: (field, value) =>
    set(() => ({
      [field]: value,
    })),

  reset: () => set(initialProfile),
}));
