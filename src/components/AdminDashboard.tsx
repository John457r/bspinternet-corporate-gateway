import React, { useState, useEffect } from 'react';
import { UserAccount, AccountStatus } from '../types';
import { 
  ShieldCheck, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  AlertOctagon, 
  RefreshCw 
} from 'lucide-react';
import { motion } from 'motion/react';
import { getLocalAccounts, updateAccountStatus } from '../storage';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Rejection state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadAccounts();
    const interval = setInterval(loadAccounts, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadAccounts = () => {
    const list = getLocalAccounts();
    setAccounts([...list]);
  };

  const handleUpdateStatus = (id: string, status: AccountStatus, reason?: string) => {
    updateAccountStatus(id, status, reason);
    loadAccounts();
    if (status === 'rejected') {
      setRejectingId(null);
      setRejectionReason('');
    }
  };

  const totalCount = accounts.length;
  const pendingCount = accounts.filter(a => a.status === 'pending').length;
  const approvedCount = accounts.filter(a => a.status === 'approved').length;
  const rejectedCount = accounts.filter(a => a.status === 'rejected').length;

  const filteredAccounts = accounts.filter(acc => {
    if (filter === 'all') return true;
    return acc.status === filter;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            <ShieldCheck className="h-6 w-6 mr-2 text-emerald-600" />
            Gateway Administration
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Live client verification queue and session authorization monitor.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadAccounts}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center gap-1.5"
            title="Refresh local records"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium shadow-sm"
          >
            Exit Admin
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Submissions</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Review</p>
            <p className="text-2xl font-bold text-amber-900 mt-1">{pendingCount}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Approved</p>
            <p className="text-2xl font-bold text-emerald-900 mt-1">{approvedCount}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Rejected</p>
            <p className="text-2xl font-bold text-rose-900 mt-1">{rejectedCount}</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
            <AlertOctagon className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Queue Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase mr-2">Filter:</span>
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  filter === tab
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredAccounts.length} of {accounts.length} requests
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Client Identifier</th>
                <th className="px-6 py-4">Reference ID</th>
                <th className="px-6 py-4">Submission Time</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No requests match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 align-top">
                      {account.status === 'pending' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="h-3 w-3 mr-1" /> Pending
                        </span>
                      )}
                      {account.status === 'approved' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Approved
                        </span>
                      )}
                      {account.status === 'rejected' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
                          <XCircle className="h-3 w-3 mr-1" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-slate-900">{account.username}</div>
                      {account.status === 'rejected' && account.rejectionReason && (
                        <div className="mt-2 text-xs bg-rose-50 border border-rose-100 p-2 rounded text-rose-700">
                          <strong>Rejection Note:</strong> {account.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top font-mono text-xs text-slate-500">
                      {account.id}
                    </td>
                    <td className="px-6 py-4 align-top text-xs text-slate-500">
                      {new Date(account.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      {rejectingId === account.id ? (
                        <div className="flex flex-col gap-2 items-end min-w-[220px]">
                          <textarea 
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full text-sm p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                            placeholder="Enter rejection reason..."
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setRejectingId(null);
                                setRejectionReason('');
                              }}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(account.id, 'rejected', rejectionReason)}
                              disabled={!rejectionReason.trim()}
                              className="px-3 py-1.5 text-xs bg-rose-600 text-white rounded hover:bg-rose-700 disabled:opacity-50 transition-colors"
                            >
                              Confirm Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(account.id, 'approved')}
                            disabled={account.status === 'approved'}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md disabled:opacity-30 transition-colors"
                            title="Approve access"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setRejectingId(account.id)}
                            disabled={account.status === 'rejected'}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md disabled:opacity-30 transition-colors"
                            title="Reject request"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
