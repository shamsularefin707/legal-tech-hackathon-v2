/**
 * কেন্দ্রীয় রাষ্ট্র ব্যবস্থাপনা ও একক নির্ভরযোগ্য তথ্যভাণ্ডার (Single Source of Truth)
 * Live, reactive in-memory store maintaining applications, court cases, panel lawyers, and audit events.
 */

import {
  CanonicalCase,
  CanonicalLawyer,
  UserSession,
  UserRole,
  ApplicationStatus,
  CaseLifecycleStatus,
  RepresentationStatus,
  HearingEvent,
  DistrictMetricSummary
} from '../types/legalAid';
import { CANONICAL_RAW_CASES, RawCaseRow } from '../data/canonicalRawCases';
import { CANONICAL_LAWYERS } from '../data/canonicalLawyers';
import {
  CANONICAL_DISTRICTS,
  PILOT_DISTRICT_NAMES,
  SYSTEM_DEMO_DATE,
  SYSTEM_DEMO_DATE_STR,
  getDistrictOfficer,
  getLegalAidCategory
} from '../data/canonicalLocations';
import { analyzeCaseChronology, formatToDisplayDate, parseDateSafe } from './chronologyEngine';
import { evaluateSla, buildMultiStageSlaDetails } from './slaEngine';
import { calculateCasePriority } from './priorityEngine';
import { auditLogger } from './auditLogger';
import { auditDatasetQuality, DatasetQualityReport } from './dataQualityEngine';
import { securityManager } from './securityService';

// Default Active User: District Legal Aid Officer (DLAO)
export const DEFAULT_USER: UserSession = {
  id: 'USR-DLAO-01',
  name: 'মো: মোর্শেদ আলম',
  designation: 'সহকারী জজ ও জেলা লিগ্যাল এইড অফিসার',
  role: 'LEGAL_AID_OFFICER',
  district: 'Dhaka',
  email: 'dlao.dhaka@nlaso.gov.bd',
  phone: '+8801711-000101',
  active: true
};

