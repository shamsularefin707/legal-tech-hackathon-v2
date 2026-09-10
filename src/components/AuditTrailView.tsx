import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  UserCheck,
  Shield,
  FileText
} from 'lucide-react';
import { AuditLogEntry, UserRole } from '../types/legalAid';
import { auditLogger } from '../services/auditLogger';

interface AuditTrailViewProps {
  currentRole: UserRole;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ currentRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');

  const logs = auditLogger.getLogs();

  const filteredLogs = logs.filter(log => {
    if (entityFilter !== 'ALL' && log.targetEntity !== entityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const mAction = log.actionBn.toLowerCase().includes(q);
      const mUser = log.userName.toLowerCase().includes(q);
      const mRec = log.recordId.toLowerCase().includes(q);
      const mDet = log.detailsBn.toLowerCase().includes(q);
      if (!mAction && !mUser && !mRec && !mDet) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-4.5 bg-slate-700 dark:bg-slate-400 rounded-xs" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              কার্যক্রমের অপরিবর্তনীয় রেকর্ড ও অডিট ট্রেইল (Immutable Audit Log)
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-4">
            আইনগত সহায়তা অনুমোদন, আইনজীবী নিয়োগ, শুনানি ও প্রশাসনিক পরিবর্তনের সময়াঙ্কিত অপরিবর্তনীয় খতিয়ান
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            মোট রেকর্ডকৃত ঘটনা: {logs.length}টি
          </span>
        </div>
      </div>

      {/* 2. Search & Entity Filter Bar */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="কার্যক্রম, কর্মকর্তা, মামলা নং বা বিবরণ দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md text-xs bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">নথি বিভাগ:</span>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="ALL">সকল বিভাগ</option>
            <option value="APPLICATION">আবেদন (Application)</option>
            <option value="CASE">মামলা (Case)</option>
            <option value="SECURITY">নিরাপত্তা (Security)</option>
            <option value="SYSTEM">সিস্টেম (System)</option>
          </select>
        </div>
      </div>

      {/* 3. Audit Records Table */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-900/60">
                <th className="py-2.5 px-3">সময়কাল (Timestamp)</th>
                <th className="py-2.5 px-3">কর্মকাণ্ড (Action)</th>
                <th className="py-2.5 px-2">সংশ্লিষ্ট রেকর্ড</th>
                <th className="py-2.5 px-3">সম্পাদনকারী ব্যবহারকারী</th>
                <th className="py-2.5 px-2 text-center">পূর্ববর্তী অবস্থা</th>
                <th className="py-2.5 px-2 text-center">নতুন অবস্থা</th>
                <th className="py-2.5 px-3">কার্যক্রমের বিবরণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {log.actionBn}
                  </td>
                  <td className="py-2.5 px-2 font-mono font-bold text-[#006A4E] dark:text-emerald-400 whitespace-nowrap">
                    {log.recordId}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    <div className="font-semibold">{log.userName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{log.userRole}</div>
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-500 text-[11px]">
                    {log.previousState || '—'}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-bold text-[#006A4E] dark:text-emerald-400 text-[11px]">
                    {log.newState || '—'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-[11px] max-w-[280px]">
                    {log.detailsBn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
