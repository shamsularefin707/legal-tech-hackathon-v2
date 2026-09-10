import React, { useState } from 'react';
import {
  FileText,
  Search,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Calendar,
  Building,
  User,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Info
} from 'lucide-react';
import { CanonicalCase } from '../types/legalAid';
import { formatToDisplayDate } from '../services/chronologyEngine';

interface ApplicantPortalViewProps {
  cases: CanonicalCase[];
  onOpenNewApplication: () => void;
  onSelectCase: (c: CanonicalCase) => void;
}

export const ApplicantPortalView: React.FC<ApplicantPortalViewProps> = ({
  cases,
  onOpenNewApplication,
  onSelectCase
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'my_cases' | 'guidelines'>('my_cases');

  // Filter cases relevant to the applicant view
  const applicantCases = cases.filter(c => {
    if (!searchQuery.trim()) {
      // By default show demo applicant's cases or direct intake
      return (
        c.applicantName.toLowerCase().includes('nasrin') ||
        c.caseId.includes('0001') ||
        c.importBatchId === 'DIRECT-PORTAL-INTAKE'
      );
    }
    const q = searchQuery.toLowerCase();
    return (
      c.caseId.toLowerCase().includes(q) ||
      c.applicantName.toLowerCase().includes(q) ||
      (c.applicationId && c.applicationId.toLowerCase().includes(q)) ||
      c.district.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* 1. Citizen Welcome Banner (Warm, Human, Plain Bangla) */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>সরকারি বিনামূল্যে আইনি সহায়তা নাগরিক সেবা</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              স্বাগতম, আপনার আইনি অধিকার সুরক্ষায় আমরা সাথে আছি
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              আইনগত সহায়তা প্রদান আইন ২০০০ এর অধীনে অসচ্ছল ও সহায়সম্বলহীন নাগরিকদের সরকারি খরচে আইনজীবী নিয়োগ ও বিচারপ্রাপ্তি নিশ্চিত করা হয়।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewApplication}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#006A4E] hover:bg-[#004D3A] text-white rounded-md text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন সহায়তা আবেদন জমা দিন</span>
            </button>
            <a
              href="tel:16430"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Phone className="w-4 h-4 text-[#006A4E] dark:text-emerald-400" />
              <span>টোল-ফ্রি হেল্পলাইন: ১৬৪৩০</span>
            </a>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
          <button
            onClick={() => setActiveSubTab('my_cases')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeSubTab === 'my_cases'
                ? 'bg-[#006A4E] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            আমার আবেদন ও মামলা ({applicantCases.length})
          </button>
          <button
            onClick={() => setActiveSubTab('guidelines')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeSubTab === 'guidelines'
                ? 'bg-[#006A4E] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            সহায়তা পাওয়ার নিয়মাবলী ও প্রশ্নোত্তর
          </button>
        </div>
      </div>

      {activeSubTab === 'my_cases' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-2.5 shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="আবেদন বা মামলা নম্বর দিয়ে খুঁজুন (যেমন: NLAS-DHA-2026-0001)..."
              className="flex-1 bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 cursor-pointer"
              >
                মুছুন
              </button>
            )}
          </div>

          {/* Applicant Case Cards (Stacked, readable, zero AI slop) */}
          {applicantCases.length === 0 ? (
            <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                কোনো মামলা বা আবেদন খুঁজে পাওয়া যায়নি
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                আপনি যদি পূর্বে আবেদন করে থাকেন, তবে আবেদন নম্বর দিয়ে পুনরায় অনুসন্ধান করুন অথবা নতুন আইনি সহায়তার জন্য আবেদন করুন।
              </p>
              <button
                onClick={onOpenNewApplication}
                className="mt-4 px-4 py-2 bg-[#006A4E] hover:bg-[#004D3A] text-white text-sm font-semibold rounded-md transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>নতুন আবেদন ফর্ম পূরণ করুন</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applicantCases.map(c => {
                const isApproved = c.applicationStatus === 'APPROVED';
                const isRejected = c.applicationStatus === 'REJECTED';
                const isUnderReview = c.applicationStatus === 'UNDER_REVIEW' || c.applicationStatus === 'SUBMITTED' || c.applicationStatus === 'VERIFIED';
                const hasLawyer = Boolean(c.assignedLawyer);
                const hasHearing = Boolean(c.nextHearingDate);

                return (
                  <div
                    key={c.caseId}
                    className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    {/* Header: Case ID & District */}
                    <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                            {c.caseId}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            {c.district} জেলা
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {c.caseType} মামলা
                          </span>
                        </div>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white mt-1">
                          আবেদনকারী: {c.applicantName}
                        </h2>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">আবেদনের তারিখ</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {formatToDisplayDate(c.filingDate)}
                        </span>
                      </div>
                    </div>

                    {/* Visual Citizen Stepper (Application to Disposal) */}
                    <div className="py-4">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                        আবেদনের অগ্রগতি ক্রম:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                        {/* Step 1: Submission */}
                        <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                          <span>১. আবেদন গ্রহণ</span>
                        </div>

                        {/* Step 2: Verification */}
                        <div className={`p-2 rounded border flex items-center gap-1.5 font-medium ${
                          c.applicationStatus !== 'SUBMITTED'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                        }`}>
                          {c.applicationStatus !== 'SUBMITTED' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                          )}
                          <span>২. তথ্য যাচাই</span>
                        </div>

                        {/* Step 3: Decision */}
                        <div className={`p-2 rounded border flex items-center gap-1.5 font-medium ${
                          isApproved
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                            : isRejected
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}>
                          {isApproved ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                          ) : isRejected ? (
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          )}
                          <span>৩. {isRejected ? 'প্রত্যাখ্যাত' : 'অনুমোদন'}</span>
                        </div>

                        {/* Step 4: Lawyer */}
                        <div className={`p-2 rounded border flex items-center gap-1.5 font-medium ${
                          hasLawyer
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                            : isRejected
                            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400 line-through'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}>
                          {hasLawyer ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          )}
                          <span>৪. আইনজীবী নিয়োগ</span>
                        </div>

                        {/* Step 5: Trial / Hearing */}
                        <div className={`p-2 rounded border flex items-center gap-1.5 font-medium ${
                          hasHearing
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}>
                          <Calendar className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                          <span>৫. আদালতে শুনানি</span>
                        </div>
                      </div>
                    </div>

                    {/* Plain Bangla Status Explanation Card (Human, Not AI Metrics) */}
                    <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-2">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-[#006A4E] dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 dark:text-white block font-semibold">
                            বর্তমান অবস্থা:
                          </strong>
                          {isUnderReview && (
                            <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                              আপনার আবেদনটি বর্তমানে জেলা লিগ্যাল এইড অফিসারের পর্যালোচনাধীন রয়েছে। সরকারি বিধি অনুসারে তথ্যাদি ও দাখিলকৃত নথিপত্র যাচাই শেষে ৩ কার্যদিবসের মধ্যে সিদ্ধান্ত গৃহীত হবে।
                            </p>
                          )}
                          {isApproved && (
                            <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                              আপনার সরকারি আইনি সহায়তার আবেদনটি অনুমোদিত হয়েছে। আপনাকে বিনামূল্যে একজন সরকারি প্যানেল আইনজীবী প্রদান করা হয়েছে।
                            </p>
                          )}
                          {isRejected && (
                            <div className="text-rose-800 dark:text-rose-300 mt-0.5">
                              <p>আপনার আবেদনটি বিবেচনা শেষে মঞ্জুর করা সম্ভব হয়নি।</p>
                              <p className="font-medium mt-1">
                                কারণ: {c.notes || 'আইনগত সহায়তা নীতিমালা ২০২৪ অনুযায়ী পারিবারিক বার্ষিক আয় সীমা সরকারি শর্ত অতিক্রম করেছে।'}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                এ সিদ্ধান্তের বিরুদ্ধে জেলা লিগ্যাল এইড কমিটির চেয়ারম্যান মহোদয়ের নিকট আপিলের সুযোগ রয়েছে।
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Lawyer and Court Info (If Approved) */}
                      {hasLawyer && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500 dark:text-slate-400 block">নিযুক্ত প্যানেল আইনজীবী:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {c.assignedLawyer}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                              স্ট্যাটাস: {c.representationStatus === 'ACCEPTED_BY_LAWYER' ? 'আইনজীবী দায়িত্ব গ্রহণ করেছেন' : 'নিয়োগ প্রক্রিয়াধীন'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400 block">সংশ্লিষ্ট আদালত:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {c.court}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Next Step / Action Required */}
                      {hasHearing && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">পরবর্তী শুনানির তারিখ:</span>
                            <strong className="text-blue-700 dark:text-blue-300 ml-1.5 font-semibold">
                              {formatToDisplayDate(c.nextHearingDate)}
                            </strong>
                          </div>
                          <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                            নির্দিষ্ট তারিখে যথাসময়ে আদালতে উপস্থিত থাকার অনুরোধ করা হলো।
                          </span>
                        </div>
                      )}
                    </div>

                    {/* View Dossier Button */}
                    <div className="mt-3 flex items-center justify-end">
                      <button
                        onClick={() => onSelectCase(c)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006A4E] dark:text-emerald-400 hover:text-[#004D3A] dark:hover:text-emerald-300 transition-colors cursor-pointer"
                      >
                        <span>সম্পূর্ণ বিবরণ ও নথিপত্র দেখুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Guidelines & FAQ Tab */}
      {activeSubTab === 'guidelines' && (
        <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#006A4E] dark:text-emerald-400" />
            <span>আইনি সহায়তা প্রাপ্তির নির্দেশিকা ও সাধারণ তথ্যাবলি</span>
          </h2>

          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                ১. কারা সরকারি খরচে বিনামূল্যে আইনি সহায়তা পাবেন?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                আইনগত সহায়তা প্রদান বিধিমালা অনুসারে: অসচ্ছল ব্যক্তি, দরিদ্র বিধবা বা পরিত্যক্তা নারী, অসহায় শিশু, শারীরিকভাবে অক্ষম ব্যক্তি, ফৌজদারি মামলায় আত্মপক্ষ সমর্থনে আইনজীবী নিয়োগে অসমর্থ যে কোনো ব্যক্তি এবং আইনি সহায়তা কমিটি কর্তৃক যোগ্য বিবেচিত যে কোনো নাগরিক।
              </p>
            </div>

            <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                ২. সেবা গ্রহণের জন্য কোনো ফি বা টাকা দিতে হয় কি?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                না। সরকারের আইনি সহায়তা কার্যক্রম সম্পূর্ণ বিনামূল্যে পরিচালিত হয়। আইনজীবী নিয়োগ, ওকালতনামা ও মামলার কোর্ট ফি সরকার বহন করে। কোনো পর্যায়ে কোনো অর্থ লেনদেন দণ্ডনীয় অপরাধ।
              </p>
            </div>

            <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                ৩. জরুরি যেকোনো সহায়তার জন্য কোথায় যোগাযোগ করবেন?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                সরাসরি জাতীয় লিগ্যাল এইড হেল্পলাইন নম্বর <strong className="text-slate-900 dark:text-white font-mono font-bold">১৬৪৩০</strong> (টোল-ফ্রি) এ যেকোনো মোবাইল অপারেটর থেকে কল করুন অথবা নিকটস্থ জেলা জজ আদালত ভবনে অবস্থিত জেলা লিগ্যাল এইড অফিসে যোগাযোগ করুন।
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
