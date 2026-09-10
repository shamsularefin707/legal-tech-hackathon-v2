/**
 * আইনজীবী নির্বাচন ও নিয়োগ সুপারিশ ইঞ্জিন (Lawyer Recommendation Engine)
 * Recommends panel lawyers based on specialization, geographic district, capacity, and conflict-of-interest.
 */

import { CanonicalCase, CanonicalLawyer } from '../types/legalAid';

export interface LawyerRecommendation {
  lawyer: CanonicalLawyer;
  matchScore: number; // 0 - 100
  fitReasonsBn: string[];
  warningsBn: string[];
  conflictDetected: boolean;
  conflictDetailsBn?: string;
  isEligible: boolean;
}

export function recommendLawyersForCase(
  caseItem: CanonicalCase,
  allLawyers: CanonicalLawyer[]
): LawyerRecommendation[] {
  const cType = (caseItem.caseType || '').toLowerCase();
  const cDistrict = (caseItem.district || '').toLowerCase();

  return allLawyers.map(lawyer => {
    let score = 50;
    const fitReasonsBn: string[] = [];
    const warningsBn: string[] = [];
    let isEligible = true;
    let conflictDetected = false;
    let conflictDetailsBn: string | undefined;

    // 1. Suspension check (Absolute Disqualification)
    if (lawyer.status === 'SUSPENDED') {
      isEligible = false;
      score = 0;
      warningsBn.push('আইনজীবী বর্তমানে বাংলাদেশ বার কাউন্সিল বা প্রশাসনিক আদেশে স্থগিতাদেশপ্রাপ্ত।');
    }

    // 2. District Match
    const lDistrict = (lawyer.district || '').toLowerCase();
    if (lDistrict === cDistrict) {
      score += 25;
      fitReasonsBn.push(`সংশ্লিষ্ট জেলা (${lawyer.district}) প্যানেলভুক্ত আইনজীবী`);
    } else {
      score -= 20;
      warningsBn.push(`আইনজীবীর ভৌগোলিক এক্তিয়ার ভিন্ন জেলা (${lawyer.district})`);
    }

    // 3. Specialization Match
    const lSpec = (lawyer.specialization || '').toLowerCase();
    const isSpecialist =
      (cType.includes('criminal') && lSpec.includes('criminal')) ||
      (cType.includes('land') && lSpec.includes('land')) ||
      (cType.includes('family') && (lSpec.includes('family') || lSpec.includes('women'))) ||
      (cType.includes('maintenance') && (lSpec.includes('maintenance') || lSpec.includes('family'))) ||
      (cType.includes('adr') && lSpec.includes('adr')) ||
      (cType.includes('civil') && (lSpec.includes('civil') || lSpec.includes('general'))) ||
      (cType.includes('woman') && (lSpec.includes('women') || lSpec.includes('family'))) ||
      lSpec.includes('general');

    if (isSpecialist) {
      score += 25;
      fitReasonsBn.push(`মামলার বিষয়ে (${caseItem.caseType}) বিশেষ পারদর্শিতা ও অভিজ্ঞতা রয়েছে`);
    }

    // 4. Capacity & Workload Balance
    const remainingCapacity = lawyer.capacity - lawyer.activeCases;
    if (remainingCapacity <= 0) {
      score -= 25;
      warningsBn.push(`আইনজীবীর কর্মভার সর্বোচ্চ সীমা অতিক্রম করেছে (${lawyer.activeCases}/${lawyer.capacity})`);
    } else if (remainingCapacity <= 3) {
      score += 5;
      fitReasonsBn.push(`কাজের সীমা সন্নিকটে (${lawyer.activeCases}/${lawyer.capacity})`);
    } else {
      score += 15;
      fitReasonsBn.push(`পর্যাপ্ত কাজের প্রাপ্যতা রয়েছে (অবশিষ্ট ক্ষমতা: ${remainingCapacity}টি মামলা)`);
    }

    // 5. Availability Status
    if (lawyer.availability === 'Available') {
      score += 10;
      fitReasonsBn.push('বর্তমানে শুনানিতে উপস্থিতির জন্য পূর্ণ প্রস্তুত (Available)');
    } else if (lawyer.availability === 'Limited') {
      score -= 5;
      warningsBn.push('সীমিত প্রাপ্যতা (Limited Availability)');
    } else if (lawyer.availability === 'On Leave') {
      score -= 20;
      warningsBn.push('আইনজীবী বর্তমানে ছুটিতে আছেন (On Leave)');
    }

    // 6. Conflict of Interest Simulation
    // Flag potential conflict if applicant and lawyer share specific conditions or opposing history
    if (caseItem.caseId.endsWith('0003') && lawyer.lawyerId === 'LADCS-003') {
      conflictDetected = true;
      conflictDetailsBn = 'এই আইনজীবী পূর্বে সংশ্লিষ্ট পক্ষদ্বয়ের অপর একটি মামলায় প্রতিপক্ষের পরামর্শক হিসেবে নিয়োজিত ছিলেন।';
      warningsBn.push('সম্ভাব্য স্বার্থের সংঘাত (Conflict of Interest) পরিলক্ষিত');
      score -= 40;
    }

    score = Math.max(0, Math.min(100, score));

    return {
      lawyer,
      matchScore: score,
      fitReasonsBn,
      warningsBn,
      conflictDetected,
      conflictDetailsBn,
      isEligible: isEligible && !conflictDetected
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
