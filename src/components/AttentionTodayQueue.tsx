import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Clock,
  Calendar,
  FileText,
  ArrowRight,
  ShieldAlert,
  UserX,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { CanonicalCase, UserRole } from '../types/legalAid';
import { formatToDisplayDate } from '../services/chronologyEngine';
import { SYSTEM_DEMO_DATE } from '../data/canonicalLocations';

interface AttentionTodayQueueProps {
  cases: CanonicalCase[];
  currentRole: UserRole;
  onSelectCase: (c: CanonicalCase) => void;
}

type QueueCategory = 'ALL' | 'CHRONOLOGY' | 'SLA' | 'HEARING' | 'NO_LAWYER';

interface WorkItem {
  caseItem: CanonicalCase;
  category: QueueCategory;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  titleBn: string;
  problemBn: string;
  evidenceBn: string;
  actionBn: string;
}

export const AttentionTodayQueue: React.FC<AttentionTodayQueueProps> = ({
  cases,
  currentRole,
  onSelectCase
}) => {
  const [activeCategory, setActiveCategory] = useState<QueueCategory>('ALL');

  const workItems: WorkItem[] = useMemo(() => {
    const items: WorkItem[] = [];

    for (const c of cases) {
      // 1. Chronology Conflict (Hero Anomaly: Never treated as normal upcoming hearing)
      if (c.chronologyStatus === 'FAILED' || c.isChronologyInvalid) {
        items.push({
          caseItem: c,
          category: 'CHRONOLOGY',
          severity: 'CRITICAL',
          titleBn: 'কালানুক্রমিক ডেটা অসংগতি',
          problemBn: c.dataQualityExplanation || 'শুনানির তারিখ মামলা দাখিলের তারিখের পূর্বে নির্ধারিত হয়েছে।',
          evidenceBn: `দাখিল: ${formatToDisplayDate(c.filingDate)} • শুনানি: ${formatToDisplayDate(c.nextHearingDate)}`,
          actionBn: 'আদালতের উৎস রেকর্ড ও দৈনিক কার্যতালিকা যাচাই করে শুনানি সংশোধন করুন।'
        });
        continue;
      }

      // 2. Future-dated records: MUST NOT be treated as legitimate current actions
      if (c.isFutureDated) {
        // Skip from actionable queue as per requirement 10
        continue;
      }

      // 3. SLA Expired
      if (c.slaStatus === 'EXPIRED') {
        const days = Math.abs(c.slaDaysRemaining || 0);
        items.push({
          caseItem: c,
          category: 'SLA',
          severity: 'CRITICAL',
          titleBn: 'সেবা সময়সীমা (SLA) অতিক্রান্ত',
          problemBn: `বিধিবদ্ধ সেবা সময়সীমা ${days} দিন পূর্বে শেষ হয়েছে।`,
          evidenceBn: `নির্ধারিত তারিখ: ${formatToDisplayDate(c.slaDueDate)} • অবস্থা: ${c.lifecycleStatus}`,
          actionBn: 'অবিলম্বে কর্মকর্তার অগ্রগতি পর্যালোচনা ও সংশ্লিষ্ট আদালতে নোটিশ জারি করুন।'
        });
        continue;
      }

      // 4. Upcoming Hearings (within 14 days) on active cases
      if (c.nextHearingDate && c.lifecycleStatus !== 'CLOSED' && c.lifecycleStatus !== 'RESOLVED') {
        const hDate = new Date(c.nextHearingDate);
        if (!isNaN(hDate.getTime())) {
          const diffDays = Math.ceil((hDate.getTime() - SYSTEM_DEMO_DATE.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays <= 14) {
            const hasLawyer = Boolean(c.assignedLawyer);
            items.push({
              caseItem: c,
              category: 'HEARING',
              severity: hasLawyer ? 'HIGH' : 'CRITICAL',
              titleBn: `আসন্ন শুনানি (${diffDays} দিন বাকি)`,
              problemBn: hasLawyer
                ? 'শুনানির পূর্বপ্রস্তুতি ও সাক্ষীর উপস্থিতি নিশ্চিতকরণ আবশ্যক।'
                : 'শুনানির তারিখ সন্নিকটে অথচ কোনো আইনজীবী নিযুক্ত নেই!',
              evidenceBn: `শুনানি: ${formatToDisplayDate(c.nextHearingDate)} • আইনজীবী: ${c.assignedLawyer || 'অনিযুক্ত'}`,
              actionBn: hasLawyer ? 'আইনজীবীর প্রস্তুতি ও হাজিরা রিপোর্ট গ্রহণ' : 'জরুরি ভিত্তিতে প্যানেল আইনজীবী নিয়োগ অনুমোদন'
            });
            continue;
          }
        }
      }

      // 5. Active Case without Assigned Lawyer
      if (c.lifecycleStatus === 'ONGOING' && !c.assignedLawyerId) {
        items.push({
          caseItem: c,
          category: 'NO_LAWYER',
          severity: 'HIGH',
          titleBn: 'আইনজীবীবিহীন সক্রিয় মামলা',
          problemBn: 'চলমান বিচারিক মোকদ্দমায় কোনো প্যানেল আইনজীবী মনোনীত নেই।',
          evidenceBn: `মামলা নং: ${c.caseId} • বিষয়: ${c.caseType} • আদালত: ${c.court}`,
          actionBn: 'প্যানেল আইনজীবী নিয়োগ ইঞ্জিন চালিয়ে উপযুক্ত আইনজীবী নিয়োগ করুন।'
        });
      }
    }

    return items;
  }, [cases]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'ALL') return workItems;
    return workItems.filter(item => item.category === activeCategory);
  }, [workItems, activeCategory]);

  const counts = useMemo(() => {
    return {
      all: workItems.length,
      chrono: workItems.filter(i => i.category === 'CHRONOLOGY').length,
      sla: workItems.filter(i => i.category === 'SLA').length,
      hearing: workItems.filter(i => i.category === 'HEARING').length,
      noLawyer: workItems.filter(i => i.category === 'NO_LAWYER').length
    };
  }, [workItems]);

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-4.5 bg-amber-500 rounded-xs" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              আজকের জরুরি কর্মতালিকা ও তদারকি কিউ (Attention Today Queue)
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 pl-4">
            ১০ সেপ্টেম্বর ২০২৬ তারিখের ভিত্তিতে জরুরি পদক্ষেপযোগ্য মামলা, এসএলএ অতিক্রান্ত নোটিশ ও অসংগতি নিরীক্ষা
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="px-3 py-1 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200">
            মোট জরুরি বিষয়: {workItems.length}টি
          </span>
        </div>
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-1.5 flex flex-wrap gap-1 text-xs">
        {[
          { id: 'ALL', labelBn: 'সকল জরুরি পদক্ষেপ', count: counts.all },
          { id: 'CHRONOLOGY', labelBn: 'কালানুক্রমিক অসংগতি', count: counts.chrono },
          { id: 'SLA', labelBn: 'এসএলএ অতিক্রান্ত', count: counts.sla },
          { id: 'HEARING', labelBn: 'আসন্ন শুনানি (১৪ দিন)', count: counts.hearing },
          { id: 'NO_LAWYER', labelBn: 'আইনজীবীবিহীন মামলা', count: counts.noLawyer }
        ].map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as QueueCategory)}
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

      {/* 3. Work Queue Items Grid */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-[#15202E] border border-slate-200 dark:border-slate-800 rounded-md p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            এই ক্যাটাগরিতে বর্তমানে কোনো জরুরি পদক্ষেপ অপেক্ষমাণ নেই।
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isCritical = item.severity === 'CRITICAL';
            return (
              <div
                key={`${item.caseItem.caseId}-${idx}`}
                className={`p-4 rounded-md border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#15202E] ${
                  isCritical
                    ? 'border-red-200 dark:border-red-900/60 shadow-2xs hover:border-red-400'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCritical
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      }`}
                    >
                      {item.titleBn}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#006A4E] dark:text-emerald-400">
                      {item.caseItem.caseId}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {item.caseItem.district} • {item.caseItem.court}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.caseItem.applicantName} ({item.caseItem.caseType})
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                    <span className="font-bold text-red-700 dark:text-red-400">সমস্যা:</span>
                    <span>{item.problemBn}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono">
                    <span>প্রমাণক: {item.evidenceBn}</span>
                    <span>দায়িত্বপ্রাপ্ত: {item.caseItem.assignedOfficer}</span>
                  </div>

                  <div className="text-xs text-[#006A4E] dark:text-emerald-400 font-medium flex items-center gap-1">
                    <span className="font-bold">প্রস্তাবিত পদক্ষেপ:</span>
                    <span>{item.actionBn}</span>
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <button
                    onClick={() => onSelectCase(item.caseItem)}
                    className="px-3 py-1.5 rounded-md bg-[#006A4E] hover:bg-[#004D3A] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>নথি পর্যালোচনা ও সিদ্ধান্ত</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
