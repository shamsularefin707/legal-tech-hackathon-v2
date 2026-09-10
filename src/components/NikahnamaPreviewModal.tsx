import React from 'react';
import { X, ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { CanonicalCase } from '../types/legalAid';
import { formatToDisplayDate } from '../services/chronologyEngine';

interface NikahnamaPreviewModalProps {
  caseItem: CanonicalCase | null;
  onClose: () => void;
}

export const NikahnamaPreviewModal: React.FC<NikahnamaPreviewModalProps> = ({
  caseItem,
  onClose
}) => {
  if (!caseItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FFFDF9] dark:bg-[#131B26] border-2 border-amber-800/40 dark:border-slate-700 rounded-md w-full max-w-2xl shadow-2xl overflow-hidden font-serif">
        
        {/* Top Header */}
        <div className="p-4 border-b border-amber-200 dark:border-slate-800 flex items-center justify-between bg-amber-50/70 dark:bg-[#0F1724]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#006A4E] dark:text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                মুসলিম বিবাহ ও দেনমোহর রেজিস্ট্রি খতিয়ান (নিকাহনামা)
              </h3>
              <span className="text-[10px] text-slate-500 font-sans">
                সংবেদনশীল তথ্য সুরক্ষা ও প্রাকদর্শন • মুসলিম বিবাহ ও তালাক (নিবন্ধন) বিধিমালা ২০০৯
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Notice Banner */}
        <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-900/60 text-[11px] text-blue-900 dark:text-blue-200 flex items-center gap-2 font-sans">
          <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>
            <strong>গোপনীয়তা সংরক্ষণ:</strong> আবেদনকারী ও পরিবারের ব্যক্তিগত সুরক্ষা রক্ষার্থে ঠিকানা ও মোবাইল নম্বর মাস্ক (••••) করা হয়েছে।
          </span>
        </div>

        {/* Deed Content Area */}
        <div className="p-6 space-y-4 text-xs text-slate-800 dark:text-slate-200 leading-relaxed max-h-[70vh] overflow-y-auto">
          {/* Form Header */}
          <div className="text-center space-y-1 pb-3 border-b border-amber-200 dark:border-slate-800">
            <div className="text-[11px] text-amber-900 dark:text-amber-400 font-bold tracking-wider uppercase font-sans">
              ফরম ‘ঙ’ (১৬ ধারা দ্রষ্টব্য)
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              বাংলাদেশ ফরম নং ১৬০১ (নিকাহনামা)
            </div>
            <div className="text-[11px] text-slate-500 font-sans">
              রেজিস্ট্রার কার্যালয়: নিকাহ ও তালাক রেজিস্ট্রি কার্য্যালয়, {caseItem.upazila}, {caseItem.district}
            </div>
          </div>

          {/* Deed Clauses */}
          <div className="space-y-3 font-sans">
            <div className="flex items-start justify-between p-2 rounded bg-amber-50/40 dark:bg-slate-900/40 border border-amber-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">১. বিবাহ অনুষ্ঠানের তারিখ:</span>
              <strong className="font-mono">{formatToDisplayDate(caseItem.filingDate)}</strong>
            </div>

            <div className="flex items-start justify-between p-2 rounded bg-amber-50/40 dark:bg-slate-900/40 border border-amber-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">২. কন্যার (আবেদনকারী) নাম:</span>
              <strong className="text-slate-900 dark:text-white">{caseItem.applicantName}</strong>
            </div>

            <div className="flex items-start justify-between p-2 rounded bg-amber-50/40 dark:bg-slate-900/40 border border-amber-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">৩. পিতার নাম ও ঠিকানা:</span>
              <span className="font-mono">মো: রফিকুল ইসলাম (গ্রাম: •••••••, {caseItem.upazila})</span>
            </div>

            <div className="flex items-start justify-between p-2 rounded bg-amber-50/40 dark:bg-slate-900/40 border border-amber-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">৪. বরের নাম ও ঠিকানা:</span>
              <span className="font-mono">মো: আব্দুল লতিফ (গ্রাম: •••••••, {caseItem.upazila})</span>
            </div>

            <div className="flex items-start justify-between p-2 rounded bg-amber-50/40 dark:bg-slate-900/40 border border-amber-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">৫. নির্ধারিত দেনমোহরের পরিমাণ (দফা ১৩):</span>
              <strong className="text-[#006A4E] dark:text-emerald-400 font-mono text-sm">৳ ৫,০০,০০০/- (পাঁচ লক্ষ টাকা মাত্র)</strong>
            </div>

            <div className="flex items-start justify-between p-2 rounded bg-amber-50/40 dark:bg-slate-900/40 border border-amber-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">৬. উসুল ও বকেয়া দেনমোহর:</span>
              <span>নগদ উসুল: ৳ ৫০,০০০/-, <strong>বকেয়া খোরপোষ ও দেনমোহর: ৳ ৪,৫০,০০০/-</strong></span>
            </div>

            <div className="flex items-start justify-between p-2 rounded bg-amber-50/40 dark:bg-slate-900/40 border border-amber-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">৭. তালাক-ই-তৌফিজের অধিকার (দফা ১৮):</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">হ্যাঁ, শর্তহীনভাবে প্রদত্ত</span>
            </div>

            <div className="flex items-start justify-between p-2 rounded bg-amber-50/40 dark:bg-slate-900/40 border border-amber-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">৮. কাজী রেজিস্ট্রারের সিল ও ভলিউম নম্বর:</span>
              <span className="font-mono text-slate-500">ভলিউম নং-১২, পৃষ্ঠা-৮৭, বালাম-২০২৪</span>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="pt-3 border-t border-amber-200 dark:border-slate-800 flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-1.5 text-[#006A4E] dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>আইনগত সহায়তা কর্মকর্তা কর্তৃক রেজিস্ট্রি খতিয়ান যাচাইকৃত</span>
            </div>
            <span className="text-slate-500 font-mono">
              রেফারেন্স: {caseItem.caseId}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-amber-200 dark:border-slate-800 bg-amber-50/50 dark:bg-[#0F1724] flex justify-end font-sans">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer"
          >
            প্রাকদর্শন বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
