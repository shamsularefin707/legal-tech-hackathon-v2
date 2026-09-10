import React, { useState, useMemo } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Search,
  Filter,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { CanonicalCase, SlaStatus, UserRole } from '../types/legalAid';
import { formatToDisplayDate } from '../services/chronologyEngine';
import { SLA_STAGE_CONFIGS } from '../services/slaEngine';
import { PILOT_DISTRICT_NAMES } from '../data/canonicalLocations';

interface SlaMonitoringViewProps {
  cases: CanonicalCase[];
  currentRole: UserRole;
  onSelectCase: (c: CanonicalCase) => void;
}

export const SlaMonitoringView: React.FC<SlaMonitoringViewProps> = ({
  cases,
  currentRole,
  onSelectCase
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('EXPIRED');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const slaCounts = useMemo(() => {
    return {
      all: cases.length,
      expired: cases.filter(c => c.slaStatus === 'EXPIRED').length,
      dueSoon: cases.filter(c => c.slaStatus === 'DUE_SOON').length,
      onTrack: cases.filter(c => c.slaStatus === 'ON_TRACK').length,
      notApplicable: cases.filter(c => c.slaStatus === 'NOT_APPLICABLE').length,
      anomalyIssue: cases.filter(c => c.slaStatus === 'DATA_QUALITY_ISSUE').length
    };
  }, [cases]);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (statusFilter !== 'ALL' && c.slaStatus !== statusFilter) return false;
      if (districtFilter !== 'ALL' && c.district !== districtFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mId = c.caseId.toLowerCase().includes(q);
        const mName = c.applicantName.toLowerCase().includes(q);
        const mLawyer = (c.assignedLawyer || '').toLowerCase().includes(q);
        if (!mId && !mName && !mLawyer) return false;
      }

      return true;
    });
  }, [cases, statusFilter, districtFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-4.5 bg-[#C8102E] rounded-xs" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              সেবা স্তর প্রতিশ্রুতি (SLA) ও সময়সীমা তদারকি
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-4">
            আবেদন পর্যালোচনা, যোগ্যতা মূল্যায়ন, আইনজীবী নিয়োগ ও শুনানির বিধিবদ্ধ সময়সীমা বাস্তবায়ন ট্র্যাকার
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold">
          <span className="px-3 py-1 rounded bg-red-100 dark:bg-red-950/60 text-[#C8102E] dark:text-red-300 border border-red-300 dark:border-red-800">
            সময়সীমা অতিক্রান্ত: {slaCounts.expired}টি মামলা
          </span>
        </div>
      </div>

      {/* 2. SLA Defined Stages Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 text-xs space-y-1 shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px]">১. আবেদন যাচাই ও প্রাথমিক পর্যালোচনা</span>
          <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">৩ কার্যদিবস</div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
            নাগরিকের আবেদন প্রাপ্তির ৩ দিনের মধ্যে নথিপত্র ও জাতীয় পরিচয়পত্র যাচাই বাধ্যতামূলক।
          </p>
        </div>

        <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 text-xs space-y-1 shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px]">২. যোগ্যতা মূল্যায়ন ও কমিটির সিদ্ধান্ত</span>
          <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">৭ কার্যদিবস</div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
            কর্মকর্তার সুপারিশের ভিত্তিতে জেলা লিগ্যাল এইড কমিটির চূড়ান্ত অনুমোদন বা প্রত্যাখ্যান।
          </p>
        </div>

        <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 text-xs space-y-1 shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px]">৩. প্যানেল আইনজীবী নিয়োগ ও গ্রহণ</span>
          <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">৫ কার্যদিবস</div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
            অনুমোদনের পর উপযুক্ত প্যানেল আইনজীবীকে মনোনীত করা এবং আইনজীবীর দায়িত্ব স্বীকার।
          </p>
        </div>
      </div>

      {/* 3. Filter Tabs */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-1.5 flex flex-wrap gap-1 text-xs">
        {[
          { id: 'ALL', labelBn: 'সকল মামলা', count: slaCounts.all },
          { id: 'EXPIRED', labelBn: 'সময়সীমা অতিক্রান্ত', count: slaCounts.expired, alert: true },
          { id: 'DUE_SOON', labelBn: 'আসন্ন সমাপ্তি (৭ দিন)', count: slaCounts.dueSoon },
          { id: 'ON_TRACK', labelBn: 'সময়সীমা স্বাভাবিক', count: slaCounts.onTrack },
          { id: 'DATA_QUALITY_ISSUE', labelBn: 'ডেটা অসংগতিজনিত স্থগিত', count: slaCounts.anomalyIssue }
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#006A4E] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.labelBn}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : tab.alert
                    ? 'bg-red-100 text-[#C8102E] dark:bg-red-950/80 dark:text-red-300'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Search and District Bar */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="মামলা নং বা আবেদনকারীর নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md text-xs bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">জেলা:</span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="ALL">সকল জেলা</option>
            {PILOT_DISTRICT_NAMES.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. SLA Records Table */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-900/60">
                <th className="py-2.5 px-3">মামলা নং</th>
                <th className="py-2.5 px-3">আবেদনকারী</th>
                <th className="py-2.5 px-2">পাইলট জেলা</th>
                <th className="py-2.5 px-2">মামলার বিষয়</th>
                <th className="py-2.5 px-2">এসএলএ নির্ধারিত তারিখ</th>
                <th className="py-2.5 px-2 text-center">স্থিতি ও বিলম্ব</th>
                <th className="py-2.5 px-2">দায়িত্বপ্রাপ্ত কর্মকর্তা</th>
                <th className="py-2.5 px-3 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    কোনো মামলা পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredCases.slice(0, 50).map((c) => {
                  const isExpired = c.slaStatus === 'EXPIRED';
                  const days = Math.abs(c.slaDaysRemaining || 0);

                  return (
                    <tr key={c.caseId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#006A4E] dark:text-emerald-400">
                        {c.caseId}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        {c.applicantName}
                      </td>
                      <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300 font-medium">
                        {c.district}
                      </td>
                      <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">
                        {c.caseType}
                      </td>
                      <td className="py-2.5 px-2 font-mono text-slate-700 dark:text-slate-300">
                        {formatToDisplayDate(c.slaDueDate)}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {isExpired ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-[#C8102E] dark:bg-red-950/80 dark:text-red-300 border border-red-300">
                            {days} দিন বিলম্বিত
                          </span>
                        ) : c.slaStatus === 'DUE_SOON' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                            {c.slaDaysRemaining} দিন বাকি
                          </span>
                        ) : c.slaStatus === 'DATA_QUALITY_ISSUE' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            ডেটা অসংগতি
                          </span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">সময়সীমার মধ্যে</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400 text-[11px] truncate max-w-[130px]">
                        {c.assignedOfficer}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onSelectCase(c)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#006A4E] hover:text-white text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          পর্যালোচনা
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
