import React, { useState } from 'react';
import {
  Building2,
  Users,
  Briefcase,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { DistrictMetricSummary, CanonicalCase, UserRole } from '../types/legalAid';
import { CANONICAL_DISTRICTS } from '../data/canonicalLocations';

interface DistrictMonitoringViewProps {
  districtMetrics: DistrictMetricSummary[];
  cases: CanonicalCase[];
  currentRole: UserRole;
  onSelectCase: (c: CanonicalCase) => void;
}

export const DistrictMonitoringView: React.FC<DistrictMonitoringViewProps> = ({
  districtMetrics,
  cases,
  currentRole,
  onSelectCase
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const selectedDistrictCases = selectedDistrict
    ? cases.filter(c => c.district.toLowerCase() === selectedDistrict.toLowerCase())
    : [];

  return (
    <div className="space-y-5">
      {/* 1. Header */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-4.5 bg-[#006A4E] dark:bg-emerald-500 rounded-xs" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              ৮টি পাইলট জেলা পর্যবেক্ষণ ও কর্মদক্ষতা মূল্যায়ন (District Monitoring)
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-4">
            জাতীয় ডিজিটাল লিগ্যাল এইড পাইলটের আওতাধীন ৮টি জেলার প্রাতিষ্ঠানিক পরিসংখ্যান ও দায়িত্বপ্রাপ্ত কর্মকর্তা খতিয়ান
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          <span className="px-3 py-1 rounded bg-[#006A4E]/10 dark:bg-emerald-950/60 text-[#006A4E] dark:text-emerald-300 border border-[#006A4E]/30">
            ৮টি প্রামাণ্য পাইলট জেলা • ১০০% সমন্বিত
          </span>
        </div>
      </div>

      {/* 2. Pilot Districts Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {districtMetrics.map((dm) => {
          const isSelected = selectedDistrict === dm.districtName;
          const distInfo = CANONICAL_DISTRICTS.find(d => d.nameEn === dm.districtName);

          return (
            <div
              key={dm.districtName}
              onClick={() => setSelectedDistrict(isSelected ? null : dm.districtName)}
              className={`p-4 rounded-md border bg-white dark:bg-[#15202E] transition-all space-y-3 cursor-pointer shadow-2xs ${
                isSelected
                  ? 'border-[#006A4E] ring-2 ring-[#006A4E]/20 dark:ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {dm.districtNameBn} ({dm.districtName})
                  </h3>
                  <span className="text-[11px] text-slate-500 block">
                    বিভাগ: {distInfo?.division}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {dm.totalCases} মামলা
                </span>
              </div>

              {/* DLAO Info */}
              <div className="p-2.5 rounded bg-slate-50 dark:bg-[#0F1724] text-xs space-y-1 border border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-500 font-bold block text-[10px]">দায়িত্বপ্রাপ্ত ডিএলএও:</span>
                <div className="font-bold text-slate-900 dark:text-white">{dm.dlaoName}</div>
                <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{dm.dlaoPhone}</span>
                </div>
              </div>

              {/* Key Counts Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block">চলমান</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-sm">{dm.activeCases}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">আসন্ন শুনানি</span>
                  <strong className="text-amber-700 dark:text-amber-400 font-mono text-sm">{dm.upcomingHearings}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">এসএলএ বিলম্ব</span>
                  <strong className="text-[#C8102E] dark:text-red-400 font-mono text-sm">{dm.slaBreaches}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>প্যানেল আইনজীবী: <strong className="text-slate-800 dark:text-slate-200">{dm.assignedLawyersCount} জন</strong></span>
                <span className="text-[#006A4E] dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                  {isSelected ? 'বন্ধ করুন' : 'মামলা খতিয়ান'} →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Selected District Drilldown */}
      {selectedDistrict && (
        <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#006A4E]" />
              <span>{selectedDistrict} জেলার মামলা তালিকা ({selectedDistrictCases.length}টি)</span>
            </h2>
            <button
              onClick={() => setSelectedDistrict(null)}
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              ড্রিলডাউন বন্ধ করুন ✕
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-900/60">
                  <th className="py-2.5 px-3">মামলা নং</th>
                  <th className="py-2.5 px-3">আবেদনকারী</th>
                  <th className="py-2.5 px-2">উপজেলা</th>
                  <th className="py-2.5 px-2">আদালত</th>
                  <th className="py-2.5 px-2">বিষয়</th>
                  <th className="py-2.5 px-2 text-center">পর্যায়</th>
                  <th className="py-2.5 px-2">আইনজীবী</th>
                  <th className="py-2.5 px-3 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {selectedDistrictCases.map(c => (
                  <tr key={c.caseId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#006A4E] dark:text-emerald-400">
                      {c.caseId}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                      {c.applicantName}
                    </td>
                    <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">
                      {c.upazila}
                    </td>
                    <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400 truncate max-w-[140px]">
                      {c.court}
                    </td>
                    <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300 font-medium">
                      {c.caseType}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {c.lifecycleStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">
                      {c.assignedLawyer || <span className="text-amber-700 text-[11px]">অনিযুক্ত</span>}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onSelectCase(c)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#006A4E] hover:text-white text-slate-700 font-semibold text-[11px] cursor-pointer"
                      >
                        নথি
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
