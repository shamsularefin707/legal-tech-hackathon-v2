/**
 * পাইলট জেলা ও আদালত সম্পর্কিত একক নির্ভরযোগ্য উৎস (Single Source of Truth)
 * Exactly 8 Pilot Districts of the Bangladesh Digital Legal Aid Pilot
 */

export interface DistrictInfo {
  id: string;
  nameEn: string;
  nameBn: string;
  division: string;
  isPilot: boolean;
  upazilas: { id: string; nameEn: string; nameBn: string }[];
  courts: string[];
}

export const CANONICAL_DISTRICTS: DistrictInfo[] = [
  {
    id: 'Dhaka',
    nameEn: 'Dhaka',
    nameBn: 'ঢাকা',
    division: 'Dhaka',
    isPilot: true,
    upazilas: [
      { id: 'Sadar', nameEn: 'Sadar', nameBn: 'সদর' },
      { id: 'Dhamrai', nameEn: 'Dhamrai', nameBn: 'ধামরাই' },
      { id: 'Dohar', nameEn: 'Dohar', nameBn: 'দোহার' },
      { id: 'Keraniganj', nameEn: 'Keraniganj', nameBn: 'কেরানীগঞ্জ' },
      { id: 'Nawabganj', nameEn: 'Nawabganj', nameBn: 'নবাবগঞ্জ' },
      { id: 'Savar', nameEn: 'Savar', nameBn: 'সাভার' }
    ],
    courts: [
      'Chief Metropolitan Magistrate Court',
      'Chief Judicial Magistrate Court',
      'District Judge Court',
      'District Legal Aid Office'
    ]
  },
  {
    id: 'Chattogram',
    nameEn: 'Chattogram',
    nameBn: 'চট্টগ্রাম',
    division: 'Chattogram',
    isPilot: true,
    upazilas: [
      { id: 'Sadar', nameEn: 'Sadar', nameBn: 'সদর' },
      { id: 'Anwara', nameEn: 'Anwara', nameBn: 'আনোয়ারা' },
      { id: 'Hathazari', nameEn: 'Hathazari', nameBn: 'হাটহাজারী' },
      { id: 'Patiya', nameEn: 'Patiya', nameBn: 'পটিয়া' },
      { id: 'Rangunia', nameEn: 'Rangunia', nameBn: 'রাঙ্গুনিয়া' }
    ],
    courts: [
      'Chief Metropolitan Magistrate Court',
      'Chief Judicial Magistrate Court',
      'District Judge Court',
      'District Legal Aid Office'
    ]
  },
  {
    id: 'Khulna',
    nameEn: 'Khulna',
    nameBn: 'খুলনা',
    division: 'Khulna',
    isPilot: true,
    upazilas: [
      { id: 'Sadar', nameEn: 'Sadar', nameBn: 'সদর' },
      { id: 'Dumuria', nameEn: 'Dumuria', nameBn: 'ডুমুরিয়া' },
      { id: 'Batiaghata', nameEn: 'Batiaghata', nameBn: 'বটিয়াঘাটা' },
      { id: 'Paikgachha', nameEn: 'Paikgachha', nameBn: 'পাইকগাছা' }
    ],
    courts: [
      'Chief Metropolitan Magistrate Court',
      'Chief Judicial Magistrate Court',
      'District Judge Court',
      'District Legal Aid Office'
    ]
  },
  {
    id: 'Cumilla',
    nameEn: 'Cumilla',
    nameBn: 'কুমিল্লা',
    division: 'Chattogram',
    isPilot: true,
    upazilas: [
      { id: 'Sadar', nameEn: 'Sadar', nameBn: 'সদর' },
      { id: 'Burichang', nameEn: 'Burichang', nameBn: 'বুড়িচং' },
      { id: 'Chandina', nameEn: 'Chandina', nameBn: 'চান্দিনা' },
      { id: 'Debidwar', nameEn: 'Debidwar', nameBn: 'দেবিদ্বার' }
    ],
    courts: [
      'Chief Judicial Magistrate Court',
      'District Judge Court',
      'District Legal Aid Office',
      'Senior Judicial Magistrate Court'
    ]
  },
  {
    id: 'Netrokona',
    nameEn: 'Netrokona',
    nameBn: 'নেত্রকোণা',
    division: 'Mymensingh',
    isPilot: true,
    upazilas: [
      { id: 'Sadar', nameEn: 'Sadar', nameBn: 'সদর' },
      { id: 'Kendua', nameEn: 'Kendua', nameBn: 'কেন্দুয়া' },
      { id: 'Barhatta', nameEn: 'Barhatta', nameBn: 'বারহাট্টা' },
      { id: 'Mohanganj', nameEn: 'Mohanganj', nameBn: 'মোহনগঞ্জ' }
    ],
    courts: [
      'Chief Judicial Magistrate Court',
      'District Judge Court',
      'District Legal Aid Office',
      'Senior Judicial Magistrate Court'
    ]
  },
  {
    id: 'Rajbari',
    nameEn: 'Rajbari',
    nameBn: 'রাজবাড়ী',
    division: 'Dhaka',
    isPilot: true,
    upazilas: [
      { id: 'Sadar', nameEn: 'Sadar', nameBn: 'সদর' },
      { id: 'Pangsha', nameEn: 'Pangsha', nameBn: 'পাংশা' },
      { id: 'Baliakandi', nameEn: 'Baliakandi', nameBn: 'বালিয়াকান্দি' },
      { id: 'Goalandaghat', nameEn: 'Goalandaghat', nameBn: 'গোয়ালন্দঘাট' }
    ],
    courts: [
      'Chief Judicial Magistrate Court',
      'District Judge Court',
      'District Legal Aid Office',
      'Senior Judicial Magistrate Court',
      'Assistant Judge Court',
      'Senior Assistant Judge Court'
    ]
  },
  {
    id: 'Habiganj',
    nameEn: 'Habiganj',
    nameBn: 'হবিগঞ্জ',
    division: 'Sylhet',
    isPilot: true,
    upazilas: [
      { id: 'Sadar', nameEn: 'Sadar', nameBn: 'সদর' },
      { id: 'Madhabpur', nameEn: 'Madhabpur', nameBn: 'মাধবপুর' },
      { id: 'Bahubal', nameEn: 'Bahubal', nameBn: 'বাহুবল' },
      { id: 'Nabiganj', nameEn: 'Nabiganj', nameBn: 'নবীগঞ্জ' }
    ],
    courts: [
      'Chief Judicial Magistrate Court',
      'District Judge Court',
      'District Legal Aid Office',
      'Senior Judicial Magistrate Court',
      'Magistrate Court'
    ]
  },
  {
    id: 'Joypurhat',
    nameEn: 'Joypurhat',
    nameBn: 'জয়পুরহাট',
    division: 'Rajshahi',
    isPilot: true,
    upazilas: [
      { id: 'Sadar', nameEn: 'Sadar', nameBn: 'সদর' },
      { id: 'Kalai', nameEn: 'Kalai', nameBn: 'কালাই' },
      { id: 'Khetlal', nameEn: 'Khetlal', nameBn: 'ক্ষেতলাল' },
      { id: 'Panchbibi', nameEn: 'Panchbibi', nameBn: 'পাঁচবিবি' }
    ],
    courts: [
      'Chief Judicial Magistrate Court',
      'District & Sessions Judge Court',
      'District Legal Aid Office',
      'Senior Judicial Magistrate Court',
      'ADR Forum'
    ]
  }
];

