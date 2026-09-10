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
  X,
  UserCheck,
  BookOpen,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../types/legalAid';
import { ROLE_CONFIGS } from '../services/rbacService';

export type NavTabId =
  | 'applicant_portal'
  | 'officer_workspace'
  | 'lawyer_workspace'
  | 'supervisor_workspace'
  | 'applications'
  | 'cases'
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

  // Define Navigation Items strictly tailored by role (Rule 20)
  const getNavItemsForRole = () => {
    if (currentRole === 'CITIZEN') {
      return [
        {
          id: 'applicant_portal' as NavTabId,
          labelBn: 'আমার আবেদন ও মামলা',
          icon: FileCheck
        },
        {
          id: 'cases' as NavTabId,
          labelBn: 'মামলা ট্র্যাকিং অনুসন্ধান',
          icon: LayoutDashboard
        }
      ];
    }

    if (currentRole === 'LEGAL_AID_OFFICER') {
      return [
        {
          id: 'officer_workspace' as NavTabId,
          labelBn: 'আজকের করণীয় ডেস্ক',
          icon: LayoutDashboard,
          badge: pendingApplicationsCount > 0 ? pendingApplicationsCount : undefined,
          badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
        },
        {
          id: 'applications' as NavTabId,
          labelBn: 'আবেদন যাচাই ও অনুমোদন',
          icon: FileCheck,
          badge: pendingApplicationsCount > 0 ? pendingApplicationsCount : undefined,
          badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
        },
        {
          id: 'cases' as NavTabId,
          labelBn: 'সকল নথিভুক্ত মামলা',
          icon: Briefcase
        },
        {
          id: 'lawyers' as NavTabId,
          labelBn: 'প্যানেল আইনজীবী রোস্টার',
          icon: Users
        },
        {
          id: 'data_quality' as NavTabId,
          labelBn: 'ডেটা মান নিরীক্ষা',
          icon: ShieldAlert,
          badge: dataAnomaliesCount > 0 ? dataAnomaliesCount : undefined,
          badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
        }
      ];
    }

    if (currentRole === 'PANEL_LAWYER') {
      return [
        {
          id: 'lawyer_workspace' as NavTabId,
          labelBn: 'আইনজীবী চেম্বার ও রোস্টার',
          icon: Briefcase
        },
        {
          id: 'cases' as NavTabId,
          labelBn: 'মামলার নথিপত্র অনুসন্ধান',
          icon: FileCheck
        },
        {
          id: 'audit' as NavTabId,
          labelBn: 'কার্যক্রম অডিট ট্রেইল',
          icon: History
        }
      ];
    }

    // Default for DISTRICT_ADMIN, SYSTEM_ADMIN, AUTHORIZED_AUTHORITY
    return [
      {
        id: 'supervisor_workspace' as NavTabId,
        labelBn: 'বিচারিক তদারকি ডেস্ক',
        icon: LayoutDashboard
      },
      {
        id: 'data_quality' as NavTabId,
        labelBn: 'ডেটা মান ও অসংগতি নিরীক্ষা',
        icon: ShieldAlert,
        badge: dataAnomaliesCount > 0 ? dataAnomaliesCount : undefined,
        badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
      },
      {
        id: 'districts' as NavTabId,
        labelBn: '৮টি পাইলট জেলা ব্যালেন্স',
        icon: Building2
      },
      {
        id: 'sla' as NavTabId,
        labelBn: 'সময়সীমা ও বিলম্ব তদারকি',
        icon: Clock,
        badge: slaBreachesCount > 0 ? slaBreachesCount : undefined,
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
      },
      {
        id: 'cases' as NavTabId,
        labelBn: 'সার্বিক মামলা খতিয়ান',
        icon: Briefcase
      },
      {
        id: 'lawyers' as NavTabId,
        labelBn: 'প্যানেল আইনজীবী কর্মভার',
        icon: Users
      },
      {
        id: 'audit' as NavTabId,
        labelBn: 'অপরিবর্তনযোগ্য অডিট লগ',
        icon: History
      },
      {
        id: 'security' as NavTabId,
        labelBn: 'ভূমিকা ও প্রবেশাধিকার',
        icon: Lock
      }
    ];
  };

  const navItems = getNavItemsForRole();

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[69px] left-0 z-40 w-64 sm:w-72 h-screen lg:h-[calc(100vh-69px)] bg-white dark:bg-[#15202E] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-3 sm:p-4 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Mobile Header with Close Button */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 lg:hidden">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              মেনু ও নেভিগেশন
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Card */}
          <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <span>সক্রিয় ভূমিকা:</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold">
                {roleConfig.nameBn}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
              {roleConfig.descriptionBn}
            </p>
          </div>

          {/* Quick Action: New Application (Available for Citizen & DLAO) */}
          {(currentRole === 'CITIZEN' || currentRole === 'LEGAL_AID_OFFICER') && (
            <button
              onClick={() => {
                onOpenNewApplicationModal();
                if (isMobileOpen) onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#006A4E] hover:bg-[#004D3A] text-white rounded-md text-xs sm:text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন আইনি আবেদন</span>
            </button>
          )}

          {/* Role-Tailored Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (isMobileOpen) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#006A4E] text-white shadow-2xs font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{item.labelBn}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: Legal Aid Hotline & Pilot Info */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>পাইলট জেলা:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">৮টি জেলা</span>
          </div>
          <div className="flex items-center justify-between">
            <span>সিস্টেম রেফারেন্স:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">১০ সেপ্টে ২০২৬</span>
          </div>
        </div>
      </aside>
    </>
  );
};
