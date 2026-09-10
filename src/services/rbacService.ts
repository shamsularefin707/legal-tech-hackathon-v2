/**
 * ভূমিকা ও অনুমতি ভিত্তিক প্রবেশাধিকার নিয়ন্ত্রণ (Role-Based Access Control)
 * Strict separation of duties for Bangladesh Legal Aid Operations
 */

import { UserRole } from '../types/legalAid';

export type PermissionAction =
  | 'VIEW_DASHBOARD'
  | 'VIEW_APPLICATIONS'
  | 'SUBMIT_APPLICATION'
  | 'REVIEW_APPLICATION'
  | 'VERIFY_DOCUMENTS'
  | 'RECOMMEND_DECISION'
  | 'APPROVE_ELIGIBILITY'    // ONLY Authorized Authority
  | 'REJECT_ELIGIBILITY'     // ONLY Authorized Authority
  | 'ASSIGN_LAWYER'           // ONLY Authorized Authority / Committee
  | 'ACCEPT_ASSIGNMENT'       // Panel Lawyer
  | 'DECLINE_ASSIGNMENT'      // Panel Lawyer
  | 'UPDATE_HEARING'          // Panel Lawyer & Bench Officer
  | 'SUBMIT_CASE_PROGRESS'    // Panel Lawyer
  | 'ADD_CASE_NOTE'
  | 'VIEW_CASES'
  | 'VIEW_ATTENTION_QUEUE'
  | 'VIEW_DISTRICT_MONITORING'
  | 'VIEW_SLA_MONITORING'
  | 'VIEW_DATA_QUALITY_AUDIT'
  | 'RESOLVE_ANOMALY'
  | 'VIEW_AUDIT_LOG'
  | 'MANAGE_USERS'
  | 'SYSTEM_CONFIG';

