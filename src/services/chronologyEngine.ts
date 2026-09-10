/**
 * কালানুক্রম ও সময়িক বৈধতা যাচাই ইঞ্জিন (Chronology Engine)
 * Validates legal timelines and detects temporal conflicts without mutating source data.
 */

import { ChronologyStatus, ChronologyStep, DataQualityStatus, AnomalyItem } from '../types/legalAid';
import { SYSTEM_DEMO_DATE } from '../data/canonicalLocations';

export interface ChronologyAnalysisResult {
  chronologyStatus: ChronologyStatus;
  dataQualityStatus: DataQualityStatus;
  isFutureDated: boolean;
  isChronologyInvalid: boolean;
  conflictReason?: string;
  explanationBn: string;
  recommendedActionBn: string;
  steps: ChronologyStep[];
  anomalies: AnomalyItem[];
}

export function parseDateSafe(dateStr: string | null | undefined): Date | null {
  if (!dateStr || dateStr.trim() === '' || dateStr.toLowerCase() === 'null') {
    return null;
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export function formatToDisplayDate(dateStr: string | null | undefined): string {
  if (!dateStr || dateStr.trim() === '' || dateStr.toLowerCase() === 'null') {
    return 'অনির্ধারিত';
  }
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
  }
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();
  return `${day}-${month}-${year}`;
}

export function analyzeCaseChronology(rawCase: {
  caseId: string;
  filingDate?: string | null;
  applicationDate?: string | null;
  reviewStartDate?: string | null;
  registrationDate?: string | null;
  lawyerAssignmentDate?: string | null;
  nextHearingDate?: string | null;
  lifecycleStatus?: string;
  lastActivityDate?: string | null;
  intentionalDemoAnomaly?: string;
}): ChronologyAnalysisResult {
  const caseId = rawCase.caseId;
  const appDate = parseDateSafe(rawCase.applicationDate || rawCase.filingDate);
  const filing = parseDateSafe(rawCase.filingDate);
  const review = parseDateSafe(rawCase.reviewStartDate);
  const registration = parseDateSafe(rawCase.registrationDate);
  const assignment = parseDateSafe(rawCase.lawyerAssignmentDate);
  const hearing = parseDateSafe(rawCase.nextHearingDate);
  const lastActivity = parseDateSafe(rawCase.lastActivityDate);

  const steps: ChronologyStep[] = [
    {
      step: 'APPLICATION',
      labelBn: 'আবেদন গ্রহণ',
      date: rawCase.applicationDate || rawCase.filingDate || null,
      status: appDate ? 'COMPLETED' : 'PENDING'
    },
    {
      step: 'REVIEW',
      labelBn: 'তথ্য ও যোগ্যতা যাচাই',
      date: rawCase.reviewStartDate || null,
      status: review ? 'COMPLETED' : 'PENDING'
    },
    {
      step: 'APPROVAL',
      labelBn: 'আইনগত সহায়তা অনুমোদন',
      date: rawCase.registrationDate || null,
      status: registration ? 'COMPLETED' : 'PENDING'
    },
    {
      step: 'ASSIGNMENT',
      labelBn: 'আইনজীবী নিয়োগ',
      date: rawCase.lawyerAssignmentDate || null,
      status: assignment ? 'COMPLETED' : 'PENDING'
    },
    {
      step: 'REGISTRATION',
      labelBn: 'মামলা নিবন্ধন ও কার্যধারা',
      date: rawCase.registrationDate || null,
      status: registration ? 'COMPLETED' : 'PENDING'
    },
    {
      step: 'HEARING',
      labelBn: 'আদালতে শুনানি',
      date: rawCase.nextHearingDate || null,
      status: hearing ? 'COMPLETED' : 'PENDING'
    },
    {
      step: 'DISPOSAL',
      labelBn: 'মামলা নিষ্পত্তি / বন্ধ',
      date: (rawCase.lifecycleStatus === 'RESOLVED' || rawCase.lifecycleStatus === 'CLOSED') ? (rawCase.lastActivityDate || null) : null,
      status: (rawCase.lifecycleStatus === 'RESOLVED' || rawCase.lifecycleStatus === 'CLOSED') ? 'COMPLETED' : 'PENDING'
    }
  ];

  const anomalies: AnomalyItem[] = [];
  let conflictReason = '';
  let isChronologyInvalid = false;
  let isFutureDated = false;

  // Rule A: Check if filing date is in the future relative to DEMO reference date (2026-09-10)
  if (filing && filing.getTime() > SYSTEM_DEMO_DATE.getTime()) {
    isFutureDated = true;
    anomalies.push({
      id: `${caseId}-FUTURE`,
      caseId,
      field: 'filingDate',
      severity: 'HIGH',
      type: 'FUTURE_DATED',
      problemBn: 'ভবিষ্যত-তারিখযুক্ত মামলা দাখিল রেকর্ড',
      whyItMattersBn: '১০ সেপ্টেম্বর ২০২৬ তারিখের রেফারেন্স অনুযায়ী এটি ভবিষ্যতের দাখিলকৃত রেকর্ড, যা বর্তমান নিয়মিত মামলার অংশ নয়।',
      recommendedActionBn: 'নথিভুক্তির প্রকৃত তারিখ সংশোধন ও রেজিস্টার রেকর্ড যাচাই করুন।',
      detectedAt: '2026-09-10'
    });
  }

  // Rule B: Hearing before Filing (Intentional Demo Anomaly & Data Defect)
  if (filing && hearing && hearing.getTime() < filing.getTime()) {
    isChronologyInvalid = true;
    conflictReason = 'শুনানির তারিখ মামলা দাখিলের তারিখের পূর্বে নির্ধারিত হয়েছে। রেকর্ড যাচাই প্রয়োজন।';
    const hearingStep = steps.find(s => s.step === 'HEARING');
    if (hearingStep) {
      hearingStep.status = 'CONFLICT';
      hearingStep.conflictReason = conflictReason;
    }
    anomalies.push({
      id: `${caseId}-CHRONO-HEARING`,
      caseId,
      field: 'nextHearingDate',
      severity: 'CRITICAL',
      type: 'CHRONOLOGY_CONFLICT',
      problemBn: conflictReason,
      whyItMattersBn: 'মামলা দায়ের হওয়ার পূর্বে কোনো বৈধ আদালতে শুনানি অনুষ্ঠিত হওয়া বাস্তবিকভাবে অসম্ভব।',
      recommendedActionBn: 'আদালতের দৈনিক কার্যতালিকা (Daily Cause List) দেখে শুনানির সঠিক তারিখ হালনাগাদ করুন।',
      detectedAt: '2026-09-10'
    });
  }

  // Rule C: Review before Filing
  if (filing && review && review.getTime() < filing.getTime()) {
    isChronologyInvalid = true;
    conflictReason = 'প্রাথমিক পর্যালোচনার তারিখ মামলা দাখিলের পূর্ববর্তী।';
    anomalies.push({
      id: `${caseId}-CHRONO-REVIEW`,
      caseId,
      field: 'reviewStartDate',
      severity: 'HIGH',
      type: 'CHRONOLOGY_CONFLICT',
      problemBn: conflictReason,
      whyItMattersBn: 'আবেদন বা মামলা দাখিলের পূর্বে প্রশাসনিক পর্যালোচনা শুরু হতে পারে না।',
      recommendedActionBn: 'দায়ের রেজিস্টারের সাথে পর্যালোচনার শুরুর তারিখ সমন্বয় করুন।',
      detectedAt: '2026-09-10'
    });
  }

  // Rule D: Closed case with future hearing
  if ((rawCase.lifecycleStatus === 'CLOSED' || rawCase.lifecycleStatus === 'RESOLVED') && hearing && hearing.getTime() > SYSTEM_DEMO_DATE.getTime()) {
    anomalies.push({
      id: `${caseId}-CLOSED-FUTURE-HEARING`,
      caseId,
      field: 'nextHearingDate',
      severity: 'MEDIUM',
      type: 'INVALID_TRANSITION',
      problemBn: 'নিষ্পত্তিকৃত/বন্ধ মামলায় ভবিষ্যৎ শুনানির তারিখ বহাল রয়েছে।',
      whyItMattersBn: 'মামলা নিষ্পত্তি হয়ে গেলে আদালতের পরবর্তী সক্রিয় শুনানির তারিখ থাকা কাম্য নয়।',
      recommendedActionBn: 'নিষ্পত্তির আদেশ যাচাই করে ভবিষ্যৎ শুনানির তারিখ প্রত্যাহার করুন।',
      detectedAt: '2026-09-10'
    });
  }

  // If intentionalDemoAnomaly tag exists in source CSV, ensure it is represented
  if (rawCase.intentionalDemoAnomaly === 'CHRONOLOGY_CONFLICT' && !isChronologyInvalid) {
    isChronologyInvalid = true;
    conflictReason = conflictReason || 'উৎস ফাইলে কালানুক্রমিক অসংগতি চিহ্নিত রয়েছে।';
  }

  let chronologyStatus: ChronologyStatus = 'PASSED';
  let dataQualityStatus: DataQualityStatus = 'VALID';

  if (isChronologyInvalid) {
    chronologyStatus = 'FAILED';
    dataQualityStatus = 'DATA_QUALITY_ANOMALY';
  } else if (isFutureDated || anomalies.length > 0) {
    chronologyStatus = 'WARNING';
    dataQualityStatus = 'WARNING';
  }

  const explanationBn = conflictReason || (isFutureDated ? 'ভবিষ্যত-তারিখযুক্ত রেকর্ড (নিয়মিত পর্যালোচনার আওতাধীন নয়)' : 'সকল তারিখ নিয়মসম্মত ও সামঞ্জস্যপূর্ণ');
  const recommendedActionBn = isChronologyInvalid ? 'উৎস নথি যাচাই সাপেক্ষে সংশোধন প্রস্তাব দাখিল করুন।' : 'কোনো তাত্ক্ষণিক সংশোধনের প্রয়োজন নেই।';

  return {
    chronologyStatus,
    dataQualityStatus,
    isFutureDated,
    isChronologyInvalid,
    conflictReason,
    explanationBn,
    recommendedActionBn,
    steps,
    anomalies
  };
}
