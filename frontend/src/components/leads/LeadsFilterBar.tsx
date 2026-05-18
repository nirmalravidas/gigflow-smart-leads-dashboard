import React, { useMemo } from 'react';
import { Search, X, RotateCcw, Filter } from 'lucide-react';
import { useLeadsFilterStore } from '../../store/leads.store';
import { LeadStatus, LeadSource, SortOrder } from '../../types';
import { Button } from '../ui/Button';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  ...Object.values(LeadStatus).map((value) => ({
    value,
    label: value,
  })),
];

const SOURCE_OPTIONS = [
  { value: '', label: 'All Sources' },
  ...Object.values(LeadSource).map((value) => ({
    value,
    label: value,
  })),
];

const SORT_OPTIONS = [
  {
    value: SortOrder.LATEST,
    label: 'Latest first',
  },
  {
    value: SortOrder.OLDEST,
    label: 'Oldest first',
  },
];

export const LeadsFilterBar: React.FC = () => {
  const {
    filters,
    draft,
    setDraftFilter,
    setDraftSearch,
    applyFilters,
    resetFilters,
  } = useLeadsFilterStore();

  const hasActiveFilters =
    !!filters.status ||
    !!filters.source ||
    !!filters.search ||
    filters.sort !== SortOrder.LATEST;

  const isDirty = useMemo(() => {
    return (
      (draft.status ?? '') !== (filters.status ?? '') ||
      (draft.source ?? '') !== (filters.source ?? '') ||
      (draft.search ?? '') !== (filters.search ?? '') ||
      (draft.sort ?? SortOrder.LATEST) !==
        (filters.sort ?? SortOrder.LATEST)
    );
  }, [draft, filters]);

  return (
    <div className="glass-panel rounded-3xl p-4 md:p-6 shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Filter Leads
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Search, segment, and sort your pipeline faster
            </p>
          </div>

          {hasActiveFilters && (
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Active filters applied
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative xl:col-span-2 group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
            />

            <input
              value={draft.search ?? ''}
              onChange={(e) => setDraftSearch(e.target.value)}
              placeholder="Search by lead name or email..."
              className="h-12 w-full rounded-2xl border border-border-theme bg-card/50 backdrop-blur-sm pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/30 focus:bg-card hover:bg-card-alt/50"
            />

            {draft.search && (
              <button
                type="button"
                onClick={() => setDraftSearch('')}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-card hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <select
            value={draft.status ?? ''}
            onChange={(e) =>
              setDraftFilter(
                'status',
                e.target.value as LeadStatus | ''
              )
            }
            className="h-12 rounded-2xl border border-border-theme bg-card/50 backdrop-blur-sm px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/30 focus:bg-card hover:bg-card-alt/50 cursor-pointer"
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-card text-foreground"
              >
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={draft.source ?? ''}
            onChange={(e) =>
              setDraftFilter(
                'source',
                e.target.value as LeadSource | ''
              )
            }
            className="h-12 rounded-2xl border border-border-theme bg-card/50 backdrop-blur-sm px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/30 focus:bg-card hover:bg-card-alt/50 cursor-pointer"
          >
            {SOURCE_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-card text-foreground"
              >
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={draft.sort ?? SortOrder.LATEST}
            onChange={(e) =>
              setDraftFilter(
                'sort',
                e.target.value as SortOrder
              )
            }
            className="h-12 rounded-2xl border border-border-theme bg-card/50 backdrop-blur-sm px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/30 focus:bg-card hover:bg-card-alt/50 cursor-pointer"
          >
            {SORT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-card text-foreground"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end mt-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="md"
              icon={<RotateCcw size={16} />}
              onClick={resetFilters}
              className="w-full sm:w-auto"
            >
              Reset filters
            </Button>
          )}

          <Button
            size="md"
            icon={<Filter size={16} />}
            disabled={!isDirty}
            onClick={applyFilters}
            className="w-full sm:w-auto"
          >
            Apply filters
          </Button>
        </div>
      </div>
    </div>
  );
};