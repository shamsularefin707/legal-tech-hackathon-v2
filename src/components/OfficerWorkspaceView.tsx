import React, { useState } from 'react';
import {
  FileText,
  Clock,
  AlertTriangle,
  UserCheck,
  UserX,
  UserPlus,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  Filter,
  Search,
  ShieldAlert,
  ArrowRight,
  ChevronDown,
  Building2,
  FileCheck
} from 'lucide-react';
import { CanonicalCase, CanonicalLawyer, UserRole } from '../types/legalAid';
import { formatToDisplayDate } from '../services/chronologyEngine';
import { legalAidStore } from '../services/legalAidStore';

interface OfficerWorkspaceViewProps {
  cases: CanonicalCase[];
  lawyers: CanonicalLawyer[];
  currentRole: UserRole;
  currentDistrict: string;
  onSelectCase: (c: CanonicalCase) => void;
  onOpenNewApplication: () => void;
  onOpenNikahnamaPreview: (c: CanonicalCase) => void;
}

export const OfficerWorkspaceView: React.FC<OfficerWorkspaceViewProps> = ({
  cases,
  lawyers,
  currentRole,
  currentDistrict,
  onSelectCase,
  onOpenNewApplication,
  onOpenNikahnamaPreview
}) => {
  // Sub-tabs for officer workflow
  const [activeQueueTab, setActiveQueueTab] = useState<
    'today_actions' | 'intake_queue' | 'decision_queue' | 'assign_lawyer' | 'hearings_7days' | 'overdue_queue'
  >('today_actions');

  const [selectedDistrict, setSelectedDistrict] = useState<string>(currentDistrict || 'Dhaka');
  const [searchQuery, setSearchQuery] = useState('');

  // Action Dialog State
  const [decisionCase, setDecisionCase] = useState<CanonicalCase | null>(null);
  const [decisionType, setDecisionType] = useState<'APPROVE' | 'REJECT' | 'ASSIGN'>('APPROVE');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [selectedLawyerId, setSelectedLawyerId] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Filter cases for the officer's jurisdiction
  const districtCases = selectedDistrict === 'ALL'
    ? cases
    : cases.filter(c => c.district.toLowerCase() === selectedDistrict.toLowerCase());

  // Derive Officer Queues
  const newIntakeCases = districtCases.filter(c => c.applicationStatus === 'SUBMITTED');
  const decisionCases = districtCases.filter(c => c.applicationStatus === 'UNDER_REVIEW' || c.applicationStatus === 'VERIFIED');
  const needsLawyerCases = districtCases.filter(
    c => c.applicationStatus === 'APPROVED' && (!c.assignedLawyerId || c.representationStatus === 'UNASSIGNED' || c.representationStatus === 'REASSIGNMENT_REQUESTED')
  );

  const upcomingHearings = districtCases.filter(c => {
    if (!c.nextHearingDate || c.lifecycleStatus === 'CLOSED' || c.lifecycleStatus === 'RESOLVED') return false;
    // Check if within next 7 days from demo date (2026-09-10 to 2026-09-17)
    return c.nextHearingDate >= '2026-09-10' && c.nextHearingDate <= '2026-09-17';
  });

  const overdueCases = districtCases.filter(c => c.slaStatus === 'EXPIRED');
  const flaggedAnomalies = districtCases.filter(c => c.dataQualityStatus === 'DATA_QUALITY_ANOMALY');

  // Handle Approve / Reject / Assign
  const handleExecuteDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionCase) return;

    if (decisionType === 'APPROVE') {
      legalAidStore.approveEligibility(decisionCase.caseId, decisionNotes);
      setActionSuccessMsg(`আবেদন ${decisionCase.caseId} সফলভাবে অনুমোদন করা হয়েছে।`);
    } else if (decisionType === 'REJECT') {
      if (!decisionNotes.trim()) {
        alert('প্রত্যাখ্যানের কারণ লিপিবদ্ধ করা বাধ্যতামূলক।');
        return;
      }
      legalAidStore.rejectEligibility(decisionCase.caseId, decisionNotes);
      setActionSuccessMsg(`আবেদন ${decisionCase.caseId} প্রত্যাখ্যান করা হয়েছে। কারণ সংরক্ষণ করা হয়েছে।`);
    } else if (decisionType === 'ASSIGN') {
      if (!selectedLawyerId) {
        alert('অনুগ্রহ করে একজন প্যানেল আইনজীবী নির্বাচন করুন।');
        return;
      }
      legalAidStore.assignPanelLawyer(decisionCase.caseId, selectedLawyerId, decisionNotes);
      setActionSuccessMsg(`মামলা ${decisionCase.caseId}-তে আইনজীবী বরাদ্দ নিশ্চিত করা হয়েছে।`);
    }

    setDecisionCase(null);
    setDecisionNotes('');
    setSelectedLawyerId('');
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  // Filter list based on search
  const filterList = (list: CanonicalCase[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      c =>
        c.caseId.toLowerCase().includes(q) ||
        c.applicantName.toLowerCase().includes(q) ||
        c.court.toLowerCase().includes(q)
    );
  };

  return (
    <div className="space-y-5">
      {/* 1. Official Officer Banner (Pragmatic Judicial Tone) */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-4.5 bg-[#006A4E] rounded-xs" />
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                জেলা লিগ্যাল এইড অফিসার (DLAO) কার্যনির্বাহী ডেস্ক
              </h1>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-4">
              আবেদন পর্যালোচনা, যোগ্যতা যাচাই, সরকারি অনুমোদন ও প্যানেল আইনজীবী নিয়োগ ব্যবস্থাপনা
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* District Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-medium">এখতিয়ারভুক্ত জেলা:</span>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="bg-transparent border-none font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="Dhaka">ঢাকা (Dhaka)</option>
                <option value="Chattogram">চট্টগ্রাম (Chattogram)</option>
                <option value="Khulna">খুলনা (Khulna)</option>
                <option value="Cumilla">কুমিল্লা (Cumilla)</option>
                <option value="Netrokona">নেত্রকোণা (Netrokona)</option>
                <option value="Rajbari">রাজবাড়ী (Rajbari)</option>
                <option value="Habiganj">হবিগঞ্জ (Habiganj)</option>
                <option value="Joypurhat">জয়পুরহাট (Joypurhat)</option>
                <option value="ALL">সকল ৮টি পাইলট জেলা</option>
              </select>
            </div>

            <button
              onClick={onOpenNewApplication}
              className="px-3.5 py-1.5 bg-[#006A4E] hover:bg-[#004D3A] text-white rounded-md font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              + নতুন আবেদন গ্রহণ
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {actionSuccessMsg && (
          <div className="mt-4 p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* 2. Today's Action Queue Bar (Operational, NOT generic KPI cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Action 1: New Applications */}
          <button
            onClick={() => setActiveQueueTab('intake_queue')}
            className={`p-3 rounded-md border text-left transition-all cursor-pointer ${
              activeQueueTab === 'intake_queue'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-[#006A4E] dark:border-emerald-500'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              নতুন আবেদন গ্রহণ
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">
              {newIntakeCases.length}
            </div>
            <span className="text-[10px] text-slate-500">যাচাই অপেক্ষমাণ</span>
          </button>

          {/* Action 2: Awaiting Decision */}
          <button
            onClick={() => setActiveQueueTab('decision_queue')}
            className={`p-3 rounded-md border text-left transition-all cursor-pointer ${
              activeQueueTab === 'decision_queue'
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-600 dark:border-amber-500'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              অনুমোদন / প্রত্যাখ্যান
            </span>
            <div className="text-xl font-bold text-amber-900 dark:text-amber-200 font-mono mt-0.5">
              {decisionCases.length}
            </div>
            <span className="text-[10px] text-slate-500">কমিটির সিদ্ধান্ত</span>
          </button>

          {/* Action 3: Needs Lawyer Assignment */}
          <button
            onClick={() => setActiveQueueTab('assign_lawyer')}
            className={`p-3 rounded-md border text-left transition-all cursor-pointer ${
              activeQueueTab === 'assign_lawyer'
                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 dark:border-blue-500'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              আইনজীবী নিয়োগ
            </span>
            <div className="text-xl font-bold text-blue-900 dark:text-blue-200 font-mono mt-0.5">
              {needsLawyerCases.length}
            </div>
            <span className="text-[10px] text-slate-500">অনুমোদিত মামলা</span>
          </button>

          {/* Action 4: Upcoming Hearings */}
          <button
            onClick={() => setActiveQueueTab('hearings_7days')}
            className={`p-3 rounded-md border text-left transition-all cursor-pointer ${
              activeQueueTab === 'hearings_7days'
                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-600 dark:border-indigo-500'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              আগামী ৭ দিনের শুনানি
            </span>
            <div className="text-xl font-bold text-indigo-900 dark:text-indigo-200 font-mono mt-0.5">
              {upcomingHearings.length}
            </div>
            <span className="text-[10px] text-slate-500">আদালত রোস্টার</span>
          </button>

          {/* Action 5: Overdue Actions */}
          <button
            onClick={() => setActiveQueueTab('overdue_queue')}
            className={`p-3 rounded-md border text-left transition-all cursor-pointer ${
              activeQueueTab === 'overdue_queue'
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-600 dark:border-rose-500'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              সময়সীমা অতিক্রান্ত
            </span>
            <div className="text-xl font-bold text-rose-900 dark:text-rose-200 font-mono mt-0.5">
              {overdueCases.length}
            </div>
            <span className="text-[10px] text-rose-700 dark:text-rose-400 font-medium">আশু পদক্ষেপ</span>
          </button>

          {/* Action 6: Master Action Overview */}
          <button
            onClick={() => setActiveQueueTab('today_actions')}
            className={`p-3 rounded-md border text-left transition-all cursor-pointer ${
              activeQueueTab === 'today_actions'
                ? 'bg-[#006A4E] text-white border-[#004D3A]'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className={`text-[11px] font-semibold block ${activeQueueTab === 'today_actions' ? 'text-emerald-100' : 'text-slate-600 dark:text-slate-300'}`}>
              আজকের অগ্রাধিকার
            </span>
            <div className={`text-xl font-bold font-mono mt-0.5 ${activeQueueTab === 'today_actions' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              {newIntakeCases.length + decisionCases.length + needsLawyerCases.length}
            </div>
            <span className={`text-[10px] ${activeQueueTab === 'today_actions' ? 'text-emerald-100' : 'text-slate-500'}`}>
              সর্বমোট করণীয়
            </span>
          </button>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="flex items-center gap-2 bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-2.5 shadow-2xs">
        <Search className="w-4 h-4 text-slate-400 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="মামলা নম্বর, আবেদনকারী বা আদালতের নাম দিয়ে এই কিউতে অনুসন্ধান করুন..."
          className="flex-1 bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer">
            মুছুন
          </button>
        )}
      </div>

      {/* 4. Queue Content Tables / Card Views */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {activeQueueTab === 'today_actions' && 'আপনার আজকের করণীয় মামলার অগ্রাধিকার তালিকা'}
              {activeQueueTab === 'intake_queue' && `প্রাথমিক আবেদন যাচাই কিউ (${filterList(newIntakeCases).length}টি)`}
              {activeQueueTab === 'decision_queue' && `অনুমোদন / প্রত্যাখ্যান সিদ্ধান্ত কিউ (${filterList(decisionCases).length}টি)`}
              {activeQueueTab === 'assign_lawyer' && `প্যানেল আইনজীবী নিয়োগ কিউ (${filterList(needsLawyerCases).length}টি)`}
              {activeQueueTab === 'hearings_7days' && `আগামী ৭ দিনের শুনানি তালিকা (${filterList(upcomingHearings).length}টি)`}
              {activeQueueTab === 'overdue_queue' && `সময়সীমা অতিক্রান্ত মামলা (${filterList(overdueCases).length}টি)`}
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            রেফারেন্স তারিখ: <strong className="text-slate-900 dark:text-white font-mono">১০ সেপ্টেম্বর ২০২৬</strong>
          </span>
        </div>

        {/* Render Active Queue Items */}
        {(() => {
          let currentList: CanonicalCase[] = [];
          if (activeQueueTab === 'today_actions') {
            currentList = [...newIntakeCases, ...decisionCases, ...needsLawyerCases];
          } else if (activeQueueTab === 'intake_queue') {
            currentList = newIntakeCases;
          } else if (activeQueueTab === 'decision_queue') {
            currentList = decisionCases;
          } else if (activeQueueTab === 'assign_lawyer') {
            currentList = needsLawyerCases;
          } else if (activeQueueTab === 'hearings_7days') {
            currentList = upcomingHearings;
          } else if (activeQueueTab === 'overdue_queue') {
            currentList = overdueCases;
          }

          const filtered = filterList(currentList);

          if (filtered.length === 0) {
            return (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="w-10 h-10 text-[#006A4E] mx-auto mb-2 opacity-80" />
                <p className="text-sm font-medium">এই তালিকায় বর্তমানে কোনো অনিষ্পন্ন পদক্ষেপ নেই।</p>
                <p className="text-xs text-slate-400 mt-1">সব কার্যক্রম সময়মতো পরিচালিত হচ্ছে।</p>
              </div>
            );
          }

          return (
            <div className="space-y-3">
              {filtered.map(c => {
                const isNeedsApproval = c.applicationStatus === 'UNDER_REVIEW' || c.applicationStatus === 'VERIFIED';
                const isNeedsIntake = c.applicationStatus === 'SUBMITTED';
                const isNeedsLawyer = c.applicationStatus === 'APPROVED' && (!c.assignedLawyerId || c.representationStatus === 'UNASSIGNED');

                return (
                  <div
                    key={c.caseId}
                    className="p-4 rounded-md border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    {/* Left: Case Info */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {c.caseId}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
                          {c.district}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {c.caseType}
                        </span>
                        {c.vulnerabilityIndicator && c.vulnerabilityIndicator !== 'None identified' && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
                            জরুরিতা: {c.vulnerabilityIndicator}
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        আবেদনকারী: {c.applicantName} • {c.court}
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        দাখিলের তারিখ: {formatToDisplayDate(c.filingDate)} • বর্তমান অবস্থা: <span className="font-medium text-slate-800 dark:text-slate-200">{c.currentStageBn}</span>
                      </div>
                    </div>

                    {/* Right: Operational Actions Tailored to DLAO */}
                    <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                      {/* Document Preview (Nikahnama if relevant) */}
                      {c.caseType.includes('Family') || c.caseType.includes('পারিবারিক') ? (
                        <button
                          onClick={() => onOpenNikahnamaPreview(c)}
                          className="px-2.5 py-1.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                        >
                          নিকাহনামা
                        </button>
                      ) : null}

                      {/* Verify Action */}
                      {isNeedsIntake && (
                        <button
                          onClick={() => {
                            legalAidStore.verifyApplicationDocuments(c.caseId, 'নথিপত্র যাচাই সম্পন্ন। বিধি মোতাবেক বৈধ।');
                            setActionSuccessMsg(`আবেদন ${c.caseId}-এর নথিপত্র সফলভাবে যাচাই সম্পন্ন হয়েছে।`);
                          }}
                          className="px-3 py-1.5 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-2xs"
                        >
                          তথ্য ও নথি যাচাই
                        </button>
                      )}

                      {/* Approve / Reject Actions (Authorized Authority / DLAO) */}
                      {isNeedsApproval && (
                        <>
                          <button
                            onClick={() => {
                              setDecisionCase(c);
                              setDecisionType('APPROVE');
                              setDecisionNotes('আবেদনকারী সরকারি আইনগত সহায়তা বিধিমালা অনুযায়ী যোগ্য বিবেচিত।');
                            }}
                            className="px-3 py-1.5 rounded text-xs font-semibold bg-[#006A4E] hover:bg-[#004D3A] text-white transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>অনুমোদন</span>
                          </button>
                          <button
                            onClick={() => {
                              setDecisionCase(c);
                              setDecisionType('REJECT');
                              setDecisionNotes('');
                            }}
                            className="px-3 py-1.5 rounded text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>প্রত্যাখ্যান</span>
                          </button>
                        </>
                      )}

                      {/* Assign Lawyer Action */}
                      {isNeedsLawyer && (
                        <button
                          onClick={() => {
                            setDecisionCase(c);
                            setDecisionType('ASSIGN');
                            // Preselect a lawyer from same district with lowest workload
                            const districtLawyers = lawyers.filter(
                              l => l.district.toLowerCase() === c.district.toLowerCase()
                            );
                            const best = districtLawyers.sort((a, b) => a.utilization - b.utilization)[0];
                            if (best) setSelectedLawyerId(best.lawyerId);
                          }}
                          className="px-3 py-1.5 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>আইনজীবী নিয়োগ</span>
                        </button>
                      )}

                      {/* Open Full Dossier */}
                      <button
                        onClick={() => onSelectCase(c)}
                        className="px-3 py-1.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>নথি দেখুন</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* 5. Decision / Action Modal (Approve, Reject, or Assign Lawyer) */}
      {decisionCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-lg max-w-lg w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {decisionType === 'APPROVE' && 'আইনগত সহায়তা অনুমোদন ফরম'}
                {decisionType === 'REJECT' && 'আইনগত সহায়তা প্রত্যাখ্যান ফরম'}
                {decisionType === 'ASSIGN' && 'প্যানেল আইনজীবী নিয়োগ ফরম'}
              </h3>
              <button
                onClick={() => setDecisionCase(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white">
                মামলা: {decisionCase.caseId} • {decisionCase.applicantName}
              </div>
              <div className="text-slate-500">
                জেলা: {decisionCase.district} • আদালত: {decisionCase.court} • বিষয়: {decisionCase.caseType}
              </div>
            </div>

            <form onSubmit={handleExecuteDecision} className="space-y-4 text-xs sm:text-sm">
              {decisionType === 'ASSIGN' && (
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    প্যানেল আইনজীবী নির্বাচন করুন:
                  </label>
                  <select
                    value={selectedLawyerId}
                    onChange={e => setSelectedLawyerId(e.target.value)}
                    className="w-full p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                    required
                  >
                    <option value="">আইনজীবী নির্বাচন করুন...</option>
                    {lawyers
                      .filter(l => l.district.toLowerCase() === decisionCase.district.toLowerCase())
                      .map(l => (
                        <option key={l.lawyerId} value={l.lawyerId}>
                          {l.lawyerName} ({l.specialization}) — মামলা ভার: {l.activeCases}/{l.capacity} ({l.utilization}%)
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {decisionType === 'REJECT'
                    ? 'প্রত্যাখ্যানের সুনির্দিষ্ট আইনগত কারণ (বাধ্যতামূলক):'
                    : 'কর্মকর্তার আদেশ ও প্রাতিষ্ঠানিক মন্তব্য:'}
                </label>
                <textarea
                  value={decisionNotes}
                  onChange={e => setDecisionNotes(e.target.value)}
                  placeholder={
                    decisionType === 'REJECT'
                      ? 'যেমন: পারিবারিক বার্ষিক আয় সরকারি নীতিমালার সীমা অতিক্রম করায় সহায়তা প্রদান সম্ভব নহে...'
                      : 'আদেশের মন্তব্য লিখুন...'
                  }
                  rows={3}
                  className="w-full p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                  required={decisionType === 'REJECT'}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setDecisionCase(null)}
                  className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md font-semibold text-white transition-colors shadow-2xs cursor-pointer ${
                    decisionType === 'APPROVE'
                      ? 'bg-[#006A4E] hover:bg-[#004D3A]'
                      : decisionType === 'REJECT'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {decisionType === 'APPROVE' && 'অনুমোদন নিশ্চিত করুন'}
                  {decisionType === 'REJECT' && 'প্রত্যাখ্যান নিশ্চিত করুন'}
                  {decisionType === 'ASSIGN' && 'আইনজীবী নিয়োগ সম্পন্ন করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
