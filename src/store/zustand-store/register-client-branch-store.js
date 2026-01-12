import { create } from "zustand";

const useBranchStore = create((set) => ({
  branches: [],

  // Add a new branch
  addBranch: (branch) =>
    set((state) => ({
      branches: [...state.branches, branch],
    })),

  // Update branch by index
  updateBranch: (index, updatedData) => {
    return set((state) => ({
      branches: state.branches.map((branch, i) => {
        return i === Number(index) ? { ...branch, ...updatedData } : branch
      }
      ),
    }))
  },

  // Remove branch by index
  removeBranch: (index) =>
    set((state) => ({
      branches: state.branches.filter((_, i) => i !== index),
    })),

  // Replace all branches
  setBranches: (newBranches) => set({ branches: newBranches }),

  reset: () => set((state) => ({
    branches: [],
  }))
}));

export default useBranchStore;
