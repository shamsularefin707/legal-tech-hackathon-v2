import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  FileText,
  Search,
  ArrowRight,
  Filter,
  Eye,
  Info
} from 'lucide-react';
import { CanonicalCase, AnomalyItem, AnomalySeverity, UserRole } from '../types/legalAid';
import { DatasetQualityReport } from '../services/dataQualityEngine';
import { formatToDisplayDate } from '../services/chronologyEngine';

interface DataQualityViewProps {
  cases: CanonicalCase[];
  qualityReport: DatasetQualityReport;
  currentRole: UserRole;
  onSelectCase: (c: CanonicalCase) => void;
}

export const DataQualityView: React.FC<DataQualityViewProps> = ({
  cases,
  qualityReport,
  currentRole,
  onSelectCase
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredAnomalies = qualityReport.allAnomalies.filter(an => {
    if (selectedType !== 'ALL' && an.type !== selectedType) return false;
    if (severityFilter !== 'ALL' && an.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-4.5 bg-rose-600 rounded-xs" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              ডেটা মান ও সামঞ্জস্য নিরীক্ষা (Data Quality & Anomaly Audit)
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-4">
            উৎস নথি অপরিবর্তিত রেখে কালানুক্রমিক সংঘাত, আবশ্যকীয় তথ্যের অপূর্ণতা ও বিচারিক অধিক্ষেত্র ত্রুটি শনাক্তকরণ
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold">
          <span className="px-3 py-1 rounded bg-red-100 dark:bg-red-950/60 text-[#C8102E] dark:text-red-300 border border-red-300 dark:border-red-800">
            মোট অসঙ্গতি: {qualityReport.totalAnomaliesCount}টি চিহ্নিত
          </span>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-[#006A4E] shadow-2xs text-xs">
          <span className="text-slate-500 font-semibold block">সম্পূর্ণ সঠিক ও সামঞ্জস্যপূর্ণ</span>
          <div className="text-2xl font-bold font-mono text-[#006A4E] dark:text-emerald-400 mt-0.5">
            {qualityReport.validRecordsCount}টি মামলা
          </div>
          <span className="text-[11px] text-slate-400">নিয়মমাফিক পরিচালিত</span>
        </div>

        <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-[#C8102E] shadow-2xs text-xs">
          <span className="text-slate-500 font-semibold block text-red-700 dark:text-red-400">জরুরি অসঙ্গতি (Critical)</span>
          <div className="text-2xl font-bold font-mono text-[#C8102E] dark:text-red-400 mt-0.5">
            {qualityReport.criticalCount}টি ত্রুটি
          </div>
          <span className="text-[11px] text-slate-400">ফাইলিংয়ের পূর্বে শুনানির সংঘাত</span>
        </div>

        <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-amber-500 shadow-2xs text-xs">
          <span className="text-slate-500 font-semibold block text-amber-700 dark:text-amber-400">উচ্চ সতর্কবার্তা (High)</span>
          <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400 mt-0.5">
            {qualityReport.highCount}টি রেকর্ড
          </div>
          <span className="text-[11px] text-slate-400">ভবিষ্যত দাখিল ও স্থগিত আইনজীবী</span>
        </div>

        <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-blue-500 shadow-2xs text-xs">
          <span className="text-slate-500 font-semibold block text-blue-700 dark:text-blue-400">তথ্য অপূর্ণতা (Medium)</span>
          <div className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-400 mt-0.5">
            {qualityReport.mediumCount}টি নথি
          </div>
          <span className="text-[11px] text-slate-400">প্রামাণিক দলিলের ঘাটতি</span>
        </div>
      </div>

      {/* 3. Category Summaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {qualityReport.categorySummaries.map((cat) => (
          <div
            key={cat.type}
            onClick={() => setSelectedType(selectedType === cat.type ? 'ALL' : cat.type)}
            className={`p-4 rounded-md border bg-white dark:bg-[#15202E] transition-all space-y-2 text-xs shadow-2xs cursor-pointer ${
              selectedType === cat.type
                ? 'border-[#C8102E] ring-2 ring-red-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {cat.titleBn}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-red-100 dark:bg-red-950/80 text-[#C8102E] dark:text-red-300">
                {cat.count}টি
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              {cat.descriptionBn}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-[#006A4E] dark:text-emerald-400 font-medium">
              <span className="font-bold">সুপারিশ:</span> {cat.recommendedActionBn}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Filter and Anomalies Detail List */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#C8102E]" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              শনাক্তকৃত অসংগতি খতিয়ান ({filteredAnomalies.length}টি প্রদর্শন)
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">তীব্রতা:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1 rounded bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none cursor-pointer"
            >
              <option value="ALL">সকল তীব্রতা</option>
              <option value="CRITICAL">জরুরি (Critical)</option>
              <option value="HIGH">উচ্চ (High)</option>
              <option value="MEDIUM">মাঝারি (Medium)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredAnomalies.map((an) => {
            const targetCase = cases.find(c => c.caseId === an.caseId);
            return (
              <div
                key={an.id}
                className="p-3.5 rounded-md border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#006A4E] dark:text-emerald-400">
                      {an.caseId}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300">
                      {an.severity}
                    </span>
                    <span className="text-slate-500 text-[11px]">ক্ষেত্র: {an.field}</span>
                  </div>

                  <div className="text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
                    <span>{an.problemBn}</span>
                  </div>

                  <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                    <span className="font-semibold text-slate-800 dark:text-slate-300">কেন গুরুত্বপূর্ণ:</span> {an.whyItMattersBn}
                  </div>

                  <div className="text-[#006A4E] dark:text-emerald-400 text-[11px] font-medium">
                    <span className="font-bold">প্রস্তাবিত পদক্ষেপ:</span> {an.recommendedActionBn}
                  </div>
                </div>

                <div className="shrink-0">
                  {targetCase && (
                    <button
                      onClick={() => onSelectCase(targetCase)}
                      className="px-3 py-1.5 rounded bg-slate-100 hover:bg-[#006A4E] hover:text-white text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
                    >
                      মামলা নথি দেখুন
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
