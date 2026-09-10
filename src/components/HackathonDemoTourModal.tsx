import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ShieldAlert,
  User,
  UserCheck,
  Briefcase,
  FileCheck,
  Calendar,
  History,
  Sparkles
} from 'lucide-react';
import { UserRole, CanonicalCase } from '../types/legalAid';

interface HackathonDemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenNewApplication: () => void;
  onSelectCase: (c: CanonicalCase) => void;
  cases: CanonicalCase[];
}

interface DemoStep {
  stepNumber: number;
  titleBn: string;
  role: UserRole;
  roleLabelBn: string;
  descriptionBn: string;
  keyFeatureBn: string;
  actionButtonTextBn: string;
  actionHandler: () => void;
}

export const HackathonDemoTourModal: React.FC<HackathonDemoTourModalProps> = ({
  isOpen,
  onClose,
  onSwitchRole,
  onOpenNewApplication,
  onSelectCase,
  cases
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  // Find sample cases for demo steps
  const sampleNewApp = cases.find(c => c.applicationStatus === 'SUBMITTED') || cases[0];
  const sampleReviewApp = cases.find(c => c.applicationStatus === 'UNDER_REVIEW' || c.applicationStatus === 'VERIFIED') || cases[1];
  const sampleNeedsLawyer = cases.find(c => c.applicationStatus === 'APPROVED' && (!c.assignedLawyerId || c.representationStatus === 'UNASSIGNED')) || cases[2];
  const sampleAssignedCase = cases.find(c => c.representationStatus === 'ASSIGNED') || cases[3];
  const sampleActiveCase = cases.find(c => c.representationStatus === 'ACCEPTED_BY_LAWYER') || cases[4];
  const sampleAnomalyCase = cases.find(c => c.dataQualityStatus === 'DATA_QUALITY_ANOMALY') || cases[0];

  const demoSteps: DemoStep[] = [
    {
      stepNumber: 1,
      titleBn: '১. নাগরিক কর্তৃক আইনি সহায়তা আবেদন দাখিল',
      role: 'CITIZEN',
      roleLabelBn: 'নাগরিক / আবেদনকারী',
      descriptionBn: 'অসচ্ছল নাগরিক সহজ সরল বাংলায় তার সমস্যা ও বার্ষিক আয় উল্লেখ করে সরকারি আইনি সহায়তার আবেদন ফরম পূরণ করেন। কোনো জটিল কোড বা এআই মেট্রিক দেখানো হয় না।',
      keyFeatureBn: 'সহজ বাংলা ইন্টারফেস • জরুরি হেল্পলাইন ১৬৪৩০ • তাৎক্ষণিক ট্র্যাকিং',
      actionButtonTextBn: 'নাগরিক পোর্টালে যান ও নতুন আবেদন ফরম দেখুন',
      actionHandler: () => {
        onSwitchRole('CITIZEN');
        onClose();
        onOpenNewApplication();
      }
    },
    {
      stepNumber: 2,
      titleBn: '২. জেলা লিগ্যাল এইড অফিসার (DLAO) কর্তৃক আবেদন গ্রহণ',
      role: 'LEGAL_AID_OFFICER',
      roleLabelBn: 'জেলা লিগ্যাল এইড অফিসার',
      descriptionBn: 'DLAO-এর ডেস্কে "আপনার আজকের করণীয়" কিউতে নতুন আবেদন জমা হয়। কর্মকর্তা আবেদনকারীর তথ্যাদি ও সংযুক্ত নথিপত্র (যেমন: নিকাহনামা/NID) যাচাই করেন।',
      keyFeatureBn: 'কার্যকরী অ্যাকশন কিউ • নথিপত্র সত্যতা যাচাই • কোনো অপ্রয়োজনীয় চার্ট নেই',
      actionButtonTextBn: 'DLAO ডেস্কে যান ও যাচাই কিউ দেখুন',
      actionHandler: () => {
        onSwitchRole('LEGAL_AID_OFFICER');
        onClose();
      }
    },
    {
      stepNumber: 3,
      titleBn: '৩. যোগ্যতা পর্যালোচনা ও সরকারি অনুমোদন / প্রত্যাখ্যান',
      role: 'LEGAL_AID_OFFICER',
      roleLabelBn: 'অনুমোদনকারী কর্তৃপক্ষ / DLAO',
      descriptionBn: 'সরকারি আইনগত সহায়তা নীতিমালা অনুসারে বার্ষিক আয়ের সীমা পরীক্ষা করে কর্মকর্তা আবেদন অনুমোদন করেন। প্রত্যাখ্যান করলে সুনির্দিষ্ট আইনি কারণ লিপিবদ্ধ করা বাধ্যতামূলক।',
      keyFeatureBn: 'আইনজীবী কখনোই অনুমোদন/প্রত্যাখ্যান করতে পারবেন না (কঠোর RBAC)',
      actionButtonTextBn: 'অনুমোদন/প্রত্যাখ্যান ফরম খুলুন',
      actionHandler: () => {
        onSwitchRole('LEGAL_AID_OFFICER');
        onClose();
        if (sampleReviewApp) onSelectCase(sampleReviewApp);
      }
    },
    {
      stepNumber: 4,
      titleBn: '৪. সরকারি প্যানেল আইনজীবী মনোনয়ন ও নিয়োগ',
      role: 'LEGAL_AID_OFFICER',
      roleLabelBn: 'জেলা লিগ্যাল এইড অফিসার',
      descriptionBn: 'অনুমোদিত মামলায় জেলার সংশ্লিষ্ট আদালত ও বিশেষায়িত প্যানেল থেকে আইনজীবী নিয়োগ করা হয়। আইনজীবীর বর্তমান মামলা ভার (Cap Utilization) বিবেচনায় রাখা হয়।',
      keyFeatureBn: 'স্বার্থের দ্বন্দ্ব পরীক্ষা • মামলা ভার ভারসাম্য • এক ক্লিকে নিয়োগ',
      actionButtonTextBn: 'আইনজীবী নিয়োগ কিউ দেখুন',
      actionHandler: () => {
        onSwitchRole('LEGAL_AID_OFFICER');
        onClose();
        if (sampleNeedsLawyer) onSelectCase(sampleNeedsLawyer);
      }
    },
    {
      stepNumber: 5,
      titleBn: '৫. প্যানেল আইনজীবী কর্তৃক নিয়োগ গ্রহণ বা অপারগতা প্রকাশ',
      role: 'PANEL_LAWYER',
      roleLabelBn: 'প্যানেল আইনজীবী (LADCS)',
      descriptionBn: 'আইনজীবী তার নিজস্ব ড্যাশবোর্ডে নতুন নিয়োগ বিবেচনা করেন। কোনো পেশাগত সংঘাত না থাকলে তিনি দায়িত্ব গ্রহণ করেন অথবা কারণ দর্শিয়ে অপারগতা জানান।',
      keyFeatureBn: 'আইনজীবীর পৃথক প্র্যাকটিস ম্যানেজার • স্বচ্ছ দায়িত্ব গ্রহণ প্রক্রিয়া',
      actionButtonTextBn: 'আইনজীবীর রোস্টারে যান ও প্রস্তাব দেখুন',
      actionHandler: () => {
        onSwitchRole('PANEL_LAWYER');
        onClose();
        if (sampleAssignedCase) onSelectCase(sampleAssignedCase);
      }
    },
    {
      stepNumber: 6,
      titleBn: '৬. আদালতে শুনানির অগ্রগতি ও আদেশনামা লিপিবদ্ধকরণ',
      role: 'PANEL_LAWYER',
      roleLabelBn: 'প্যানেল আইনজীবী (LADCS)',
      descriptionBn: 'আদালতে শুনানি শেষে আইনজীবী শুনানির সারসংক্ষেপ, আদালতের আদেশ এবং পরবর্তী ধার্য তারিখ সিস্টেমে হালনাগাদ করেন। এটি তাৎক্ষণিকভাবে নাগরিকের পোর্টালেও দেখা যায়।',
      keyFeatureBn: 'সরাসরি শুনানির ইতিহাস সংরক্ষণ • পরবর্তী তারিখ ট্র্যাকিং',
      actionButtonTextBn: 'শুনানি হালনাগাদ ফরম দেখুন',
      actionHandler: () => {
        onSwitchRole('PANEL_LAWYER');
        onClose();
        if (sampleActiveCase) onSelectCase(sampleActiveCase);
      }
    },
    {
      stepNumber: 7,
      titleBn: '৭. কৃত্রিম অসঙ্গতি সনাক্তকরণ (যেমন: ফাইলিংয়ের আগে শুনানি)',
      role: 'DISTRICT_ADMIN',
      roleLabelBn: 'তদারকি কর্তৃপক্ষ / অ্যাডমিন',
      descriptionBn: 'সিস্টেম ইচ্ছাকৃত ডেমো অসংগতি সনাক্ত করেছে (যেমন: NLAS-DHA-2026-0001 মামলায় ২০ আগস্ট ফাইলিংয়ের পূর্বে ১৭ আগস্ট শুনানি)। সিস্টেম ডেটা কার্পেট না করে স্বচ্ছ অ্যালার্ট তৈরি করেছে।',
      keyFeatureBn: 'কালানুক্রমিক স্বয়ংক্রিয় বৈধতা পরীক্ষা • কোনো ডেটা গোপন নয়',
      actionButtonTextBn: 'অসঙ্গতিপূর্ণ মামলাটি তদন্ত করুন',
      actionHandler: () => {
        onSwitchRole('DISTRICT_ADMIN');
        onClose();
        if (sampleAnomalyCase) onSelectCase(sampleAnomalyCase);
      }
    },
    {
      stepNumber: 8,
      titleBn: '৮. বিচারিক তদারকি কর্তৃপক্ষ কর্তৃক তদন্ত ও সিদ্ধান্ত',
      role: 'DISTRICT_ADMIN',
      roleLabelBn: 'তদারকি কর্তৃপক্ষ / অ্যাডমিন',
      descriptionBn: 'তদারকি কর্তৃপক্ষ অসঙ্গতির কারণ বিশ্লেষণ করেন এবং আদালতের মূল রেজিস্টার যাচাইয়ের আনুষ্ঠানিক নির্দেশ লিপিবদ্ধ করেন।',
      keyFeatureBn: 'ইন্টারেক্টিভ ড্রিলডাউন • প্রশাসনিক সিদ্ধান্ত সংরক্ষণ',
      actionButtonTextBn: 'তদারকি ডেস্কের অসঙ্গতি সেকশনে যান',
      actionHandler: () => {
        onSwitchRole('DISTRICT_ADMIN');
        onClose();
      }
    },
    {
      stepNumber: 9,
      titleBn: '৯. ৮টি পাইলট জেলার কাজের চাপ ও সমন্বয়',
      role: 'DISTRICT_ADMIN',
      roleLabelBn: 'তদারকি কর্তৃপক্ষ / অ্যাডমিন',
      descriptionBn: 'ঢাকা, চট্টগ্রাম, খুলনা, কুমিল্লা, নেত্রকোণা, রাজবাড়ী, হবিগঞ্জ ও জয়পুরহাট — ৮টি জেলার সর্বমোট ৫০০ মামলা ও ৩০ আইনজীবীর ১০০% নিখুঁত সমন্বিত হিসাব।',
      keyFeatureBn: 'জিরো ডেটা ড্রিফট • অথরিটেটিভ জেলা রোস্টার • শতভাগ সমন্বয়',
      actionButtonTextBn: '৮টি জেলার ব্যালেন্স টেবিল দেখুন',
      actionHandler: () => {
        onSwitchRole('DISTRICT_ADMIN');
        onClose();
      }
    },
    {
      stepNumber: 10,
      titleBn: '১০. অপরিবর্তনযোগ্য অডিট হিস্ট্রি ও জবাবদিহিতা',
      role: 'DISTRICT_ADMIN',
      roleLabelBn: 'তদারকি কর্তৃপক্ষ / অডিট',
      descriptionBn: 'কে, কখন, কোন রোল থেকে কোন অ্যাকশন সম্পন্ন করেছেন (আগের অবস্থা ➔ নতুন অবস্থা) তা প্রতিটি স্টেপে স্বচ্ছভাবে অডিট ট্রেইলে সংরক্ষিত।',
      keyFeatureBn: 'অপরিবর্তনযোগ্য রেকর্ড • টাইমস্ট্যাম্পযুক্ত ইতিহাস • পূর্ণ জবাবদিহিতা',
      actionButtonTextBn: 'অডিট ট্রেইল পর্যবেক্ষণ করুন',
      actionHandler: () => {
        onSwitchRole('DISTRICT_ADMIN');
        onClose();
      }
    }
  ];

  const currentStep = demoSteps[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-950 text-[#006A4E] dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                হ্যাকাথন ৩-৫ মিনিট লাইভ ডেমো প্রবাহ নির্দেশিকা
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                বিচারপ্রাপ্তির সম্পূর্ণ জীবনচক্র: আবেদন ➔ পর্যালোচনা ➔ অনুমোদন ➔ শুনানি ➔ তদারকি
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {demoSteps.map((step, idx) => (
            <button
              key={step.stepNumber}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                idx === currentStepIndex
                  ? 'bg-[#006A4E] dark:bg-emerald-400'
                  : idx < currentStepIndex
                  ? 'bg-emerald-200 dark:bg-emerald-900'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
              title={`ধাপ ${step.stepNumber}: ${step.titleBn}`}
            />
          ))}
        </div>

        {/* Current Step Card */}
        <div className="p-5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#006A4E] dark:text-emerald-400 uppercase tracking-wider">
              ধাপ {currentStep.stepNumber} / ১০
            </span>
            <span className="text-xs px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold">
              ভূমিকা: {currentStep.roleLabelBn}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {currentStep.titleBn}
          </h3>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {currentStep.descriptionBn}
          </p>

          <div className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-semibold text-[#006A4E] dark:text-emerald-400 block mb-1">
              বিচারিক গুরুত্ব ও মূল বৈশিষ্ট্য:
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              {currentStep.keyFeatureBn}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>পূর্ববর্তী</span>
            </button>
            <button
              disabled={currentStepIndex === demoSteps.length - 1}
              onClick={() => setCurrentStepIndex(prev => Math.min(demoSteps.length - 1, prev + 1))}
              className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>পরবর্তী</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={currentStep.actionHandler}
            className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-[#006A4E] hover:bg-[#004D3A] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{currentStep.actionButtonTextBn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
