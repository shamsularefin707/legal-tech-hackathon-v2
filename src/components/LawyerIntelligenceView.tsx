import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Phone,
  Mail,
  Scale,
  Award,
  ShieldCheck
} from 'lucide-react';
import { CanonicalLawyer, UserRole } from '../types/legalAid';
import { PILOT_DISTRICT_NAMES } from '../data/canonicalLocations';

interface LawyerIntelligenceViewProps {
  lawyers: CanonicalLawyer[];
  currentRole: UserRole;
  onSelectLawyer?: (l: CanonicalLawyer) => void;
}

export const LawyerIntelligenceView: React.FC<LawyerIntelligenceViewProps> = ({
  lawyers,
  currentRole,
  onSelectLawyer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [workloadFilter, setWorkloadFilter] = useState('ALL');

  const specializations = useMemo(() => {
    return Array.from(new Set(lawyers.map(l => l.specialization))).filter(Boolean);
  }, [lawyers]);

  const filteredLawyers = useMemo(() => {
    return lawyers.filter(l => {
      if (districtFilter !== 'ALL' && l.district !== districtFilter) return false;
      if (workloadFilter !== 'ALL' && l.workloadStatus !== workloadFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mName = l.lawyerName.toLowerCase().includes(q);
        const mId = l.barCouncilId.toLowerCase().includes(q);
        const mSpec = l.specialization.toLowerCase().includes(q);
        if (!mName && !mId && !mSpec) return false;
      }
      return true;
    });
  }, [lawyers, districtFilter, workloadFilter, searchQuery]);

  // Overall workload distribution
  const availableCount = lawyers.filter(l => l.workloadStatus === 'AVAILABLE').length;
  const nearCapacityCount = lawyers.filter(l => l.workloadStatus === 'NEAR_CAPACITY').length;
  const overloadedCount = lawyers.filter(l => l.workloadStatus === 'OVERLOADED').length;
  const suspendedCount = lawyers.filter(l => l.status === 'SUSPENDED').length;

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-4.5 bg-purple-600 dark:bg-purple-500 rounded-xs" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              প্যানেল আইনজীবী ও কর্মভার ভারসাম্য (LADCS Panel Intelligence)
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-4">
            ৮টি পাইলট জেলার ৩০ জন অনুমোদিত প্যানেল আইনজীবীর সক্রিয় মামলা, কর্মক্ষমতা ও প্রাপ্যতা ব্যবস্থাপনা
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            মোট প্যানেল আইনজীবী: {lawyers.length} জন
          </span>
        </div>
      </div>

      {/* 2. Workload Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-emerald-600 shadow-2xs text-xs">
          <span className="text-slate-500 font-semibold block">নতুন দায়িত্বে প্রস্তুত</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">{availableCount} জন</div>
          <span className="text-[11px] text-slate-400">ক্ষমতা &lt; ৮০%</span>
        </div>

        <div className="p-3 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-amber-500 shadow-2xs text-xs">
          <span className="text-slate-500 font-semibold block">কাজের সীমা সন্নিকটে</span>
          <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400 mt-0.5">{nearCapacityCount} জন</div>
          <span className="text-[11px] text-slate-400">ক্ষমতা ৮০% - ৯৯%</span>
        </div>

        <div className="p-3 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-red-600 shadow-2xs text-xs">
          <span className="text-slate-500 font-semibold block">অতিরিক্ত কাজের চাপ</span>
          <div className="text-2xl font-bold font-mono text-red-700 dark:text-red-400 mt-0.5">{overloadedCount} জন</div>
          <span className="text-[11px] text-slate-400">ক্ষমতা &gt;= ১০০%</span>
        </div>

        <div className="p-3 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-slate-500 shadow-2xs text-xs">
          <span className="text-slate-500 font-semibold block">স্থগিতাদেশপ্রাপ্ত / অনুপলব্ধ</span>
          <div className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300 mt-0.5">{suspendedCount} জন</div>
          <span className="text-[11px] text-slate-400">বার কাউন্সিল বা আদেশে স্থগিত</span>
        </div>
      </div>

      {/* 3. Search and Filters */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="আইনজীবীর নাম, বার কাউন্সিল আইডি বা বিষয় দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md text-xs bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#006A4E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="ALL">সকল জেলা (৮টি পাইলট)</option>
            {PILOT_DISTRICT_NAMES.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={workloadFilter}
            onChange={(e) => setWorkloadFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="ALL">সকল কর্মভার অবস্থা</option>
            <option value="AVAILABLE">প্রস্তুত (Available)</option>
            <option value="NEAR_CAPACITY">সীমা সন্নিকটে (Near Capacity)</option>
            <option value="OVERLOADED">অতিরিক্ত চাপ (Overloaded)</option>
            <option value="UNAVAILABLE">অনুপলব্ধ / স্থগিত</option>
          </select>
        </div>
      </div>

      {/* 4. Lawyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredLawyers.map((l) => {
          const isSuspended = l.status === 'SUSPENDED';
          const isOverloaded = l.workloadStatus === 'OVERLOADED';

          let statusBadge = (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              সক্রিয় প্রস্তুত
            </span>
          );
          if (isSuspended) {
            statusBadge = (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                স্থগিতাদেশপ্রাপ্ত
              </span>
            );
          } else if (isOverloaded) {
            statusBadge = (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                অতিরিক্ত কর্মভার
              </span>
            );
          } else if (l.workloadStatus === 'NEAR_CAPACITY') {
            statusBadge = (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                কাজের সীমা সন্নিকটে
              </span>
            );
          }

          return (
            <div
              key={l.lawyerId}
              className={`p-4 rounded-md border bg-white dark:bg-[#15202E] transition-all space-y-2.5 text-xs shadow-2xs ${
                isSuspended
                  ? 'border-slate-300 dark:border-slate-800 opacity-80'
                  : isOverloaded
                  ? 'border-red-200 dark:border-red-900/60 hover:border-red-400'
                  : 'border-slate-200 dark:border-slate-800 hover:border-[#006A4E]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {l.lawyerName}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    আইডি: {l.lawyerId} • বার কাউন্সিল: {l.barCouncilId}
                  </div>
                </div>
                {statusBadge}
              </div>

              <div className="space-y-1 text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span>পাইলট জেলা:</span>
                  <strong className="text-slate-900 dark:text-white">{l.district}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>আইনি বিশেষায়ন:</span>
                  <span className="font-semibold text-blue-700 dark:text-blue-300">{l.specialization}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>অভিজ্ঞতা:</span>
                  <span>{l.yearsExperience} বছর</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>প্রাপ্যতা স্থিতি:</span>
                  <span className="font-medium">{l.availability}</span>
                </div>
              </div>

              {/* Workload Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-semibold">কাজের চাপ ({l.utilization}%):</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {l.activeCases} / {l.capacity} মামলা
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOverloaded ? 'bg-[#C8102E]' : l.utilization >= 80 ? 'bg-amber-500' : 'bg-[#006A4E]'
                    }`}
                    style={{ width: `${Math.min(100, l.utilization)}%` }}
                  />
                </div>
              </div>

              {/* Contact info footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{l.phone}</span>
                </div>
                <span className="truncate max-w-[120px]">{l.email}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
