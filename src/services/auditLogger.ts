/**
 * কার্যক্রমের রেকর্ড ও অডিট লগ ইঞ্জিন (Audit Logger)
 * Traceable, immutable audit trail for administrative and judicial accountability.
 */

import { AuditLogEntry, UserRole } from '../types/legalAid';

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-2026-0001',
    timestamp: '2026-09-10 14:15:22',
    userRole: 'LEGAL_AID_OFFICER',
    userName: 'মো: মোর্শেদ আলম (ডিএলএও, ঢাকা)',
    actionBn: 'নথিপত্র যাচাই সম্পন্ন',
    actionCode: 'VERIFY_DOCUMENTS',
    recordId: 'NLAS-DHA-2026-0001',
    targetEntity: 'CASE',
    previousState: 'SUBMITTED',
    newState: 'UNDER_REVIEW',
    detailsBn: 'আবেদনকারীর পরিচয়পত্র ও আয় সংক্রান্ত প্রমাণক যাচাই করা হয়েছে।',
    ipAddress: '10.12.4.18'
  },
  {
    id: 'AUD-2026-0002',
    timestamp: '2026-09-10 11:30:05',
    userRole: 'AUTHORIZED_AUTHORITY',
    userName: 'জেলা লিগ্যাল এইড কমিটি, খুলনা',
    actionBn: 'আইনগত সহায়তা অনুমোদন',
    actionCode: 'APPROVE_ELIGIBILITY',
    recordId: 'NLAS-KHU-2026-0002',
    targetEntity: 'APPLICATION',
    previousState: 'RECOMMENDED',
    newState: 'APPROVED',
    detailsBn: 'দরিদ্র ও প্রবীণ বিবেচনায় আইনগত সহায়তা বিধিমালার আওতায় অনুমোদন প্রদান।',
    ipAddress: '10.18.2.45'
  },
  {
    id: 'AUD-2026-0003',
    timestamp: '2026-09-10 09:45:10',
    userRole: 'PANEL_LAWYER',
    userName: 'অ্যাডভোকেট সাদিয়া ইসলাম',
    actionBn: 'নিয়োগ গ্রহণ ও শুনানি হালনাগাদ',
    actionCode: 'ACCEPT_ASSIGNMENT',
    recordId: 'NLAS-CUM-2026-0007',
    targetEntity: 'CASE',
    previousState: 'ASSIGNED',
    newState: 'ACCEPTED_BY_LAWYER',
    detailsBn: 'মামলার প্রতিনিধিত্ব গ্রহণপূর্বক পরবর্তী শুনানির প্রস্তুতি রেকর্ড করা হয়েছে।',
    ipAddress: '10.22.8.91'
  },
  {
    id: 'AUD-2026-0004',
    timestamp: '2026-09-09 16:20:40',
    userRole: 'SYSTEM_ADMIN',
    userName: 'সিস্টেম অ্যাডমিনিস্ট্রেটর',
    actionBn: '৮টি পাইলট জেলা ডেটাসেট আমদানি',
    actionCode: 'DATA_IMPORT',
    recordId: 'DEMO-500-2026-09-09',
    targetEntity: 'SYSTEM',
    previousState: 'INITIAL',
    newState: 'SYNCED',
    detailsBn: '৫০০টি প্রামাণ্য মামলার স্বয়ংক্রিয় তথ্য ও অসংগতি যাচাইকরণ ব্যাচ সম্পন্ন।',
    ipAddress: '127.0.0.1'
  }
];

class AuditStore {
  private logs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];

  public getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  public recordEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const pad = String(this.logs.length + 1).padStart(4, '0');
    const fullEntry: AuditLogEntry = {
      ...entry,
      id: `AUD-2026-${pad}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: entry.ipAddress || '10.15.0.24'
    };
    this.logs.unshift(fullEntry);
    return fullEntry;
  }
}

export const auditLogger = new AuditStore();