export const PILOT_DISTRICT_NAMES = [
  'Dhaka',
  'Chattogram',
  'Khulna',
  'Cumilla',
  'Netrokona',
  'Rajbari',
  'Habiganj',
  'Joypurhat'
] as const;

export type PilotDistrictName = typeof PILOT_DISTRICT_NAMES[number];

// Controlled reference demonstration date: 10 September 2026
export const SYSTEM_DEMO_DATE_STR = '2026-09-10';
export const SYSTEM_DEMO_DATE = new Date('2026-09-10T00:00:00Z');

export interface DistrictOfficerInfo {
  officerName: string;
  designation: string;
  phone: string;
  email: string;
}

export const AUTHORITATIVE_DLAO_OFFICERS: Record<string, DistrictOfficerInfo> = {
  Dhaka: {
    officerName: 'মো: মোর্শেদ আলম',
    designation: 'সহকারী জজ ও জেলা লিগ্যাল এইড অফিসার, ঢাকা',
    phone: '+8801711-000101',
    email: 'dlao.dhaka@nlaso.gov.bd'
  },
  Chattogram: {
    officerName: 'সুব্রত কুমার দাশ',
    designation: 'সিনিয়র সহকারী জজ ও জেলা লিগ্যাল এইড অফিসার, চট্টগ্রাম',
    phone: '+8801711-000102',
    email: 'dlao.chattogram@nlaso.gov.bd'
  },
  Khulna: {
    officerName: 'নাজমুন নাহার',
    designation: 'সহকারী জজ ও জেলা লিগ্যাল এইড অফিসার, খুলনা',
    phone: '+8801711-000103',
    email: 'dlao.khulna@nlaso.gov.bd'
  },
  Cumilla: {
    officerName: 'রেহানা সুলতানা',
    designation: 'সিনিয়র সহকারী জজ ও জেলা লিগ্যাল এইড অফিসার, কুমিল্লা',
    phone: '+8801711-000104',
    email: 'dlao.cumilla@nlaso.gov.bd'
  },
  Netrokona: {
    officerName: 'মাহমুদুল হাসান',
    designation: 'সহকারী জজ ও জেলা লিগ্যাল এইড অফিসার, নেত্রকোণা',
    phone: '+8801711-000105',
    email: 'dlao.netrokona@nlaso.gov.bd'
  },
  Rajbari: {
    officerName: 'মো: আরিফুল ইসলাম',
    designation: 'সহকারী জজ ও জেলা লিগ্যাল এইড অফিসার, রাজবাড়ী',
    phone: '+8801711-000106',
    email: 'dlao.rajbari@nlaso.gov.bd'
  },
  Habiganj: {
    officerName: 'ফেরদৌস জাহান',
    designation: 'সিনিয়র সহকারী জজ ও জেলা লিগ্যাল এইড অফিসার, হবিগঞ্জ',
    phone: '+8801711-000107',
    email: 'dlao.habiganj@nlaso.gov.bd'
  },
  Joypurhat: {
    officerName: 'কামরুল আহসান',
    designation: 'সহকারী জজ ও জেলা লিগ্যাল এইড অফিসার, জয়পুরহাট',
    phone: '+8801711-000108',
    email: 'dlao.joypurhat@nlaso.gov.bd'
  }
};

