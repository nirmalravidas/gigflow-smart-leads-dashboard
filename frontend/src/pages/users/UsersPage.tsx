import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, UserCircle, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '../../api/users.api';
import { useAuthStore } from '../../store/auth.store';
import type { IUser } from '../../types';
import { UserRole } from '../../types';
import { PageLoader, EmptyState, ConfirmDialog } from '../../components/ui';
import { Button } from '../../components/ui/Button';
import { getErrorMessage } from '../../utils/helpers';

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
    role === UserRole.ADMIN
      ? 'bg-[rgba(79,126,248,0.12)] text-[#4f7ef8] border-[rgba(79,126,248,0.3)]'
      : 'bg-[#1e2535] text-[#8a97b0] border-[#2a3347]'
  }`}>
    {role === UserRole.ADMIN ? <Shield size={10} /> : <UserCircle size={10} />}
    {role}
  </span>
);

const UsersPage: React.FC = () => {
  const { user: me } = useAuthStore();
  const qc = useQueryClient();
  const [deleteUser, setDeleteUser] = useState<IUser | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.listUsers().then((r) => r.data.data!),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      usersApi.updateRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Role updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted');
      setDeleteUser(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const users = data?.users ?? [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#e8edf5]">Users</h1>
        <p className="text-sm text-[#8a97b0] mt-0.5">Manage team members and roles</p>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="border border-[#2a3347] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a3347] bg-[#161b27]">
                {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#8a97b0] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2535]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={<UserCircle size={48} />} title="No users found" />
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#161b27] transition-colors animate-fade-in">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1e2535] flex items-center justify-center text-xs font-bold text-[#4f7ef8] shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-[#e8edf5]">
                            {user.name}
                            {user._id === me?._id && (
                              <span className="ml-2 text-[10px] text-[#4f7ef8] bg-[rgba(79,126,248,0.12)] px-1.5 py-0.5 rounded">You</span>
                            )}
                          </p>
                          <p className="text-xs text-[#8a97b0]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                        user.isEmailVerified
                          ? 'bg-[rgba(34,197,94,0.1)] text-[#22c55e] border-[rgba(34,197,94,0.2)]'
                          : 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border-[rgba(245,158,11,0.2)]'
                      }`}>
                        {user.isEmailVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8a97b0] mono">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {user._id !== me?._id && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<RefreshCw size={12} />}
                            loading={roleMutation.isPending && roleMutation.variables?.id === user._id}
                            onClick={() =>
                              roleMutation.mutate({
                                id: user._id,
                                role: user.role === UserRole.ADMIN ? UserRole.SALES : UserRole.ADMIN,
                              })
                            }
                          >
                            Toggle role
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<Trash2 size={12} />}
                            onClick={() => setDeleteUser(user)}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={() => deleteUser && deleteMutation.mutate(deleteUser._id)}
        loading={deleteMutation.isPending}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteUser?.name}"? This cannot be undone.`}
      />
    </div>
  );
};

export default UsersPage;
