import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, UserCircle, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { leadsApi } from '../../api/leads.api';
import type { ILead } from '../../types';
import { UserRole } from '../../types';
import { useLeadsFilterStore } from '../../store/leads.store';
import { useAuthStore } from '../../store/auth.store';
import { StatusBadge, SourceBadge, PageLoader, EmptyState, ConfirmDialog } from '../ui';
import { Button } from '../ui/Button';
import { Modal } from '../ui';
import { LeadForm } from './LeadForm';
import { getErrorMessage } from '../../utils/helpers';

export const LeadsTable: React.FC = () => {
  const { filters, debouncedSearch, setPage } = useLeadsFilterStore();
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [editLead, setEditLead] = useState<ILead | null>(null);
  const [deleteLead, setDeleteLead] = useState<ILead | null>(null);

  // Build query with applied filters + applied search
  const queryFilters = { ...filters, search: debouncedSearch || undefined };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leads', queryFilters],
    queryFn: () => leadsApi.getLeads(queryFilters).then((r) => r.data.data!),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Lead deleted');
      setDeleteLead(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (isLoading) return <PageLoader />;

  if (isError) return (
    <div className="flex items-center gap-2 text-danger p-4 glass-panel rounded-xl">
      <AlertCircle size={16} />
      <span className="text-sm font-medium">Failed to load leads</span>
    </div>
  );

  const leads = data?.data ?? [];
  const meta  = data?.meta;

  return (
    <>
      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-x-auto border-border-theme/50 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/5 bg-card/40">
              {['Lead', 'Status', 'Source', 'Created by', 'Date', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    icon={<UserCircle size={48} />}
                    title="No leads found"
                    description="Try adjusting your filters or create a new lead."
                  />
                </td>
              </tr>
            ) : (
              leads.map((lead, i) => (
                <tr
                  key={lead._id}
                  className="hover:bg-card-alt/50 transition-colors duration-200 animate-fade-in group"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {/* Lead info */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  {/* Source */}
                  <td className="px-6 py-4">
                    <SourceBadge source={lead.source} />
                  </td>
                  {/* Created by */}
                  <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                    {lead.createdBy?.name ?? '—'}
                  </td>
                  {/* Date */}
                  <td className="px-6 py-4 text-xs text-muted-foreground mono font-medium">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Pencil size={14} />}
                        onClick={() => setEditLead(lead)}
                        className="h-8 w-8 px-0 rounded-lg hover:text-primary"
                        aria-label="Edit lead"
                      />
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={14} />}
                          onClick={() => setDeleteLead(lead)}
                          className="h-8 w-8 px-0 rounded-lg hover:text-danger hover:bg-danger/10"
                          aria-label="Delete lead"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 animate-fade-in">
          <p className="text-xs font-medium text-muted-foreground">
            Showing {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} leads
          </p>
          <div className="flex items-center gap-1.5 p-1 glass-panel rounded-xl">
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft size={16} />}
              disabled={!meta.hasPrevPage}
              onClick={() => setPage(meta.page - 1)}
              className="h-8 w-8 px-0 rounded-lg"
            />
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - meta.page) <= 2)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                    p === meta.page
                      ? 'bg-primary text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card-alt'
                  }`}
                >
                  {p}
                </button>
              ))}
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronRight size={16} />}
              disabled={!meta.hasNextPage}
              onClick={() => setPage(meta.page + 1)}
              className="h-8 w-8 px-0 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        open={!!editLead}
        onClose={() => setEditLead(null)}
        title="Edit Lead"
      >
        {editLead && (
          <LeadForm lead={editLead} onSuccess={() => setEditLead(null)} />
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteLead}
        onClose={() => setDeleteLead(null)}
        onConfirm={() => deleteLead && deleteMutation.mutate(deleteLead._id)}
        loading={deleteMutation.isPending}
        title="Delete Lead"
        description={`Are you sure you want to delete "${deleteLead?.name}"? This cannot be undone.`}
      />
    </>
  );
};