function transformRawToCanonical(raw: RawCaseRow): CanonicalCase {
  const officerInfo = getDistrictOfficer(raw.district);

  // Application lifecycle determination from source raw status
  let appStatus: ApplicationStatus = 'APPROVED';
  if (raw.lifecycleStatus === 'SUBMITTED') {
    appStatus = 'SUBMITTED';
  } else if (raw.lifecycleStatus === 'UNDER_REVIEW') {
    appStatus = 'UNDER_REVIEW';
  }

  const caseStatus: CaseLifecycleStatus =
    (raw.lifecycleStatus as CaseLifecycleStatus) || 'ONGOING';

  const repStatus: RepresentationStatus = raw.assignedLawyer
    ? 'ACCEPTED_BY_LAWYER'
    : 'UNASSIGNED';

  // Chronology analysis
  const chrono = analyzeCaseChronology({
    caseId: raw.caseId,
    filingDate: raw.filingDate,
    applicationDate: raw.filingDate,
    reviewStartDate: raw.reviewStartDate,
    registrationDate: raw.registrationDate,
    lawyerAssignmentDate: raw.lawyerAssignmentDate,
    nextHearingDate: raw.nextHearingDate,
    lifecycleStatus: raw.lifecycleStatus,
    lastActivityDate: raw.lastActivityDate,
    intentionalDemoAnomaly: raw.intentionalDemoAnomaly
  });

  // SLA Evaluation
  const sla = evaluateSla(
    raw.slaDueDate,
    caseStatus,
    appStatus,
    chrono.isChronologyInvalid
  );

  const slaDetails = buildMultiStageSlaDetails({
    applicationDate: raw.filingDate,
    filingDate: raw.filingDate,
    registrationDate: raw.registrationDate,
    lawyerAssignmentDate: raw.lawyerAssignmentDate,
    lastActivityDate: raw.lastActivityDate,
    nextHearingDate: raw.nextHearingDate,
    slaDueDate: raw.slaDueDate
  });

  // Priority Calculation
  const priorityBreakdown = calculateCasePriority({
    caseType: raw.caseType,
    vulnerabilityIndicator: raw.vulnerabilityIndicator,
    nextHearingDate: raw.nextHearingDate,
    slaDueDate: raw.slaDueDate,
    documentStatus: raw.documentStatus,
    sourcePriority: raw.priority
  });

  // Hearing history
  const previousDates = raw.previousHearingDates
    ? raw.previousHearingDates.split(';').filter(Boolean)
    : [];

  const hearingHistory: HearingEvent[] = previousDates.map((d, idx) => ({
    date: d,
    benchCourt: raw.court,
    purpose: idx === 0 ? 'প্রাথমিক শুনানি ও অভিযোগ গঠন' : 'সাক্ষ্য গ্রহণ ও জবানবন্দি',
    outcome: 'শুনানি সম্পন্ন, পরবর্তী তারিখ ধার্য',
    recordedBy: 'আদালত বেঞ্চ সহকারী',
    recordedAt: d
  }));

  // Bengali stage name
  let currentStageBn = 'চলমান বিচারিক কার্যক্রম';
  if (appStatus === 'SUBMITTED') currentStageBn = 'নতুন আবেদন দাখিলকৃত';
  else if (appStatus === 'UNDER_REVIEW') currentStageBn = 'তথ্য যাচাই ও পর্যালোচনায়';
  else if (caseStatus === 'REGISTERED') currentStageBn = 'মামলা নিবন্ধিত (কার্যধারা আরম্ভ)';
  else if (caseStatus === 'AWAITING_RESOLUTION') currentStageBn = 'নিষ্পত্তির চূড়ান্ত শুনানির অপেক্ষায়';
  else if (caseStatus === 'RESOLVED') currentStageBn = 'সফল নিষ্পত্তি ও রায় কার্যকর';
  else if (caseStatus === 'CLOSED') currentStageBn = 'নথি সংরক্ষিত ও সমাপ্ত';

  const padNum = raw.caseId.slice(-4);
  const applicationId = `APP-2026-${padNum}`;

  return {
    caseId: raw.caseId,
    applicationId,
    applicantName: raw.applicantName,
    beneficiaryNidMasked: `১৯৮৭••••${padNum}`,
    district: raw.district,
    upazila: raw.upazila,
    court: raw.court,
    caseType: raw.caseType,
    legalAidCategory: getLegalAidCategory(raw.caseType),
    vulnerabilityIndicator: raw.vulnerabilityIndicator,

    applicationDate: raw.filingDate,
    filingDate: raw.filingDate || null,
    reviewStartDate: raw.reviewStartDate || null,
    registrationDate: raw.registrationDate || null,
    lawyerAssignmentDate: raw.lawyerAssignmentDate || null,
    lawyerAcceptanceDate: raw.assignedLawyer ? raw.lawyerAssignmentDate : null,

    applicationStatus: appStatus,
    lifecycleStatus: caseStatus,
    representationStatus: repStatus,
    currentStageBn,

    assignedOfficer: officerInfo.officerName,
    assignedOfficerDesignation: officerInfo.designation,
    assignedLawyerId: raw.assignedLawyerId || null,
    assignedLawyer: raw.assignedLawyer || null,

    nextHearingDate: raw.nextHearingDate || null,
    previousHearingDates: previousDates,
    hearingHistory,

    lastActivityDate: raw.lastActivityDate || null,
    lastUpdatedDate: raw.lastActivityDate || '2026-09-10',
    slaDueDate: raw.slaDueDate || null,
    slaDaysRemaining: sla.daysRemaining,
    slaStatus: sla.slaStatus,
    slaDetails,

    documentStatus: (raw.documentStatus as any) || 'COMPLETE',
    attachedDocuments: [
      { id: 'DOC-01', title: 'আবেদনপত্রের মূল কপি ও হলফনামা', type: 'APPLICATION_FORM', verified: true, date: raw.filingDate },
      { id: 'DOC-02', title: 'আবেদনকারীর জাতীয় পরিচয়পত্র', type: 'NID', verified: raw.documentStatus !== 'MISSING_KEY_DOCUMENT', date: raw.filingDate },
      { id: 'DOC-03', title: 'স্থানীয় ইউপি চেয়ারম্যান কর্তৃক আয়ের প্রত্যয়নপত্র', type: 'INCOME_CERT', verified: raw.documentStatus === 'COMPLETE', date: raw.filingDate }
    ],

    priority: priorityBreakdown.level,
    priorityScore: priorityBreakdown.score,
    priorityBreakdown,

    dataQualityStatus: chrono.dataQualityStatus,
    dataQualityExplanation: chrono.explanationBn,
    isFutureDated: chrono.isFutureDated,
    isChronologyInvalid: chrono.isChronologyInvalid,
    chronologyStatus: chrono.chronologyStatus,
    chronologySteps: chrono.steps,
    chronologyConflictReason: chrono.conflictReason,
    chronologyReviewStatus: 'UNREVIEWED',
    anomalies: chrono.anomalies,

    sourceRecordId: raw.sourceRecordId,
    importBatchId: raw.importBatchId,
    intentionalDemoAnomaly: raw.intentionalDemoAnomaly,
    notes: raw.notes
  };
}

class LegalAidStore {
  private cases: CanonicalCase[] = [];
  private lawyers: CanonicalLawyer[] = [];
  private currentUser: UserSession = { ...DEFAULT_USER };
  private listeners: (() => void)[] = [];

