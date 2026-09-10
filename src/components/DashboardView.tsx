import React from 'react';
import {
  FileText,
  Clock,
  AlertTriangle,
  Users,
  Building2,
  Calendar,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { CanonicalCase, CanonicalLawyer, DistrictMetricSummary, UserRole } from '../types/legalAid';
import { formatToDisplayDate } from '../services/chronologyEngine';

interface DashboardViewProps {
  cases: CanonicalCase[];
  lawyers: CanonicalLawyer[];
  districtMetrics: DistrictMetricSummary[];
  currentRole: UserRole;
  onNavigateToTab: (tabId: any) => void;
  onSelectCase: (c: CanonicalCase) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  lawyers,
  districtMetrics,
  currentRole,
  onNavigateToTab,
  onSelectCase
}) => {
  // 1. Reconciled Metrics
  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.lifecycleStatus !== 'CLOSED' && c.lifecycleStatus !== 'RESOLVED').length;
  const pendingApplications = cases.filter(c => c.applicationStatus === 'SUBMITTED' || c.applicationStatus === 'UNDER_REVIEW').length;
  const approvedApplications = cases.filter(c => c.applicationStatus === 'APPROVED').length;
  const resolvedCases = cases.filter(c => c.lifecycleStatus === 'RESOLVED' || c.lifecycleStatus === 'CLOSED').length;
  const upcomingHearings = cases.filter(c => c.nextHearingDate && c.lifecycleStatus !== 'CLOSED' && c.lifecycleStatus !== 'RESOLVED').length;
  const slaBreaches = cases.filter(c => c.slaStatus === 'EXPIRED').length;
  const dataAnomalies = cases.filter(c => c.dataQualityStatus === 'DATA_QUALITY_ANOMALY').length;
  const overloadedLawyers = lawyers.filter(l => l.workloadStatus === 'OVERLOADED').length;

  // Urgent upcoming cases
  const highPriorityCases = cases
    .filter(c => c.priority === 'CRITICAL' || c.priority === 'HIGH')
    .slice(0, 5);

  // Intentional demo anomaly cases (hero showcase)
  const anomalyCases = cases
    .filter(c => c.dataQualityStatus === 'DATA_QUALITY_ANOMALY')
    .slice(0, 4);

  return (
    <div className="space-y-5">
      {/* 1. Official Government Department Header */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-4.5 bg-[#006A4E] dark:bg-emerald-500 rounded-xs" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              আইনগত সহায়তা কার্যক্রম ও বিচারিক তদারকি ড্যাশবোর্ড
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-4">
            জাতীয় আইনগত সহায়তা প্রদান সংস্থা (NLASO) • ৮টি ডিজিটাল পাইলট জেলা সমন্বয় ও সিদ্ধান্ত সহায়তা
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            তদারকি অধিবেশন: <strong className="text-slate-900 dark:text-white font-mono">১০ সেপ্টেম্বর ২০২৬</strong>
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-semibold">
            ডেমো পরিবেশ • ৫০০ প্রামাণ্য মামলা
          </span>
        </div>
      </div>

      {/* 2. Top Metric Dossiers (Analytically Reconciled) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Registered Cases */}
        <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-[#006A4E] dark:border-t-emerald-500 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-semibold">মোট নথিভুক্ত মামলা</span>
              <FileText className="w-3.5 h-3.5 text-[#006A4E] dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1">
              {totalCases}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">৮টি পাইলট জেলা</span>
          </div>
          <button
            onClick={() => onNavigateToTab('cases')}
            className="flex items-center justify-between text-xs text-[#006A4E] dark:text-emerald-400 hover:text-[#004D3A] dark:hover:text-emerald-300 font-semibold mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <span>মামলা খতিয়ান</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Pending Applications Review */}
        <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-blue-600 dark:border-t-blue-500 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">আবেদন পর্যালোচনায়</span>
              <FileCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-300 font-mono mt-1">
              {pendingApplications}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">যাচাই ও সিদ্ধান্ত অপেক্ষমাণ</span>
          </div>
          <button
            onClick={() => onNavigateToTab('applications')}
            className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 font-semibold mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <span>আবেদন পর্যালোচনা</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Active Proceedings */}
        <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-emerald-600 dark:border-t-emerald-500 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-semibold">চলমান বিচারিক মামলা</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1">
              {activeCases}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">আদালতে সক্রিয় কার্যধারা</span>
          </div>
          <button
            onClick={() => onNavigateToTab('cases')}
            className="flex items-center justify-between text-xs text-[#006A4E] dark:text-emerald-400 hover:text-[#004D3A] dark:hover:text-emerald-300 font-semibold mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <span>চলমান তালিকা</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Upcoming Hearings */}
        <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-amber-500 dark:border-t-amber-400 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">আসন্ন শুনানি</span>
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-800 dark:text-amber-300 font-mono mt-1">
              {upcomingHearings}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">কার্যতালিকায় নির্ধারিত</span>
          </div>
          <button
            onClick={() => onNavigateToTab('attention')}
            className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 font-semibold mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <span>কার্যতালিকা</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* SLA Breaches */}
        <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-[#C8102E] dark:border-t-red-500 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-semibold text-[#C8102E] dark:text-red-400">এসএলএ অতিক্রান্ত</span>
              <Clock className="w-3.5 h-3.5 text-[#C8102E] dark:text-red-400" />
            </div>
            <div className="text-2xl font-bold text-[#C8102E] dark:text-red-400 font-mono mt-1">
              {slaBreaches}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">জরুরি পদক্ষেপ আবশ্যক</span>
          </div>
          <button
            onClick={() => onNavigateToTab('sla')}
            className="flex items-center justify-between text-xs text-[#C8102E] dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <span>বিলম্বিত মামলা</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Data Quality Anomalies */}
        <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 border-t-3 border-t-rose-600 dark:border-t-rose-500 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">ডেটা মানের অসঙ্গতি</span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-700 dark:text-rose-400 font-mono mt-1">
              {dataAnomalies}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">কালানুক্রমিক অসংগতি</span>
          </div>
          <button
            onClick={() => onNavigateToTab('data_quality')}
            className="flex items-center justify-between text-xs text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 font-semibold mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <span>নিরীক্ষা প্রতিবেদন</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. Operational Section: 8 Pilot Districts Grid & Intentional Demo Anomaly Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pilot District Case Reconciled Distribution (2 Columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#006A4E] dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                ৮টি পাইলট জেলার মামলার সামগ্রিক অবস্থান
              </h2>
            </div>
            <button
              onClick={() => onNavigateToTab('districts')}
              className="text-xs font-semibold text-[#006A4E] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>বিস্তারিত জেলা পর্যবেক্ষণ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-900/50">
                  <th className="py-2.5 px-3">পাইলট জেলা</th>
                  <th className="py-2.5 px-2 text-center">মোট মামলা</th>
                  <th className="py-2.5 px-2 text-center">চলমান</th>
                  <th className="py-2.5 px-2 text-center">আসন্ন শুনানি</th>
                  <th className="py-2.5 px-2 text-center">এসএলএ বিলম্ব</th>
                  <th className="py-2.5 px-2 text-center">অসঙ্গতি</th>
                  <th className="py-2.5 px-3">দায়িত্বপ্রাপ্ত ডিএলএও</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {districtMetrics.map((dm) => (
                  <tr key={dm.districtName} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                      {dm.districtNameBn} ({dm.districtName})
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                      {dm.totalCases}
                    </td>
                    <td className="py-2 px-2 text-center font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      {dm.activeCases}
                    </td>
                    <td className="py-2 px-2 text-center font-mono text-amber-700 dark:text-amber-400 font-semibold">
                      {dm.upcomingHearings}
                    </td>
                    <td className="py-2 px-2 text-center font-mono text-[#C8102E] dark:text-red-400 font-semibold">
                      {dm.slaBreaches > 0 ? dm.slaBreaches : '—'}
                    </td>
                    <td className="py-2 px-2 text-center font-mono text-rose-700 dark:text-rose-400 font-bold">
                      {dm.dataAnomaliesCount > 0 ? dm.dataAnomaliesCount : '—'}
                    </td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[140px]">
                      {dm.dlaoName}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 dark:border-slate-700 font-bold bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
                  <td className="py-2.5 px-3">সর্বমোট (Reconciled Sum)</td>
                  <td className="py-2.5 px-2 text-center font-mono text-[#006A4E] dark:text-emerald-400 font-bold">
                    {districtMetrics.reduce((acc, m) => acc + m.totalCases, 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono">
                    {districtMetrics.reduce((acc, m) => acc + m.activeCases, 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono">
                    {districtMetrics.reduce((acc, m) => acc + m.upcomingHearings, 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-[#C8102E]">
                    {districtMetrics.reduce((acc, m) => acc + m.slaBreaches, 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-rose-600">
                    {districtMetrics.reduce((acc, m) => acc + m.dataAnomaliesCount, 0)}
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-emerald-700 dark:text-emerald-400">
                    ৮ জন অনুমোদিত কর্মকর্তা
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Hero Spotlight: Data Quality & Chronology Anomaly Detection Showcase */}
        <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#C8102E] dark:text-red-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  স্বয়ংক্রিয় অসংগতি শনাক্তকরণ
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-[#C8102E] border border-red-200">
                {dataAnomalies}টি অসংগতি
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              সিস্টেম কোনো উৎস তথ্য স্বয়ংক্রিয়ভাবে বিকৃত না করে সরাসরি আইনগত অসংগতি শনাক্ত ও প্রদর্শন করে:
            </p>

            <div className="space-y-2.5">
              {anomalyCases.map((ac) => (
                <div
                  key={ac.caseId}
                  onClick={() => onSelectCase(ac)}
                  className="p-2.5 rounded-md border border-red-200 dark:border-red-900/50 bg-red-50/70 dark:bg-red-950/30 hover:bg-red-100/60 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#C8102E] dark:text-red-300">
                      {ac.caseId}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-200/80 dark:bg-red-900/60 text-red-900 dark:text-red-200 font-bold">
                      {ac.district}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                    {ac.applicantName}
                  </div>
                  <div className="text-[11px] text-red-800 dark:text-red-300 mt-1 flex items-start gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#C8102E]" />
                    <span>{ac.dataQualityExplanation || 'শুনানির তারিখ মামলা দাখিলের তারিখের পূর্বে নির্ধারিত হয়েছে।'}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                    ফাইলিং: {formatToDisplayDate(ac.filingDate)} • শুনানি: {formatToDisplayDate(ac.nextHearingDate)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('data_quality')}
            className="w-full mt-4 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
          >
            <span>সকল অসংগতি পরীক্ষা করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Priority Cases Requiring Immediate Attention */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              জরুরি ও উচ্চ অগ্রাধিকারপ্রাপ্ত মামলা (শীর্ষ পর্যালোচনা)
            </h2>
          </div>
          <button
            onClick={() => onNavigateToTab('attention')}
            className="text-xs font-semibold text-[#006A4E] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>আজকের সম্পূর্ণ কিউ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-900/50">
                <th className="py-2.5 px-3">মামলা নং</th>
                <th className="py-2.5 px-3">আবেদনকারী</th>
                <th className="py-2.5 px-2">জেলা ও আদালত</th>
                <th className="py-2.5 px-2">মামলার বিষয়</th>
                <th className="py-2.5 px-2">অগ্রাধিকার স্কোর</th>
                <th className="py-2.5 px-2">নিযুক্ত আইনজীবী</th>
                <th className="py-2.5 px-3 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {highPriorityCases.map((c) => (
                <tr key={c.caseId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#006A4E] dark:text-emerald-400">
                    {c.caseId}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                    {c.applicantName}
                    {c.vulnerabilityIndicator && c.vulnerabilityIndicator !== 'None identified' && (
                      <span className="block text-[10px] text-amber-700 dark:text-amber-400">
                        {c.vulnerabilityIndicator}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">
                    <div>{c.district}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{c.court}</div>
                  </td>
                  <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300 font-medium">
                    {c.caseType}
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200">
                      {c.priorityScore}/১০০ ({c.priority})
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">
                    {c.assignedLawyer || <span className="text-amber-700 dark:text-amber-400 font-semibold">অনিযুক্ত</span>}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectCase(c)}
                      className="px-2.5 py-1 rounded bg-[#006A4E] hover:bg-[#004D3A] text-white font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      নথি দেখুন
                    </button>
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
