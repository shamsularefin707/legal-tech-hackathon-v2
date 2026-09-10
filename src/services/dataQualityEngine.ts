/**
 * ডেটা মান ও সামঞ্জস্য নিরীক্ষা ইঞ্জিন (Data Quality & Consistency Engine)
 * Dedicated auditor identifying structural anomalies, missing data, and jurisdiction defects.
 */

import { CanonicalCase, CanonicalLawyer, AnomalyItem, AnomalySeverity, AnomalyType } from '../types/legalAid';
import { isPilotDistrict } from '../data/canonicalLocations';

export interface DataQualityCategorySummary {
  type: AnomalyType;
  titleBn: string;
  severity: AnomalySeverity;
  count: number;
  descriptionBn: string;
  recommendedActionBn: string;
  affectedCaseIds: string[];
}

export interface DatasetQualityReport {
  totalRecordsAudited: number;
  validRecordsCount: number;
  warningRecordsCount: number;
  anomalyRecordsCount: number;
  totalAnomaliesCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  categorySummaries: DataQualityCategorySummary[];
  allAnomalies: AnomalyItem[];
}

export function auditDatasetQuality(
  cases: CanonicalCase[],
  lawyers: CanonicalLawyer[]
): DatasetQualityReport {
  const allAnomalies: AnomalyItem[] = [];
  const lawyerMap = new Map<string, CanonicalLawyer>();
  for (const l of lawyers) {
    lawyerMap.set(l.lawyerId, l);
  }

  const seenCaseIds = new Set<string>();

  for (const c of cases) {
    // 1. Inherit chronology anomalies
    for (const an of c.anomalies) {
      allAnomalies.push(an);
    }

    // 2. Duplicate case ID check
    if (seenCaseIds.has(c.caseId)) {
      allAnomalies.push({
        id: `${c.caseId}-DUPLICATE`,
        caseId: c.caseId,
        field: 'caseId',
        severity: 'CRITICAL',
        type: 'INVALID_TRANSITION',
        problemBn: `দ্বৈত মামলা আইডি সনাক্ত হয়েছে: ${c.caseId}`,
        whyItMattersBn: 'একই শনাক্তকারী নম্বর একাধিক নথিতে ব্যবহৃত হলে বিচারিক কার্যক্রমে বিভ্রান্তি সৃষ্টি হয়।',
        recommendedActionBn: 'মামলা নম্বর যাচাই করে রেজিস্টার সংশোধন করুন।',
        detectedAt: '2026-09-10'
      });
    }
    seenCaseIds.add(c.caseId);

    // 3. Pilot District validation
    if (!isPilotDistrict(c.district)) {
      allAnomalies.push({
        id: `${c.caseId}-DISTRICT`,
        caseId: c.caseId,
        field: 'district',
        severity: 'CRITICAL',
        type: 'INVALID_DISTRICT',
        problemBn: `অননুমোদিত বা বহিরাগত জেলা: "${c.district}"`,
        whyItMattersBn: 'পাইলট প্রকল্পের আওতাধীন ৮টি জেলার বাইরে মামলা বরাদ্দ করা আইনগতভাবে অনুমোদিত নয়।',
        recommendedActionBn: 'সংশ্লিষ্ট জেলা লিগ্যাল এইড অফিসে মামলাটি স্থানান্তর করুন।',
        detectedAt: '2026-09-10'
      });
    }

    // 4. Missing required lawyer on active/ongoing case
    if (c.lifecycleStatus === 'ONGOING' && !c.assignedLawyerId) {
      allAnomalies.push({
        id: `${c.caseId}-MISSING-LAWYER`,
        caseId: c.caseId,
        field: 'assignedLawyerId',
        severity: 'HIGH',
        type: 'MISSING_REQUIRED_FIELD',
        problemBn: 'চলমান বিচারিক মামলায় কোনো আইনজীবী নিযুক্ত নেই।',
        whyItMattersBn: 'আইনজীবী নিয়োগ ব্যতীত আদালতে নাগরিকের আইনি প্রতিনিধিত্ব নিশ্চিত করা সম্ভব নয়।',
        recommendedActionBn: 'প্যানেল আইনজীবী নিয়োগের সুপারিশ বা আদেশ জারি করুন।',
        detectedAt: '2026-09-10'
      });
    }

    // 5. Lawyer suspended check
    if (c.assignedLawyerId) {
      const lawyer = lawyerMap.get(c.assignedLawyerId);
      if (lawyer && lawyer.status === 'SUSPENDED') {
        allAnomalies.push({
          id: `${c.caseId}-SUSPENDED-LAWYER`,
          caseId: c.caseId,
          field: 'assignedLawyerId',
          severity: 'HIGH',
          type: 'LAWYER_OVERLOAD',
          problemBn: `স্থগিতাদেশপ্রাপ্ত আইনজীবীর (${lawyer.lawyerName}) অধীনে মামলা ন্যস্ত রয়েছে।`,
          whyItMattersBn: 'সাময়িক স্থগিত বা ছাড়প্রাপ্ত আইনজীবী কর্তৃক প্রতিনিধিত্ব বার কাউন্সিল বিধিমালার পরিপন্থী।',
          recommendedActionBn: 'মামলাটি অবিলম্বে বিকল্প সক্রিয় প্যানেল আইনজীবীর নিকট পুনর্বণ্টন করুন।',
          detectedAt: '2026-09-10'
        });
      }
    }

    // 6. Missing key document check
    if (c.documentStatus === 'MISSING_KEY_DOCUMENT') {
      allAnomalies.push({
        id: `${c.caseId}-MISSING-DOC`,
        caseId: c.caseId,
        field: 'documentStatus',
        severity: 'MEDIUM',
        type: 'MISSING_REQUIRED_FIELD',
        problemBn: 'মূল নথিপত্র অসম্পূর্ণ (জাতীয় পরিচয়পত্র / নিকাহনামা / কোর্ট ফি সংক্রান্ত)',
        whyItMattersBn: 'প্রমাণক দলিল ছাড়া আদালতে শুনানিতে মামলা খারিজ হওয়ার ঝুঁকি থাকে।',
        recommendedActionBn: 'আবেদনকারীকে অবহিত করে আবশ্যকীয় নথি সংগ্রহ ও সংযোজন করুন।',
        detectedAt: '2026-09-10'
      });
    }
  }

  // Aggregate by anomaly type
  const typeMap = new Map<AnomalyType, DataQualityCategorySummary>();

  const metaDefs: Record<AnomalyType, { titleBn: string; severity: AnomalySeverity; descriptionBn: string; recommendedActionBn: string }> = {
    CHRONOLOGY_CONFLICT: {
      titleBn: 'কালানুক্রমিক অসংগতি',
      severity: 'CRITICAL',
      descriptionBn: 'তারিখের ধারাবাহিকতায় বাস্তবতাবহির্ভূত সংঘাত (যেমন: মামলা দায়েরের পূর্বে শুনানি অনুষ্ঠিত হওয়া)',
      recommendedActionBn: 'আদালতের উৎস কার্যতালিকা ও ফাইল যাচাই করে তারিখ সমন্বয় করুন।'
    },
    FUTURE_DATED: {
      titleBn: 'ভবিষ্যত-তারিখযুক্ত দাখিল রেকর্ড',
      severity: 'HIGH',
      descriptionBn: 'রেফারেন্স তারিখের (১০ সেপ্টেম্বর ২০২৬) পরবর্তী সময়ের দাখিলকৃত মামলা রেকর্ড',
      recommendedActionBn: 'প্রশাসনিক খতিয়ান যাচাই সাপেক্ষে প্রকৃত দাখিল তারিখ নিশ্চিত করুন।'
    },
    MISSING_REQUIRED_FIELD: {
      titleBn: 'আবশ্যকীয় তথ্য বা নথি অনুপস্থিত',
      severity: 'HIGH',
      descriptionBn: 'আইনজীবী নিয়োগবিহীন চলমান মামলা বা আবশ্যকীয় প্রামাণিক দলিলের ঘাটতি',
      recommendedActionBn: 'অসম্পূর্ণ ক্ষেত্রগুলো অবিলম্বে পূরণ ও নথি আপলোড করুন।'
    },
    INVALID_DISTRICT: {
      titleBn: 'অননুমোদিত জেলা এক্তিয়ার',
      severity: 'CRITICAL',
      descriptionBn: '৮টি অনুমোদিত পাইলট জেলার বাইরের এলাকা সংক্রান্ত মামলা',
      recommendedActionBn: 'সংশ্লিষ্ট জেলার আদালতে প্রশাসনিক প্রক্রিয়ায় স্থানান্তর করুন।'
    },
    INVALID_TRANSITION: {
      titleBn: 'বিধিপরিপন্থী লাইফসাইকেল পর্যায়',
      severity: 'MEDIUM',
      descriptionBn: 'নিষ্পত্তিকৃত মামলায় ভবিষ্যৎ শুনানির তারিখ বহাল বা দ্বৈত এন্ট্রি',
      recommendedActionBn: 'মামলার সর্বশেষ বিচারিক নিষ্পত্তি আদেশের ভিত্তিতে রেকর্ড সংশোধন করুন।'
    },
    LAWYER_OVERLOAD: {
      titleBn: 'আইনজীবী সংশ্লিষ্ট প্রশাসনিক অসংগতি',
      severity: 'HIGH',
      descriptionBn: 'স্থগিতাদেশপ্রাপ্ত বা কাজের সীমার অতিরিক্ত আইনজীবী নিয়োগ',
      recommendedActionBn: 'উপযুক্ত বিকল্প প্যানেল আইনজীবীর নিকট মামলা পুনর্বণ্টন করুন।'
    },
    SLA_CALCULATION_ERROR: {
      titleBn: 'এসএলএ পরিগণনায় অসঙ্গতি',
      severity: 'MEDIUM',
      descriptionBn: 'তারিখের অমিলের কারণে সেবা সময়সীমা গণনায় বিভ্রান্তি',
      recommendedActionBn: 'এসএলএ শুরু ও শেষের নির্ধারিত দিন পুনরায় পরিগণনা করুন।'
    }
  };

  for (const an of allAnomalies) {
    if (!typeMap.has(an.type)) {
      const def = metaDefs[an.type] || {
        titleBn: an.type,
        severity: an.severity,
        descriptionBn: an.problemBn,
        recommendedActionBn: an.recommendedActionBn
      };
      typeMap.set(an.type, {
        type: an.type,
        titleBn: def.titleBn,
        severity: def.severity,
        count: 0,
        descriptionBn: def.descriptionBn,
        recommendedActionBn: def.recommendedActionBn,
        affectedCaseIds: []
      });
    }
    const cat = typeMap.get(an.type)!;
    cat.count++;
    if (!cat.affectedCaseIds.includes(an.caseId)) {
      cat.affectedCaseIds.push(an.caseId);
    }
  }

  const categorySummaries = Array.from(typeMap.values()).sort((a, b) => {
    const score = (s: AnomalySeverity) => s === 'CRITICAL' ? 3 : s === 'HIGH' ? 2 : 1;
    return score(b.severity) - score(a.severity);
  });

  const criticalCount = allAnomalies.filter(a => a.severity === 'CRITICAL').length;
  const highCount = allAnomalies.filter(a => a.severity === 'HIGH').length;
  const mediumCount = allAnomalies.filter(a => a.severity === 'MEDIUM' || a.severity === 'INFO').length;

  const validRecordsCount = cases.filter(c => c.dataQualityStatus === 'VALID').length;
  const warningRecordsCount = cases.filter(c => c.dataQualityStatus === 'WARNING').length;
  const anomalyRecordsCount = cases.filter(c => c.dataQualityStatus === 'DATA_QUALITY_ANOMALY').length;

  return {
    totalRecordsAudited: cases.length,
    validRecordsCount,
    warningRecordsCount,
    anomalyRecordsCount,
    totalAnomaliesCount: allAnomalies.length,
    criticalCount,
    highCount,
    mediumCount,
    categorySummaries,
    allAnomalies
  };
}