  constructor() {
    this.resetToDefault();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public resetToDefault(): void {
    this.lawyers = CANONICAL_LAWYERS.map(l => ({ ...l }));
    this.cases = CANONICAL_RAW_CASES.map(transformRawToCanonical);
    this.currentUser = { ...DEFAULT_USER };
    this.notify();
  }

  // Getters
  public getCases(): CanonicalCase[] {
    return this.cases;
  }

  public getLawyers(): CanonicalLawyer[] {
    return this.lawyers;
  }

  public getCurrentUser(): UserSession {
    return this.currentUser;
  }

  public setCurrentRole(role: UserRole): void {
    const roleNames: Record<UserRole, { name: string; desig: string }> = {
      CITIZEN: { name: 'মোছা: নাসরিন পারভীন', desig: 'আবেদনকারী (নাগরিক)' },
      LEGAL_AID_OFFICER: { name: 'মো: মোর্শেদ আলম', desig: 'সহকারী জজ ও জেলা লিগ্যাল এইড অফিসার' },
      AUTHORIZED_AUTHORITY: { name: 'জেলা লিগ্যাল এইড কমিটি', desig: 'অনুমোদনকারী কর্তৃপক্ষ' },
      PANEL_LAWYER: { name: 'অ্যাডভোকেট সাদিয়া ইসলাম', desig: 'প্যানেল আইনজীবী (LADCS)' },
      DISTRICT_ADMIN: { name: 'কাজী মিজানুর রহমান', desig: 'জেলা সমন্বয়ক ও তদারককারী' },
      SYSTEM_ADMIN: { name: 'মুহাম্মদ আরেফিন', desig: 'সিস্টেম অ্যাডমিনিস্ট্রেটর' }
    };

    const info = roleNames[role];
    this.currentUser = {
      ...this.currentUser,
      role,
      name: info.name,
      designation: info.desig,
      assignedLawyerId: role === 'PANEL_LAWYER' ? 'LADCS-007' : undefined
    };

    auditLogger.recordEvent({
      userRole: role,
      userName: info.name,
      actionBn: `ভূমিকা পরিবর্তন (${role})`,
      actionCode: 'ROLE_SWITCH',
      recordId: this.currentUser.id,
      targetEntity: 'SYSTEM',
      detailsBn: `ব্যবহারকারীর সক্রিয় ভূমিকা "${info.desig}" হিসেবে নির্বাচিত হয়েছে।`
    });

    this.notify();
  }

  // 1. Citizen / Staff submits a new legal aid application
  public submitApplication(newAppData: {
    applicantName: string;
    gender: string;
    nid: string;
    phone: string;
    district: string;
    upazila: string;
    caseType: string;
    court: string;
    vulnerabilityIndicator: string;
    description: string;
  }): CanonicalCase {
    const count = this.cases.length + 1;
    const pad = String(count).padStart(4, '0');
    const distCode = newAppData.district.slice(0, 3).toUpperCase();
    const caseId = `NLAS-${distCode}-2026-${pad}`;
    const applicationId = `APP-2026-${pad}`;
    const officer = getDistrictOfficer(newAppData.district);

    const newCase: CanonicalCase = {
      caseId,
      applicationId,
      applicantName: newAppData.applicantName,
      beneficiaryNidMasked: `১৯৯০••••${newAppData.nid.slice(-3) || '৭৮৯'}`,
      district: newAppData.district,
      upazila: newAppData.upazila,
      court: newAppData.court,
      caseType: newAppData.caseType,
      legalAidCategory: getLegalAidCategory(newAppData.caseType),
      vulnerabilityIndicator: newAppData.vulnerabilityIndicator || 'None identified',

      applicationDate: SYSTEM_DEMO_DATE_STR,
      filingDate: SYSTEM_DEMO_DATE_STR,
      reviewStartDate: null,
      registrationDate: null,
      lawyerAssignmentDate: null,

      applicationStatus: 'SUBMITTED',
      lifecycleStatus: 'REGISTERED',
      representationStatus: 'UNASSIGNED',
      currentStageBn: 'আবেদন দাখিলকৃত (প্রাথমিক পর্যালোচনার অপেক্ষায়)',

      assignedOfficer: officer.officerName,
      assignedOfficerDesignation: officer.designation,
      assignedLawyerId: null,
      assignedLawyer: null,

      nextHearingDate: null,
      previousHearingDates: [],
      hearingHistory: [],

      lastActivityDate: SYSTEM_DEMO_DATE_STR,
      lastUpdatedDate: SYSTEM_DEMO_DATE_STR,
      slaDueDate: '2026-09-13',
      slaDaysRemaining: 3,
      slaStatus: 'ON_TRACK',

      documentStatus: 'COMPLETE',
      attachedDocuments: [
        { id: `DOC-${pad}-01`, title: 'নাগরিক আবেদনপত্র ও প্রাতিষ্ঠানিক খসড়া', type: 'APPLICATION', verified: false, date: SYSTEM_DEMO_DATE_STR },
        { id: `DOC-${pad}-02`, title: 'জাতীয় পরিচয়পত্রের সত্যায়িত অনুলিপি', type: 'NID', verified: false, date: SYSTEM_DEMO_DATE_STR }
      ],

      priority: 'HIGH',
      priorityScore: 70,
      priorityBreakdown: {
        score: 70,
        level: 'HIGH',
        factors: [{ factor: 'নতুন দাখিলকৃত নাগরিক আবেদন', points: 30, description: 'আবেদনকারীর প্রাথমিক পরীক্ষা আবশ্যক' }]
      },

      dataQualityStatus: 'VALID',
      dataQualityExplanation: 'নতুন দাখিলকৃত তথ্যাবলি বিধিমতে সামঞ্জস্যপূর্ণ',
      isFutureDated: false,
      isChronologyInvalid: false,
      chronologyStatus: 'PASSED',
      chronologySteps: [
        { step: 'APPLICATION', labelBn: 'আবেদন গ্রহণ', date: SYSTEM_DEMO_DATE_STR, status: 'COMPLETED' },
        { step: 'REVIEW', labelBn: 'তথ্য ও যোগ্যতা যাচাই', date: null, status: 'PENDING' },
        { step: 'APPROVAL', labelBn: 'আইনগত সহায়তা অনুমোদন', date: null, status: 'PENDING' },
        { step: 'ASSIGNMENT', labelBn: 'আইনজীবী নিয়োগ', date: null, status: 'PENDING' },
        { step: 'REGISTRATION', labelBn: 'মামলা নিবন্ধন ও কার্যধারা', date: null, status: 'PENDING' },
        { step: 'HEARING', labelBn: 'আদালতে শুনানি', date: null, status: 'PENDING' },
        { step: 'DISPOSAL', labelBn: 'মামলা নিষ্পত্তি / বন্ধ', date: null, status: 'PENDING' }
      ],
      anomalies: [],
      sourceRecordId: `SRC-${pad}`,
      importBatchId: 'DIRECT-PORTAL-INTAKE',
      intentionalDemoAnomaly: '',
      notes: newAppData.description
    };

    this.cases.unshift(newCase);

    auditLogger.recordEvent({
      userRole: this.currentUser.role,
      userName: this.currentUser.name,
      actionBn: 'নতুন আইনগত সহায়তা আবেদন দাখিল',
      actionCode: 'SUBMIT_APPLICATION',
      recordId: applicationId,
      targetEntity: 'APPLICATION',
      previousState: 'NONE',
      newState: 'SUBMITTED',
      detailsBn: `আবেদনকারী: ${newCase.applicantName} • জেলা: ${newCase.district} • বিষয়: ${newCase.caseType}`
    });

    this.notify();
    return newCase;
  }

  // 2. Legal Aid Officer verifies documents and records assessment
  public verifyApplicationDocuments(caseId: string, notes: string): void {
    const c = this.cases.find(item => item.caseId === caseId);
    if (!c) return;

    c.applicationStatus = 'VERIFIED';
    c.reviewStartDate = SYSTEM_DEMO_DATE_STR;
    c.currentStageBn = 'তথ্য ও নথি যাচাই সম্পন্ন';
    if (c.attachedDocuments) {
      for (const d of c.attachedDocuments) d.verified = true;
    }

    auditLogger.recordEvent({
      userRole: this.currentUser.role,
      userName: this.currentUser.name,
      actionBn: 'তথ্য ও নথিপত্র যাচাই সম্পন্ন',
      actionCode: 'VERIFY_DOCUMENTS',
      recordId: c.applicationId,
      targetEntity: 'APPLICATION',
      previousState: 'SUBMITTED',
      newState: 'VERIFIED',
      detailsBn: `কর্মকর্তার মন্তব্য: ${notes || 'নথিপত্র নির্ভরযোগ্য প্রমাণিত হয়েছে।'}`
    });

    this.notify();
  }

  // 3. Legal Aid Officer recommends decision to District Committee/Authority
  public recommendEligibility(caseId: string, recommendation: 'APPROVE' | 'REJECT', notes: string): void {
    const c = this.cases.find(item => item.caseId === caseId);
    if (!c) return;

    c.applicationStatus = 'RECOMMENDED';
    c.currentStageBn = `কমিটিতে অনুমোদনের জন্য সুপারিশ পেশ (${recommendation === 'APPROVE' ? 'অনুমোদনের পক্ষে' : 'প্রত্যাখ্যানের পক্ষে'})`;

    auditLogger.recordEvent({
      userRole: this.currentUser.role,
      userName: this.currentUser.name,
      actionBn: 'অনুমোদনের জন্য সুপারিশ দাখিল',
      actionCode: 'RECOMMEND_DECISION',
      recordId: c.applicationId,
      targetEntity: 'APPLICATION',
      previousState: 'VERIFIED',
      newState: 'RECOMMENDED',
      detailsBn: `সুপারিশ: ${recommendation === 'APPROVE' ? 'আইনগত সহায়তা প্রদান যুক্তিযুক্ত' : 'বিধি অনুযায়ী অপাত্রে সহায়তা নিরুৎসাহিত'} • মন্তব্য: ${notes}`
    });

    this.notify();
  }

  // 4. Authorized Authority approves citizen legal-aid eligibility
  public approveEligibility(caseId: string, authorityNotes: string): void {
    const c = this.cases.find(item => item.caseId === caseId);
    if (!c) return;

    c.applicationStatus = 'APPROVED';
    c.registrationDate = SYSTEM_DEMO_DATE_STR;
    c.currentStageBn = 'আইনগত সহায়তা অনুমোদিত (আইনজীবী নিয়োগ অপেক্ষমাণ)';
    c.lifecycleStatus = 'REGISTERED';

    auditLogger.recordEvent({
      userRole: this.currentUser.role,
      userName: this.currentUser.name,
      actionBn: 'আইনগত সহায়তা অনুমোদন',
      actionCode: 'APPROVE_ELIGIBILITY',
      recordId: c.applicationId,
      targetEntity: 'APPLICATION',
      previousState: 'RECOMMENDED',
      newState: 'APPROVED',
      detailsBn: `অনুমোদনকারী কর্তৃপক্ষের সিদ্ধান্ত: ${authorityNotes || 'আবেদনকারী আইনগত সহায়তা বিধিমালার শর্ত পূরণ করেছেন।'}`
    });

    this.notify();
  }

  // 5. Authorized Authority rejects eligibility
  public rejectEligibility(caseId: string, rejectionReason: string): void {
    const c = this.cases.find(item => item.caseId === caseId);
    if (!c) return;

    c.applicationStatus = 'REJECTED';
    c.lifecycleStatus = 'CLOSED';
    c.currentStageBn = 'আইনগত সহায়তা প্রাপ্তির আবেদন প্রত্যাখ্যাত';

    auditLogger.recordEvent({
      userRole: this.currentUser.role,
      userName: this.currentUser.name,
      actionBn: 'আইনগত সহায়তা প্রত্যাখ্যান',
      actionCode: 'REJECT_ELIGIBILITY',
      recordId: c.applicationId,
      targetEntity: 'APPLICATION',
      previousState: 'RECOMMENDED',
      newState: 'REJECTED',
      detailsBn: `প্রত্যাখ্যানের কারণ: ${rejectionReason || 'আইনগত সহায়তা নীতিমালা ২০২৪ অনুসারে বার্ষিক আয় সীমা অতিক্রম করায় অপাত্র বিবেচিত।'}`
    });

    this.notify();
  }

  // 6. Authorized Authority assigns a panel lawyer
  public assignPanelLawyer(caseId: string, lawyerId: string, notes: string): void {
    const c = this.cases.find(item => item.caseId === caseId);
    const lawyer = this.lawyers.find(l => l.lawyerId === lawyerId);
    if (!c || !lawyer) return;

    const prevLawyerName = c.assignedLawyer || 'অনিযুক্ত';
    c.assignedLawyerId = lawyer.lawyerId;
    c.assignedLawyer = lawyer.lawyerName;
    c.lawyerAssignmentDate = SYSTEM_DEMO_DATE_STR;
    c.representationStatus = 'ASSIGNED';
    c.currentStageBn = `আইনজীবী (${lawyer.lawyerName}) মনোনীত (নিয়োগ গ্রহণ অপেক্ষমাণ)`;
    c.lifecycleStatus = 'ONGOING';

    lawyer.activeCases++;
    lawyer.utilization = Math.round((lawyer.activeCases / lawyer.capacity) * 100);
    if (lawyer.utilization >= 100) lawyer.workloadStatus = 'OVERLOADED';
    else if (lawyer.utilization >= 80) lawyer.workloadStatus = 'NEAR_CAPACITY';

    auditLogger.recordEvent({
      userRole: this.currentUser.role,
      userName: this.currentUser.name,
      actionBn: 'প্যানেল আইনজীবী নিয়োগ অনুমোদন',
      actionCode: 'ASSIGN_LAWYER',
      recordId: c.caseId,
      targetEntity: 'CASE',
      previousState: prevLawyerName,
      newState: lawyer.lawyerName,
      detailsBn: `মনোনীত আইনজীবী: ${lawyer.lawyerName} (${lawyer.barCouncilId}) • জেলা: ${lawyer.district} • উদ্দেশ্য: ${notes || 'বিচারিক প্রতিনিধিত্ব'}`
    });

    this.notify();
  }

  // 7. Panel Lawyer accepts assignment
  public lawyerAcceptAssignment(caseId: string): void {
    const c = this.cases.find(item => item.caseId === caseId);
    if (!c) return;

    c.representationStatus = 'ACCEPTED_BY_LAWYER';
    c.lawyerAcceptanceDate = SYSTEM_DEMO_DATE_STR;
    c.currentStageBn = 'আইনজীবী কর্তৃক নিয়োগ গৃহীত ও প্রতিনিধিত্ব কার্যকর';

    auditLogger.recordEvent({
      userRole: this.currentUser.role,
      userName: this.currentUser.name,
      actionBn: 'আইনজীবী কর্তৃক দায়িত্ব গ্রহণ',
      actionCode: 'ACCEPT_ASSIGNMENT',
      recordId: c.caseId,
      targetEntity: 'CASE',
      previousState: 'ASSIGNED',
      newState: 'ACCEPTED_BY_LAWYER',
      detailsBn: `অ্যাডভোকেট ${c.assignedLawyer} আনুষ্ঠানিকভাবে মামলার ওকালতনামা ও দায়িত্ব গ্রহণ করেছেন।`
    });

    this.notify();
  }

  // 8. Panel Lawyer updates hearing or submits progress
  public updateCaseHearing(caseId: string, nextDate: string, outcome: string, purpose: string): void {
    const c = this.cases.find(item => item.caseId === caseId);
    if (!c) return;

    const previousNextDate = c.nextHearingDate;
    c.nextHearingDate = nextDate;
    c.lastActivityDate = SYSTEM_DEMO_DATE_STR;
    c.currentStageBn = `শুনানি কার্যক্রম সম্পন্ন (পরবর্তী তারিখ: ${formatToDisplayDate(nextDate)})`;

    c.hearingHistory.unshift({
      date: SYSTEM_DEMO_DATE_STR,
      benchCourt: c.court,
      purpose: purpose || 'আদালতে সাক্ষ্যগ্রহণ ও সওয়াল-জবাব',
      outcome: outcome || 'শুনানি সম্পন্ন, পরবর্তী কার্যদিবস ধার্য',
      nextDate,
      recordedBy: this.currentUser.name,
      recordedAt: SYSTEM_DEMO_DATE_STR
    });

    auditLogger.recordEvent({
      userRole: this.currentUser.role,
      userName: this.currentUser.name,
      actionBn: 'শুনানির কার্যবিবরণী ও অগ্রগতি দাখিল',
      actionCode: 'UPDATE_HEARING',
      recordId: c.caseId,
      targetEntity: 'CASE',
      previousState: previousNextDate ? formatToDisplayDate(previousNextDate) : 'অনির্ধারিত',
      newState: formatToDisplayDate(nextDate),
      detailsBn: `আদালত: ${c.court} • ফলাফল: ${outcome || 'সন্তোষজনক অগ্রগতি'}`
    });

    this.notify();
  }

  // 9. Officer marks anomaly as reviewed
  public reviewChronologyAnomaly(caseId: string, status: 'REVIEWED' | 'CORRECTION_NEEDED' | 'VERIFIED_WITH_SOURCE', note: string): void {
    const c = this.cases.find(item => item.caseId === caseId);
    if (!c) return;

    c.chronologyReviewStatus = status;
    const label = status === 'REVIEWED' ? 'পর্যালোচনা সম্পন্ন' : status === 'CORRECTION_NEEDED' ? 'সংশোধন প্রয়োজন' : 'উৎস নথির সাথে যাচাই করা হয়েছে';

    auditLogger.recordEvent({
      userRole: this.currentUser.role,
      userName: this.currentUser.name,
      actionBn: 'তথ্যের অসঙ্গতি নিরীক্ষা নিষ্পত্তি',
      actionCode: 'RESOLVE_ANOMALY',
      recordId: c.caseId,
      targetEntity: 'CASE',
      previousState: 'UNREVIEWED',
      newState: status,
      detailsBn: `নিরীক্ষা সিদ্ধান্ত: "${label}" • কর্মকর্তার মন্তব্য: ${note || 'আদালতের উৎস রেজিস্টারের সাথে ক্রস-ম্যাচ সম্পন্ন।'}`
    });

    this.notify();
  }

  // 10. Panel Lawyer declines assignment with valid reason
  public lawyerDeclineAssignment(caseId: string, reason: string): void {
    const c = this.cases.find(item => item.caseId === caseId);
    if (!c) return;

    const lawyerName = c.assignedLawyer || 'আইনজীবী';
    const lawyer = this.lawyers.find(l => l.lawyerId === c.assignedLawyerId);
    if (lawyer && lawyer.activeCases > 0) {
      lawyer.activeCases--;
      lawyer.utilization = Math.round((lawyer.activeCases / lawyer.capacity) * 100);
      if (lawyer.utilization >= 100) lawyer.workloadStatus = 'OVERLOADED';
      else if (lawyer.utilization >= 80) lawyer.workloadStatus = 'NEAR_CAPACITY';
      else lawyer.workloadStatus = 'AVAILABLE';
    }

    c.assignedLawyerId = null;
    c.assignedLawyer = null;
    c.representationStatus = 'REASSIGNMENT_REQUESTED';
    c.currentStageBn = 'আইনজীবী অপারগতা প্রকাশ করেছেন (পুনঃনিয়োগ অপেক্ষমাণ)';

    auditLogger.recordEvent({
      userRole: this.currentUser.role,
      userName: this.currentUser.name,
      actionBn: 'আইনজীবী কর্তৃক দায়িত্ব গ্রহণে অপারগতা প্রকাশ',
      actionCode: 'DECLINE_ASSIGNMENT',
      recordId: c.caseId,
      targetEntity: 'CASE',
      previousState: lawyerName,
      newState: 'UNASSIGNED',
      detailsBn: `অপারগতার কারণ: "${reason || 'পেশাগত স্বার্থের দ্বন্দ্ব / অতিরিক্ত কার্যভার'}" • DLAO কর্তৃক পুনঃনিয়োগের সুপারিশ প্রযোজ্য।`
    });

    this.notify();
  }

  // 11. Add Case Progress Note
  public addCaseProgressNote(caseId: string, content: string): void {
    const c = this.cases.find(item => item.caseId === caseId);
    if (!c) return;

    if (!c.caseNotes) {
      c.caseNotes = [];
    }

    c.caseNotes.unshift({
      id: `NOTE-${Date.now()}`,
      authorName: this.currentUser.name,
      authorRole: this.currentUser.role,
      date: SYSTEM_DEMO_DATE_STR,
      content
    });

    c.lastActivityDate = SYSTEM_DEMO_DATE_STR;

    auditLogger.recordEvent({
      userRole: this.currentUser.role,
      userName: this.currentUser.name,
      actionBn: 'মামলার অগ্রগতি নোট সংযোজন',
      actionCode: 'ADD_CASE_NOTE',
      recordId: c.caseId,
      targetEntity: 'CASE',
      detailsBn: `নোট: ${content.length > 80 ? content.substring(0, 80) + '...' : content}`
    });

    this.notify();
  }

  // Role-Specific Fast Queues (Clean Workflow Architecture)
  public getApplicantCases(searchQuery?: string): CanonicalCase[] {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) {
      // Default to demo citizen's cases (e.g. Nasrin Parvin or recently submitted applications)
      return this.cases.filter(
        c => c.applicantName.toLowerCase().includes('nasrin') || c.caseId.includes('0001') || c.importBatchId === 'DIRECT-PORTAL-INTAKE'
      );
    }
    return this.cases.filter(
      c =>
        c.caseId.toLowerCase().includes(q) ||
        c.applicantName.toLowerCase().includes(q) ||
        (c.applicationId && c.applicationId.toLowerCase().includes(q))
    );
  }

