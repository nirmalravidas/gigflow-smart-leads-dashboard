import { create } from 'zustand';
import type { ILeadFilters } from '../types';
import { SortOrder } from '../types';

interface LeadsFilterState {
  // Applied filters used for fetching
  filters: ILeadFilters;
  // Draft filters used for editing in the UI (only applied on click)
  draft: ILeadFilters;
  debouncedSearch: string;
  setDraftFilter: <K extends keyof ILeadFilters>(key: K, value: ILeadFilters[K]) => void;
  setDraftSearch: (search: string) => void;
  applyFilters: () => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: ILeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: SortOrder.LATEST,
  page: 1,
  limit: 10,
};

export const useLeadsFilterStore = create<LeadsFilterState>((set) => ({
  filters: { ...DEFAULT_FILTERS },
  draft: { ...DEFAULT_FILTERS },
  debouncedSearch: '',
  setDraftFilter: (key, value) =>
    set((state) => ({
      draft: { ...state.draft, [key]: value, page: key !== 'page' ? 1 : (value as number) },
    })),
  setDraftSearch: (search) =>
    set((state) => ({ draft: { ...state.draft, search, page: 1 } })),
  applyFilters: () =>
    set((state) => ({
      filters: { ...state.draft, page: 1 },
      debouncedSearch: state.draft.search || '',
    })),
  setPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
      draft: { ...state.draft, page },
    })),
  resetFilters: () =>
    set({ filters: { ...DEFAULT_FILTERS }, draft: { ...DEFAULT_FILTERS }, debouncedSearch: '' }),
}));