export function getDistrictOfficer(districtName: string): DistrictOfficerInfo {
  const norm = districtName.trim();
  for (const [distKey, officer] of Object.entries(AUTHORITATIVE_DLAO_OFFICERS)) {
    if (distKey.toLowerCase() === norm.toLowerCase()) return officer;
  }
  return {
    officerName: 'জেলা লিগ্যাল এইড অফিসার (ভারপ্রাপ্ত)',
    designation: `সহকারী জজ ও ডিএলএও, ${districtName}`,
    phone: '+8801711-000000',
    email: `dlao.${districtName.toLowerCase()}@nlaso.gov.bd`
  };
}

export function getLegalAidCategory(caseType: string): string {
  const t = (caseType || '').toLowerCase();
  if (t.includes('criminal') || t.includes('ফৌজদারি')) return 'ফৌজদারি আইনি সহায়তা';
  if (t.includes('land') || t.includes('জমি')) return 'ভূমি বিরোধ ও স্বত্ব আইনি সহায়তা';
  if (t.includes('family') || t.includes('পারিবারিক')) return 'পারিবারিক ও বৈবাহিক বিরোধ সহায়তা';
  if (t.includes('adr') || t.includes('মধ্যস্থতা')) return 'বিকল্প বিরোধ নিষ্পত্তি ও মধ্যস্থতা (ADR)';
  if (t.includes('maintenance') || t.includes('ভরণপোষণ')) return 'ভরণপোষণ ও খোরপোশ আদায়';
  if (t.includes('domestic') || t.includes('সহিংসতা')) return 'পারিবারিক সহিংসতা প্রতিরোধ ও সুরক্ষা';
  if (t.includes('woman') || t.includes('child') || t.includes('নারী')) return 'নারী ও শিশু নির্যাতন দমন সহায়তা';
  if (t.includes('civil') || t.includes('দেওয়ানি')) return 'দেওয়ানি মোকদ্দমা সহায়তা';
  return 'সাধারণ আইনি সহায়তা';
}

export function getDistrictInfo(districtName: string): DistrictInfo | undefined {
  const norm = districtName.trim().toLowerCase();
  return CANONICAL_DISTRICTS.find(
    d => d.nameEn.toLowerCase() === norm || d.nameBn === districtName.trim()
  );
}

export function isPilotDistrict(districtName: string): boolean {
  const info = getDistrictInfo(districtName);
  return info ? info.isPilot : false;
}
