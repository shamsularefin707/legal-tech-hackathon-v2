/**
 * জাতীয় আইনগত সহায়তা কার্যক্রম ব্যবস্থাপনা (NLASO Platform)
 * Authoritative Canonical Types for Bangladesh Digital Justice Operations
 */

// 1. Roles & Access Control
export type UserRole =
  | 'CITIZEN'                // আবেদনকারী / নাগরিক
  | 'LEGAL_AID_OFFICER'     // আইনগত সহায়তা কর্মকর্তা (Case Officer / DLAO)
  | 'AUTHORIZED_AUTHORITY'  // জেলা লিগ্যাল এইড কমিটি / ক্ষমতাপ্রাপ্ত কর্তৃপক্ষ (Authority)
  | 'PANEL_LAWYER'          // প্যানেল আইনজীবী (LADCS Counsel)
  | 'DISTRICT_ADMIN'        // জেলা / জাতীয় সমন্বয়ক (Administrator)
  | 'SYSTEM_ADMIN';         // সিস্টেম অ্যাডমিনিস্ট্রেটর

export interface UserSession {
  id: string;
  name: string;
  designation: string;
  role: UserRole;
  district: string;
  assignedLawyerId?: string; // If PANEL_LAWYER
  email: string;
  phone: string;
  active: boolean;
}

// 2. Clear Separation: Application Lifecycle vs. Court Case Lifecycle
export type ApplicationStatus =
  | 'SUBMITTED'             // দাখিলকৃত (নাগরিক বা স্টাফ কর্তৃক আবেদন গৃহীত)
  | 'UNDER_REVIEW'          // পর্যালোচনাধীন (আইনগত সহায়তা কর্মকর্তা পরীক্ষা করছেন)
  | 'VERIFIED'              // তথ্য ও নথি যাচাইকৃত (Verification Complete)
  | 'RECOMMENDED'           // অনুমোদনের সুপারিশকৃত (Officer Recommended)
  | 'APPROVED'              // আইনগত সহায়তা অনুমোদিত (Authority Approved)
  | 'REJECTED';             // আইনগত সহায়তা প্রত্যাখ্যাত (Authority Rejected)

export type CaseLifecycleStatus =
  | 'REGISTERED'            // বিধিসম্মতভাবে নিবন্ধিত
  | 'ONGOING'               // চলমান বিচারিক কার্যক্রম
  | 'AWAITING_RESOLUTION'   // নিষ্পত্তির অপেক্ষায় (রায় / এডিআর সমাধান পর্ব)
  | 'RESOLVED'              // নিষ্পত্তি সম্পন্ন
  | 'CLOSED';               // নথি সংরক্ষিত ও সমাপ্ত

export type RepresentationStatus =
  | 'UNASSIGNED'            // আইনজীবী অনিযুক্ত
  | 'ASSIGNED'              // আইনজীবী মনোনীত (কর্তৃপক্ষ কর্তৃক নিয়োগ প্রদান)
  | 'ACCEPTED_BY_LAWYER'    // আইনজীবী নিয়োগ গ্রহণ করেছেন (Counsel Accepted)
  | 'REASSIGNMENT_REQUESTED';// আইনজীবী পরিবর্তন অনুরোধ

// 3. Chronology & Data Quality
export type ChronologyStatus = 'PASSED' | 'WARNING' | 'FAILED';

export type DataQualityStatus =
  | 'VALID'                 // বৈধ ও নির্ভরযোগ্য
  | 'WARNING'               // সতর্কবার্তা (যেমন: ভবিষ্যত-তারিখযুক্ত রেকর্ড)
  | 'DATA_QUALITY_ANOMALY'; // তথ্যের অসঙ্গতি (যেমন: ফাইলিংয়ের আগে শুনানি)

export type AnomalySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';

export type AnomalyType =
  | 'CHRONOLOGY_CONFLICT'   // কালানুক্রমিক অসংগতি
  | 'FUTURE_DATED'          // ভবিষ্যত-তারিখযুক্ত রেকর্ড
  | 'MISSING_REQUIRED_FIELD'// আবশ্যকীয় তথ্য অনুপস্থিত
  | 'INVALID_DISTRICT'      // অননুমোদিত পাইলট জেলা
  | 'INVALID_TRANSITION'    // বিধিবহির্ভূত স্ট্যাটাস পরিবর্তন
  | 'LAWYER_OVERLOAD'       // আইনজীবীর অতিরিক্ত কর্মভার
  | 'SLA_CALCULATION_ERROR';// এসএলএ পরিগণনায় অসঙ্গতি

export interface AnomalyItem {
  id: string;
  caseId: string;
  field: string;
  severity: AnomalySeverity;
  type: AnomalyType;
  problemBn: string;
  whyItMattersBn: string;
  recommendedActionBn: string;
  detectedAt: string;
}

export interface ChronologyStep {
  step: 'APPLICATION' | 'REVIEW' | 'APPROVAL' | 'ASSIGNMENT' | 'REGISTRATION' | 'HEARING' | 'DISPOSAL';
  labelBn: string;
  date: string | null;
  status: 'COMPLETED' | 'PENDING' | 'CONFLICT' | 'SKIPPED';
  conflictReason?: string;
}

// 4. SLA Monitoring
export type SlaStatus =
  | 'ON_TRACK'              // সময়সীমা স্বাভাবিক
  | 'DUE_SOON'              // সময়সীমা আসন্ন (৭ দিনের মধ্যে)
  | 'EXPIRED'               // সময়সীমা অতিক্রান্ত
  | 'NOT_APPLICABLE'        // প্রযোজ্য নয় (নিষ্পত্তিকৃত)
  | 'DATA_QUALITY_ISSUE';   // তথ্যের অসঙ্গতির কারণে অনির্ধারিত

