import {create} from "zustand";

type State = {
    activeId: number;
    setActiveId: (activeId: number) => void;
}

export const useActiveId = create<State>((set) => ({
    activeId: 0,
    setActiveId: (activeId) => set({ activeId })
}));