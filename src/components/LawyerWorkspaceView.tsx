import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  FileCheck,
  PlusCircle,
  Search,
  Building,
  User,
  AlertTriangle,
  ArrowRight,
  Eye,
  MessageSquare
} from 'lucide-react';
import { CanonicalCase, CanonicalLawyer, UserRole } from '../types/legalAid';
import { formatToDisplayDate } from '../services/chronologyEngine';
import { legalAidStore } from '../services/legalAidStore';

interface LawyerWorkspaceViewProps {
  cases: CanonicalCase[];
  lawyers: CanonicalLawyer[];
  currentRole: UserRole;
  currentLawyerId?: string;
  onSelectCase: (c: CanonicalCase) => void;
  onOpenNikahnamaPreview: (c: CanonicalCase) => void;
}

export const LawyerWorkspaceView: React.FC<LawyerWorkspaceViewProps> = ({
  cases,
  lawyers,
  currentRole,
  currentLawyerId,
  onSelectCase,
  onOpenNikahnamaPreview
}) => {
  // Find lawyer or default to first panel lawyer
  const [activeLawyerId, setActiveLawyerId] = useState<string>(
    currentLawyerId || 'LADCS-004' // Default demo lawyer: Advocate Kazi Afroza Begum
  );

  const [activeTab, setActiveTab] = useState<'hearings' | 'pending' | 'active_cases'>('hearings');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals / Action Drawers
  const [hearingModalCase, setHearingModalCase] = useState<CanonicalCase | null>(null);
  const [nextHearingDate, setNextHearingDate] = useState('2026-09-24');
  const [hearingPurpose, setHearingPurpose] = useState('আদালতে সাক্ষ্যগ্রহণ ও সওয়াল-জবাব');
  const [hearingOutcome, setHearingOutcome] = useState('শুনানি সম্পন্ন, আর্গুমেন্টের জন্য পরবর্তী তারিখ ধার্য');

  const [declineModalCase, setDeclineModalCase] = useState<CanonicalCase | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  const [noteModalCase, setNoteModalCase] = useState<CanonicalCase | null>(null);
  const [caseNoteContent, setCaseNoteContent] = useState('');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Retrieve designated lawyer's caseload
  const lawyerCaseload = legalAidStore.getLawyerCaseload(activeLawyerId);
  const activeLawyer = lawyers.find(l => l.lawyerId === activeLawyerId) || lawyers[0];

  // Handlers
  const handleAcceptAssignment = (c: CanonicalCase) => {
    legalAidStore.lawyerAcceptAssignment(c.caseId);
    setSuccessMsg(`আপনি মামলা ${c.caseId}-এর আইনি প্রতিনিধিত্বের দায়িত্ব আনুষ্ঠানিকভাবে গ্রহণ করেছেন।`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDeclineAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declineModalCase || !declineReason.trim()) return;

    legalAidStore.lawyerDeclineAssignment(declineModalCase.caseId, declineReason);
    setSuccessMsg(`মামলা ${declineModalCase.caseId}-এর দায়িত্বে অপারগতা লিপিবদ্ধ করা হয়েছে। DLAO-কে জানানো হয়েছে।`);
    setDeclineModalCase(null);
    setDeclineReason('');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleRecordHearing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hearingModalCase) return;

    legalAidStore.updateCaseHearing(
      hearingModalCase.caseId,
      nextHearingDate,
      hearingOutcome,
      hearingPurpose
    );

    setSuccessMsg(`মামলা ${hearingModalCase.caseId}-এর আদালতের শুনানির ফলাফল ও পরবর্তী তারিখ সফলভাবে সংরক্ষিত হয়েছে।`);
    setHearingModalCase(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteModalCase || !caseNoteContent.trim()) return;

    legalAidStore.addCaseProgressNote(noteModalCase.caseId, caseNoteContent);
    setSuccessMsg(`মামলা ${noteModalCase.caseId}-তে অগ্রগতি নোট সফলভাবে যুক্ত হয়েছে।`);
    setNoteModalCase(null);
    setCaseNoteContent('');
    setTimeout(() => setSuccessMsg(null), 4000);
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
      {/* 1. Panel Lawyer Header */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-4.5 bg-[#006A4E] rounded-xs" />
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                প্যানেল আইনজীবী (LADCS) চেম্বার ও কার্যতালিকা
              </h1>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-4">
              নিযুক্ত সরকারি আইনি সহায়তা মামলা, আদালতের শুনানি রোস্টার ও কার্যবিবরণী হালনাগাদ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Lawyer Persona Selector for Demo flexibility */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-medium">আইনজীবী:</span>
              <select
                value={activeLawyerId}
                onChange={e => setActiveLawyerId(e.target.value)}
                className="bg-transparent border-none font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                {lawyers.map(l => (
                  <option key={l.lawyerId} value={l.lawyerId}>
                    {l.lawyerName} ({l.district}) — {l.activeCases}/{l.capacity} মামলা
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lawyer Profile Quick Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span>বার কাউন্সিল আইডি: <strong className="text-slate-900 dark:text-white font-mono">{activeLawyer.barCouncilId}</strong></span>
            <span>বিশেষজ্ঞতা: <strong className="text-slate-900 dark:text-white">{activeLawyer.specialization}</strong></span>
            <span>জেলা: <strong className="text-slate-900 dark:text-white">{activeLawyer.district}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span>কার্যভার ব্যবহার:</span>
            <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  activeLawyer.utilization >= 100
                    ? 'bg-rose-600'
                    : activeLawyer.utilization >= 80
                    ? 'bg-amber-600'
                    : 'bg-[#006A4E]'
                }`}
                style={{ width: `${Math.min(activeLawyer.utilization, 100)}%` }}
              />
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {activeLawyer.activeCases}/{activeLawyer.capacity} ({activeLawyer.utilization}%)
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mt-3 p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Action Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('hearings')}
            className={`px-4 py-2 rounded-md font-semibold text-xs transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'hearings'
                ? 'bg-[#006A4E] text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>আসন্ন আদালতের শুনানি তালিকা ({lawyerCaseload.upcomingHearings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-md font-semibold text-xs transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>নতুন নিয়োগ বিবেচনাধীন ({lawyerCaseload.pendingAssignments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('active_cases')}
            className={`px-4 py-2 rounded-md font-semibold text-xs transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'active_cases'
                ? 'bg-[#006A4E] text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>দায়িত্বপ্রাপ্ত চলমান মামলা ({lawyerCaseload.activeCases.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Search */}
      <div className="flex items-center gap-2 bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-2.5 shadow-2xs">
        <Search className="w-4 h-4 text-slate-400 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="মামলা নম্বর বা মক্কেলের নাম দিয়ে এই রোস্টারে খুঁজুন..."
          className="flex-1 bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer">
            মুছুন
          </button>
        )}
      </div>

      {/* 3. Tab Content */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        {/* Tab 1: Hearings */}
        {activeTab === 'hearings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#006A4E]" />
                <span>আসন্ন শুনানির তালিকা ও আদালতের ডকেট</span>
              </h2>
              <span className="text-xs text-slate-500">
                রেফারেন্স তারিখ: ১০ সেপ্টেম্বর ২০২৬
              </span>
            </div>

            {filterList(lawyerCaseload.upcomingHearings).length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-60 text-[#006A4E]" />
                <p className="text-sm">আসন্ন ৭ দিনের মধ্যে কোনো শুনানির তারিখ নির্ধারিত নেই।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filterList(lawyerCaseload.upcomingHearings).map(c => (
                  <div
                    key={c.caseId}
                    className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {c.caseId}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-semibold">
                          শুনানি: {formatToDisplayDate(c.nextHearingDate)}
                        </span>
                        <span className="text-xs text-slate-500">
                          {c.court}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        মক্কেল: {c.applicantName} • মামলা বিষয়: {c.caseType}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        বর্তমান পর্যায়: {c.currentStageBn}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => {
                          setHearingModalCase(c);
                          setNextHearingDate('2026-09-24');
                          setHearingOutcome('আদালতে শুনানি সম্পন্ন, পরবর্তী তারিখ ধার্য');
                        }}
                        className="px-3 py-1.5 rounded text-xs font-semibold bg-[#006A4E] hover:bg-[#004D3A] text-white transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>শুনানির আদেশ লিপিবদ্ধ করুন</span>
                      </button>

                      <button
                        onClick={() => onSelectCase(c)}
                        className="px-3 py-1.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        নথি দেখুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Pending Assignments */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>DLAO কর্তৃক প্রেরিত নতুন নিয়োগ (গ্রহণ / অপারগতা বিবেচনাধীন)</span>
              </h2>
              <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                ৩ কার্যদিবসের মধ্যে সিদ্ধান্ত প্রদান করুন
              </span>
            </div>

            {filterList(lawyerCaseload.pendingAssignments).length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-60 text-[#006A4E]" />
                <p className="text-sm">বর্তমানে কোনো অনিষ্পন্ন নিয়োগ প্রস্তাব নেই।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filterList(lawyerCaseload.pendingAssignments).map(c => (
                  <div
                    key={c.caseId}
                    className="p-4 rounded-md border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {c.caseId}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-medium">
                          নিয়োগ প্রস্তাবিত
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        আবেদনকারী: {c.applicantName} • আদালত: {c.court}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        মামলার বিষয়: {c.caseType} • জরুরিতা: {c.vulnerabilityIndicator}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleAcceptAssignment(c)}
                        className="px-3.5 py-1.5 rounded text-xs font-semibold bg-[#006A4E] hover:bg-[#004D3A] text-white transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>নিয়োগ গ্রহণ করুন</span>
                      </button>

                      <button
                        onClick={() => {
                          setDeclineModalCase(c);
                          setDeclineReason('');
                        }}
                        className="px-3 py-1.5 rounded text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>অপারগতা প্রকাশ</span>
                      </button>

                      <button
                        onClick={() => onSelectCase(c)}
                        className="px-3 py-1.5 rounded text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        নথি যাচাই
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Active Caseload */}
        {activeTab === 'active_cases' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#006A4E]" />
                <span>চলমান আইনি সহায়তা মামলা তালিকা ({filterList(lawyerCaseload.activeCases).length}টি)</span>
              </h2>
            </div>

            {filterList(lawyerCaseload.activeCases).length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                <p className="text-sm">বর্তমানে কোনো সক্রিয় মামলা নেই।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filterList(lawyerCaseload.activeCases).map(c => (
                  <div
                    key={c.caseId}
                    className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {c.caseId}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium">
                          প্রতিনিধিত্ব কার্যকর
                        </span>
                        {c.nextHearingDate && (
                          <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                            পরবর্তী শুনানি: {formatToDisplayDate(c.nextHearingDate)}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        মক্কেল: {c.applicantName} • {c.court}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        বিষয়: {c.caseType} • শেষ কার্যক্রম: {formatToDisplayDate(c.lastActivityDate)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => {
                          setNoteModalCase(c);
                          setCaseNoteContent('');
                        }}
                        className="px-3 py-1.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>নোট যোগ করুন</span>
                      </button>

                      <button
                        onClick={() => {
                          setHearingModalCase(c);
                          setNextHearingDate('2026-09-24');
                          setHearingOutcome('');
                        }}
                        className="px-3 py-1.5 rounded text-xs font-semibold bg-[#006A4E] hover:bg-[#004D3A] text-white transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>শুনানি হালনাগাদ</span>
                      </button>

                      <button
                        onClick={() => onSelectCase(c)}
                        className="px-3 py-1.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        নথি
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Record Hearing Outcome Modal */}
      {hearingModalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-lg max-w-lg w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                আদালতের শুনানির ফলাফল ও আদেশ লিপিবদ্ধকরণ
              </h3>
              <button
                onClick={() => setHearingModalCase(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white">
                মামলা: {hearingModalCase.caseId} • {hearingModalCase.applicantName}
              </div>
              <div className="text-slate-500">
                আদালত: {hearingModalCase.court} • জেলা: {hearingModalCase.district}
              </div>
            </div>

            <form onSubmit={handleRecordHearing} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  আজকের শুনানির উদ্দেশ্য ও পর্যায়:
                </label>
                <input
                  type="text"
                  value={hearingPurpose}
                  onChange={e => setHearingPurpose(e.target.value)}
                  placeholder="যেমন: সাক্ষ্যগ্রহণ, চার্জ গঠন, সওয়াল-জবাব..."
                  className="w-full p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  আদালতের আদেশের সারসংক্ষেপ:
                </label>
                <textarea
                  value={hearingOutcome}
                  onChange={e => setHearingOutcome(e.target.value)}
                  placeholder="আদালত কর্তৃক প্রদত্ত অন্তর্বর্তীকালীন আদেশ বা অগ্রগতির বিবরণ..."
                  rows={3}
                  className="w-full p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  পরবর্তী ধার্য শুনানির তারিখ:
                </label>
                <input
                  type="date"
                  value={nextHearingDate}
                  onChange={e => setNextHearingDate(e.target.value)}
                  min="2026-09-11"
                  className="w-full p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none font-mono"
                  required
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  * শুনানি অবশ্যই রেফারেন্স তারিখ (১০ সেপ্টেম্বর ২০২৬)-এর পরবর্তী তারিখে হতে হবে।
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setHearingModalCase(null)}
                  className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md font-semibold text-white bg-[#006A4E] hover:bg-[#004D3A] transition-colors shadow-2xs cursor-pointer"
                >
                  শুনানির তথ্য সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Decline Assignment Modal */}
      {declineModalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-lg max-w-md w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-rose-700 dark:text-rose-400">
                দায়িত্ব গ্রহণে অপারগতা প্রকাশ
              </h3>
              <button
                onClick={() => setDeclineModalCase(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              প্যানেল আইনজীবী হিসেবে দায়িত্ব পালনে কোনো সংঘাত বা গুরুতর পেশাগত প্রতিবন্ধকতা থাকলে তা সুস্পষ্ট কারণসহ DLAO-কে জানাতে হবে।
            </p>

            <form onSubmit={handleDeclineAssignment} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  অপারগতার সুনির্দিষ্ট কারণ (বাধ্যতামূলক):
                </label>
                <textarea
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  placeholder="যেমন: বিপক্ষ পক্ষের সাথে পেশাগত সংঘাত, একই আদালতে একই দিনে অন্য অগ্রাধিকারপ্রাপ্ত মামলার ব্যস্ততা..."
                  rows={3}
                  className="w-full p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setDeclineModalCase(null)}
                  className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-2xs cursor-pointer"
                >
                  অপারগতা নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Add Case Progress Note Modal */}
      {noteModalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-lg max-w-md w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                মামলার অগ্রগতি নোট সংযোজন
              </h3>
              <button
                onClick={() => setNoteModalCase(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  অগ্রগতির বিবরণ:
                </label>
                <textarea
                  value={caseNoteContent}
                  onChange={e => setCaseNoteContent(e.target.value)}
                  placeholder="মামলার প্রস্তুতি, সাক্ষীর সাথে পরামর্শ বা আদালতের নির্দেশনা সংক্রান্ত বিবরণ লিখুন..."
                  rows={4}
                  className="w-full p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setNoteModalCase(null)}
                  className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md font-semibold text-white bg-[#006A4E] hover:bg-[#004D3A] transition-colors shadow-2xs cursor-pointer"
                >
                  নোট সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
