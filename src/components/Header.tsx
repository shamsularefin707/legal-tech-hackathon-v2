import React from 'react';
import { Phone, Moon, Sun, RotateCcw, Menu, Shield, UserCheck, Sparkles } from 'lucide-react';
import { UserRole } from '../types/legalAid';
import { ROLE_CONFIGS } from '../services/rbacService';
import { GovCrest } from './GovCrest';

interface HeaderProps {
  currentRole: UserRole;
  userName: string;
  userDesignation: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onRoleChange: (role: UserRole) => void;
  onResetDemo: () => void;
  onToggleMobileMenu: () => void;
  onOpenDemoTour: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  userName,
  userDesignation,
  theme,
  onToggleTheme,
  onRoleChange,
  onResetDemo,
  onToggleMobileMenu,
  onOpenDemoTour
}) => {
  return (
    <header className="sticky top-0 z-30 shadow-xs border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15202E]">
      {/* 1. Government Prototype Top Strip */}
      <div className="bg-[#004D3A] text-white border-b border-[#006A4E] text-[11px] sm:text-xs">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2">
          {/* Official Prototype Notice (Complying with Rule 24: DO NOT FABRICATE GOVT AUTHORITY) */}
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C8102E] shrink-0 shadow-xs" title="বাংলাদেশ জাতীয় লাল সূর্য" />
            <span className="font-semibold tracking-wide">জাতীয় আইনগত সহায়তা কার্যক্রমের আদলে নির্মিত প্রোটোটাইপ</span>
            <span className="text-emerald-300/60 hidden md:inline">|</span>
            <span className="text-emerald-100 hidden md:inline">লিগ্যাল টেক হ্যাকাথন ২০২৬ • ট্র্যাক-সি (সিস্টেম ব্যাকবোন)</span>
          </div>

          {/* Right Utilities: Helpline + Demo Date + Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Toll-Free Legal Aid Helpline */}
            <a
              href="tel:16430"
              className="flex items-center gap-1 text-emerald-100 hover:text-white transition-colors bg-[#00382B] px-2 py-0.5 rounded border border-emerald-700/50"
              title="টোল-ফ্রি জাতীয় আইনগত সহায়তা হেল্পলাইন"
            >
              <Phone className="w-3 h-3 text-amber-300" />
              <span>হেল্পলাইন: <strong className="font-bold text-amber-300 font-mono">১৬৪৩০</strong></span>
              <span className="hidden sm:inline text-[10px] text-emerald-200">(টোল ফ্রি)</span>
            </a>

            {/* Reference Demo Date */}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#00382B] border border-emerald-700/50 text-emerald-100 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>১০ সেপ্টেম্বর ২০২৬</span>
              <span className="text-[10px] text-emerald-300/80">(রেফারেন্স সেশন)</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#00382B] hover:bg-[#002B21] text-emerald-100 hover:text-white border border-emerald-700/50 text-[11px] font-medium transition-colors cursor-pointer"
              title={theme === 'dark' ? 'লাইট মোডে পরিবর্তন' : 'ডার্ক মোডে পরিবর্তন'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">লাইট মোড</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-slate-200" />
                  <span className="hidden sm:inline">ডার্ক মোড</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional Navbar */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu + Gov Crest + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <GovCrest className="w-9 h-9 sm:w-11 sm:h-11 shrink-0" size={42} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                  জাতীয় আইনি সেবা ও বিচারিক তদারকি প্ল্যাটফর্ম
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#006A4E]/10 dark:bg-emerald-950/60 text-[#006A4E] dark:text-emerald-300 border border-[#006A4E]/20">
                  NLASO
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 hidden sm:block">
                ৮টি ডিজিটাল পাইলট জেলা সমন্বয় • আবেদন থেকে রায় পর্যন্ত পূর্ণাঙ্গ জীবনচক্র
              </p>
            </div>
          </div>
        </div>

        {/* Right: Hackathon Demo Tour + Role Switcher + Reset Demo Data */}
        <div className="flex items-center gap-2.5">
          {/* Hackathon 10-Step Demo Tour Trigger */}
          <button
            onClick={onOpenDemoTour}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-2xs transition-colors cursor-pointer"
            title="হ্যাকাথন বিচারকদের জন্য ৩-৫ মিনিটের সরাসরি লাইভ ডেমো গাইড"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>লাইভ ডেমো নির্দেশিকা</span>
          </button>

          {/* Active Role Selector (Actor Switcher) */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0F1724] border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md">
            <UserCheck className="w-4 h-4 text-[#006A4E] dark:text-emerald-400 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                ব্যবহারকারীর ভূমিকা:
              </span>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-transparent outline-none cursor-pointer pr-1 py-0.5"
                title="সক্রিয় ব্যবহারকারী ভূমিকা পরিবর্তন করুন"
              >
                <option value="CITIZEN" className="dark:bg-[#15202E] text-slate-900 dark:text-white">
                  নাগরিক / আবেদনকারী
                </option>
                <option value="LEGAL_AID_OFFICER" className="dark:bg-[#15202E] text-slate-900 dark:text-white">
                  জেলা লিগ্যাল এইড অফিসার (DLAO)
                </option>
                <option value="PANEL_LAWYER" className="dark:bg-[#15202E] text-slate-900 dark:text-white">
                  প্যানেল আইনজীবী (LADCS)
                </option>
                <option value="DISTRICT_ADMIN" className="dark:bg-[#15202E] text-slate-900 dark:text-white">
                  বিচারিক তদারকি কর্তৃপক্ষ / অ্যাডমিন
                </option>
              </select>
            </div>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="ডেমো ডেটাসেট প্রারম্ভিক অবস্থায় রিসেট করুন"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden md:inline">রিসেট</span>
          </button>
        </div>
      </div>
    </header>
  );
};
