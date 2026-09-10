/**
 * অগ্রাধিকার নির্ধারণ সহায়ক ইঞ্জিন (Case Priority Engine)
 * Transparent rule-based prioritization (not opaque AI magic).
 */

import { PriorityLevel, PriorityBreakdown, PriorityFactor } from '../types/legalAid';
import { SYSTEM_DEMO_DATE } from '../data/canonicalLocations';
import { parseDateSafe } from './chronologyEngine';

export function calculateCasePriority(data: {
  caseType: string;
  vulnerabilityIndicator: string;
  nextHearingDate: string | null;
  slaDueDate: string | null;
  documentStatus: string;
  sourcePriority?: string;
}): PriorityBreakdown {
  const factors: PriorityFactor[] = [];
  let score = 30; // Baseline points

  // 1. Vulnerability factors
  const vuln = (data.vulnerabilityIndicator || '').toLowerCase();
  if (vuln.includes('child') || vuln.includes('শিশু')) {
    score += 25;
    factors.push({ factor: 'শিশু সুরক্ষা বিষয়াদি', points: 25, description: 'শিশুর হেফাজত বা সুরক্ষামূলক আইনি সহায়তা অগ্রাধিকারযোগ্য' });
  } else if (vuln.includes('woman') || vuln.includes('নারী') || vuln.includes('domestic')) {
    score += 20;
    factors.push({ factor: 'নারী ও পারিবারিক সহিংসতা সুরক্ষা', points: 20, description: 'পারিবারিক সহিংসতা বা নারী নির্যাতন সুরক্ষামূলক পদক্ষেপ জরুরি' });
  } else if (vuln.includes('disability') || vuln.includes('প্রতিবন্ধী')) {
    score += 20;
    factors.push({ factor: 'প্রতিবন্ধী ব্যক্তির বিশেষ সুবিধা', points: 20, description: 'বিশেষ চাহিদাসম্পন্ন আবেদনকারীর বিচার প্রাপ্তি নিশ্চিতকরণ' });
  } else if (vuln.includes('elderly') || vuln.includes('বয়স্ক')) {
    score += 15;
    factors.push({ factor: 'প্রবীণ নাগরিক সুরক্ষা', points: 15, description: 'বয়োজ্যেষ্ঠ নাগরিকের মামলা অগ্রাধিকার ভিত্তিতে নিষ্পত্তিযোগ্য' });
  }

  // 2. Case Type Urgency
  const ctype = (data.caseType || '').toLowerCase();
  if (ctype.includes('criminal') || ctype.includes('ফৌজদারি')) {
    score += 15;
    factors.push({ factor: 'ফৌজদারি মামলা (ব্যক্তি স্বাধীনতা)', points: 15, description: 'জামিন ও কারাবাস সংক্রান্ত আইনি প্রতিকার জরুরি' });
  } else if (ctype.includes('domestic') || ctype.includes('সহিংসতা')) {
    score += 15;
    factors.push({ factor: 'পারিবারিক সহিংসতা প্রতিরোধ', points: 15, description: 'তাৎক্ষণিক আদালতের সুরক্ষামূলক আদেশ আবশ্যক' });
  } else if (ctype.includes('maintenance') || ctype.includes('ভরণপোষণ')) {
    score += 10;
    factors.push({ factor: 'খোরপোষ ও জীবনধারণ সহায়তা', points: 10, description: 'নাবালক সন্তান ও স্ত্রীর খোরপোষ দাবি অগ্রাধিকার' });
  }

  // 3. Proximity of next hearing
  if (data.nextHearingDate) {
    const hearingDate = parseDateSafe(data.nextHearingDate);
    if (hearingDate) {
      const daysToHearing = Math.ceil((hearingDate.getTime() - SYSTEM_DEMO_DATE.getTime()) / (1000 * 60 * 60 * 24));
      if (daysToHearing >= 0 && daysToHearing <= 7) {
        score += 20;
        factors.push({ factor: `আসন্ন শুনানি (${daysToHearing} দিন বাকি)`, points: 20, description: 'আদালতের শুনানির তারিখ অত্যন্ত সন্নিকটে' });
      } else if (daysToHearing > 7 && daysToHearing <= 14) {
        score += 10;
        factors.push({ factor: `আসন্ন শুনানি (${daysToHearing} দিন বাকি)`, points: 10, description: 'শুনানির পূর্বপ্রস্তুতি ও হাজিরা নিশ্চিতকরণ প্রয়োজন' });
      }
    }
  }

  // 4. SLA Pressure
  if (data.slaDueDate) {
    const slaDate = parseDateSafe(data.slaDueDate);
    if (slaDate) {
      const daysRemaining = Math.ceil((slaDate.getTime() - SYSTEM_DEMO_DATE.getTime()) / (1000 * 60 * 60 * 24));
      if (daysRemaining < 0) {
        score += 20;
        factors.push({ factor: 'এসএলএ অতিক্রান্ত', points: 20, description: 'সেবা প্রদানের সময়সীমা পার হওয়ায় অবিলম্বে ব্যবস্থা গ্রহণ আবশ্যক' });
      } else if (daysRemaining <= 5) {
        score += 10;
        factors.push({ factor: 'এসএলএ আসন্ন সমাপ্তি', points: 10, description: 'সেবা সময়সীমা শেষ হতে চলেছে' });
      }
    }
  }

  // Cap score between 10 and 100
  score = Math.min(100, Math.max(10, score));

  // Determine Level
  let level: PriorityLevel = 'LOW';
  if (score >= 80) level = 'CRITICAL';
  else if (score >= 60) level = 'HIGH';
  else if (score >= 40) level = 'MEDIUM';

  // If source priority was CRITICAL, elevate
  if (data.sourcePriority === 'CRITICAL' && level !== 'CRITICAL') {
    level = 'CRITICAL';
    score = Math.max(80, score);
    factors.push({ factor: 'প্রাথমিক রেজিস্টার অনুযায়ী অতি-জরুরি', points: 15, description: 'দাখিলকৃত রেজিস্টারে সর্বোচ্চ অগ্রাধিকার হিসেবে চিহ্নিত' });
  }

  return {
    score,
    level,
    factors
  };
}
