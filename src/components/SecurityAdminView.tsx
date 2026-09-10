import React, { useState } from 'react';
import {
  Lock,
  Shield,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Play,
  UserCheck,
  Building2,
  FileText
} from 'lucide-react';
import { UserRole } from '../types/legalAid';
import { ROLE_CONFIGS } from '../services/rbacService';
import { securityManager, SecurityIncident } from '../services/securityService';

interface SecurityAdminViewProps {
  currentRole: UserRole;
  onRefresh: () => void;
}

export const SecurityAdminView: React.FC<SecurityAdminViewProps> = ({
  currentRole,
  onRefresh
}) => {
  const [incidents, setIncidents] = useState<SecurityIncident[]>(securityManager.getIncidents());
  const [simulationSuccess, setSimulationSuccess] = useState<string | null>(null);

  const runSecurityDrill = () => {
    const inc = securityManager.recordBlockedAttempt(
      'PANEL_LAWYER',
      'APPROVE_ELIGIBILITY',
      'প্যানেল আইনজীবী কর্তৃক আবেদন অনুমোদন চেষ্টার সিমুলেশন ড্রিল সফলভাবে প্রতিহত ও অডিটে সংরক্ষিত।'
    );
    setIncidents(securityManager.getIncidents());
    setSimulationSuccess('নিরাপত্তা ড্রিল সফল: অননুমোদিত অনুমোদন চেষ্টা প্রতিহত করা হয়েছে এবং অডিটে সংরক্ষিত হয়েছে।');
    setTimeout(() => setSimulationSuccess(null), 4000);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-4.5 bg-slate-800 dark:bg-slate-400 rounded-xs" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              নিরাপত্তা কাঠামো ও সিস্টেম প্রশাসন (Security & RBAC Architecture)
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-4">
            ভূমিকাভিত্তিক প্রবেশাধিকার (RBAC), তথ্য গোপনীয়তা (PII Protection) ও প্রোটোটাইপ নিরাপত্তা নীতি
          </p>
        </div>

        <button
          onClick={runSecurityDrill}
          className="px-3.5 py-1.5 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          title="অননুমোদিত অনুমোদন চেষ্টার সিমুলেশন চালান"
        >
          <Play className="w-3.5 h-3.5" />
          <span>নিরাপত্তা ড্রিল সিমুলেশন চালান</span>
        </button>
      </div>

      {simulationSuccess && (
        <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{simulationSuccess}</span>
        </div>
      )}

      {/* 2. Synthetic Data Boundary & Legal Disclaimer */}
      <div className="p-4 rounded-md bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
          <Shield className="w-4 h-4 text-amber-600" />
          <span>সিন্থেটিক ডেটাসেট ও প্রোটোটাইপ সীমানা সম্পর্কিত প্রাতিষ্ঠানিক ঘোষণা:</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          এই প্ল্যাটফর্মে প্রদর্শিত ৫০০টি মামলার সকল নাম, জাতীয় পরিচয়পত্র ও তথ্য সম্পূর্ণ সিন্থেটিক (Synthetic Demonstration Data)। হ্যাকাথনে বাস্তবসম্মত বিচারিক কার্যধারা প্রদর্শনের উদ্দেশ্যে কৃত্রিমভাবে তৈরি করা হয়েছে। কোনোরূপ সংবেদনশীল ব্যক্তিগত তথ্য বা গোপনীয় বিচারিক নথিপত্র সিস্টেমে সংরক্ষিত নয়।
        </p>
      </div>

      {/* 3. 6-Tier Role Matrix */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 shadow-2xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#006A4E]" />
          <span>৬-স্তরের প্রাতিষ্ঠানিক ভূমিকা ও অনুমতির ম্যাট্রিক্স (RBAC Separation of Duties)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(ROLE_CONFIGS).map((rc) => (
            <div
              key={rc.role}
              className={`p-3.5 rounded-md border text-xs space-y-2 bg-white dark:bg-[#15202E] ${
                currentRole === rc.role
                  ? 'border-[#006A4E] ring-2 ring-[#006A4E]/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">
                    {rc.nameBn}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{rc.nameEn}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rc.badgeBg} ${rc.badgeText}`}>
                  {rc.role}
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                {rc.descriptionBn}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500">
                অনুমোদিত কার্যক্রম: <strong>{rc.permissions.length}টি একশন</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Security Incident Log */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>স্বয়ংক্রিয় নিরাপত্তা নিরীক্ষা ঘটনাপঞ্জি (Security Incidents & Blocked Violations)</span>
          </h2>
          <span className="font-mono text-xs font-bold text-red-700 dark:text-red-400">
            {incidents.length}টি ঘটনা
          </span>
        </div>

        <div className="space-y-2">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-red-700 dark:text-red-400">{inc.id}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                    {inc.status}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">{inc.timestamp}</span>
                </div>
                <div className="text-slate-800 dark:text-slate-200 font-semibold">{inc.descriptionBn}</div>
              </div>

              <div className="shrink-0 text-[11px] text-slate-500 font-mono">
                ভূমিকা: {inc.attemptedByRole}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
