import React, { useState } from 'react';
import { X, PlusCircle, User, MapPin, Building2, FileText, CheckCircle2, Shield } from 'lucide-react';
import { PILOT_DISTRICT_NAMES, CANONICAL_DISTRICTS } from '../data/canonicalLocations';
import { legalAidStore } from '../services/legalAidStore';

interface NewApplicationModalProps {
  onClose: () => void;
  onSuccess: (caseId: string) => void;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  onClose,
  onSuccess
}) => {
  const [applicantName, setApplicantName] = useState('');
  const [gender, setGender] = useState('নারী');
  const [nid, setNid] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Sadar');
  const [caseType, setCaseType] = useState('Family');
  const [court, setCourt] = useState('Chief Metropolitan Magistrate Court');
  const [vulnerabilityIndicator, setVulnerabilityIndicator] = useState('Woman');
  const [description, setDescription] = useState('');

  const currentDistInfo = CANONICAL_DISTRICTS.find(d => d.nameEn === district) || CANONICAL_DISTRICTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) return;

    const newCase = legalAidStore.submitApplication({
      applicantName,
      gender,
      nid,
      phone,
      district,
      upazila,
      caseType,
      court,
      vulnerabilityIndicator,
      description: description || 'আইনগত সহায়তা বিধিমতে নতুন দাখিলকৃত আবেদন।'
    });

    onSuccess(newCase.caseId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#15202E] border border-slate-300 dark:border-slate-700 rounded-md w-full max-w-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0F1724]">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#006A4E] dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              নতুন আইনগত সহায়তা আবেদন দাখিল (Application Intake Form)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Applicant Name */}
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">আবেদনকারীর পূর্ণ নাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: মোছা: পারভীন আক্তার"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-[#006A4E]"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">লিঙ্গ</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                <option value="নারী">নারী (Female)</option>
                <option value="পুরুষ">পুরুষ (Male)</option>
                <option value="অন্যান্য">অন্যান্য (Other)</option>
              </select>
            </div>

            {/* NID */}
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">জাতীয় পরিচয়পত্র নম্বর (NID)</label>
              <input
                type="text"
                placeholder="১০ বা ১৭ অঙ্কের নম্বর"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-[#006A4E]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">যোগাযোগের মোবাইল নম্বর</label>
              <input
                type="text"
                placeholder="+8801700000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-[#006A4E]"
              />
            </div>

            {/* District */}
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">পাইলট জেলা *</label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  const distObj = CANONICAL_DISTRICTS.find(d => d.nameEn === e.target.value);
                  if (distObj && distObj.upazilas.length > 0) {
                    setUpazila(distObj.upazilas[0].nameEn);
                  }
                  if (distObj && distObj.courts.length > 0) {
                    setCourt(distObj.courts[0]);
                  }
                }}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                {PILOT_DISTRICT_NAMES.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Upazila */}
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">উপজেলা / থানা</label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                {currentDistInfo.upazilas.map(u => (
                  <option key={u.id} value={u.nameEn}>{u.nameBn} ({u.nameEn})</option>
                ))}
              </select>
            </div>

            {/* Case Type */}
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">মামলার বিষয় / শ্রেণি *</label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                <option value="Family">পারিবারিক বিরোধ (Family)</option>
                <option value="Maintenance">ভরণপোষণ আদায় (Maintenance)</option>
                <option value="Land">জমিজমা বিরোধ (Land)</option>
                <option value="Criminal">ফৌজদারি মামলা (Criminal)</option>
                <option value="Domestic Violence">পারিবারিক সহিংসতা প্রতিরোধ (Domestic Violence)</option>
                <option value="Woman/Child">নারী ও শিশু নির্যাতন দমন (Woman/Child)</option>
                <option value="ADR">বিকল্প বিরোধ নিষ্পত্তি ও মধ্যস্থতা (ADR)</option>
                <option value="Civil">দেওয়ানি মোকদ্দমা (Civil)</option>
              </select>
            </div>

            {/* Court Jurisdiction */}
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">এখতিয়ারাধীন আদালত</label>
              <select
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                {currentDistInfo.courts.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vulnerability Indicator */}
          <div>
            <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">সুরক্ষা নির্দেশক (Vulnerability Indicator)</label>
            <select
              value={vulnerabilityIndicator}
              onChange={(e) => setVulnerabilityIndicator(e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="Woman">নারী (Woman)</option>
              <option value="Child">শিশু (Child)</option>
              <option value="Elderly">প্রবীণ নাগরিক (Elderly)</option>
              <option value="Person with disability">প্রতিবন্ধী ব্যক্তি (Person with disability)</option>
              <option value="Low income">অস্বচ্ছল দিনমজুর / দরিদ্র (Low income)</option>
              <option value="Minority community">অনগ্রসর সম্প্রদায় (Minority)</option>
              <option value="None identified">সাধারণ আবেদনকারী</option>
            </select>
          </div>

          {/* Details */}
          <div>
            <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">বিরোধের সারসংক্ষেপ ও আইনি প্রার্থিত প্রতিকার</label>
            <textarea
              rows={3}
              placeholder="আবেদনকারীর সমস্যার সংক্ষিপ্ত বিবরণ ও আদালতের কাছে কী সহায়তা চাওয়া হচ্ছে..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-[#006A4E]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#006A4E] hover:bg-[#004D3A] text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>আবেদন দাখিল ও রেজিস্ট্রি করুন</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
