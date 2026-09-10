import React, { useState, useMemo } from 'react';
import {
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  UserCheck,
  Building2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { CanonicalCase, ApplicationStatus, UserRole } from '../types/legalAid';
import { formatToDisplayDate } from '../services/chronologyEngine';
import { PILOT_DISTRICT_NAMES } from '../data/canonicalLocations';

interface ApplicationsViewProps {
  cases: CanonicalCase[];
  currentRole: UserRole;
  onSelectCase: (c: CanonicalCase) => void;
  onOpenNewApplicationModal: () => void;
}

type TabFilter = 'ALL' | 'SUBMITTED' | 'UNDER_REVIEW' | 'RECOMMENDED' | 'APPROVED' | 'REJECTED';

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  cases,
  currentRole,
  onSelectCase,
  onOpenNewApplicationModal
}) => {
  const [activeTab, setActiveTab] = useState<TabFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  const filteredApplications = useMemo(() => {
    return cases.filter((c) => {
      // Tab filter
      if (activeTab === 'SUBMITTED' && c.applicationStatus !== 'SUBMITTED') return false;
      if (activeTab === 'UNDER_REVIEW' && c.applicationStatus !== 'UNDER_REVIEW' && c.applicationStatus !== 'VERIFIED') return false;
      if (activeTab === 'RECOMMENDED' && c.applicationStatus !== 'RECOMMENDED') return false;
      if (activeTab === 'APPROVED' && c.applicationStatus !== 'APPROVED') return false;
      if (activeTab === 'REJECTED' && c.applicationStatus !== 'REJECTED') return false;

      // District filter
      if (districtFilter !== 'ALL' && c.district !== districtFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.applicantName.toLowerCase().includes(q);
        const matchAppId = c.applicationId.toLowerCase().includes(q);
        const matchCaseId = c.caseId.toLowerCase().includes(q);
        const matchType = c.caseType.toLowerCase().includes(q);
        if (!matchName && !matchAppId && !matchCaseId && !matchType) return false;
      }

      return true;
    });
  }, [cases, activeTab, districtFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: cases.length,
      submitted: cases.filter(c => c.applicationStatus === 'SUBMITTED').length,
      underReview: cases.filter(c => c.applicationStatus === 'UNDER_REVIEW' || c.applicationStatus === 'VERIFIED').length,
      recommended: cases.filter(c => c.applicationStatus === 'RECOMMENDED').length,
      approved: cases.filter(c => c.applicationStatus === 'APPROVED').length,
      rejected: cases.filter(c => c.applicationStatus === 'REJECTED').length
    };
  }, [cases]);

  return (
    <div className="space-y-4">
      {/* 1. Header & Institutional Context */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-4.5 bg-blue-600 dark:bg-blue-500 rounded-xs" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              আইনগত সহায়তা আবেদন ব্যবস্থাপনা (Application Intake & Review)
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-4">
            নাগরিকদের সরাসরি বা হেল্পলাইনের মাধ্যমে প্রাপ্ত আইনগত সহায়তা আবেদন যাচাই, যোগ্যতা নির্ধারণ ও অনুমোদন প্রক্রিয়া
          </p>
        </div>

        <button
          onClick={onOpenNewApplicationModal}
          className="px-3.5 py-1.5 rounded-md bg-[#006A4E] hover:bg-[#004D3A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <span>+ নতুন আবেদন গ্রহণ</span>
        </button>
      </div>

      {/* Role advisory notice if Lawyer */}
      {currentRole === 'PANEL_LAWYER' && (
        <div className="p-3 rounded-md bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-purple-600 shrink-0" />
          <span>
            <strong>আইনি নির্দেশিকা:</strong> প্যানেল আইনজীবীদের কোনো নাগরিকের আইনগত সহায়তা যোগ্যতা অনুমোদন বা প্রত্যাখ্যানের প্রশাসনিক কর্তৃত্ব নেই। শুধুমাত্র অনুমোদিত মামলার নিয়োগ গ্রহণ ও প্রতিনিধিত্ব পরিচালনা করতে পারবেন।
          </span>
        </div>
      )}

      {/* 2. Sub-navigation Tabs */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-1.5 flex flex-wrap gap-1 text-xs">
        {[
          { id: 'ALL', labelBn: 'সকল আবেদন', count: counts.all },
          { id: 'SUBMITTED', labelBn: 'দাখিলকৃত (নতুন)', count: counts.submitted },
          { id: 'UNDER_REVIEW', labelBn: 'যাচাই ও পর্যালোচনায়', count: counts.underReview },
          { id: 'RECOMMENDED', labelBn: 'সুপারিশকৃত', count: counts.recommended },
          { id: 'APPROVED', labelBn: 'অনুমোদিত', count: counts.approved },
          { id: 'REJECTED', labelBn: 'প্রত্যাখ্যাত', count: counts.rejected }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabFilter)}
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
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Search and Filters */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="আবেদনকারী, আইডি বা মামলার বিষয় দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md text-xs bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#006A4E]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">পাইলট জেলা:</span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="ALL">সকল জেলা (৮টি পাইলট)</option>
            {PILOT_DISTRICT_NAMES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Applications Administrative Table */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-900/60">
                <th className="py-2.5 px-3">আবেদন আইডি</th>
                <th className="py-2.5 px-3">আবেদনকারী ও পরিচয়</th>
                <th className="py-2.5 px-2">জেলা ও উপজেলা</th>
                <th className="py-2.5 px-2">মামলার শ্রেণি</th>
                <th className="py-2.5 px-2">আবেদনের তারিখ</th>
                <th className="py-2.5 px-2 text-center">আবেদন পর্যায়</th>
                <th className="py-2.5 px-2">দায়িত্বপ্রাপ্ত কর্মকর্তা</th>
                <th className="py-2.5 px-3 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    কোনো আবেদন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredApplications.slice(0, 50).map((c) => {
                  let statusBadge = (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                      পর্যালোচনাধীন
                    </span>
                  );
                  if (c.applicationStatus === 'SUBMITTED') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        দাখিলকৃত (নতুন)
                      </span>
                    );
                  } else if (c.applicationStatus === 'VERIFIED') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                        তথ্য যাচাইকৃত
                      </span>
                    );
                  } else if (c.applicationStatus === 'RECOMMENDED') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                        সুপারিশকৃত
                      </span>
                    );
                  } else if (c.applicationStatus === 'APPROVED') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        অনুমোদিত
                      </span>
                    );
                  } else if (c.applicationStatus === 'REJECTED') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                        প্রত্যাখ্যাত
                      </span>
                    );
                  }

                  return (
                    <tr key={c.caseId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700 dark:text-blue-400">
                        {c.applicationId}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {c.applicantName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          NID: {c.beneficiaryNidMasked}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">
                        <div className="font-semibold">{c.district}</div>
                        <div className="text-[10px] text-slate-500">{c.upazila}</div>
                      </td>
                      <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300 font-medium">
                        {c.caseType}
                      </td>
                      <td className="py-2.5 px-2 font-mono text-slate-600 dark:text-slate-400">
                        {formatToDisplayDate(c.applicationDate)}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {statusBadge}
                      </td>
                      <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400 text-[11px] truncate max-w-[130px]">
                        {c.assignedOfficer}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onSelectCase(c)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#006A4E] hover:text-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-600 dark:hover:text-white font-semibold text-[11px] transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
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
