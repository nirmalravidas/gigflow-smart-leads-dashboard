import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Plus, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { leadsApi } from '../../api/leads.api';
import { useLeadsFilterStore } from '../../store/leads.store';
import { LeadsFilterBar } from '../../components/leads/LeadsFilterBar';
import { LeadsTable } from '../../components/leads/LeadsTable';
import { Modal } from '../../components/ui';
import { LeadForm } from '../../components/leads/LeadForm';
import { Button } from '../../components/ui/Button';
import { downloadBlob, getErrorMessage } from '../../utils/helpers';

const LeadsPage: React.FC = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const { filters } = useLeadsFilterStore();

  const exportMutation = useMutation({
    mutationFn: () =>
      leadsApi.exportCSV({
        status: filters.status || undefined,
        source: filters.source || undefined,
        search: filters.search || undefined,
        sort: filters.sort,
      }).then((r) => r.data as Blob),
    onSuccess: (blob) => {
      downloadBlob(blob, `leads-export-${Date.now()}.csv`);
      toast.success('CSV downloaded');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto opacity-0 animate-fade-in relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1">Manage and track your leads efficiently.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            className="flex-1 sm:flex-none"
            icon={<Download size={16} />}
            loading={exportMutation.isPending}
            onClick={() => exportMutation.mutate()}
          >
            Export CSV
          </Button>
          <Button
            className="flex-1 sm:flex-none btn-primary shadow-glow"
            icon={<Plus size={16} />}
            onClick={() => setCreateOpen(true)}
          >
            New Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <LeadsFilterBar />
      </div>

      {/* Table */}
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <LeadsTable />
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Lead">
        <LeadForm onSuccess={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
};

export default LeadsPage;