export type SlaStageType =
  | 'APPLICATION_REVIEW'    // আবেদন পর্যালোচনা (৩ কার্যদিবস)
  | 'ELIGIBILITY_DECISION'  // যোগ্যতা যাচাই ও কমিটির সিদ্ধান্ত (৭ কার্যদিবস)
  | 'LAWYER_ASSIGNMENT'     // আইনজীবী নিয়োগ ও গ্রহণ (৫ কার্যদিবস)
  | 'HEARING_UPDATE'        // শুনানির কার্যবিবরণী হালনাগাদ (৩ কার্যদিবস)
  | 'CASE_PROGRESS';        // মামলার সামগ্রিক অগ্রগতি

export interface SlaDetail {
  stage: SlaStageType;
  stageNameBn: string;
  startDate: string;
  dueDate: string;
  daysRemaining: number;
  status: SlaStatus;
  thresholdDays: number;
}

// 5. Case Priority Model
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PriorityFactor {
  factor: string;
  points: number;
  description: string;
}

export interface PriorityBreakdown {
  score: number; // 0 - 100
  level: PriorityLevel;
  factors: PriorityFactor[];
  officerOverridden?: boolean;
  overrideReason?: string;
  overriddenBy?: string;
}

// 6. Panel Lawyers
export type LawyerAvailability = 'Available' | 'Limited' | 'On Leave' | 'Suspended';
export type LawyerStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
export type LawyerWorkloadStatus = 'AVAILABLE' | 'NEAR_CAPACITY' | 'OVERLOADED' | 'UNAVAILABLE';

export interface CanonicalLawyer {
  lawyerId: string;
  lawyerName: string;
  barCouncilId: string;
  gender: string;
  district: string;
  specialization: string;
  phone: string;
  email: string;
  activeCases: number;
  capacity: number;
  utilization: number;
  workloadStatus: LawyerWorkloadStatus;
  availability: LawyerAvailability;
  yearsExperience: number;
  status: LawyerStatus;
  notes?: string;
}

// 7. Case Entity (Single Source of Truth)
export interface HearingEvent {
  date: string;
  benchCourt: string;
  purpose: string;
  outcome?: string;
  nextDate?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface CanonicalCase {
  caseId: string;
  applicationId: string;
  applicantName: string;
  beneficiaryNidMasked?: string;
  district: string;
  upazila: string;
  court: string;
  caseType: string;
  legalAidCategory: string;
  vulnerabilityIndicator: string;

  // Dates
  applicationDate: string;
  filingDate: string | null;
  reviewStartDate: string | null;
  registrationDate: string | null;
  lawyerAssignmentDate: string | null;
  lawyerAcceptanceDate?: string | null;

  // Distinct Lifecycles
  applicationStatus: ApplicationStatus;
  lifecycleStatus: CaseLifecycleStatus;
  representationStatus: RepresentationStatus;
  currentStageBn: string;

  // Personnel
  assignedOfficer: string;
  assignedOfficerDesignation: string;
  assignedLawyerId: string | null;
  assignedLawyer: string | null;

  // Hearing History
  nextHearingDate: string | null;
  previousHearingDates: string[];
  hearingHistory: HearingEvent[];

  // SLA & Temporal
  lastActivityDate: string | null;
  lastUpdatedDate: string | null;
  slaDueDate: string | null;
  slaDaysRemaining: number | null;
  slaStatus: SlaStatus;
  slaDetails?: SlaDetail[];

  // Documents
  documentStatus: 'COMPLETE' | 'PARTIAL' | 'MISSING_KEY_DOCUMENT';
  attachedDocuments?: { id: string; title: string; type: string; verified: boolean; date: string }[];

  // Priority
  priority: PriorityLevel;
  priorityScore: number;
  priorityBreakdown: PriorityBreakdown;

  // Chronology & Quality
  dataQualityStatus: DataQualityStatus;
  dataQualityExplanation?: string;
  isFutureDated: boolean;
  isChronologyInvalid: boolean;
  chronologyStatus: ChronologyStatus;
  chronologySteps: ChronologyStep[];
  chronologyConflictReason?: string;
  chronologyReviewStatus?: 'UNREVIEWED' | 'REVIEWED' | 'CORRECTION_NEEDED' | 'VERIFIED_WITH_SOURCE';
  anomalies: AnomalyItem[];

  // Case Notes & Progress
  caseNotes?: CaseNote[];

  // Source Lineage
  sourceRecordId: string;
  importBatchId: string;
  intentionalDemoAnomaly: string;
  notes: string;
}

export interface CaseNote {
  id: string;
  authorName: string;
  authorRole: UserRole;
  date: string;
  content: string;
  isPrivate?: boolean;
}

// 8. Audit Trail
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userRole: UserRole;
  userName: string;
  actionBn: string;
  actionCode: string;
  recordId: string;
  targetEntity: 'APPLICATION' | 'CASE' | 'LAWYER' | 'SYSTEM' | 'SECURITY';
  previousState?: string;
  newState?: string;
  detailsBn: string;
  ipAddress?: string;
}

// 9. District Statistics
export interface DistrictMetricSummary {
  districtName: string;
  districtNameBn: string;
  dlaoName: string;
  dlaoPhone: string;
  totalApplications: number;
  pendingReview: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalCases: number;
  activeCases: number;
  upcomingHearings: number;
  resolvedCases: number;
  slaBreaches: number;
  dataAnomaliesCount: number;
  assignedLawyersCount: number;
}