export interface RoleConfig {
  role: UserRole;
  nameBn: string;
  nameEn: string;
  designationBn: string;
  badgeBg: string;
  badgeText: string;
  permissions: PermissionAction[];
  descriptionBn: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  CITIZEN: {
    role: 'CITIZEN',
    nameBn: 'নাগরিক / আবেদনকারী',
    nameEn: 'Applicant / Citizen',
    designationBn: 'আইনগত সহায়তা প্রার্থী',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    descriptionBn: 'নতুন আইনগত সহায়তা আবেদন দাখিল, আবেদনের সার্বিক অবস্থা তদারকি ও নোটিফিকেশন গ্রহণ।',
    permissions: [
      'VIEW_DASHBOARD',
      'SUBMIT_APPLICATION',
      'VIEW_APPLICATIONS'
    ]
  },
  LEGAL_AID_OFFICER: {
    role: 'LEGAL_AID_OFFICER',
    nameBn: 'আইনগত সহায়তা কর্মকর্তা (DLAO)',
    nameEn: 'Legal Aid Officer / DLAO',
    designationBn: 'সহকারী জজ ও জেলা লিগ্যাল এইড অফিসার',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800',
    badgeText: 'text-blue-800 dark:text-blue-300',
    descriptionBn: 'আবেদন পর্যালোচনা, জাতীয় পরিচয়পত্র ও নথি যাচাই, প্রাথমিক মূল্যায়ন এবং কমিটির কাছে অনুমোদনের সুপারিশ পেশ।',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_APPLICATIONS',
      'SUBMIT_APPLICATION',
      'REVIEW_APPLICATION',
      'VERIFY_DOCUMENTS',
      'RECOMMEND_DECISION',
      'ADD_CASE_NOTE',
      'VIEW_CASES',
      'VIEW_ATTENTION_QUEUE',
      'VIEW_DISTRICT_MONITORING',
      'VIEW_SLA_MONITORING',
      'VIEW_DATA_QUALITY_AUDIT',
      'RESOLVE_ANOMALY',
      'VIEW_AUDIT_LOG'
    ]
  },
  AUTHORIZED_AUTHORITY: {
    role: 'AUTHORIZED_AUTHORITY',
    nameBn: 'অনুমোদনকারী কর্তৃপক্ষ (কমিটি)',
    nameEn: 'District Authority / Committee',
    designationBn: 'জেলা লিগ্যাল এইড কমিটি ও ক্ষমতাপ্রাপ্ত কর্তৃপক্ষ',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800',
    badgeText: 'text-amber-800 dark:text-amber-300',
    descriptionBn: 'কর্মকর্তার সুপারিশ পর্যালোচনা করে চূড়ান্ত আইনগত সহায়তা অনুমোদন/প্রত্যাখ্যান এবং প্যানেল আইনজীবী নিয়োগ অনুমোদন।',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_APPLICATIONS',
      'REVIEW_APPLICATION',
      'APPROVE_ELIGIBILITY',
      'REJECT_ELIGIBILITY',
      'ASSIGN_LAWYER',
      'ADD_CASE_NOTE',
      'VIEW_CASES',
      'VIEW_ATTENTION_QUEUE',
      'VIEW_DISTRICT_MONITORING',
      'VIEW_SLA_MONITORING',
      'VIEW_DATA_QUALITY_AUDIT',
      'RESOLVE_ANOMALY',
      'VIEW_AUDIT_LOG'
    ]
  },
  PANEL_LAWYER: {
    role: 'PANEL_LAWYER',
    nameBn: 'প্যানেল আইনজীবী (LADCS)',
    nameEn: 'Panel Lawyer / Legal Aid Counsel',
    designationBn: 'নিয়োজিত প্যানেল আইনজীবী',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800',
    badgeText: 'text-purple-800 dark:text-purple-300',
    descriptionBn: 'নিয়োগ গ্রহণ, আদালতে মামলার প্রতিনিধিত্ব, শুনানির ফলাফল লিপিবদ্ধকরণ এবং মামলার অগ্রগতি দাখিল (যোগ্যতা অনুমোদন ক্ষমতা নেই)।',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_CASES',
      'ACCEPT_ASSIGNMENT',
      'DECLINE_ASSIGNMENT',
      'UPDATE_HEARING',
      'SUBMIT_CASE_PROGRESS',
      'ADD_CASE_NOTE'
    ]
  },
  DISTRICT_ADMIN: {
    role: 'DISTRICT_ADMIN',
    nameBn: 'জেলা সমন্বয়ক / প্রশাসক',
    nameEn: 'District Administrator',
    designationBn: 'জেলা প্রশাসনিক তদারককারী',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-800',
    badgeText: 'text-teal-800 dark:text-teal-300',
    descriptionBn: 'পাইলট জেলার কাজের চাপ, এসএলএ অতিক্রান্ত মামলা এবং কর্মকর্তাদের কর্মদক্ষতা পর্যবেক্ষণ।',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_APPLICATIONS',
      'VIEW_CASES',
      'VIEW_ATTENTION_QUEUE',
      'VIEW_DISTRICT_MONITORING',
      'VIEW_SLA_MONITORING',
      'VIEW_DATA_QUALITY_AUDIT',
      'VIEW_AUDIT_LOG'
    ]
  },
  SYSTEM_ADMIN: {
    role: 'SYSTEM_ADMIN',
    nameBn: 'সিস্টেম অ্যাডমিনিস্ট্রেটর',
    nameEn: 'System Administrator',
    designationBn: 'আইটি অবকাঠামো ও সিস্টেম অ্যাডমিনিস্ট্রেটর',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800',
    badgeText: 'text-rose-800 dark:text-rose-300',
    descriptionBn: 'সিস্টেম কনফিগারেশন, ব্যবহারকারী ও রোল ব্যবস্থাপনা, পাইলট জেলা ডেটা সেটিংস এবং নিরাপত্তা অডিট পর্যালোচনা।',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_APPLICATIONS',
      'VIEW_CASES',
      'VIEW_ATTENTION_QUEUE',
      'VIEW_DISTRICT_MONITORING',
      'VIEW_SLA_MONITORING',
      'VIEW_DATA_QUALITY_AUDIT',
      'RESOLVE_ANOMALY',
      'VIEW_AUDIT_LOG',
      'MANAGE_USERS',
      'SYSTEM_CONFIG'
    ]
  }
};

export function hasPermission(role: UserRole, action: PermissionAction): boolean {
  const config = ROLE_CONFIGS[role];
  return config ? config.permissions.includes(action) : false;
}

export function canLawyerApproveEligibility(): boolean {
  return false; // Authoritative rule: A lawyer can NEVER approve eligibility
}
