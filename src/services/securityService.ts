/**
 * নিরাপত্তা ও তথ্য গোপনীয়তা সেবা (Security & Privacy Service)
 * Masks sensitive PII, logs security incidents, and prevents privilege escalation.
 */

import { UserRole } from '../types/legalAid';
import { auditLogger } from './auditLogger';

export interface SecurityIncident {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  descriptionBn: string;
  attemptedByRole: UserRole;
  attemptedAction: string;
  status: 'BLOCKED' | 'INVESTIGATING' | 'RESOLVED';
}

export function maskNid(nid: string | null | undefined): string {
  if (!nid) return 'প্রযোজ্য নয়';
  const clean = nid.replace(/[^0-9]/g, '');
  if (clean.length <= 6) return '******';
  return `${clean.slice(0, 4)}••••${clean.slice(-3)}`;
}

export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return 'অনির্দিষ্ট';
  const clean = phone.trim();
  if (clean.length < 8) return '••••••••';
  return `${clean.slice(0, 6)}••••${clean.slice(-2)}`;
}

export const INITIAL_SECURITY_INCIDENTS: SecurityIncident[] = [
  {
    id: 'SEC-2026-001',
    timestamp: '2026-09-09 18:30:11',
    severity: 'HIGH',
    type: 'UNAUTHORIZED_DECISION_ATTEMPT',
    descriptionBn: 'প্যানেল আইনজীবী অ্যাকাউন্ট থেকে আবেদন অনুমোদনের অননুমোদিত চেষ্টা স্বয়ংক্রিয়ভাবে প্রতিহত হয়েছে।',
    attemptedByRole: 'PANEL_LAWYER',
    attemptedAction: 'APPROVE_ELIGIBILITY',
    status: 'BLOCKED'
  },
  {
    id: 'SEC-2026-002',
    timestamp: '2026-09-08 14:12:00',
    severity: 'MEDIUM',
    type: 'JURISDICTION_MISMATCH',
    descriptionBn: 'কুমিল্লা জেলার কর্মকর্তা কর্তৃক ঢাকা জেলার পাইলট মামলার নথিতে পরিবর্তনের চেষ্টা প্রতিহত হয়েছে।',
    attemptedByRole: 'LEGAL_AID_OFFICER',
    attemptedAction: 'MODIFY_RECORD',
    status: 'BLOCKED'
  }
];

class SecurityManager {
  private incidents: SecurityIncident[] = [...INITIAL_SECURITY_INCIDENTS];

  public getIncidents(): SecurityIncident[] {
    return [...this.incidents];
  }

  public recordBlockedAttempt(
    attemptedByRole: UserRole,
    attemptedAction: string,
    descriptionBn: string,
    caseId?: string
  ): SecurityIncident {
    const inc: SecurityIncident = {
      id: `SEC-2026-00${this.incidents.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      severity: 'HIGH',
      type: 'PRIVILEGE_VIOLATION_BLOCKED',
      descriptionBn,
      attemptedByRole,
      attemptedAction,
      status: 'BLOCKED'
    };
    this.incidents.unshift(inc);

    auditLogger.recordEvent({
      userRole: attemptedByRole,
      userName: `রোল: ${attemptedByRole}`,
      actionBn: 'অননুমোদিত প্রবেশাধিকার প্রতিহত',
      actionCode: 'ACCESS_DENIED',
      recordId: caseId || 'SYSTEM',
      targetEntity: 'SECURITY',
      detailsBn: descriptionBn
    });

    return inc;
  }
}

export const securityManager = new SecurityManager();