  public getOfficerTodayActionQueue(district?: string): {
    newApplications: CanonicalCase[];
    awaitingEligibility: CanonicalCase[];
    awaitingLawyer: CanonicalCase[];
    upcomingHearings7Days: CanonicalCase[];
    overdueSlaCases: CanonicalCase[];
    dataAnomalies: CanonicalCase[];
  } {
    const pool = district ? this.cases.filter(c => c.district.toLowerCase() === district.toLowerCase()) : this.cases;

    const newApplications = pool.filter(c => c.applicationStatus === 'SUBMITTED');
    const awaitingEligibility = pool.filter(c => c.applicationStatus === 'UNDER_REVIEW' || c.applicationStatus === 'VERIFIED');
    const awaitingLawyer = pool.filter(c => c.applicationStatus === 'APPROVED' && (!c.assignedLawyerId || c.representationStatus === 'UNASSIGNED' || c.representationStatus === 'REASSIGNMENT_REQUESTED'));

    const upcomingHearings7Days = pool.filter(c => {
      if (!c.nextHearingDate || c.lifecycleStatus === 'CLOSED' || c.lifecycleStatus === 'RESOLVED') return false;
      const d = parseDateSafe(c.nextHearingDate);
      if (!d) return false;
      const diffDays = (d.getTime() - SYSTEM_DEMO_DATE.getTime()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    });

    const overdueSlaCases = pool.filter(c => c.slaStatus === 'EXPIRED');
    const dataAnomalies = pool.filter(c => c.dataQualityStatus === 'DATA_QUALITY_ANOMALY');

    return {
      newApplications,
      awaitingEligibility,
      awaitingLawyer,
      upcomingHearings7Days,
      overdueSlaCases,
      dataAnomalies
    };
  }

  public getLawyerCaseload(lawyerId: string): {
    pendingAssignments: CanonicalCase[];
    activeCases: CanonicalCase[];
    upcomingHearings: CanonicalCase[];
    needsProgressUpdate: CanonicalCase[];
  } {
    // If lawyerId is provided, match that lawyer, or fallback to first active panel lawyer
    const targetLawyer = this.lawyers.find(l => l.lawyerId === lawyerId) || this.lawyers[0];
    const targetId = targetLawyer.lawyerId;
    const targetName = targetLawyer.lawyerName;

    const assigned = this.cases.filter(
      c => c.assignedLawyerId === targetId || (c.assignedLawyer && c.assignedLawyer.toLowerCase() === targetName.toLowerCase())
    );

    const pendingAssignments = assigned.filter(c => c.representationStatus === 'ASSIGNED');
    const activeCases = assigned.filter(c => c.representationStatus === 'ACCEPTED_BY_LAWYER');

    const upcomingHearings = activeCases.filter(c => {
      if (!c.nextHearingDate) return false;
      const d = parseDateSafe(c.nextHearingDate);
      return d !== null && d >= SYSTEM_DEMO_DATE;
    });

    const needsProgressUpdate = activeCases.filter(c => {
      if (!c.lastActivityDate) return true;
      const d = parseDateSafe(c.lastActivityDate);
      if (!d) return true;
      const daysSince = (SYSTEM_DEMO_DATE.getTime() - d.getTime()) / (1000 * 3600 * 24);
      return daysSince > 20;
    });

    return {
      pendingAssignments,
      activeCases,
      upcomingHearings,
      needsProgressUpdate
    };
  }

  public getSupervisorWorkload(): {
    overdueCases: CanonicalCase[];
    chronologyConflicts: CanonicalCase[];
    unassignedApproved: CanonicalCase[];
    highPriorityActive: CanonicalCase[];
  } {
    return {
      overdueCases: this.cases.filter(c => c.slaStatus === 'EXPIRED'),
      chronologyConflicts: this.cases.filter(c => c.dataQualityStatus === 'DATA_QUALITY_ANOMALY'),
      unassignedApproved: this.cases.filter(c => c.applicationStatus === 'APPROVED' && !c.assignedLawyerId),
      highPriorityActive: this.cases.filter(c => (c.priority === 'CRITICAL' || c.priority === 'HIGH') && c.lifecycleStatus !== 'CLOSED' && c.lifecycleStatus !== 'RESOLVED')
    };
  }

  // Aggregations & Metrics (Strict 100% Reconciliation)
  public getQualityReport(): DatasetQualityReport {
    return auditDatasetQuality(this.cases, this.lawyers);
  }

  public getDistrictMetrics(): DistrictMetricSummary[] {
    return PILOT_DISTRICT_NAMES.map(distName => {
      const distInfo = CANONICAL_DISTRICTS.find(d => d.nameEn === distName)!;
      const officer = getDistrictOfficer(distName);
      const distCases = this.cases.filter(c => c.district.toLowerCase() === distName.toLowerCase());

      const pendingReview = distCases.filter(c => c.applicationStatus === 'SUBMITTED' || c.applicationStatus === 'UNDER_REVIEW').length;
      const approvedApplications = distCases.filter(c => c.applicationStatus === 'APPROVED').length;
      const rejectedApplications = distCases.filter(c => c.applicationStatus === 'REJECTED').length;
      const activeCases = distCases.filter(c => c.lifecycleStatus !== 'CLOSED' && c.lifecycleStatus !== 'RESOLVED').length;
      const upcomingHearings = distCases.filter(c => c.nextHearingDate && c.lifecycleStatus !== 'CLOSED' && c.lifecycleStatus !== 'RESOLVED').length;
      const resolvedCases = distCases.filter(c => c.lifecycleStatus === 'RESOLVED' || c.lifecycleStatus === 'CLOSED').length;
      const slaBreaches = distCases.filter(c => c.slaStatus === 'EXPIRED').length;
      const dataAnomaliesCount = distCases.filter(c => c.dataQualityStatus === 'DATA_QUALITY_ANOMALY').length;
      const assignedLawyersCount = this.lawyers.filter(l => l.district.toLowerCase() === distName.toLowerCase()).length;

      return {
        districtName: distName,
        districtNameBn: distInfo.nameBn,
        dlaoName: officer.officerName,
        dlaoPhone: officer.phone,
        totalApplications: distCases.length,
        pendingReview,
        approvedApplications,
        rejectedApplications,
        totalCases: distCases.length,
        activeCases,
        upcomingHearings,
        resolvedCases,
        slaBreaches,
        dataAnomaliesCount,
        assignedLawyersCount
      };
    });
  }
}

export const legalAidStore = new LegalAidStore();
