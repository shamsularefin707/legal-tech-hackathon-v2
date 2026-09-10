import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  UserCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { CanonicalCase, CaseLifecycleStatus, SlaStatus, UserRole } from '../types/legalAid';
import { formatToDisplayDate } from '../services/chronologyEngine';
import { PILOT_DISTRICT_NAMES } from '../data/canonicalLocations';

interface CaseExplorerViewProps {
  cases: CanonicalCase[];
  currentRole: UserRole;
  onSelectCase: (c: CanonicalCase) => void;
  initialFilterKey?: string;
  initialFilterValue?: string;
}

export const CaseExplorerView: React.FC<CaseExplorerViewProps> = ({
  cases,
  currentRole,
  onSelectCase,
  initialFilterKey,
  initialFilterValue
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilterKey === 'lifecycleStatus' ? initialFilterValue || 'ALL' : 'ALL');
  const [slaFilter, setSlaFilter] = useState<string>(initialFilterKey === 'slaStatus' ? initialFilterValue || 'ALL' : 'ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [anomalyOnly, setAnomalyOnly] = useState<boolean>(initialFilterKey === 'anomalyOnly');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const caseTypes = useMemo(() => {
    return Array.from(new Set(cases.map(c => c.caseType))).filter(Boolean);
  }, [cases]);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // District filter
      if (districtFilter !== 'ALL' && c.district !== districtFilter) return false;

      // Status filter
      if (statusFilter !== 'ALL' && c.lifecycleStatus !== statusFilter) return false;

      // SLA filter
      if (slaFilter !== 'ALL' && c.slaStatus !== slaFilter) return false;

      // Type filter
      if (typeFilter !== 'ALL' && c.caseType !== typeFilter) return false;

      // Anomaly filter
      if (anomalyOnly && c.dataQualityStatus !== 'DATA_QUALITY_ANOMALY' && c.chronologyStatus !== 'FAILED') return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mId = c.caseId.toLowerCase().includes(q);
        const mName = c.applicantName.toLowerCase().includes(q);
        const mLawyer = (c.assignedLawyer || '').toLowerCase().includes(q);
        const mCourt = c.court.toLowerCase().includes(q);
        const mUpazila = c.upazila.toLowerCase().includes(q);
        if (!mId && !mName && !mLawyer && !mCourt && !mUpazila) return false;
      }

      return true;
    });
  }, [cases, districtFilter, statusFilter, slaFilter, typeFilter, anomalyOnly, searchQuery]);

  const totalPages = Math.ceil(filteredCases.length / pageSize) || 1;
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCases.slice(start, start + pageSize);
  }, [filteredCases, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-4.5 bg-[#006A4E] dark:bg-emerald-500 rounded-xs" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              আদালতের মামলা খতিয়ান ও বিচারিক রেজিস্টার (Case Records Repository)
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-4">
            ৮টি পাইলট জেলায় বিচারাধীন সকল সক্রিয়, শুনানি ও নিষ্পত্তিকৃত আইনি মোকদ্দমার প্রাতিষ্ঠানিক ডেটাসেট
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            মোট প্রদর্শিত: {filteredCases.length} / {cases.length}
          </span>
        </div>
      </div>

      {/* 2. Filters & Multi-parameter Bar */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-3.5 space-y-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Text Search */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="মামলা নং, আবেদনকারী, আইনজীবী বা আদালত দিয়ে অনুসন্ধান..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 rounded-md text-xs bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#006A4E]"
            />
          </div>

          {/* District Filter */}
          <select
            value={districtFilter}
            onChange={(e) => {
              setDistrictFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="ALL">সকল পাইলট জেলা</option>
            {PILOT_DISTRICT_NAMES.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="ALL">সকল বিচারিক পর্যায়</option>
            <option value="REGISTERED">নিবন্ধিত (Registered)</option>
            <option value="ONGOING">চলমান (Ongoing)</option>
            <option value="AWAITING_RESOLUTION">নিষ্পত্তির অপেক্ষায় (Awaiting)</option>
            <option value="RESOLVED">নিষ্পত্তিকৃত (Resolved)</option>
            <option value="CLOSED">নথি সমাপ্ত (Closed)</option>
          </select>

          {/* Case Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="ALL">সকল বিষয়/শ্রেণি</option>
            {caseTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* SLA Filter */}
          <select
            value={slaFilter}
            onChange={(e) => {
              setSlaFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="ALL">সকল এসএলএ অবস্থা</option>
            <option value="EXPIRED">এসএলএ অতিক্রান্ত (Expired)</option>
            <option value="DUE_SOON">আসন্ন সমাপ্তি (Due Soon)</option>
            <option value="ON_TRACK">স্বাভাবিক (On Track)</option>
          </select>

          {/* Anomaly Checkbox Filter */}
          <label className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 bg-red-50 dark:bg-red-950/40 px-2.5 py-1.5 rounded-md border border-red-200 dark:border-red-800 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={anomalyOnly}
              onChange={(e) => {
                setAnomalyOnly(e.target.checked);
                setCurrentPage(1);
              }}
              className="rounded accent-[#C8102E] cursor-pointer"
            />
            <span>শুধুমাত্র ডেটা অসঙ্গতিযুক্ত মামলা</span>
          </label>
        </div>
      </div>

      {/* 3. Dense Legal Records Table */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-900/60">
                <th className="py-2.5 px-3">মামলা নং</th>
                <th className="py-2.5 px-3">আবেদনকারী</th>
                <th className="py-2.5 px-2">মামলার বিষয়</th>
                <th className="py-2.5 px-2">জেলা ও আদালত</th>
                <th className="py-2.5 px-2 text-center">পর্যায়</th>
                <th className="py-2.5 px-2">পরবর্তী শুনানি</th>
                <th className="py-2.5 px-2">নিযুক্ত আইনজীবী</th>
                <th className="py-2.5 px-2 text-center">এসএলএ</th>
                <th className="py-2.5 px-2 text-center">ডেটা মান</th>
                <th className="py-2.5 px-3 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    ফিল্টারের সাথে মিল রেখে কোনো মামলা পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                paginatedCases.map((c) => {
                  const hasChronoAnomaly = c.chronologyStatus === 'FAILED' || c.isChronologyInvalid;
                  const isSlaExpired = c.slaStatus === 'EXPIRED';

                  return (
                    <tr
                      key={c.caseId}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        hasChronoAnomaly ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-[#006A4E] dark:text-emerald-400 whitespace-nowrap">
                        {c.caseId}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {c.applicantName}
                        </div>
                        {c.vulnerabilityIndicator && c.vulnerabilityIndicator !== 'None identified' && (
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block">
                            {c.vulnerabilityIndicator}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300 font-medium">
                        {c.caseType}
                      </td>
                      <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">
                        <div className="font-semibold">{c.district}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[130px]">{c.court}</div>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {c.lifecycleStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {formatToDisplayDate(c.nextHearingDate)}
                      </td>
                      <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">
                        {c.assignedLawyer ? (
                          <div className="font-medium truncate max-w-[120px]">{c.assignedLawyer}</div>
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400 font-semibold text-[11px]">অনিযুক্ত</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {isSlaExpired ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300">
                            অতিক্রান্ত
                          </span>
                        ) : c.slaStatus === 'DUE_SOON' ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            আসন্ন
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">স্বাভাবিক</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {hasChronoAnomaly ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-300 flex items-center justify-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-[#C8102E]" />
                            <span>অসঙ্গতি</span>
                          </span>
                        ) : c.isFutureDated ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            ভবিষ্যত
                          </span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">✓ সঠিক</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onSelectCase(c)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#006A4E] hover:text-white text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-emerald-600 dark:hover:text-white font-semibold text-[11px] transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                        >
                          নথি
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination Controls */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-[#0F1724] text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            পৃষ্ঠা <strong className="text-slate-900 dark:text-white font-mono">{currentPage}</strong> / <span className="font-mono">{totalPages}</span> (মোট {filteredCases.length}টি রেকর্ড)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>পূর্ববর্তী</span>
            </button>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>পরবর্তী</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
