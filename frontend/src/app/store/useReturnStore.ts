import { create } from "zustand";

export interface ReturnRequest {
  id: string; // unique id pengajuan
  productId: string;
  reason: string;
  proofFile: File | null;
  proofPreview: string | null;
  note: string;
  status: "diproses" | "selesai";
  createdAt: number;
}

interface ReturnStore {
  requests: ReturnRequest[];
  addRequest: (req: Omit<ReturnRequest, "id" | "createdAt" | "status">) => void;
  isReturned: (productId: string) => boolean;
  getRequestByProductId: (productId: string) => ReturnRequest | undefined;
}

export const useReturnStore = create<ReturnStore>((set, get) => ({
  requests: [],

  addRequest: (req) => {
    const newRequest: ReturnRequest = {
      ...req,
      id: crypto.randomUUID(),
      status: "selesai", // dummy: langsung "selesai", ganti ke "diproses" kalau ada flow approval
      createdAt: Date.now(),
    };
    set((state) => ({ requests: [...state.requests, newRequest] }));
  },

  isReturned: (productId) => {
    return get().requests.some((r) => r.productId === productId);
  },

  getRequestByProductId: (productId) => {
    return get().requests.find((r) => r.productId === productId);
  },
}));
