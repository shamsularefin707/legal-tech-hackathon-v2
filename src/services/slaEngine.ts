/**
 * সেবা স্তর প্রতিশ্রুতি ও সময়সীমা ইঞ্জিন (SLA Engine)
 * Multi-stage legal-aid SLA monitoring relative to 2026-09-10.
 */

import { SlaStatus, SlaStageType, SlaDetail, CaseLifecycleStatus, ApplicationStatus } from '../types/legalAid';
import { SYSTEM_DEMO_DATE, SYSTEM_DEMO_DATE_STR } from '../data/canonicalLocations';
import { parseDateSafe } from './chronologyEngine';

export const SLA_STAGE_CONFIGS: Record<SlaStageType, { nameBn: string; thresholdDays: number }> = {
  APPLICATION_REVIEW: {
    nameBn: 'আবেদন পর্যালোচনা ও তথ্য যাচাই',
    thresholdDays: 3
  },
  ELIGIBILITY_DECISION: {
    nameBn: 'আইনগত সহায়তা প্রাপ্তির যোগ্যতা মূল্যায়ন',
    thresholdDays: 7
  },
  LAWYER_ASSIGNMENT: {
    nameBn: 'আইনজীবী নিয়োগ ও স্বীকৃতি',
    thresholdDays: 5
  },
  HEARING_UPDATE: {
    nameBn: 'শুনানির ফলাফল ও অগ্রগতি হালনাগাদ',
    thresholdDays: 3
  },
  CASE_PROGRESS: {
    nameBn: 'মামলা পরিচালনার সামগ্রিক অগ্রগতি',
    thresholdDays: 90
  }
};

export function calculateDaysBetween(startDateStr: string, endDateStr: string): number {
  const start = parseDateSafe(startDateStr);
  const end = parseDateSafe(endDateStr);
  if (!start || !end) return 0;
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function evaluateSla(
  dueDateStr: string | null | undefined,
  lifecycleStatus: CaseLifecycleStatus,
  applicationStatus: ApplicationStatus,
  isChronologyInvalid: boolean
): { slaStatus: SlaStatus; daysRemaining: number | null } {
  // If case is closed or resolved, SLA is not active
  if (lifecycleStatus === 'RESOLVED' || lifecycleStatus === 'CLOSED') {
    return { slaStatus: 'NOT_APPLICABLE', daysRemaining: null };
  }

  // If chronology is invalid, SLA cannot be legitimately calculated
  if (isChronologyInvalid) {
    return { slaStatus: 'DATA_QUALITY_ISSUE', daysRemaining: null };
  }

  if (!dueDateStr || dueDateStr.trim() === '') {
    return { slaStatus: 'ON_TRACK', daysRemaining: null };
  }

  const dueDate = parseDateSafe(dueDateStr);
  if (!dueDate) {
    return { slaStatus: 'DATA_QUALITY_ISSUE', daysRemaining: null };
  }

  const daysRemaining = Math.ceil((dueDate.getTime() - SYSTEM_DEMO_DATE.getTime()) / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return { slaStatus: 'EXPIRED', daysRemaining };
  } else if (daysRemaining <= 7) {
    return { slaStatus: 'DUE_SOON', daysRemaining };
  } else {
    return { slaStatus: 'ON_TRACK', daysRemaining };
  }
}

export function buildMultiStageSlaDetails(caseData: {
  applicationDate: string;
  filingDate: string | null;
  registrationDate: string | null;
  lawyerAssignmentDate: string | null;
  lastActivityDate: string | null;
  nextHearingDate: string | null;
  slaDueDate: string | null;
}): SlaDetail[] {
  const details: SlaDetail[] = [];
  const refDate = SYSTEM_DEMO_DATE;

  // 1. Application Review SLA
  if (caseData.applicationDate) {
    const appDate = parseDateSafe(caseData.applicationDate) || refDate;
    const due = new Date(appDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    const dueStr = due.toISOString().slice(0, 10);
    const rem = Math.ceil((due.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    details.push({
      stage: 'APPLICATION_REVIEW',
      stageNameBn: SLA_STAGE_CONFIGS.APPLICATION_REVIEW.nameBn,
      startDate: caseData.applicationDate,
      dueDate: dueStr,
      daysRemaining: rem,
      status: rem < 0 ? 'EXPIRED' : (rem <= 2 ? 'DUE_SOON' : 'ON_TRACK'),
      thresholdDays: 3
    });
  }

  // 2. Lawyer Assignment SLA
  if (caseData.registrationDate) {
    const regDate = parseDateSafe(caseData.registrationDate) || refDate;
    const due = new Date(regDate.getTime() + 5 * 24 * 60 * 60 * 1000);
    const dueStr = due.toISOString().slice(0, 10);
    const rem = Math.ceil((due.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    details.push({
      stage: 'LAWYER_ASSIGNMENT',
      stageNameBn: SLA_STAGE_CONFIGS.LAWYER_ASSIGNMENT.nameBn,
      startDate: caseData.registrationDate,
      dueDate: dueStr,
      daysRemaining: rem,
      status: rem < 0 ? 'EXPIRED' : (rem <= 2 ? 'DUE_SOON' : 'ON_TRACK'),
      thresholdDays: 5
    });
  }

  return details;
}
