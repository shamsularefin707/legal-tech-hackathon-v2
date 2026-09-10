import React from 'react';
import {
  LayoutDashboard,
  FileCheck,
  Briefcase,
  AlertCircle,
  Users,
  Building2,
  Clock,
  ShieldAlert,
  History,
  Lock,
  PlusCircle,
  X
} from 'lucide-react';
import { UserRole } from '../types/legalAid';
import { ROLE_CONFIGS, hasPermission } from '../services/rbacService';

export type NavTabId =
  | 'dashboard'
  | 'applications'
  | 'cases'
  | 'attention'
  | 'lawyers'
  | 'districts'
  | 'sla'
  | 'data_quality'
  | 'audit'
  | 'security';

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  currentRole: UserRole;
  pendingApplicationsCount: number;
  activeCasesCount: number;
  attentionItemsCount: number;
  slaBreachesCount: number;
  dataAnomaliesCount: number;
  onOpenNewApplicationModal: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  pendingApplicationsCount,
  activeCasesCount,
  attentionItemsCount,
  slaBreachesCount,
  dataAnomaliesCount,
  onOpenNewApplicationModal,
  isMobileOpen,
  onCloseMobile
}) => {
  const roleConfig = ROLE_CONFIGS[currentRole];

  const navItems: {
    id: NavTabId;
    labelBn: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    showForRoles?: UserRole[];
  }[] = [
    {
      id: 'dashboard',
      labelBn: 'ড্যাশবোর্ড',
      icon: LayoutDashboard
    },
    {
      id: 'applications',
      labelBn: 'আইনগত সহায়তা আবেদন',
      icon: FileCheck,
      badge: pendingApplicationsCount > 0 ? pendingApplicationsCount : undefined,
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
    },
    {
      id: 'cases',
      labelBn: 'আদালতের মামলাসমূহ',
      icon: Briefcase,
      badge: activeCasesCount > 0 ? activeCasesCount : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
    },
    {
      id: 'attention',
      labelBn: 'আজকের জরুরি কিউ',
      icon: AlertCircle,
      badge: attentionItemsCount > 0 ? attentionItemsCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
    },
    {
      id: 'lawyers',
      labelBn: 'প্যানেল আইনজীবী ও কর্মভার',
      icon: Users
    },
    {
      id: 'districts',
      labelBn: 'জেলা পর্যবেক্ষণ (৮ পাইলট)',
      icon: Building2,
      badge: '৮ জেলা',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
    },
    {
      id: 'sla',
      labelBn: 'সেবা সময়সীমা (SLA)',
      icon: Clock,
      badge: slaBreachesCount > 0 ? slaBreachesCount : undefined,
      badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200'
    },
    {
      id: 'data_quality',
      labelBn: 'ডেটা মান ও নিরীক্ষা',
      icon: ShieldAlert,
      badge: dataAnomaliesCount > 0 ? dataAnomaliesCount : undefined,
      badgeColor: 'bg-[#C8102E]/10 text-[#C8102E] dark:bg-red-900/40 dark:text-red-300 border border-red-300 dark:border-red-800'
    },
    {
      id: 'audit',
      labelBn: 'কার্যক্রমের রেকর্ড (Audit)',
      icon: History
    },
    {
      id: 'security',
      labelBn: 'নিরাপত্তা ও প্রশাসন',
      icon: Lock
    }
  ];

  const handleNavClick = (tabId: NavTabId) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#15202E] border-r border-slate-200 dark:border-slate-800 w-64 select-none">
      {/* Action Button: New Application Intake */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onOpenNewApplicationModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-[#006A4E] hover:bg-[#004D3A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          title="নতুন আবেদন দাখিল করুন"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন আবেদন দাখিল</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-[#006A4E]/10 dark:bg-emerald-950/60 text-[#006A4E] dark:text-emerald-300 font-bold border-l-3 border-[#006A4E] dark:border-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#006A4E] dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="truncate">{item.labelBn}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Role Profile Box at Bottom */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1724]">
        <div className="flex items-center gap-2 text-left">
          <div className="w-7 h-7 rounded-full bg-[#006A4E]/20 text-[#006A4E] dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
            {roleConfig.nameBn.charAt(0)}
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-900 dark:text-white block truncate">
              {roleConfig.nameBn}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
              {roleConfig.designationBn}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden lg:block shrink-0 h-[calc(100vh-80px)] sticky top-[80px]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-[#15202E] shadow-xl z-50">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                মেনু নেভিগেশন
              </span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
