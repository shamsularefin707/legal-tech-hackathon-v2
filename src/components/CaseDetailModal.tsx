import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  FileText,
  Briefcase,
  ShieldAlert,
  Calendar,
  Layers,
  History,
  Scale,
  Send,
  UserX,
  Award,
  AlertCircle
} from 'lucide-react';
import { CanonicalCase, CanonicalLawyer, UserRole } from '../types/legalAid';
import { formatToDisplayDate } from '../services/chronologyEngine';
import { legalAidStore } from '../services/legalAidStore';
import { recommendLawyersForCase } from '../services/lawyerRecommendationEngine';
import { hasPermission } from '../services/rbacService';
import { auditLogger } from '../services/auditLogger';

interface CaseDetailModalProps {
  caseItem: CanonicalCase;
  lawyers: CanonicalLawyer[];
  currentRole: UserRole;
  onClose: () => void;
  onRefresh: () => void;
  onOpenNikahnamaPreview: (caseItem: CanonicalCase) => void;
}

type ModalTab = 'overview' | 'timeline' | 'documents' | 'hearings' | 'lawyer' | 'audit';

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseItem,
  lawyers,
  currentRole,
  onClose,
  onRefresh,
  onOpenNikahnamaPreview
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Form states for role actions
  const [hearingNextDate, setHearingNextDate] = useState('');
  const [hearingOutcome, setHearingOutcome] = useState('');
  const [hearingPurpose, setHearingPurpose] = useState('');
  const [actionNotes, setActionNotes] = useState('');

  // Matched lawyers for assignment
  const matchedLawyers = recommendLawyersForCase(caseItem, lawyers).slice(0, 4);

  const notifySuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
    onRefresh();
  };

  // 1. Legal Aid Officer: Verify Documents
  const handleVerifyDocuments = () => {
    legalAidStore.verifyApplicationDocuments(caseItem.caseId, actionNotes || 'নথিপত্র ও জাতীয় পরিচয়পত্র বিধিমতে সঠিক পাওয়া গেছে।');
    notifySuccess('তথ্য ও নথিপত্র সফলভাবে যাচাই সম্পন্ন হয়েছে।');
  };

  // 2. Legal Aid Officer: Recommend Approval
  const handleRecommendApproval = () => {
    legalAidStore.recommendEligibility(caseItem.caseId, 'APPROVE', actionNotes || 'আবেদনকারী আইনগত সহায়তা পাওয়ার যোগ্য।');
    notifySuccess('জেলা লিগ্যাল এইড কমিটির নিকট অনুমোদনের সুপারিশ পেশ করা হয়েছে।');
  };

  // 3. Legal Aid Officer: Recommend Rejection
  const handleRecommendRejection = () => {
    legalAidStore.recommendEligibility(caseItem.caseId, 'REJECT', actionNotes || 'আয়ের সীমা বা শর্তাবলী অপূর্ণ।');
    notifySuccess('জেলা কমিটির নিকট প্রত্যাখ্যানের সুপারিশ পেশ করা হয়েছে।');
  };

  // 4. Authorized Authority: Formally Approve Eligibility
  const handleApproveEligibility = () => {
    legalAidStore.approveEligibility(caseItem.caseId, actionNotes || 'কর্তৃপক্ষ কর্তৃক আইনগত সহায়তা অনুমোদন করা হলো।');
    notifySuccess('আইনগত সহায়তা আবেদন আনুষ্ঠানিকভাবে অনুমোদিত হয়েছে। এখন আইনজীবী নিয়োগ প্রদান করুন।');
  };

  // 5. Authorized Authority: Formally Reject Eligibility
  const handleRejectEligibility = () => {
    legalAidStore.rejectEligibility(caseItem.caseId, actionNotes || 'কর্তৃপক্ষ কর্তৃক আবেদনটি আইনগত কারণ প্রদর্শনপূর্বক প্রত্যাখ্যাত হলো।');
    notifySuccess('আইনগত সহায়তা আবেদন প্রত্যাখ্যাত হয়েছে।');
  };

  // 6. Authorized Authority: Assign Panel Lawyer
  const handleAssignLawyer = (lawyerId: string) => {
    legalAidStore.assignPanelLawyer(caseItem.caseId, lawyerId, actionNotes || 'বিচারিক প্রতিনিধিত্বের দায়িত্ব অর্পণ');
    notifySuccess('প্যানেল আইনজীবী সফলভাবে মনোনীত ও নিয়োগ আদেশ জারি হয়েছে।');
  };

  // 7. Panel Lawyer: Accept Assignment
  const handleLawyerAccept = () => {
    legalAidStore.lawyerAcceptAssignment(caseItem.caseId);
    notifySuccess('প্যানেল আইনজীবী হিসেবে আপনি মামলার দায়িত্ব গ্রহণ করেছেন।');
  };

  // 8. Hearing Update by Lawyer / Clerk
  const handleHearingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hearingNextDate) return;
    legalAidStore.updateCaseHearing(caseItem.caseId, hearingNextDate, hearingOutcome, hearingPurpose);
    setHearingNextDate('');
    setHearingOutcome('');
    setHearingPurpose('');
    notifySuccess('শুনানির কার্যবিবরণী ও পরবর্তী তারিখ সফলভাবে হালনাগাদ হয়েছে।');
  };

  // 9. Chronology Anomaly Review
  const handleChronologyReview = (status: 'REVIEWED' | 'CORRECTION_NEEDED' | 'VERIFIED_WITH_SOURCE') => {
    legalAidStore.reviewChronologyAnomaly(caseItem.caseId, status, actionNotes);
    notifySuccess('কালানুক্রমিক অসংগতির নিরীক্ষা সিদ্ধান্ত রেকর্ড করা হয়েছে।');
  };

  const isAssignedToCurrentLawyer = currentRole === 'PANEL_LAWYER' && caseItem.assignedLawyerId === 'LADCS-007';
  const hasChronoAnomaly = caseItem.chronologyStatus === 'FAILED' || caseItem.isChronologyInvalid;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#15202E] border border-slate-300 dark:border-slate-700 rounded-md w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* 1. Modal Top Banner */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50 dark:bg-[#0F1724]">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono px-2.5 py-0.5 rounded-xs bg-[#006A4E]/10 dark:bg-emerald-950/60 text-[#006A4E] dark:text-emerald-300 font-bold border border-[#006A4E]/30">
                মামলা নং: {caseItem.caseId}
              </span>
              <span className="font-mono px-2.5 py-0.5 rounded-xs bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold border border-blue-300">
                আবেদন আইডি: {caseItem.applicationId}
              </span>
              <span className="px-2 py-0.5 rounded-xs bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-[11px]">
                পর্যায়: {caseItem.lifecycleStatus}
              </span>
              {hasChronoAnomaly && (
                <span className="px-2 py-0.5 rounded-xs bg-red-100 dark:bg-red-950/80 text-[#C8102E] dark:text-red-300 border border-red-300 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>কালানুক্রমিক অসংগতি</span>
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {caseItem.applicantName}
            </h2>

            <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>জেলা: <strong className="text-slate-900 dark:text-slate-200">{caseItem.district}</strong></span>
              <span>উপজেলা: <strong className="text-slate-900 dark:text-slate-200">{caseItem.upazila}</strong></span>
              <span>আদালত: <strong className="text-slate-900 dark:text-slate-200">{caseItem.court}</strong></span>
              <span>বিষয়: <strong className="text-slate-900 dark:text-slate-200">{caseItem.caseType}</strong></span>
              {caseItem.vulnerabilityIndicator && caseItem.vulnerabilityIndicator !== 'None identified' && (
                <span>সুরক্ষা: <strong className="text-amber-800 dark:text-amber-300 font-bold">{caseItem.vulnerabilityIndicator}</strong></span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action success banner */}
        {actionSuccessMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/80 border-b border-emerald-200 dark:border-emerald-800 px-5 py-2 text-xs text-[#006A4E] dark:text-emerald-200 flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#006A4E] dark:text-emerald-400" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* 2. Chronology Conflict Alert Box (Hero Feature) */}
        {hasChronoAnomaly && (
          <div className="px-5 py-4 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-200 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <div className="text-sm font-bold text-[#C8102E] dark:text-red-300 flex items-center gap-2">
                  <span>কালানুক্রমিক অসংগতি সংক্রান্ত প্রশাসনিক সতর্কবার্তা</span>
                  {caseItem.chronologyReviewStatus && caseItem.chronologyReviewStatus !== 'UNREVIEWED' && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-red-200 dark:bg-red-900/60 text-red-900 dark:text-red-200">
                      অবস্থা: {caseItem.chronologyReviewStatus === 'REVIEWED' ? 'পর্যালোচনা সম্পন্ন' : caseItem.chronologyReviewStatus === 'CORRECTION_NEEDED' ? 'সংশোধন প্রয়োজন' : 'উৎস নথির সাথে যাচাই করা হয়েছে'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-red-100/60 dark:bg-red-900/30 p-2.5 rounded border border-red-200 dark:border-red-800/50">
                  <div>
                    <span className="text-red-800 dark:text-red-300 font-semibold">মামলা দাখিলের তারিখ: </span>
                    <strong className="text-slate-900 dark:text-white font-mono">{formatToDisplayDate(caseItem.filingDate)}</strong>
                  </div>
                  <div>
                    <span className="text-red-800 dark:text-red-300 font-semibold">আদালতে শুনানির তারিখ: </span>
                    <strong className="text-slate-900 dark:text-white font-mono">{formatToDisplayDate(caseItem.nextHearingDate)}</strong>
                  </div>
                </div>

                <div className="text-red-900 dark:text-red-200">
                  <span className="font-bold text-[#C8102E]">সমস্যা বিশ্লেষণ: </span>
                  <span>{caseItem.chronologyConflictReason || 'শুনানির তারিখ মামলা দাখিলের তারিখের পূর্বে নির্ধারিত হয়েছে।'}</span>
                </div>

                <div className="text-red-900 dark:text-red-200">
                  <span className="font-bold text-[#C8102E]">প্রস্তাবিত পদক্ষেপ: </span>
                  <span>আদালতের উৎস দৈনিক কার্যতালিকা ও রেজিস্টার খতিয়ান যাচাই করে শুনানির সঠিক তারিখ সমন্বয় করুন।</span>
                </div>

                <div className="text-red-700 dark:text-red-400 text-[11px] italic">
                  * সিস্টেম কোনো উৎস তথ্য স্বয়ংক্রিয়ভাবে পরিমার্জন করেনি (উৎস খতিয়ানের শুদ্ধতা অক্ষুণ্ণ রয়েছে)।
                </div>
              </div>
            </div>

            {/* Officer Anomaly Action Buttons */}
            {(currentRole === 'LEGAL_AID_OFFICER' || currentRole === 'AUTHORIZED_AUTHORITY' || currentRole === 'SYSTEM_ADMIN') && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-red-200 dark:border-red-900/60">
                <span className="text-xs font-bold text-red-800 dark:text-red-300">নিরীক্ষা সিদ্ধান্ত:</span>
                <button
                  onClick={() => handleChronologyReview('REVIEWED')}
                  className="px-3 py-1.5 rounded bg-[#C8102E] hover:bg-red-800 text-white font-semibold text-xs cursor-pointer"
                >
                  পর্যালোচনা সম্পন্ন
                </button>
                <button
                  onClick={() => handleChronologyReview('CORRECTION_NEEDED')}
                  className="px-3 py-1.5 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  সংশোধন প্রয়োজন
                </button>
                <button
                  onClick={() => handleChronologyReview('VERIFIED_WITH_SOURCE')}
                  className="px-3 py-1.5 rounded bg-[#006A4E] hover:bg-[#004D3A] text-white font-semibold text-xs cursor-pointer"
                >
                  উৎস নথির সাথে যাচাই করা হয়েছে
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. Sub-navigation Tabs */}
        <div className="px-5 border-b border-slate-200 dark:border-slate-800 flex gap-4 bg-slate-50 dark:bg-slate-900 text-xs overflow-x-auto">
          {[
            { id: 'overview', label: 'সারসংক্ষেপ ও তথ্য' },
            { id: 'timeline', label: 'আইনি কার্যধারা ও টাইমলাইন' },
            { id: 'documents', label: 'নথিপত্র ও প্রমাণক' },
            { id: 'hearings', label: 'শুনানি ও অগ্রগতি' },
            { id: 'lawyer', label: 'আইনজীবী নির্বাচন ও নিয়োগ' },
            { id: 'audit', label: 'কার্যক্রমের অডিট ইতিহাস' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ModalTab)}
              className={`py-2.5 font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#006A4E] dark:border-emerald-400 text-[#006A4E] dark:text-emerald-300'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Separate Lifecycles Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-[#0F1724] p-3.5 rounded-md border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block">আইনগত সহায়তা আবেদন স্থিতি:</span>
                  <span className="font-bold text-sm text-blue-700 dark:text-blue-400 font-mono mt-0.5 block">
                    {caseItem.applicationStatus}
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">{caseItem.currentStageBn}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">আদালতের মামলার স্থিতি:</span>
                  <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 block">
                    {caseItem.lifecycleStatus}
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    আইনি প্রতিনিধিত্ব: {caseItem.representationStatus === 'ACCEPTED_BY_LAWYER' ? 'আইনজীবী কর্তৃক গৃহীত' : 'মনোনয়ন অপেক্ষমাণ'}
                  </span>
                </div>
              </div>

              {/* Personnel Dossier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <span className="text-slate-500 font-bold block">দায়িত্বপ্রাপ্ত আইনগত সহায়তা কর্মকর্তা (DLAO):</span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{caseItem.assignedOfficer}</div>
                  <div className="text-slate-600 dark:text-slate-400 text-[11px]">{caseItem.assignedOfficerDesignation}</div>
                </div>

                <div className="p-3 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <span className="text-slate-500 font-bold block">নিয়োজিত প্যানেল আইনজীবী (LADCS):</span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {caseItem.assignedLawyer || <span className="text-amber-700 dark:text-amber-400 font-semibold">কোনো আইনজীবী নিযুক্ত নেই</span>}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {caseItem.assignedLawyerId ? `বার কাউন্সিল আইডি: ${caseItem.assignedLawyerId}` : 'কমিটি কর্তৃক নিয়োগ আদেশ আবশ্যক'}
                  </div>
                </div>
              </div>

              {/* Priority & Transparent Factors */}
              <div className="p-3.5 rounded-md bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">স্বচ্ছ অগ্রাধিকার মূল্যায়ন (Priority Scoring):</span>
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                    স্কোর: {caseItem.priorityScore}/১০০ ({caseItem.priority})
                  </span>
                </div>
                <div className="space-y-1">
                  {caseItem.priorityBreakdown.factors.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1 rounded">
                      <span>• {f.factor}</span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">+{f.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                ধারাবাহিক আইনি কার্যধারা (Chronological Case Timeline):
              </span>
              <div className="space-y-2 relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 pl-4">
                {caseItem.chronologySteps.map((step, idx) => {
                  const isConflict = step.status === 'CONFLICT';
                  const isDone = step.status === 'COMPLETED';

                  return (
                    <div key={idx} className="relative text-xs">
                      <div
                        className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-[#15202E] ${
                          isConflict
                            ? 'border-red-600 bg-red-500'
                            : isDone
                            ? 'border-emerald-600 bg-emerald-500'
                            : 'border-slate-400 bg-slate-300'
                        }`}
                      />
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${isConflict ? 'text-[#C8102E]' : 'text-slate-900 dark:text-white'}`}>
                          {step.labelBn}
                        </span>
                        <span className="font-mono text-slate-500">
                          {formatToDisplayDate(step.date)}
                        </span>
                      </div>
                      {step.conflictReason && (
                        <div className="text-[11px] text-red-700 dark:text-red-400 mt-0.5">
                          ⚠️ {step.conflictReason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                সংযোজিত প্রামাণিক নথিপত্র (Attached Evidentiary Documents):
              </span>
              <div className="space-y-2">
                {(caseItem.attachedDocuments || []).map((doc) => (
                  <div key={doc.id} className="p-3 rounded-md border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#006A4E] dark:text-emerald-400" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{doc.title}</div>
                        <div className="text-[10px] text-slate-500">দাখিলের তারিখ: {formatToDisplayDate(doc.date)}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${doc.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {doc.verified ? 'যাচাইকৃত' : 'যাচাই অপেক্ষমাণ'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Special Nikahnama / Marriage Deed Preview Button (From V1 privacy showcase) */}
              {(caseItem.caseType === 'Family' || caseItem.caseType === 'Maintenance' || caseItem.caseType === 'Domestic Violence') && (
                <div className="mt-4 p-3.5 rounded-md bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between">
                  <div className="text-xs text-blue-900 dark:text-blue-200">
                    <span className="font-bold block">পারিবারিক নথিপত্র প্রাকদর্শন (Privacy Masked Deed):</span>
                    <span className="text-[11px] text-blue-700 dark:text-blue-300">দেনমোহর ও নিকাহনামার সংবেদনশীল তথ্য গোপনীয়তা রক্ষা করে পরীক্ষা করুন।</span>
                  </div>
                  <button
                    onClick={() => onOpenNikahnamaPreview(caseItem)}
                    className="px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    নিকাহনামা দেখুন
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HEARINGS */}
          {activeTab === 'hearings' && (
            <div className="space-y-4">
              {/* Hearing Update Form for Panel Lawyer or Court Staff */}
              {(currentRole === 'PANEL_LAWYER' || currentRole === 'LEGAL_AID_OFFICER' || currentRole === 'SYSTEM_ADMIN') && (
                <form onSubmit={handleHearingSubmit} className="p-3.5 rounded-md bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    শুনানির কার্যবিবরণী ও অগ্রগতি দাখিল (Hearing Progress Submission):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 block font-semibold mb-1">পরবর্তী শুনানির তারিখ *</label>
                      <input
                        type="date"
                        required
                        value={hearingNextDate}
                        onChange={(e) => setHearingNextDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 block font-semibold mb-1">শুনানির উদ্দেশ্য / পর্ব</label>
                      <input
                        type="text"
                        placeholder="যেমন: সাক্ষ্যগ্রহণ / যুক্তিতর্ক / আদেশ"
                        value={hearingPurpose}
                        onChange={(e) => setHearingPurpose(e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block font-semibold mb-1">শুনানির ফলাফল ও অগ্রগতি বিবরণ</label>
                    <textarea
                      rows={2}
                      placeholder="আদালতের আদেশ ও মামলার অগ্রগতি সম্পর্কে বিস্তারিত লিখুন..."
                      value={hearingOutcome}
                      onChange={(e) => setHearingOutcome(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded bg-[#006A4E] hover:bg-[#004D3A] text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>অগ্রগতি দাখিল করুন</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Historical Hearings Log */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">পূর্ববর্তী শুনানিসমূহের রেকর্ড:</span>
                {caseItem.hearingHistory.length === 0 ? (
                  <div className="p-4 rounded border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
                    এখনও কোনো শুনানি অনুষ্ঠিত হয়নি।
                  </div>
                ) : (
                  caseItem.hearingHistory.map((h, i) => (
                    <div key={i} className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15202E] text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>তারিখ: {formatToDisplayDate(h.date)}</span>
                        <span className="text-[11px] text-slate-500">{h.benchCourt}</span>
                      </div>
                      <div className="text-slate-700 dark:text-slate-300">বিষয়: {h.purpose}</div>
                      <div className="text-emerald-700 dark:text-emerald-400">ফলাফল: {h.outcome}</div>
                      <div className="text-[10px] text-slate-400 font-mono">লিপিবদ্ধকারী: {h.recordedBy} ({formatToDisplayDate(h.recordedAt)})</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: LAWYER ASSIGNMENT */}
          {activeTab === 'lawyer' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    প্রস্তাবিত প্যানেল আইনজীবী তালিকা (Recommendation Engine):
                  </span>
                  <span className="text-[11px] text-slate-500">বিশেষায়ন, কাজের চাপ ও ভৌগোলিক উপযুক্ততা বিবেচনায় সাজানো</span>
                </div>
              </div>

              <div className="space-y-2">
                {matchedLawyers.map((rec) => {
                  const l = rec.lawyer;
                  return (
                    <div
                      key={l.lawyerId}
                      className="p-3.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15202E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{l.lawyerName}</span>
                          <span className="text-slate-500 font-mono text-[11px]">({l.barCouncilId})</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {l.district}
                          </span>
                        </div>
                        <div className="text-slate-600 dark:text-slate-400">বিশেষায়ন: <strong>{l.specialization}</strong> • অভিজ্ঞতা: {l.yearsExperience} বছর</div>
                        <div className="text-slate-600 dark:text-slate-400">
                          বর্তমান কাজের চাপ: <strong>{l.activeCases}/{l.capacity} মামলা</strong> ({l.utilization}%)
                        </div>

                        {/* Fit reasons */}
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400 space-y-0.5 pt-1">
                          {rec.fitReasonsBn.map((r, i) => (
                            <div key={i}>✓ {r}</div>
                          ))}
                        </div>

                        {/* Warnings */}
                        {rec.warningsBn.length > 0 && (
                          <div className="text-[11px] text-amber-700 dark:text-amber-400 space-y-0.5 pt-0.5">
                            {rec.warningsBn.map((w, i) => (
                              <div key={i}>⚠️ {w}</div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Assign button restricted to Authorized Authority */}
                      <div className="shrink-0">
                        {currentRole === 'AUTHORIZED_AUTHORITY' || currentRole === 'SYSTEM_ADMIN' ? (
                          <button
                            onClick={() => handleAssignLawyer(l.lawyerId)}
                            disabled={!rec.isEligible}
                            className="px-3 py-1.5 rounded bg-[#006A4E] hover:bg-[#004D3A] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            আইনজীবী নিয়োগ করুন
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            (শুধুমাত্র কমিটির অনুমোদনসাপেক্ষ)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                এই মামলার অপরিবর্তনীয় অডিট লগ (Case Audit Log):
              </span>
              <div className="space-y-1.5">
                {auditLogger.getLogs().filter(l => l.recordId === caseItem.caseId || l.recordId === caseItem.applicationId).map((al) => (
                  <div key={al.id} className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{al.actionBn}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{al.timestamp}</span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">{al.detailsBn}</div>
                    <div className="text-[10px] text-slate-500">সম্পাদনকারী: {al.userName} ({al.userRole})</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Role-Enforced Action Bar at Bottom */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1724] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            বর্তমান ভূমিকা: <strong className="text-slate-900 dark:text-white">{currentRole}</strong>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Legal Aid Officer Workflow Actions */}
            {currentRole === 'LEGAL_AID_OFFICER' && (
              <>
                <button
                  onClick={handleVerifyDocuments}
                  className="px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  তথ্য ও নথি যাচাই সম্পন্ন
                </button>
                <button
                  onClick={handleRecommendApproval}
                  className="px-3 py-1.5 rounded bg-[#006A4E] hover:bg-[#004D3A] text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  অনুমোদনের জন্য সুপারিশ
                </button>
                <button
                  onClick={handleRecommendRejection}
                  className="px-3 py-1.5 rounded bg-red-700 hover:bg-red-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  প্রত্যাখ্যানের সুপারিশ
                </button>
              </>
            )}

            {/* Authorized Authority / Committee Workflow Actions */}
            {(currentRole === 'AUTHORIZED_AUTHORITY' || currentRole === 'SYSTEM_ADMIN') && (
              <>
                <button
                  onClick={handleApproveEligibility}
                  className="px-3.5 py-1.5 rounded bg-[#006A4E] hover:bg-[#004D3A] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  আইনগত সহায়তা অনুমোদন
                </button>
                <button
                  onClick={handleRejectEligibility}
                  className="px-3 py-1.5 rounded bg-red-700 hover:bg-red-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  আইনগত সহায়তা প্রত্যাখ্যান
                </button>
              </>
            )}

            {/* Panel Lawyer Actions */}
            {currentRole === 'PANEL_LAWYER' && (
              <>
                {caseItem.representationStatus === 'ASSIGNED' ? (
                  <button
                    onClick={handleLawyerAccept}
                    className="px-3.5 py-1.5 rounded bg-[#006A4E] hover:bg-[#004D3A] text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    নিয়োগ গ্রহণ করুন
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('hearings')}
                    className="px-3 py-1.5 rounded bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    মামলার অগ্রগতি দাখিল
                  </button>
                )}
              </>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
