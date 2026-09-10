import { legalAidStore } from '../services/legalAidStore';
import { CANONICAL_DISTRICTS } from '../data/canonicalLocations';
import { hasPermission } from '../services/rbacService';

console.log('=== SYSTEM INTEGRATION VERIFICATION ===');
const cases = legalAidStore.getCases();
const lawyers = legalAidStore.getLawyers();
console.log(`Cases in Store: ${cases.length}`);
console.log(`Lawyers in Store: ${lawyers.length}`);
console.log(`Pilot Districts: ${CANONICAL_DISTRICTS.length}`);

// Assert lengths
if (cases.length !== 500) throw new Error('Expected 500 cases');
if (lawyers.length !== 30) throw new Error('Expected 30 lawyers');
if (CANONICAL_DISTRICTS.length !== 8) throw new Error('Expected 8 pilot districts');

// Test Quality Report
const qualityReport = legalAidStore.getQualityReport();
console.log(`Quality Report Audited Records: ${qualityReport.totalRecordsAudited}`);
console.log(`Total Anomalies Detected: ${qualityReport.totalAnomaliesCount}`);
console.log(`Valid Records: ${qualityReport.validRecordsCount}, Anomaly Records: ${qualityReport.anomalyRecordsCount}`);

// Test Pilot District Metrics Reconciliation
const distMetrics = legalAidStore.getDistrictMetrics();
const totalDistrictCases = distMetrics.reduce((sum, d) => sum + d.totalCases, 0);
console.log(`Total District Sum Cases: ${totalDistrictCases} (Must be exactly 500)`);
if (totalDistrictCases !== 500) throw new Error(`District sum ${totalDistrictCases} != 500`);

// Test RBAC
const lawyerCanApprove = hasPermission('PANEL_LAWYER', 'APPROVE_ELIGIBILITY');
const authorityCanApprove = hasPermission('AUTHORIZED_AUTHORITY', 'APPROVE_ELIGIBILITY');
console.log(`RBAC Check: PANEL_LAWYER approve=${lawyerCanApprove} (false), AUTHORIZED_AUTHORITY approve=${authorityCanApprove} (true)`);
if (lawyerCanApprove !== false) throw new Error('Security violation: Panel lawyer cannot approve eligibility');
if (authorityCanApprove !== true) throw new Error('Authorized Authority must be able to approve eligibility');

console.log('✅ ALL DOMAIN LOGIC & DATA RECONCILIATION PASSED 100%!');
