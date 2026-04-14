import { create } from "zustand";
import type { ConsultationCreate } from "@/types";

interface ConsultationState {
  step: number;
  data: Partial<ConsultationCreate>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (updates: Partial<ConsultationCreate>) => void;
  reset: () => void;
}

export const useConsultationStore = create<ConsultationState>((set) => ({
  step: 1,
  data: { preferred_language: "en" },
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: s.step + 1 })),
  prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
  updateData: (updates) => set((s) => ({ data: { ...s.data, ...updates } })),
  reset: () => set({ step: 1, data: { preferred_language: "en" } }),
}));
